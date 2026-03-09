export interface TabData {
  id: string;
  name: string;
  query: string;
  variables: string;
  headers: string;
}

export interface ApiResponse {
  status: number | null;
  timeMs: number | null;
  data: any | null;
  error?: string | null;
}
