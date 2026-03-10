export interface SchemaVersion {
  id: string;
  name: string;
}

export interface TabData {
  id: string;
  name: string;
  category: 'Queries' | 'Mutations' | 'Subscriptions' | 'Types';
  query: string;
  variables: string;
  headers: string;
  isOpen?: boolean;
  schemaVersionId?: string;
}

export interface ApiResponse {
  status: number | null;
  timeMs: number | null;
  data: any | null;
  error?: string | null;
}
