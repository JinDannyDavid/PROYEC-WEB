// src/contexts/AuthContext.tsx
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, onAuthExpired, clearTokens } from '@/services/api';

interface User {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion: string;
  sector: string;
  tipo_usuario: 'VECINO' | 'ADMIN' | 'CAJERO' | 'TECNICO';
  foto_url?: string;
  fecha_registro?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (dni: string, password: string) => Promise<{ success: boolean; message?: string; user?: User; redirectTo?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string; user?: User; redirectTo?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion: string;
  sector: string;
  password: string;
  confirm_password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Registrar callback para expiración de sesión
  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      console.log('🔴 Sesión expirada, redirigiendo a login');
      clearTokens();
      setUser(null);
      router.push('/login');
    });
    return unsubscribe;
  }, [router]);

  // Cargar usuario desde token al iniciar
  useEffect(() => {
    const loadUser = async () => {
      // Intentar obtener token de cookies o localStorage
      let token = null;
      
      // Primero intentar desde cookies
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access_token') {
          token = value;
          break;
        }
      }
      
      // Si no está en cookies, intentar desde localStorage
      if (!token) {
        token = localStorage.getItem('access_token');
      }
      
      if (token) {
        await fetchUser(token);
      } else {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      // Usar la instancia api con interceptores de refresh token
      const response = await api.get('/perfil/');
      
      // Guardar el usuario
      const userData = response.data.data || response.data;
      setUser(userData);
      
      // Asegurar que el token también esté en localStorage
      localStorage.setItem('access_token', token);
      
    } catch (error) {
      console.error('Error fetching user:', error);
      // Si el token es inválido, limpiar todo
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (dni: string, password: string) => {
    try {
      const response = await api.post('/token/', { dni, password });
      
      const { access, refresh, user: userData } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Guardar en cookies para el middleware
      document.cookie = `access_token=${access}; path=/; max-age=86400`;
      document.cookie = `refresh_token=${refresh}; path=/; max-age=604800`;
      
      setUser(userData);
      
      // ✅ RETORNAR DATOS PARA QUE EL COMPONENTE MANEJE LA NAVEGACIÓN SPA
      return { 
        success: true, 
        user: userData,
        redirectTo: userData.tipo_usuario === 'ADMIN' ? '/admin' : '/dashboard'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      console.error('🔴 Login error:', axiosError.response?.data);
      return {
        success: false,
        message: axiosError.response?.data?.detail || 'Error al iniciar sesión'
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log('🟡 Datos de registro enviados:', userData);
      const response = await api.post('/usuarios/', userData);
      
      console.log('🟢 Registro exitoso:', response.data);
      
      // Auto-login después de registro exitoso
      const { dni, password } = userData;
      const loginResult = await login(dni, password);
      
      if (loginResult.success) {
        return { 
          success: true, 
          message: 'Usuario registrado correctamente',
          user: loginResult.user,
          redirectTo: loginResult.redirectTo
        };
      }
      
      return { 
        success: false, 
        message: 'Registro exitoso pero error al iniciar sesión automáticamente' 
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: Record<string, unknown> } };
      let errorMessage = 'Error al registrar usuario';
      
      // Extraer mensajes de error del backend
      if (axiosError.response?.data) {
        const data = axiosError.response.data as Record<string, unknown>;
        
        // Error de DNI duplicado
        if (data.dni && Array.isArray(data.dni)) {
          errorMessage = String(data.dni[0]);
        }
        // Otros errores
        else if (data.detail) {
          errorMessage = String(data.detail);
        }
        else if (data.message) {
          errorMessage = String(data.message);
        }
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    clearTokens();
    
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};