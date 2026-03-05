
export default function ChatArea() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-background)',
      position: 'relative'
    }}>
      {/* Top Header */}
      <header className="flex items-center justify-between" style={{ padding: '0 32px', height: '64px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm" style={{ color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            MAIN CLUSTER
          </div>
          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--color-border)' }}></div>
          <div className="flex items-center gap-sm" style={{ color: 'var(--color-cta)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            V1.2 SCHEMA
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="btn-icon">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </button>
          <button className="btn-icon">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
        </div>
      </header>

      {/* Chat History Space */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 64px 120px 64px' }}>
        
        {/* User Message */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '40px' }}>
           <div className="flex items-center gap-sm" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '1px' }}>
             YOU • 2:14 PM
             <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FCD34D', overflow: 'hidden', marginLeft: '4px' }}>
               <img src="https://i.pravatar.cc/100?img=33" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
           </div>
           <div style={{ 
             background: 'var(--color-secondary)', 
             padding: '20px 24px', 
             borderRadius: '16px 16px 0 16px', 
             maxWidth: '80%',
             lineHeight: 1.6,
             fontSize: '15px'
           }}>
             I'm getting a null value on my <span style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-cta)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>author</span> field when querying <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Post</span>. The resolver is definitely firing, but it seems like the nested context isn't passing down the <span style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-cta)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>authorId</span> correctly. How can I debug this in my Apollo server setup?
           </div>
        </div>

        {/* AI Message */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '40px' }}>
           <div className="flex items-center gap-sm" style={{ fontSize: '11px', color: 'var(--color-cta)', marginBottom: '8px', fontWeight: 600, letterSpacing: '1px' }}>
             <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-cta)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
             </div>
             QUERYCAMP AI • JUST NOW
           </div>
           <div style={{ 
             background: 'var(--color-primary)', 
             border: '1px solid var(--color-border)',
             padding: '24px', 
             borderRadius: '16px 16px 16px 0', 
             maxWidth: '85%',
             lineHeight: 1.6,
             fontSize: '15px'
           }}>
             <p style={{ marginBottom: '24px' }}>
               This usually happens because the parent object doesn't include the foreign key required by the child resolver. Ensure your <strong style={{ color: 'var(--color-cta)', fontWeight: 600 }}>Post</strong> resolver is explicitly returning the <span style={{ color: 'var(--color-cta)', fontFamily: 'monospace' }}>authorId</span>.
             </p>

             <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', letterSpacing: '1px', fontWeight: 600, marginBottom: '12px' }}>TRY THIS QUERY PATTERN:</div>
             
             {/* Code Block */}
             <div style={{ 
               background: 'var(--color-background)', 
               borderRadius: '12px', 
               padding: '20px', 
               borderLeft: '4px solid var(--color-cta)',
               fontFamily: 'monospace',
               fontSize: '14px',
               overflowX: 'auto'
             }}>
                <div><span style={{ color: '#F472B6' }}>query</span> <span style={{ color: 'var(--color-cta)' }}>GetPostWithAuthor</span>(<span style={{ color: '#38BDF8' }}>$id</span>: <span style={{ color: 'white' }}>ID!</span>) {'{'}</div>
                <div style={{ paddingLeft: '16px', color: '#FBBF24' }}>post(id: <span style={{ color: '#38BDF8' }}>$id</span>) {'{'}</div>
                <div style={{ paddingLeft: '32px' }}>id</div>
                <div style={{ paddingLeft: '32px' }}>title</div>
                <div style={{ paddingLeft: '32px', color: '#10B981' }}># This field requires 'authorId' in the parent source</div>
                <div style={{ paddingLeft: '32px', color: '#FBBF24' }}>author {'{'}</div>
                <div style={{ paddingLeft: '48px' }}>id</div>
                <div style={{ paddingLeft: '48px' }}>name</div>
                <div style={{ paddingLeft: '48px' }}>email</div>
                <div style={{ paddingLeft: '32px' }}>{'}'}</div>
                <div style={{ paddingLeft: '16px' }}>{'}'}</div>
                <div>{'}'}</div>
             </div>
           </div>
        </div>

      </div>

      {/* Input Box Area (Fixed to bottom) */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '32px 64px 24px', 
        background: 'linear-gradient(to top, var(--color-background) 80%, transparent)' 
      }}>
         <div style={{ 
           background: 'var(--color-primary)', 
           border: '1px solid var(--color-border)', 
           borderRadius: '16px', 
           padding: '8px 16px',
           display: 'flex',
           alignItems: 'center',
           gap: '16px',
           boxShadow: 'var(--shadow-xl)'
         }}>
            <button className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input type="text" placeholder="Ask about your schema, resolvers, or best practices..." style={{
              flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '15px'
            }} />
            <button className="btn-icon">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button className="btn-primary" style={{ padding: '12px 24px', letterSpacing: '0.5px' }}>
              SEND <span style={{ marginLeft: '4px' }}>➤</span>
            </button>
         </div>
         
         <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
           QUERYCAMP AI CAN MAKE MISTAKES. VERIFY SCHEMA CHANGES IN YOUR STAGING ENVIRONMENT.
         </div>
      </div>
    </div>
  );
}
