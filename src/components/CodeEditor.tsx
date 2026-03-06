import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { graphql } from 'cm6-graphql'; 
import { json } from '@codemirror/lang-json';
import { FiX, FiPlus } from 'react-icons/fi'; // Removed unused icons for cleaner code

// 1. Import tools for custom theming
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

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


export interface TabData {
  id: string;
  name: string;
  query: string;
  variables: string;
}

const DEFAULT_TABS: TabData[] = [
  {
    id: 'tab-1',
    name: 'GetUserData.graphql',
    query: `query GetUserData($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    email\n    posts {\n      title\n      content\n      createdAt\n    }\n  }\n}`,
    variables: `{\n  "id": "usr_982347102"\n}`
  },
  {
    id: 'tab-2',
    name: 'UpdateProfile.graphql',
    query: `mutation UpdateProfile($input: ProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    username\n    updatedAt\n  }\n}`,
    variables: `{\n  "input": {\n    "username": "new_name"\n  }\n}`
  }
];

export default function CodeEditor() {
  const [tabs, setTabs] = useState<TabData[]>(() => {
    const saved = localStorage.getItem('qc_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed parsing tabs", e);
      }
    }
    return DEFAULT_TABS;
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const saved = localStorage.getItem('qc_active_tab');
    if (saved) return saved;
    return DEFAULT_TABS[0].id;
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('qc_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('qc_active_tab', activeTabId);
  }, [activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateActiveTab = (updates: Partial<TabData>) => {
    setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, ...updates } : t));
  };

  const handleAddTab = () => {
    const newId = crypto.randomUUID();
    const newTab: TabData = {
      id: newId,
      name: `NewQuery.graphql`,
      query: '# Write your GraphQL query here\n',
      variables: '{\n  \n}'
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing last tab
    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (activeTabId === id && remaining.length > 0) {
        setActiveTabId(remaining[0].id);
      }
      return remaining;
    });
  };

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
        {tabs.map(tab => (
          <div 
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className="flex items-center" 
            style={{ 
              backgroundColor: activeTabId === tab.id ? 'var(--color-background)' : 'transparent',
              borderBottom: activeTabId === tab.id ? '2px solid var(--color-cta)' : '2px solid transparent', 
              padding: 'var(--space-md) var(--space-lg)', 
              color: activeTabId === tab.id ? 'var(--color-text)' : 'var(--color-text-muted)', 
              cursor: 'pointer', 
              fontSize: '14px',
              borderLeft: '1px solid var(--color-border)',
              minWidth: 'max-content'
            }}
          >
            {tab.name}
            {tabs.length > 1 && (
              <FiX 
                size={14} 
                color="currentColor" 
                style={{ marginLeft: 'var(--space-sm)', opacity: 0.5 }} 
                onClick={(e) => handleCloseTab(tab.id, e)}
              />
            )}
          </div>
        ))}
        
        <div 
          className="flex items-center justify-center btn-icon" 
          style={{ marginLeft: 'var(--space-sm)', padding: 'var(--space-md)' }}
          onClick={handleAddTab}
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
            onChange={(value) => updateActiveTab({ query: value })}
            height="100%"
            style={{ height: '100%', fontSize: '14px', fontFamily: "'Space Grotesk', monospace" }}
            extensions={[graphql()]}
          />
        </div>
      </div>

      {/* Variables/Headers Pane */}
      <div style={{ height: '250px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)' }}>
          <div style={{ padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-cta)', borderBottom: '2px solid var(--color-cta)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>VARIABLES</div>
          <div style={{ padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>HTTP HEADERS</div>
        </div>
        
        {/* Variables Editor Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-primary)' }}>
          <div style={{ width: '100%', height: '100%', overflow: 'auto', paddingTop: '8px' }}>
            <CodeMirror
              value={activeTab.variables}
              theme={customTheme}
              onChange={(value) => updateActiveTab({ variables: value })}
              height="100%"
              style={{ height: '100%', fontSize: '13px', fontFamily: "'Space Grotesk', monospace" }}
              extensions={[json()]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}