import { useState } from 'react';
import { FiLink } from 'react-icons/fi';

interface TopbarProps {
  onRunQuery?: (endpoint: string) => void; 
}

export default function Topbar({ onRunQuery }: TopbarProps) {
  const [endpoint, setEndpoint] = useState('https://api.querycamp.io/v1/graphql');

  const handleRunClick = () => {
    if (onRunQuery) {
      onRunQuery(endpoint);
    } else {
      console.log("Tiến hành gửi request tới:", endpoint);
    }
  };

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
          <FiLink size={16} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
          
          {/* Cập nhật input: Dùng value và onChange thay vì defaultValue */}
          <input 
            type="text" 
            value={endpoint} 
            onChange={(e) => setEndpoint(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--color-text)', outline: 'none', width: '100%', fontSize: '14px'
            }} 
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-sm">
        {/* Thêm onClick vào nút */}
        <button 
          className="btn-primary" 
          onClick={handleRunClick}
          style={{ padding: '8px 16px', borderRadius: '6px' }}
        >
          {/* SVG fill="currentColor" sẽ tự động đổi màu theo màu chữ của nút */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run Query
        </button>
      </div>
    </header>
  );
}