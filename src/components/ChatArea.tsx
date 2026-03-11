import { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function ChatArea() {
  const { 
    activeSession, 
    sendMessage, 
    isGenerating, 
    isEngineReady, 
    isEngineLoading, 
    engineProgressText, 
    initEngineIfMissing 
  } = useChat();
  
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initEngineIfMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden' // Ensure it doesn't spill over
    }}>

      {/* Initialize Engine Warning */}
      {!isEngineReady && (
        <div style={{ padding: '12px 16px', background: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {isEngineLoading ? `Wait, Loading AI Engine: ${engineProgressText}` : 'AI Engine not ready.'}
        </div>
      )}

      {/* Chat History Space */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 64px 20px 64px' }}>
        
        {activeSession?.messages.map((msg, index) => (
          <div key={msg.id || index} style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'user' ? (
              <>
                 <div className="flex items-center gap-sm" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '1px' }}>
                   YOU
                 </div>
                 <div style={{ 
                   background: 'var(--color-secondary)', 
                   padding: '20px 24px', 
                   borderRadius: '16px 16px 0 16px', 
                   maxWidth: '80%',
                   lineHeight: 1.6,
                   fontSize: '15px'
                 }}>
                   {msg.content}
                 </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-sm" style={{ fontSize: '11px', color: 'var(--color-cta)', marginBottom: '8px', fontWeight: 600, letterSpacing: '1px' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-cta)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                   </div>
                   QUERYCAMP AI
                 </div>
                 <div style={{ 
                   background: 'var(--color-primary)', 
                   border: '1px solid var(--color-border)',
                   padding: '24px', 
                   borderRadius: '16px 16px 16px 0', 
                   maxWidth: '85%',
                   lineHeight: 1.6,
                   fontSize: '15px',
                   whiteSpace: 'pre-wrap' // Preserve newlines
                 }}>
                   {msg.content}
                 </div>
              </>
            )}
          </div>
        ))}

        {!activeSession || activeSession.messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
             Send a message to start a new conversation.
          </div>
        ) : null}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box Area (Fixed height bottom with flex shrink 0 to float) */}
      <div style={{ 
        flexShrink: 0,
        padding: '24px 64px 24px', 
        background: 'var(--color-background)',
        borderTop: '1px solid var(--color-border)'
      }}>
         <div style={{ 
           background: 'var(--color-primary)', 
           border: '1px solid var(--color-border)', 
           borderRadius: '16px', 
           padding: '8px 16px',
           display: 'flex',
           alignItems: 'center',
           gap: '16px',
           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
         }}>
            <button className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              disabled={isGenerating || !isEngineReady}
              placeholder={isEngineReady ? "Ask about your schema, resolvers, or best practices..." : "Waiting for AI Engine..."} 
              style={{
                flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '15px'
              }} 
            />
            <button 
              className="btn-primary" 
              onClick={handleSend}
              disabled={isGenerating || !isEngineReady || !inputText.trim()}
              style={{ padding: '12px 24px', letterSpacing: '0.5px' }}
            >
              SEND <span style={{ marginLeft: '4px' }}>➤</span>
            </button>
         </div>
         
         <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
           QUERYCAMP AI RUNS LOCALLY. IT MAY STILL MAKE MISTAKES.
         </div>
      </div>
    </div>
  );
}
