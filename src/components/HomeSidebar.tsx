import {FiRefreshCw, FiDatabase} from 'react-icons/fi'

export default function HomeSidebar() {
  return (
    <aside style={{
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-background)'
    }}>
      <div className="flex items-center justify-between" style={{ padding: '16px 24px' }}>
        <h3 style={{ fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Documentation</h3>
        <button className="btn-icon" style={{ padding: '4px' }}>
          <FiRefreshCw />
        </button>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="input flex items-center" style={{ padding: '8px 12px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', color: 'var(--color-text-muted)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search schema..." style={{
            background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px'
          }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {/* Queries */}
        <div style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-sm" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(90deg)' }}><polyline points="9 18 15 12 9 6"/></svg>
            <FiDatabase/>
            <strong style={{ fontSize: '14px', fontWeight: 600 }}>Queries</strong>
          </div>
          <div style={{ paddingLeft: '28px', borderLeft: '1px solid var(--color-secondary)', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', cursor: 'pointer' }}><span style={{ color: 'var(--color-cta)' }}>user</span> <span style={{ color: 'var(--color-text-muted)' }}>User</span></div>
            <div style={{ fontSize: '13px', cursor: 'pointer' }}><span style={{ color: 'var(--color-cta)' }}>allUsers</span> <span style={{ color: 'var(--color-text-muted)' }}>[User!]!</span></div>
            <div style={{ fontSize: '13px', cursor: 'pointer' }}><span style={{ color: 'var(--color-cta)' }}>post</span> <span style={{ color: 'var(--color-text-muted)' }}>Post</span></div>
          </div>
        </div>

        {/* Mutations */}
        <div style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-sm" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" style={{ marginRight: '4px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600 }}>Mutations</strong>
          </div>
        </div>

        {/* Subscriptions */}
        <div style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-sm" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600 }}>Subscriptions</strong>
          </div>
        </div>

        {/* Types */}
        <div style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-sm" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ marginRight: '4px' }}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600 }}>Types</strong>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <span>SCHEMA VERSION</span>
          <span style={{ backgroundColor: '#1ea95033', color: 'var(--color-cta)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>v2.4.1</span>
        </div>
        <button className="btn-secondary w-full" style={{ marginTop: '12px', padding: '8px', fontSize: '13px', borderRadius: '6px' }}>View Introspection JSON</button>
      </div>
    </aside>
  );
}
