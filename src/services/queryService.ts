import type { ApiResponse } from '../types/editor';

import { createClient } from 'graphql-ws';

export async function executeGraphQLQuery(
  endpointUrl: string,
  query: string,
  variables: string,
  customHeaders: string,
  onMessage?: (response: ApiResponse) => void
): Promise<ApiResponse | (() => void)> {
  const startTime = performance.now();

  try {
    endpointUrl = endpointUrl.trim();
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

    // --- WebSocket Logic ---
    if (endpointUrl.startsWith('ws://') || endpointUrl.startsWith('wss://')) {
      if (!onMessage) {
        return {
          status: 400,
          timeMs: Math.round(performance.now() - startTime),
          data: null,
          error: "WebSocket requires an onMessage callback."
        };
      }

      const client = createClient({
        url: endpointUrl,
        connectionParams: parsedHeaders,
        on: {
          connected: () => {
            onMessage({
              status: 101,
              timeMs: Math.round(performance.now() - startTime),
              data: { status: "Connected successfully. Listening for subscription events..." },
              error: null
            });
          }
        }
      });

      const unsubscribe = client.subscribe(
        {
          query: query,
          variables: parsedVariables
        },
        {
          next: (data) => {
             onMessage({
                status: 200,
                timeMs: Math.round(performance.now() - startTime),
                data: data.data || data,
                error: data.errors ? JSON.stringify(data.errors, null, 2) : null
             });
          },
          error: (err: any) => {
            let errorMessage = "Subscription Connection Error";
            
            if (Array.isArray(err)) {
                errorMessage = JSON.stringify(err, null, 2);
            } 
            else if (err instanceof Error) {
                errorMessage = err.message;
            } 
            else if (err && typeof err === 'object') {
                // Typical WebSocket error events
                if (err.type === 'error' && err.message) {
                    errorMessage = err.message;
                } else if (err.message) {
                    errorMessage = String(err.message);
                } else {
                    errorMessage = "WebSocket closed or failed to connect. Ensure your backend supports WebSocket subprotocols 'graphql-ws' or 'graphql-transport-ws'.";
                }
            }
             onMessage({
                status: 500,
                timeMs: Math.round(performance.now() - startTime),
                data: null,
                error: errorMessage
             });
          },
          complete: () => {
             console.log("Subscription complete.");
          }
        }
      );

      // Return cleanup function
      return () => {
        unsubscribe();
        client.dispose();
      };
    }

    // --- HTTP Logic ---
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
