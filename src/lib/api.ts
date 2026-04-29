const BASE_URL = '/api/external';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-auth-token'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log('[apiFetch]', url, token ? 'WITH TOKEN' : 'no token');

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.responseCodeTxt || `Error ${response.status}`
    );
  }

  const data = await response.json();
  // Return full response — each caller handles the structure
  return data as T;
}

export const endpoints = {
  login: '/api/login',
  profile: '/api/movil/estudiante',
  grades: '/api/movil/estudiante/calificaciones',
  kardex: '/api/movil/estudiante/kardex',
  schedule: '/api/movil/estudiante/horarios',
};
