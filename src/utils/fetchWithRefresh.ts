import API_URL from './apiUrl';

const BASE_URL = API_URL;

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
