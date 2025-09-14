import { useAuth } from '@clerk/clerk-expo';

export function useFetch() {
  const { getToken } = useAuth();

  return async (
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    }
  ) => {
    const token = await getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }

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

    return response;
  };
}
