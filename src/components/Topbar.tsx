
export default function Topbar() {
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr auto',
      alignItems: 'center',
      padding: '0 var(--space-md)',
      height: '64px',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-background)'
    }}>
      {/* Logo Area */}
      <div className="flex items-center gap-sm">
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--color-cta)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
        <h2 style={{ fontSize: '18px', margin: 0 }}>QueryCamp IDE</h2>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-md pl-md" style={{ paddingLeft: 'var(--space-md)' }}>
        <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cta)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span style={{ marginLeft: '6px' }}>Main Instance: <strong style={{ color: 'white' }}>PRODUCTION</strong></span>
        </button>

        <div className="flex items-center input" style={{ padding: '8px 12px', borderRadius: '6px', flex: 1, maxWidth: '400px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" style={{ marginRight: '8px' }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/></svg>
          <input type="text" defaultValue="https://api.querycamp.io/v1/graphql" style={{
            background: 'transparent', border: 'none', color: 'var(--color-text)', outline: 'none', width: '100%', fontSize: '14px'
          }} />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-sm">
        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run Query
        </button>
        <button className="btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <button className="btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FCD34D', marginLeft: 'var(--space-md)', overflow: 'hidden' }}>
          <img src="https://i.pravatar.cc/100?img=33" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </header>
  );
}
