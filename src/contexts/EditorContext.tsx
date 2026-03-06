import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Data Types
export interface TabData {
  id: string;
  name: string;
  query: string;
  variables: string;
}

export interface ApiResponse {
  status: number | null;
  timeMs: number | null;
  data: any | null;
  error?: string | null;
}

interface EditorContextType {
  tabs: TabData[];
  activeTabId: string | null;
  endpointUrl: string;
  response: ApiResponse;
  
  // Actions
  addTab: () => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
  updateTab: (id: string, updates: Partial<TabData>) => void;
  setActiveTabId: (id: string) => void;
  setEndpointUrl: (url: string) => void;
  executeQuery: () => Promise<void>;
}

// 2. Default Initial Data
const generateId = () => crypto.randomUUID();

export const DEFAULT_TABS: TabData[] = [
  {
    id: generateId(),
    name: 'GetUserData.graphql',
    query: `query GetUserData($id: ID!) {\n  user(id: $id) {\n    id\n    username\n    email\n    posts {\n      title\n      content\n      createdAt\n    }\n  }\n}`,
    variables: `{\n  "id": "usr_982347102"\n}`
  },
  {
    id: generateId(),
    name: 'UpdateProfile.graphql',
    query: `mutation UpdateProfile($input: ProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    username\n    updatedAt\n  }\n}`,
    variables: `{\n  "input": {\n    "username": "new_name"\n  }\n}`
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


  // --- Actions ---
  const addTab = () => {
    const newTab: TabData = {
      id: generateId(),
      name: `Query${tabs.length + 1}.graphql`,
      query: '# Write your GraphQL query here\n',
      variables: '{\n  \n}'
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking the tab
    setTabs(prevTabs => {
      const result = prevTabs.filter(t => t.id !== id);
      
      // If we closed the active tab, pick a new one
      if (activeTabId === id) {
        if (result.length > 0) {
          // Try to get the one before it, or the first one
          const closedIndex = prevTabs.findIndex(t => t.id === id);
          const nextIndex = Math.max(0, closedIndex - 1);
          setActiveTabId(result[nextIndex]?.id || null);
        } else {
          setActiveTabId(null);
        }
      }
      return result;
    });
  };

  const updateTab = (id: string, updates: Partial<TabData>) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab)
    );
  };

  const executeQuery = async () => {
    if (!activeTabId) return;
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeTab.query.trim()) return;

    setResponse({ status: null, timeMs: null, data: null, error: null }); // Resetting state
    const startTime = performance.now();

    try {
      // Parse variables if needed
      let parsedVariables = {};
      if (activeTab.variables.trim()) {
         try {
           parsedVariables = JSON.parse(activeTab.variables);
         } catch (e) {
           setResponse({
             status: 400,
             timeMs: performance.now() - startTime,
             data: null,
             error: "Invalid JSON in variables panel."
           });
           return;
         }
      }

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: activeTab.query,
          variables: parsedVariables
        })
      });

      const data = await res.json();
      const timeMs = Math.round(performance.now() - startTime);

      setResponse({
        status: res.status,
        timeMs,
        data: data.data || data, // GraphQL usually puts results in .data
        error: data.errors ? JSON.stringify(data.errors, null, 2) : res.ok ? null : "HTTP Error"
      });

    } catch (err: any) {
      setResponse({
        status: 0, // Network error
        timeMs: Math.round(performance.now() - startTime),
        data: null,
        error: err.message || "Failed to fetch response."
      });
    }
  };

  return (
    <EditorContext.Provider value={{
      tabs,
      activeTabId,
      endpointUrl,
      response,
      addTab,
      closeTab,
      updateTab,
      setActiveTabId,
      setEndpointUrl,
      executeQuery
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
