// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache del token en memoria para evitar leer localStorage en cada request
let accessTokenCache: string | null = null;
let refreshTokenCache: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// Callbacks para notificar expiración de sesión (evita window.location.href)
type AuthExpiredCallback = () => void;
const authExpiredCallbacks: AuthExpiredCallback[] = [];

export function onAuthExpired(callback: AuthExpiredCallback) {
  authExpiredCallbacks.push(callback);
}

function notifyAuthExpired() {
  authExpiredCallbacks.forEach(cb => cb());
}

function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

function getTokens(): { access: string | null; refresh: string | null } {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  
  if (!accessTokenCache) {
    accessTokenCache = localStorage.getItem('access_token');
  }
  if (!refreshTokenCache) {
    refreshTokenCache = localStorage.getItem('refresh_token');
  }
  return { access: accessTokenCache, refresh: refreshTokenCache };
}

function setTokens(access: string, refresh: string) {
  accessTokenCache = access;
  refreshTokenCache = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  document.cookie = `access_token=${access}; path=/; max-age=86400`;
  document.cookie = `refresh_token=${refresh}; path=/; max-age=604800`;
}

function clearTokens() {
  accessTokenCache = null;
  refreshTokenCache = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Crear instancia axios dedicada para refresh (sin interceptores para evitar loop)
const refreshApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function refreshAccessToken(): Promise<string> {
  const { refresh } = getTokens();
  if (!refresh) throw new Error('No refresh token available');
  
  try {
    const response = await refreshApi.post('/token/refresh/', { refresh });
    const { access, refresh: newRefresh } = response.data;
    setTokens(access, newRefresh || refresh);
    return access;
  } catch (error) {
    clearTokens();
    throw error;
  }
}

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Interceptor para manejar 401 y refresh token
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Esperar a que termine el refresh en curso
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        processQueue(error, null);
        // Notificar expiración de sesión (en lugar de window.location.href)
        if (typeof window !== 'undefined') {
          notifyAuthExpired();
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export { clearTokens, setTokens, getTokens };