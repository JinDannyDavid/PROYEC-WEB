// src/hooks/useApi.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheTTL?: number; // Time to live en ms
  cacheMaxSize?: number; // Maximo de entradas en cache
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

// Cache con TTL y limite de tamano
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 50 entradas, 5 min TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  private makeKey(url: string, args: unknown[]): string {
    // Usar URL + hash estable de args
    let argsStr = '';
    if (args.length > 0) {
      try {
        argsStr = JSON.stringify(args[0]);
      } catch {
        argsStr = String(args[0]);
      }
    }
    return `${url}:${argsStr}`;
  }

  get<T>(url: string, args: unknown[]): T | null {
    const key = this.makeKey(url, args);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Verificar TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  set<T>(url: string, args: unknown[], data: T): void {
    const key = this.makeKey(url, args);
    
    // Limpiar entradas expiradas si cache lleno
    if (this.cache.size >= this.maxSize) {
      this.cleanExpired();
    }
    
    // Si aun lleno, eliminar la mas antigua (LRU simple)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  delete(url: string, args: unknown[] = []): void {
    const key = this.makeKey(url, args);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global del cache
const apiCache = new ApiCache(50, 5 * 60 * 1000);

export function useApi<T = unknown>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { 
    immediate = true, 
    onSuccess, 
    onError, 
    cacheTTL = 5 * 60 * 1000,
    cacheMaxSize = 50
  } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    // Verificar cache
    const cachedData = apiCache.get<T>(url, args);
    if (cachedData !== null) {
      if (isMounted.current) {
        setData(cachedData);
        setError(null);
        onSuccess?.(cachedData);
      }
      return cachedData;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await api.get(url, { signal, ...(args[0] || {}) });
      let result: T;
      
      if (Array.isArray(response.data)) {
        result = response.data as T;
      } else if (response.data.results) {
        result = response.data.results as T;
      } else {
        result = response.data as T;
      }

      // Guardar en cache
      apiCache.set(url, args, result);

      if (isMounted.current) {
        setData(result);
        onSuccess?.(result);
      }
      return result;
    } catch (err: unknown) {
      if (isMounted.current) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        if (error.name !== 'AbortError') {
          setError(error);
          onError?.(error);
        }
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [url, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [immediate, execute]);

  return { data, loading, error, execute, reset };
}

// Hook especifico para facturas pendientes
export function useFacturasPendientes() {
  return useApi<{ id: number; numero_factura: string; periodo: string; monto_total: number; fecha_vencimiento: string; estado: string; consumo_m3?: number }[]>('/facturas/pendientes/');
}

// Hook especifico para historial de pagos
export function useMisPagos() {
  return useApi<{ id: number; monto: number; fecha_pago: string; metodo_pago: string }[]>('/mis-pagos/');
}

// Funcion para invalidar cache
export function invalidateApiCache(url?: string, args: unknown[] = []) {
  if (url) {
    apiCache.delete(url, args);
  } else {
    apiCache.clear();
  }
}