import { useEffect, useCallback } from 'react';
import { useEditor } from '../contexts/EditorContext';
import { FiLink, FiPlay } from 'react-icons/fi';
import myLogo from '/favicon_io/favicon-32x32.png';

interface TopbarProps {
  onRunQuery?: (endpoint: string) => void; 
}

export default function Topbar({ onRunQuery }: TopbarProps) {
  const { endpointUrl, setEndpointUrl, executeQuery } = useEditor();

  // 1. Wrap in useCallback so it remains stable for the useEffect dependency array
  const handleRunClick = useCallback(() => {
    if (onRunQuery) {
      onRunQuery(endpointUrl);
    } else {
      executeQuery();
    }
  }, [onRunQuery, endpointUrl, executeQuery]);

  // 2. Add the keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // e.metaKey ensures this also works with Cmd + Enter on macOS!
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (e.repeat) return; // Prevent key repeat locking the UI!
        e.preventDefault(); // Prevents any default browser behavior
        e.stopPropagation(); // Prevents event from bubbling down to CodeMirror
        handleRunClick();
      }
    };

    // Attach the listener to the window using capture phase
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // 3. Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRunClick]); // Re-run effect only if handleRunClick changes

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
        <img src={myLogo} alt="Logo" />
        <h2 style={{ fontSize: '20px', margin: 0 }}>QueryCamp</h2>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-md pl-md">
        <div className="flex items-center input" style={{ padding: '10px 12px', borderRadius: '6px', flex: 1, maxWidth: '400px' }}>
          <FiLink size={16} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
          
          <input 
            type="text" 
            value={endpointUrl} 
            onChange={(e) => setEndpointUrl(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--color-text)', outline: 'none', width: '100%', fontSize: '14px'
            }} 
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-sm">
        
        {/* 1. We wrap the button in a relative container and give it the 'group' class */}
        <div className="relative flex flex-col items-center group">
          
          <button 
            className="btn-primary flex items-center gap-2" 
            onClick={handleRunClick}
            style={{ padding: '8px 16px', borderRadius: '6px' }}
          >
            <FiPlay size={16} className='text-white' />
            Run Query
          </button>

          {/* 2. This is the actual Tooltip. It stays hidden (opacity-0) until the group is hovered! */}
          <div className="absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Ctrl + Enter
          </div>

        </div>

      </div>
    </header>
  );
}