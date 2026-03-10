import { useState, useEffect } from 'react';
import {FiRefreshCw, FiDatabase, FiPlus, FiX} from 'react-icons/fi';
import { useEditor } from '../contexts/EditorContext';

export default function HomeSidebar() {
  const { tabs, activeTabId, setActiveTabId, addTab, updateTab, deleteTab, 
    schemaVersions, activeSchemaVersionId, setActiveSchemaVersionId, createSchemaVersion, renameSchemaVersion 
  } = useEditor();
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    Queries: true,
    Mutations: true,
    Subscriptions: true,
    Types: true
  });

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const toggleCategory = (cat: string) => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));

  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('contextmenu', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  const [isEditingSchema, setIsEditingSchema] = useState(false);
  const [schemaEditName, setSchemaEditName] = useState('');

  const handleSchemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'new_schema') {
      const newName = prompt('Enter a name for the new schema version:');
      if (newName?.trim()) {
        createSchemaVersion(newName.trim());
      }
    } else {
      setActiveSchemaVersionId(e.target.value);
    }
  };

  const handleSchemaRename = () => {
    if (schemaEditName.trim()) {
      renameSchemaVersion(activeSchemaVersionId, schemaEditName.trim());
    }
    setIsEditingSchema(false);
  };
   
  const searchQuery = debouncedSearchText.toLowerCase();
  const filteredTabs = tabs.filter(t => 
    t.schemaVersionId === activeSchemaVersionId && 
    t.name.toLowerCase().startsWith(searchQuery)
  );

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
          <input 
            type="text" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search schema..." 
            style={{
              background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px'
            }} 
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', minHeight: 0 }}>
        {/* Queries */}
        <div style={{ marginBottom: '16px' }}>
          <div onClick={() => toggleCategory('Queries')} className="flex items-center gap-sm group" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedCategories['Queries'] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>
            <FiDatabase className="text-green-500" />
            <strong style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>Queries</strong>
            <button className="opacity-0 group-hover:opacity-100 btn-icon p-1 transition-opacity" onClick={(e) => { e.stopPropagation(); addTab('Queries'); }}>
              <FiPlus size={14} />
            </button>
          </div>
          {expandedCategories['Queries'] && (
          <div style={{ paddingLeft: '28px', borderLeft: '1px solid var(--color-secondary)', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTabs.filter(t => t.category === 'Queries').map(tab => (
              <div 
                key={tab.id} 
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                style={{ 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  color: activeTabId === tab.id ? 'var(--color-cta)' : 'var(--color-text-muted)',
                  fontWeight: activeTabId === tab.id ? 600 : 400
                }}
                onClick={() => { setActiveTabId(tab.id); updateTab(tab.id, { isOpen: true }); }}
              >
                {tab.name}
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Mutations */}
        <div style={{ marginBottom: '16px' }}>
          <div onClick={() => toggleCategory('Mutations')} className="flex items-center gap-sm group" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedCategories['Mutations'] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" style={{ marginRight: '4px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>Mutations</strong>
            <button className="opacity-0 group-hover:opacity-100 btn-icon p-1 transition-opacity" onClick={(e) => { e.stopPropagation(); addTab('Mutations'); }}>
              <FiPlus size={14} />
            </button>
          </div>
          {expandedCategories['Mutations'] && (
          <div style={{ paddingLeft: '28px', borderLeft: '1px solid var(--color-secondary)', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTabs.filter(t => t.category === 'Mutations').map(tab => (
              <div 
                key={tab.id} 
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                style={{ 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  color: activeTabId === tab.id ? 'var(--color-cta)' : 'var(--color-text-muted)',
                  fontWeight: activeTabId === tab.id ? 600 : 400
                }}
                onClick={() => { setActiveTabId(tab.id); updateTab(tab.id, { isOpen: true }); }}
              >
                {tab.name}
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Subscriptions */}
        <div style={{ marginBottom: '16px' }}>
          <div onClick={() => toggleCategory('Subscriptions')} className="flex items-center gap-sm group" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedCategories['Subscriptions'] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>Subscriptions</strong>
            <button className="opacity-0 group-hover:opacity-100 btn-icon p-1 transition-opacity" onClick={(e) => { e.stopPropagation(); addTab('Subscriptions'); }}>
              <FiPlus size={14} />
            </button>
          </div>
          {expandedCategories['Subscriptions'] && (
          <div style={{ paddingLeft: '28px', borderLeft: '1px solid var(--color-secondary)', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTabs.filter(t => t.category === 'Subscriptions').map(tab => (
              <div 
                key={tab.id} 
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                style={{ 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  color: activeTabId === tab.id ? 'var(--color-cta)' : 'var(--color-text-muted)',
                  fontWeight: activeTabId === tab.id ? 600 : 400
                }}
                onClick={() => { setActiveTabId(tab.id); updateTab(tab.id, { isOpen: true }); }}
              >
                {tab.name}
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Types */}
        <div style={{ marginBottom: '16px' }}>
          <div onClick={() => toggleCategory('Types')} className="flex items-center gap-sm group" style={{ padding: '8px 0', cursor: 'pointer', color: 'var(--color-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedCategories['Types'] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ marginRight: '4px' }}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <strong style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>Types</strong>
            <button className="opacity-0 group-hover:opacity-100 btn-icon p-1 transition-opacity" onClick={(e) => { e.stopPropagation(); addTab('Types'); }}>
              <FiPlus size={14} />
            </button>
          </div>
          {expandedCategories['Types'] && (
          <div style={{ paddingLeft: '28px', borderLeft: '1px solid var(--color-secondary)', marginLeft: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTabs.filter(t => t.category === 'Types').map(tab => (
              <div 
                key={tab.id} 
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                style={{ 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  color: activeTabId === tab.id ? 'var(--color-cta)' : 'var(--color-text-muted)',
                  fontWeight: activeTabId === tab.id ? 600 : 400
                }}
                onClick={() => { setActiveTabId(tab.id); updateTab(tab.id, { isOpen: true }); }}
              >
                {tab.name}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <span>SCHEMA VERSION</span>
          {isEditingSchema ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus 
                value={schemaEditName} 
                onChange={e => setSchemaEditName(e.target.value)} 
                onBlur={handleSchemaRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSchemaRename();
                  if (e.key === 'Escape') setIsEditingSchema(false);
                }}
                style={{ fontSize: '12px', padding: '2px 4px', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-cta)', borderRadius: '4px', outline: 'none', width: '80px' }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <select 
                value={activeSchemaVersionId} 
                onChange={handleSchemaChange}
                style={{ backgroundColor: '#1ea95033', color: 'var(--color-cta)', border: 'none', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, outline: 'none', cursor: 'pointer', maxWidth: '120px' }}>
                {schemaVersions.map(sv => (
                  <option key={sv.id} value={sv.id}>{sv.name}</option>
                ))}
                <option value="new_schema">+ Create New...</option>
              </select>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white" onClick={() => {
                const activeVersion = schemaVersions.find(v => v.id === activeSchemaVersionId);
                if (activeVersion) {
                  setSchemaEditName(activeVersion.name);
                  setIsEditingSchema(true);
                }
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          backgroundColor: 'var(--color-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '4px',
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)'
        }}>
          <button 
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-white/5 rounded w-full transition-colors font-bold"
            onClick={(e) => {
              e.stopPropagation();
              deleteTab(contextMenu.id);
              setContextMenu(null);
            }}
          >
            <FiX size={14} /> Delete Tab
          </button>
        </div>
      )}
    </aside>
  );
}
