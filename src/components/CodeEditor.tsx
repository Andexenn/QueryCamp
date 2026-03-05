
export default function CodeEditor() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-primary)'
    }}>
      {/* Tabs */}
      <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center" style={{ borderBottom: '2px solid var(--color-cta)', padding: '12px 16px', color: 'var(--color-text)', cursor: 'pointer', fontSize: '14px' }}>
          GetUserData.graphql
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '12px', opacity: 0.5 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <div className="flex items-center" style={{ padding: '12px 16px', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '14px', borderLeft: '1px solid var(--color-border)' }}>
          UpdateProfile.graphql
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '12px', opacity: 0.5 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <div className="flex items-center justify-center btn-icon" style={{ marginLeft: '16px', padding: '12px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </div>

      {/* Editor Content */}
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Line Numbers */}
        <div style={{ padding: '16px 8px', color: 'var(--color-text-muted)', textAlign: 'right', fontSize: '14px', fontFamily: 'monospace', opacity: 0.5, lineHeight: 1.6 }}>
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        </div>

        {/* Code Area */}
        <div style={{ padding: '16px', color: 'var(--color-text)', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6, flex: 1 }}>
          <div><span style={{ color: '#F472B6' }}>query</span> <span style={{ color: 'var(--color-cta)' }}>GetUserData</span>(<span style={{ color: '#38BDF8' }}>$id</span>: <span style={{ color: 'white' }}>ID!</span>) {'{'}</div>
          <div style={{ paddingLeft: '16px' }}><span style={{ color: '#F472B6' }}>user</span>(id: <span style={{ color: '#38BDF8' }}>$id</span>) {'{'}</div>
          <div style={{ paddingLeft: '32px' }}>id</div>
          <div style={{ paddingLeft: '32px' }}>username</div>
          <div style={{ paddingLeft: '32px' }}>email</div>
          <div style={{ paddingLeft: '32px' }}>posts {'{'}</div>
          <div style={{ paddingLeft: '48px' }}>title</div>
          <div style={{ paddingLeft: '48px', color: '#F472B6' }}>content</div>
          <div style={{ paddingLeft: '48px' }}>createdAt</div>
          <div style={{ paddingLeft: '32px' }}>{'}'}</div>
          <div style={{ paddingLeft: '16px' }}>{'}'}</div>
          <div>{'}'}</div>
          <div style={{ color: 'var(--color-cta)' }}>|</div>
        </div>

        {/* Floating Toolbar */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--color-secondary)', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'var(--shadow-md)' }}>
          <button className="btn-icon" style={{ padding: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 8.6L12 2l9.5 6.6V22H2.5z"/></svg> {/* Simulating wand */}
          </button>
          <button className="btn-icon" style={{ padding: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button className="btn-icon" style={{ padding: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-5 5"/></svg>
          </button>
        </div>
      </div>

      {/* Variables variables pane */}
      <div style={{ height: '250px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ padding: '12px 24px', color: 'var(--color-cta)', borderBottom: '2px solid var(--color-cta)', fontSize: '13px', fontWeight: 600 }}>VARIABLES</div>
          <div style={{ padding: '12px 24px', color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 600 }}>HTTP HEADERS</div>
        </div>
        <div style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px', flex: 1, backgroundColor: 'var(--color-primary)' }}>
          <div>{'{'}</div>
          <div style={{ paddingLeft: '16px' }}><span style={{ color: '#FBBF24' }}>"id"</span>: <span style={{ color: '#FBBF24' }}>"usr_982347102"</span></div>
          <div>{'}'}</div>
        </div>
      </div>
    </div>
  );
}
