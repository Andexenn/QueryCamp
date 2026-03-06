import { useState } from 'react';
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


export default function CodeEditor() {
  const [query, setQuery] = useState(`query GetUserData($id: ID!) {
  user(id: $id) {
    id
    username
    email
    posts {
      title
      content
      createdAt
    }
  }
}`);

  const [variables, setVariables] = useState(`{
  "id": "usr_982347102"
}`);

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
      <div className="flex items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-primary)' }}>
        {/* Active Tab */}
        <div className="flex items-center" style={{ borderBottom: '2px solid var(--color-cta)', padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '14px' }}>
          GetUserData.graphql
          <FiX size={14} color="currentColor" style={{ marginLeft: 'var(--space-sm)', opacity: 0.5 }} />
        </div>
        {/* Inactive Tab */}
        <div className="flex items-center" style={{ padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '14px', borderLeft: '1px solid var(--color-border)' }}>
          UpdateProfile.graphql
          <FiX size={14} color="currentColor" style={{ marginLeft: 'var(--space-sm)', opacity: 0.5 }} />
        </div>
        <div className="flex items-center justify-center btn-icon" style={{ marginLeft: 'var(--space-lg)', padding: 'var(--space-md)' }}>
          <FiPlus size={16} color="currentColor" />
        </div>
      </div>

      {/* Editor Content Area */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto', paddingTop: '8px' }}>
          <CodeMirror
            value={query}
            theme={customTheme}
            onChange={(value) => setQuery(value)}
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
              value={variables}
              theme={customTheme}
              onChange={(value) => setVariables(value)}
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