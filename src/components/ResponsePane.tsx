import { useState, useEffect } from 'react';
import { useEditor } from '../contexts/EditorContext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

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
  const { response, endpointUrl } = useEditor();
  const isError = response.status !== 200 && response.status !== 101 && response.status !== null;
  const statusColor = isError ? '#F43F5E' : 'var(--color-cta)';
  const statusBg = isError ? '#F43F5E20' : '#1ea95020';
  
  const formattedResponse = response.data 
    ? JSON.stringify({ data: response.data }, null, 2)
    : response.error 
      ? JSON.stringify({ error: response.error }, null, 2)
      : '{\n  // Execute a query to see the response\n}';

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [errorPaneHeight, setErrorPaneHeight] = useState(200);

  const handleErrorResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = errorPaneHeight;

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const delta = startY - mouseMoveEvent.clientY;
      const newHeight = Math.max(100, Math.min(startHeight + delta, window.innerHeight - 200));
      setErrorPaneHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    let isMounted = true;
    
    // For WebSockets, we rely on the executeQuery response status (101) to know if it's connected,
    // or if the GraphQL client actively tells us it failed (500).
    // We only poll for HTTP endpoints.
    if (endpointUrl?.trim().startsWith('ws://') || endpointUrl?.trim().startsWith('wss://')) {
        if (response.status === 101) {
            setIsConnected(true);
        } else if (response.status === 500 && response.error?.includes('WebSocket')) {
            setIsConnected(false);
        } else {
            // Unknown or waiting state
            setIsConnected(null);
        }
        return;
    }
    
    const checkConnection = async () => {
      if (!endpointUrl?.trim()) {
        if (isMounted) setIsConnected(null);
        return;
      }
      
      try {
        await fetch(endpointUrl, { method: 'GET' });
        if (isMounted) setIsConnected(true);
      } catch (e) {
        if (isMounted) setIsConnected(false);
      }
    };

    checkConnection(); // Initial check
    
    const interval = setInterval(() => {
      checkConnection();
    }, 10000); // 10s polling

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [endpointUrl, response.status, response.error]);

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
      borderLeft: '1px solid var(--color-border)',
      minHeight: 0
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
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
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

      

      {/* Resizer for Error Area */}
      {response.error && (
        <div 
          onMouseDown={handleErrorResizeStart}
          style={{ 
            height: '4px', 
            cursor: 'row-resize', 
            backgroundColor: 'transparent', 
            borderTop: '2px solid #F43F5E',
            flexShrink: 0,
            zIndex: 10
          }}
          className="hover:bg-[#F43F5E] transition-colors"
        />
      )}

      {/* Error / Warning Alert */}
      {response.error && (
        <div style={{ 
          background: '#4C1D9520', 
          padding: '16px', 
          paddingLeft: '24px', 
          paddingRight: '64px', 
          position: 'relative',
          flexShrink: 0,
          height: `${errorPaneHeight}px`,
          overflowY: 'auto'
        }}>
           <div className="flex" style={{ gap: '16px' }}>
             <div style={{ marginTop: '2px', flexShrink: 0 }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <div style={{ minWidth: 0 }}>
               <div style={{ fontSize: '13px', fontWeight: 600, color: '#F43F5E', marginBottom: '4px' }}>QUERY ERROR</div>
               <div style={{ 
                 fontSize: '13px', 
                 color: 'var(--color-text-muted)', 
                 fontFamily: 'monospace',
                 whiteSpace: 'pre-wrap',
                 wordBreak: 'break-all'
               }}>
                 {response.error}
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Footer / Status Bar */}
      <div className="flex items-center justify-end" style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
        <div className="flex items-center gap-xs" style={{ color: isConnected === true ? '#4ADE80' : isConnected === false ? '#F43F5E' : 'var(--color-text-muted)' }}>
          {isConnected === true ? <FiWifi /> : <FiWifiOff />}
          {isConnected === true ? 'CONNECTED' : isConnected === false ? 'DISCONNECTED' : 'CHECKING...'}
        </div>
      </div>
    </div>
  );
}
