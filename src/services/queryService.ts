import type { ApiResponse } from '../types/editor';

export async function executeGraphQLQuery(
  endpointUrl: string,
  query: string,
  variables: string,
  customHeaders: string
): Promise<ApiResponse> {
  const startTime = performance.now();

  try {
    let parsedVariables = {};
    if (variables.trim()) {
      try {
        parsedVariables = JSON.parse(variables);
      } catch (e) {
        return {
          status: 400,
          timeMs: Math.round(performance.now() - startTime),
          data: null,
          error: "Invalid JSON in variables panel."
        };
      }
    }

    let parsedHeaders = {};
    if (customHeaders && customHeaders.trim()) {
      try {
        parsedHeaders = JSON.parse(customHeaders);
      } catch (e) {
        return {
          status: 400,
          timeMs: Math.round(performance.now() - startTime),
          data: null,
          error: "Invalid JSON in HTTP Headers panel."
        };
      }
    }

    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...parsedHeaders
      },
      body: JSON.stringify({
        query: query,
        variables: parsedVariables
      })
    });

    const data = await res.json();
    const timeMs = Math.round(performance.now() - startTime);

    return {
      status: res.status,
      timeMs,
      data: data.data || data,
      error: data.errors ? JSON.stringify(data.errors, null, 2) : res.ok ? null : "HTTP Error"
    };

  } catch (err: any) {
    return {
      status: 0,
      timeMs: Math.round(performance.now() - startTime),
      data: null,
      error: err.message || "Failed to fetch response."
    };
  }
}
