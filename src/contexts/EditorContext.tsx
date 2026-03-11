import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import type { TabData, ApiResponse, SchemaVersion } from '../types/editor';
import { executeGraphQLQuery } from '../services/queryService';

interface EditorContextType {
  tabs: TabData[];
  activeTabId: string | null;
  endpointUrl: string;
  response: ApiResponse;
  schemaVersions: SchemaVersion[];
  activeSchemaVersionId: string;
  
  // Actions
  addTab: (category: TabData['category']) => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
  deleteTab: (id: string, e?: React.MouseEvent) => void;
  updateTab: (id: string, updates: Partial<TabData>) => void;
  setActiveTabId: (id: string) => void;
  setEndpointUrl: (url: string) => void;
  executeQuery: () => Promise<void>;
  createSchemaVersion: (name: string) => void;
  renameSchemaVersion: (id: string, newName: string) => void;
  setActiveSchemaVersionId: (id: string) => void;
}

// 2. Default Initial Data
const generateId = () => crypto.randomUUID();

export const DEFAULT_SCHEMA_VERSION: SchemaVersion = { id: 'v1.0.0', name: 'v1.0.0' };

export const DEFAULT_TABS: TabData[] = [
  {
    id: generateId(),
    name: 'GetUsers.graphql',
    category: 'Queries',
    query: `query GetUsers {\n  getUsers {\n    id\n    age\n    isMarried\n    name\n  }\n}`,
    variables: `{}`,
    headers: `{\n  \n}`,
    isOpen: true,
    schemaVersionId: DEFAULT_SCHEMA_VERSION.id
  },
  {
    id: generateId(),
    name: 'CreateUser.graphql',
    category: 'Mutations',
    query: `mutation createUser($user: AddUserInput!) {\n  createUser(user: $user) {\n    id\n    name\n    age\n  }\n}`,
    variables: `{\n  "user": {\n    "age": 12,\n    "name": "ryan",\n    "isMarried": true\n  }\n}`,
    headers: `{\n  \n}`,
    isOpen: true,
    schemaVersionId: DEFAULT_SCHEMA_VERSION.id
  }
];

const DEFAULT_API_URL = "https://api.querycamp.io/v1/graphql";


// 3. Create Context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// 4. Provider Component
export function EditorProvider({ children }: { children: ReactNode }) {
  // --- State Initialization with LocalStorage ---
  const [tabs, setTabs] = useState<TabData[]>(() => {
    try {
      const savedTabs = localStorage.getItem('querycamp_tabs');
      if (savedTabs) {
        const parsed = JSON.parse(savedTabs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Backward compatibility check for tabs without a category or schema version
          const needsFixing = parsed.some(t => !t.category || t.isOpen === undefined || !t.schemaVersionId);
          if (needsFixing) {
            return parsed.map(t => ({...t, category: t.category || 'Queries', isOpen: t.isOpen ?? true, schemaVersionId: t.schemaVersionId || DEFAULT_SCHEMA_VERSION.id}));
          }
          if (parsed.length === 1 && parsed[0].name === 'NewQuery.graphql') {
            return DEFAULT_TABS;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load tabs from local storage", e);
    }
    // Fallback default
    return DEFAULT_TABS;
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    try {
      const savedActiveId = localStorage.getItem('querycamp_active_tab');
      if (savedActiveId && tabs.some(t => t.id === savedActiveId)) {
          return savedActiveId;
      }
    } catch (e) {
       console.error("Failed to load active tab from storage", e);
    }
    // Fallback to first tab
    return tabs[0]?.id || null;
  });

  const [endpointUrl, setEndpointUrl] = useState<string>(() => {
     try {
       return localStorage.getItem('querycamp_endpoint') || DEFAULT_API_URL;
     } catch (e) {
       return DEFAULT_API_URL;
     }
  });

  const [schemaVersions, setSchemaVersions] = useState<SchemaVersion[]>(() => {
    try {
      const saved = localStorage.getItem('querycamp_schema_versions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load schema versions", e);
    }
    return [DEFAULT_SCHEMA_VERSION];
  });

  const [activeSchemaVersionId, setActiveSchemaVersionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('querycamp_active_schema_version');
      if (saved) return saved;
    } catch (e) {
      console.error("Failed to load active schema version", e);
    }
    return DEFAULT_SCHEMA_VERSION.id;
  });

  const [response, setResponse] = useState<ApiResponse>({ status: null, timeMs: null, data: null });

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('querycamp_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('querycamp_active_tab', activeTabId);
    }
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem('querycamp_endpoint', endpointUrl);
  }, [endpointUrl]);

  useEffect(() => {
    localStorage.setItem('querycamp_schema_versions', JSON.stringify(schemaVersions));
  }, [schemaVersions]);

  useEffect(() => {
    localStorage.setItem('querycamp_active_schema_version', activeSchemaVersionId);
  }, [activeSchemaVersionId]);


  // --- Actions ---
  const addTab = (category: TabData['category'] = 'Queries') => {
    let prefix = '';
    let defaultQuery = '# Write your GraphQL query here\n';
    
    switch(category) {
      case 'Queries': prefix = 'Query'; defaultQuery = 'query {\n  \n}'; break;
      case 'Mutations': prefix = 'Mutation'; defaultQuery = 'mutation {\n  \n}'; break;
      case 'Subscriptions': prefix = 'Subscription'; defaultQuery = 'subscription {\n  \n}'; break;
      case 'Types': prefix = 'Type'; defaultQuery = '# Define your GraphQL types here\n'; break;
    }

    let maxCounter = 0;
    const regex = new RegExp(`^${prefix}(\\d+)\\.graphql$`);
    tabs.forEach(tab => {
      if (tab.category === category) {
        const match = tab.name.match(regex);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxCounter) {
            maxCounter = num;
          }
        }
      }
    });
    
    const newTab: TabData = {
      id: generateId(),
      name: `${prefix}${maxCounter + 1}.graphql`,
      category: category,
      query: defaultQuery,
      variables: '{\n  \n}',
      headers: '{\n  \n}',
      isOpen: true,
      schemaVersionId: activeSchemaVersionId
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking the tab
    setTabs(prevTabs => {
      const result = prevTabs.map(t => t.id === id ? { ...t, isOpen: false } : t);
      
      // If we closed the active tab, pick a new one that is open and in the same schema version
      if (activeTabId === id) {
        const openTabs = result.filter(t => t.isOpen !== false && t.schemaVersionId === activeSchemaVersionId);
        setActiveTabId(openTabs.length > 0 ? openTabs[openTabs.length - 1].id : null);
      }
      return result;
    });
  };

  const deleteTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTabs(prevTabs => {
      const result = prevTabs.filter(t => t.id !== id);
      
      // If we deleted the active tab, pick a new one that is open and in the same schema version
      if (activeTabId === id) {
        const openTabs = result.filter(t => t.isOpen !== false && t.schemaVersionId === activeSchemaVersionId);
        setActiveTabId(openTabs.length > 0 ? openTabs[openTabs.length - 1].id : null);
      }
      return result;
    });
  };

  const updateTab = (id: string, updates: Partial<TabData>) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab)
    );
  };

  const unsubscribeRef = React.useRef<(() => void) | null>(null);

  const executeQuery = async () => {
    if (!activeTabId) return;
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeTab.query.trim()) return;

    // Unsubscribe from previous subscription if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setResponse({ status: null, timeMs: null, data: null, error: null }); // Resetting state
    
    const newResponse = await executeGraphQLQuery(
      endpointUrl, 
      activeTab.query, 
      activeTab.variables, 
      activeTab.headers,
      (streamingResponse) => {
        setResponse(streamingResponse);
      }
    );
    
    if (typeof newResponse === 'function') {
      // It's a cleanup/unsubscribe function from a WebSocket
      unsubscribeRef.current = newResponse;
      // We don't set a final response yet, the onMessage handler will do that
    } else {
      console.log(newResponse);
      setResponse(newResponse);
    }
  };

  const createSchemaVersion = (name: string) => {
    const newId = generateId();
    const newVersion: SchemaVersion = { id: newId, name };
    
    // Duplicate tabs for the new schema version
    const tabsToCopy = tabs.filter(t => t.schemaVersionId === activeSchemaVersionId);
    const newTabs = tabsToCopy.map(t => ({
      ...t,
      id: generateId(),
      schemaVersionId: newId
    }));

    setSchemaVersions([...schemaVersions, newVersion]);
    setTabs([...tabs, ...newTabs]);
    setActiveSchemaVersionId(newId);
    
    // Try to set an active tab in the new version
    if (newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    } else {
      setActiveTabId(null);
    }
  };

  const renameSchemaVersion = (id: string, newName: string) => {
    setSchemaVersions(prevVersions => 
      prevVersions.map(v => v.id === id ? { ...v, name: newName } : v)
    );
  };

  return (
    <EditorContext.Provider value={{
      tabs,
      activeTabId,
      endpointUrl,
      response,
      schemaVersions,
      activeSchemaVersionId,
      addTab,
      closeTab,
      deleteTab,
      updateTab,
      setActiveTabId,
      setEndpointUrl,
      executeQuery,
      createSchemaVersion,
      renameSchemaVersion,
      setActiveSchemaVersionId
    }}>
      {children}
    </EditorContext.Provider>
  );
}

// 5. Custom Hook for easy consumption
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
