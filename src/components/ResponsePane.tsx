import { useEditor } from '../contexts/EditorContext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const queryCampUITheme = EditorView.theme({
  "&": { color: "var(--color-text)", backgroundColor: "transparent" },
  "&.cm-focused": { outline: "none" },
  ".cm-content": { caretColor: "var(--color-cta)" },
  "&.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  ".cm-gutters": { backgroundColor: "transparent", color: "var(--color-text-muted)", borderRight: "none" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-text)" },
  ".cm-activeLine": { backgroundColor: "rgba(255, 255, 255, 0.03)" }
}, { dark: true });

const queryCampSyntax = HighlightStyle.define([
  { tag: t.keyword, color: "#F472B6" },
  { tag: t.variableName, color: "#4ADE80" },
  { tag: t.propertyName, color: "#F8FAFC" },
  { tag: t.string, color: "#FBBF24" },
  { tag: t.number, color: "#FBBF24" },
  { tag: t.punctuation, color: "#94A3B8" },
  { tag: t.definition(t.name), color: "#4ADE80" },
  { tag: t.typeName, color: "#F8FAFC" },
]);

const customTheme = [queryCampUITheme, syntaxHighlighting(queryCampSyntax)];

export default function ResponsePane() {
  const { response } = useEditor();
  const isError = response.status !== 200 && response.status !== null;
  const statusColor = isError ? '#F43F5E' : 'var(--color-cta)';
  const statusBg = isError ? '#F43F5E20' : '#1ea95020';
  
  const formattedResponse = response.data 
    ? JSON.stringify({ data: response.data }, null, 2)
    : response.error 
      ? JSON.stringify({ error: response.error }, null, 2)
      : '{\n  // Execute a query to see the response\n}';

  const handleDownload = () => {
    if (!formattedResponse) return;
    
    const blob = new Blob([formattedResponse], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-background)',
      borderLeft: '1px solid var(--color-border)'
    }}>
      {/* Response Header */}
      <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-sm">
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: 'var(--color-text-muted)' }}>RESPONSE</span>
          <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'var(--color-border)', margin: '0 8px' }}></div>
          {response.status ? (
            <div className="flex items-center gap-xs" style={{ background: statusBg, color: statusColor, padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }}></div>
              {response.status} {isError ? 'ERROR' : 'OK'}
            </div>
          ) : (
            <div className="flex items-center gap-xs" style={{ background: '#33415550', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
               WAITING
            </div>
          )}
          {response.timeMs !== null && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>{response.timeMs}ms</span>
          )}
        </div>
        <button className="btn-icon" onClick={handleDownload} title="Download Response">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>

      {/* JSON Response */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', overflow: 'auto', paddingTop: '8px' }}>
          <CodeMirror
            value={formattedResponse}
            theme={customTheme}
            readOnly={true}
            height="100%"
            style={{ height: '100%', fontSize: '14px', fontFamily: "'Space Grotesk', monospace" }}
            extensions={[json()]}
          />
        </div>
      </div>

      {/* Floating Need Help Pill */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
         <div style={{ 
           background: 'var(--color-primary)', 
           border: '1px solid var(--color-border)', 
           borderRadius: '8px', 
           padding: '12px 16px', 
           display: 'flex', 
           alignItems: 'center', 
           gap: '12px',
           boxShadow: 'var(--shadow-lg)'
         }}>
           <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--color-cta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
           </div>
           <div>
             <div style={{ fontSize: '13px', fontWeight: 500 }}>Need help with your</div>
             <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>GraphQL query?</div>
           </div>
           <button className="btn-icon" style={{ marginLeft: '8px' }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </button>
         </div>
         {/* Green circle chatbot trigger (bottom right) */}
         <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-cta)', position: 'absolute', bottom: '-24px', right: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', zIndex: 10 }}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
         </div>
      </div>

      {/* Error / Warning Alert */}
      {response.error && (
        <div style={{ background: '#4C1D9520', borderTop: '2px solid #F43F5E', padding: '16px', paddingLeft: '24px', paddingRight: '64px', position: 'relative' }}>
           <div className="flex" style={{ gap: '16px' }}>
             <div style={{ marginTop: '2px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <div>
               <div style={{ fontSize: '13px', fontWeight: 600, color: '#F43F5E', marginBottom: '4px' }}>QUERY ERROR</div>
               <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{response.error}</div>
             </div>
           </div>
        </div>
      )}

      {/* Footer / Status Bar */}
      <div className="flex items-center justify-between" style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
        <div>Line: 4 &nbsp;&nbsp; Col: 12</div>
        <div className="flex items-center gap-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          CONNECTED
        </div>
      </div>
    </div>
  );
}
