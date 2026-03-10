import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

export type ProgressCallback = (text: string) => void;

class LLMService {
  private engine: MLCEngine | null = null;
  private isInitializing = false;
  private isReady = false;

  async initEngine(onProgress?: (progress: number, text: string) => void) {
    if (this.isReady) return;
    if (this.isInitializing) return;

    this.isInitializing = true;
    try {
      this.engine = await CreateMLCEngine(
        "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (progressInfo: any) => {
            if (onProgress) {
              onProgress(progressInfo.progress, progressInfo.text);
            }
          }
        }
      );
      this.isReady = true;
    } catch (e) {
      console.error("Failed to initialize WebLLM engine:", e);
      throw e;
    } finally {
      this.isInitializing = false;
    }
  }

  isEngineReady() {
    return this.isReady;
  }

  async chat(messages: { role: 'user' | 'assistant', content: string }[], onChunk?: ProgressCallback): Promise<string> {
    if (!this.engine || !this.isReady) {
      throw new Error("Engine is not initialized yet.");
    }

    // Process system prompt if needed:
    const formattedMessages = [
      { role: 'system' as const, content: 'You are a helpful AI assistant for QueryCamp, a GraphQL IDE. Help users write and debug GraphQL queries and understand schemas.' },
      ...messages
    ];

    try {
      if (onChunk) {
        const chunks = await this.engine.chat.completions.create({
          messages: formattedMessages,
          stream: true,
        });

        let fullContent = "";
        for await (const chunk of chunks) {
          const text = chunk.choices[0]?.delta.content || "";
          fullContent += text;
          onChunk(fullContent);
        }
        return fullContent;
      } else {
         const reply = await this.engine.chat.completions.create({
            messages: formattedMessages,
         });
         return reply.choices[0]?.message.content || "";
      }
    } catch (e) {
      console.error("LLM Chat generation failed:", e);
      throw e;
    }
  }
}

export const llmService = new LLMService();
