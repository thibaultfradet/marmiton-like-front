const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function fetchWithRefresh(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(BASE_URL + input, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(BASE_URL + '/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      return fetch(BASE_URL + input, {
        ...init,
        credentials: 'include',
      });
    }

    window.dispatchEvent(new CustomEvent('auth:logout'));
    return response;
  }

  return response;
}

export default fetchWithRefresh;
