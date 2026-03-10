import CodeMirror from '@uiw/react-codemirror';
import { graphql } from 'cm6-graphql'; 
import { json } from '@codemirror/lang-json';
import { FiX, FiPlus } from 'react-icons/fi'; // Removed unused icons for cleaner code

// 1. Import tools for custom theming
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { useEditor } from '../contexts/EditorContext';
import { useState, useEffect, useRef } from 'react';

// 2. Define the Custom UI Theme
const queryCampUITheme = EditorView.theme({
  "&": {
    color: "var(--color-text)",
    backgroundColor: "transparent", 
  },
  "&.cm-focused": {
    outline: "none", // Prevents default browser focus ring when clicking the editor
  },
  ".cm-content": {
    caretColor: "var(--color-cta)", 
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--color-text-muted)",
    borderRight: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--color-text)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
  }
}, { dark: true });

// 3. Define the Custom Syntax Highlighting 
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

// Combine them into a single theme array
const customTheme = [queryCampUITheme, syntaxHighlighting(queryCampSyntax)];

export default function CodeEditor() {
  const { tabs, activeTabId, setActiveTabId, addTab, closeTab, updateTab, activeSchemaVersionId } = useEditor();
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeBottomPane, setActiveBottomPane] = useState<'variables' | 'headers'>('variables');

  const filteredTabs = tabs.filter(t => t.schemaVersionId === activeSchemaVersionId);
  const activeTab = filteredTabs.find(t => t.id === activeTabId && t.isOpen !== false) || filteredTabs.find(t => t.isOpen !== false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && activeTabId) {
        e.preventDefault();
        const tabToEdit = tabs.find(t => t.id === activeTabId);
        if (tabToEdit) {
          setEditingTabId(tabToEdit.id);
          setEditingTabName(tabToEdit.name);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs]);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const commitTabRename = () => {
    if (editingTabId && editingTabName.trim()) {
      updateTab(editingTabId, { name: editingTabName.trim() });
    }
    setEditingTabId(null);
  };

  if (!activeTab) return null;

  return (
    <div style={{ 
      // Removed className="card" to eliminate the inherited padding
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-background)',
      overflow: 'hidden',
      borderRadius: 0,
      margin: 0,
      padding: 0, // Explicitly set to 0 just to be safe
      border: '1px solid var(--color-border)',
    }}>
      {/* Query Editor Tabs Bar */}
      <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)', overflowX: 'auto' }}>
        {filteredTabs.filter(t => t.isOpen !== false).map(tab => (
          <div 
            key={tab.id}
            onClick={() => {
              if (editingTabId !== tab.id) setActiveTabId(tab.id);
            }}
            onDoubleClick={() => {
              setEditingTabId(tab.id);
              setEditingTabName(tab.name);
            }}
            className="flex items-center group select-none" 
            style={{ 
              backgroundColor: activeTabId === tab.id ? 'var(--color-background)' : 'transparent',
              borderBottom: activeTabId === tab.id ? '2px solid var(--color-cta)' : '2px solid transparent', 
              padding: 'var(--space-md) var(--space-lg)', 
              color: activeTabId === tab.id ? 'var(--color-text)' : 'var(--color-text-muted)', 
              cursor: 'pointer', 
              fontSize: '14px',
              borderLeft: '1px solid var(--color-border)',
              minWidth: 'max-content',
              position: 'relative'
            }}
          >
            {editingTabId === tab.id ? (
              <input
                ref={inputRef}
                value={editingTabName}
                onChange={(e) => setEditingTabName(e.target.value)}
                onBlur={commitTabRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitTabRename();
                  if (e.key === 'Escape') setEditingTabId(null);
                }}
                className="bg-transparent border-none outline-none text-[var(--color-text)]"
                style={{ width: `${Math.max(editingTabName.length * 8, 50)}px` }}
              />
            ) : (
              <span>{tab.name}</span>
            )}
            {filteredTabs.filter(t => t.isOpen !== false).length > 1 && (
              <div 
                className="ml-3 opacity-50 hover:opacity-100 hover:bg-white/10 hover:scale-110 p-1 rounded-full transition-all"
                onClick={(e) => closeTab(tab.id, e)}
              >
                <FiX size={14} color="currentColor" />
              </div>
            )}
          </div>
        ))}
        
        <div 
          className="flex items-center justify-center btn-icon" 
          style={{ marginLeft: 'var(--space-sm)', padding: 'var(--space-md)' }}
          onClick={() => addTab('Queries')}
        >
          <FiPlus size={16} color="currentColor" />
        </div>
      </div>

      {/* Editor Content Area */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto', paddingTop: '8px' }}>
          <CodeMirror
            value={activeTab.query}
            theme={customTheme}
            onChange={(value) => updateTab(activeTab.id, { query: value })}
            height="100%"
            style={{ height: '100%', fontSize: '14px', fontFamily: "'Space Grotesk', monospace" }}
            extensions={[graphql()]}
          />
        </div>
      </div>

      {/* Variables/Headers Pane */}
      <div style={{ height: '250px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)' }}>
          <div 
            onClick={() => setActiveBottomPane('variables')}
            style={{ 
              padding: 'var(--space-md) var(--space-lg)', 
              color: activeBottomPane === 'variables' ? 'var(--color-cta)' : 'var(--color-text-muted)', 
              borderBottom: activeBottomPane === 'variables' ? '2px solid var(--color-cta)' : '2px solid transparent', 
              fontSize: '13px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            VARIABLES
          </div>
          <div 
            onClick={() => setActiveBottomPane('headers')}
            style={{ 
              padding: 'var(--space-md) var(--space-lg)', 
              color: activeBottomPane === 'headers' ? 'var(--color-cta)' : 'var(--color-text-muted)', 
              borderBottom: activeBottomPane === 'headers' ? '2px solid var(--color-cta)' : '2px solid transparent', 
              fontSize: '13px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            HTTP HEADERS
          </div>
        </div>
        
        {/* State Driven Editor Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-primary)' }}>
          <div style={{ width: '100%', height: '100%', overflow: 'auto', paddingTop: '8px' }}>
            {activeBottomPane === 'variables' ? (
              <CodeMirror
                value={activeTab.variables}
                theme={customTheme}
                onChange={(value) => updateTab(activeTab.id, { variables: value })}
                height="100%"
                style={{ height: '100%', fontSize: '13px', fontFamily: "'Space Grotesk', monospace" }}
                extensions={[json()]}
              />
            ) : (
              <CodeMirror
                value={activeTab.headers}
                theme={customTheme}
                onChange={(value) => updateTab(activeTab.id, { headers: value })}
                height="100%"
                style={{ height: '100%', fontSize: '13px', fontFamily: "'Space Grotesk', monospace" }}
                extensions={[json()]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}