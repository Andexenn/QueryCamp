import { useChat } from '../contexts/ChatContext';
import QueryCampLogo from '/favicon_io/favicon-32x32.png';

export default function ChatSidebar() {
  const { sessions, activeSessionId, setActiveSessionId, createNewSession } = useChat();

  return (
    <aside style={{
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-primary)'
    }}>
      {/* Header Area */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)'
        }}>
          <img src={QueryCampLogo} alt="QueryCamp Logo" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>QueryCamp AI</h2>
          <div className="flex items-center gap-xs" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', letterSpacing: '0.5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-cta)' }}></div>
            LOCAL CHAT
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: '0 20px 24px' }}>
        <button className="btn-primary w-full" onClick={createNewSession} style={{ padding: '12px 16px', borderRadius: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span style={{ fontWeight: 600 }}>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '12px', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Chat History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className="flex items-center gap-sm" style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              background: activeSessionId === session.id ? 'rgba(255,255,255,0.05)' : 'transparent', 
              border: activeSessionId === session.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              cursor: 'pointer',
              color: activeSessionId === session.id ? 'var(--color-text)' : 'var(--color-text-muted)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={activeSessionId === session.id ? 'currentColor' : 'none'} stroke={activeSessionId === session.id ? 'none' : 'currentColor'} strokeWidth="2"><path d={activeSessionId === session.id ? "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" : "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"}/></svg>
              <span style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.title || 'New Chat'}
              </span>
            </div>
          ))}
          {sessions.length === 0 && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '12px', textAlign: 'center' }}>
              No previous sessions.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
