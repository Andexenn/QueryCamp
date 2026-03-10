import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { chatStorage, type ChatSession, type ChatMessage } from '../services/chatStorageService';
import { llmService } from '../services/llmService';

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  isEngineReady: boolean;
  isEngineLoading: boolean;
  engineProgressText: string;
  isGenerating: boolean;
  
  // Actions
  createNewSession: () => Promise<void>;
  setActiveSessionId: (id: string) => void;
  deleteSession: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  initEngineIfMissing: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isEngineLoading, setIsEngineLoading] = useState(false);
  const [engineProgressText, setEngineProgressText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Load initial sessions
  useEffect(() => {
    chatStorage.getSessions().then(loadedSessions => {
      setSessions(loadedSessions);
      if (loadedSessions.length > 0) {
        setActiveSessionId(loadedSessions[0].id);
      } else {
        createNewSession();
      }
    });
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const initEngineIfMissing = async () => {
    if (llmService.isEngineReady()) {
      setIsEngineReady(true);
      return;
    }
    
    setIsEngineLoading(true);
    try {
      await llmService.initEngine((_, text) => {
        setEngineProgressText(text);
      });
      setIsEngineReady(true);
    } catch (e) {
      console.error(e);
      setEngineProgressText("Failed to load AI Model");
    } finally {
      setIsEngineLoading(false);
    }
  };

  const createNewSession = async () => {
    const newSession = await chatStorage.createSession('New Chat');
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = async (id: string) => {
    await chatStorage.deleteSession(id);
    setSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
        if (remaining.length === 0) {
           createNewSession();
        }
      }
      return remaining;
    });
  };

  const sendMessage = async (content: string) => {
    if (!activeSessionId || !content.trim()) return;
    
    setIsGenerating(true);
    
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };
    
    let updatedSession: ChatSession | undefined;

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        updatedSession = { ...s, messages: [...s.messages, userMsg], updatedAt: Date.now() };
        // Auto-title if it's the first message and title is "New Chat"
        if (updatedSession.messages.length === 1 && s.title === 'New Chat') {
           updatedSession.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        }
        return updatedSession;
      }
      return s;
    }));

    if (updatedSession) {
      await chatStorage.updateSession(updatedSession);
    }

    try {
      const conversationHistory = updatedSession!.messages.map(m => ({ role: m.role, content: m.content }));
      
      const assistantMsgId = crypto.randomUUID();
      
      let localSession = { ...updatedSession! };
      
      // Request generation
      await llmService.chat(conversationHistory, async (chunkText) => {
         // Update state with chunk
         setSessions(prev => prev.map(s => {
           if (s.id === activeSessionId) {
             const messages = [...s.messages];
             const existingAsst = messages.find(m => m.id === assistantMsgId);
             if (existingAsst) {
                existingAsst.content = chunkText;
                existingAsst.timestamp = Date.now();
             } else {
                messages.push({
                   id: assistantMsgId,
                   role: 'assistant',
                   content: chunkText,
                   timestamp: Date.now()
                });
             }
             localSession = { ...s, messages, updatedAt: Date.now() };
             return localSession;
           }
           return s;
         }));
      });
      
      // Save final chat state
      await chatStorage.updateSession(localSession);
      
    } catch (e) {
      console.error("Chat error:", e);
      // Append error message to chat
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `*Sorry, I encountered an error. Is the AI engine loaded properly? (${e instanceof Error ? e.message : String(e)})*`,
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          const newSession = { ...s, messages: [...s.messages, errorMsg], updatedAt: Date.now() };
          chatStorage.updateSession(newSession);
          return newSession;
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      activeSessionId,
      activeSession,
      isEngineReady,
      isEngineLoading,
      engineProgressText,
      isGenerating,
      createNewSession,
      setActiveSessionId,
      deleteSession,
      sendMessage,
      initEngineIfMissing
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
