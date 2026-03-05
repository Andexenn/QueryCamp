
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
        <h2 style={{ fontSize: '18px', margin: 0 }}>QueryCamp</h2>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-md pl-md" style={{ paddingLeft: 'var(--space-md)' }}>
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
      </div>
    </header>
  );
}
