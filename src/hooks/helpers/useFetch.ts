import { useAuth } from '@clerk/clerk-expo';

export function useFetch() {
  const { getToken } = useAuth();

  return async (
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    },
    debug = false
  ) => {
    if (debug) {
      console.log('Fetching:', endpoint, options ?? 'No-opt');
    }

    const token = await getToken();
    if (!token) {
      if (debug) console.log('No auth token available');
      throw new Error('User is not authenticated');
    }

    if (debug) console.log(`Auth token acquired: ${token.substring(0, 10)}...`);

    const { method = 'GET', headers = {}, body } = options || {};

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (debug) console.log(`Response from ${endpoint}:`, response.status, response.statusText);

    return response;
  };
}
