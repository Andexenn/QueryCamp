
export default function ChatSidebar() {
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
          backgroundColor: 'var(--color-cta)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>QueryCamp AI</h2>
          <div className="flex items-center gap-xs" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', letterSpacing: '0.5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-cta)' }}></div>
            SCHEMA CONNECTED
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: '0 20px 24px' }}>
        <button className="btn-primary w-full" style={{ padding: '12px 16px', borderRadius: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span style={{ fontWeight: 600 }}>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '12px', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Chat History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Active Chat Item */}
          <div className="flex items-center gap-sm" style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-text-muted)' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Nested Resolver Error</span>
          </div>
          
          {/* History Items */}
          <div className="flex items-center gap-sm" style={{ padding: '8px 12px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Mutation Validation...</span>
          </div>
          
          <div className="flex items-center gap-sm" style={{ padding: '8px 12px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Pagination Auth Logic</span>
          </div>
        </div>
      </div>

      {/* Bottom Profile Area */}
      <div className="flex items-center justify-between" style={{ padding: '20px', borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FCD34D', overflow: 'hidden' }}>
            <img src="https://i.pravatar.cc/100?img=33" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Dev User</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pro Plan</div>
          </div>
        </div>
        <button className="btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    </aside>
  );
}
