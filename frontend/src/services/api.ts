// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Singleton token manager to avoid race conditions
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'access_token') {
            this.accessToken = value;
            break;
          }
        }
        if (!this.accessToken) {
          this.accessToken = localStorage.getItem('access_token');
        }
        this.refreshToken = localStorage.getItem('refresh_token');
      } finally {
        this.initialized = true;
      }
    })();

    await this.initPromise;
  }

  async getTokens(): Promise<{ access: string | null; refresh: string | null }> {
    await this.initialize();
    return { access: this.accessToken, refresh: this.refreshToken };
  }

  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    document.cookie = `access_token=${access}; path=/; max-age=86400`;
    document.cookie = `refresh_token=${refresh}; path=/; max-age=604800`;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

// Singleton instance
const tokenManager = new TokenManager();

// Callbacks para notificar expiracion de sesion
type AuthExpiredCallback = () => void;
const authExpiredCallbacks: Set<AuthExpiredCallback> = new Set();

export function onAuthExpired(callback: AuthExpiredCallback): () => void {
  authExpiredCallbacks.add(callback);
  return () => {
    authExpiredCallbacks.delete(callback);
  };
}

function notifyAuthExpired(): void {
  authExpiredCallbacks.forEach(cb => cb());
}

// Crear instancia axios dedicada para refresh (sin interceptores para evitar loop)
const refreshApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function refreshAccessToken(): Promise<string> {
  const { refresh } = await tokenManager.getTokens();
  if (!refresh) throw new Error('No refresh token available');
  
  try {
    const response = await refreshApi.post('/token/refresh/', { refresh });
    const { access, refresh: newRefresh } = response.data;
    tokenManager.setTokens(access, newRefresh || refresh);
    return access;
  } catch (error) {
    tokenManager.clearTokens();
    throw error;
  }
}

// Interceptor para agregar el token
api.interceptors.request.use(async (config) => {
  const { access } = await tokenManager.getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Interceptor para manejar 401 y refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null = null): void {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Esperar a que termine el refresh en curso con timeout
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Refresh timeout'));
          }, 10000);
          
          failedQueue.push({ 
            resolve: (token: string) => {
              clearTimeout(timeout);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: Error) => {
              clearTimeout(timeout);
              reject(err);
            }
          });
        });
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
        // Notificar expiracion de sesion
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

export { tokenManager };

// Exportar funciones compatibles
export const clearTokens = () => tokenManager.clearTokens();
export const setTokens = (access: string, refresh: string) => tokenManager.setTokens(access, refresh);
export const getTokens = () => tokenManager.getTokens();