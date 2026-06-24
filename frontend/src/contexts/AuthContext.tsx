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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Registrar callback para expiracion de sesion
  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      console.log('Sesion expirada, redirigiendo a login');
      clearTokens();
      setUser(null);
      router.push('/login');
    });
    return unsubscribe;
  }, [router]);

  // Cargar usuario desde token al iniciar (solo en cliente)
  useEffect(() => {
    const loadUser = async () => {
      // Solo ejecutar en cliente
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Verificar si hay token disponible ANTES de intentar fetch
      const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('access_token=')) 
        || localStorage.getItem('access_token');
      
      if (!hasToken) {
        setLoading(false);
        return;
      }

      try {
        // Usar la instancia api con interceptores de refresh token
        const response = await api.get('/perfil/');
        
        // Guardar el usuario
        const userData = response.data.data || response.data;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Si el token es invalido, limpiar todo
        clearTokens();
        setUser(null);
      } finally {
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
      
      // Token ya esta en localStorage desde el login, no re-escribir
      
    } catch (error) {
      console.error('Error fetching user:', error);
      // Si el token es invalido, limpiar todo
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
      
      // Retornar datos para que el componente maneje la navegacion SPA
      return { 
        success: true, 
        user: userData,
        redirectTo: userData.tipo_usuario === 'ADMIN' ? '/admin' : '/dashboard'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      console.error('Login error:', axiosError.response?.data);
      return {
        success: false,
        message: axiosError.response?.data?.detail || 'Error al iniciar sesion'
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log('Datos de registro enviados:', userData);
      const response = await api.post('/usuarios/', userData);
      
      console.log('Registro exitoso:', response.data);
      
      // Auto-login despues de registro: usar credenciales recién creadas
      // El backend debería devolver el usuario creado, así que intentamos login directo
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
      
      // Fallback: si login falla, intentar obtener perfil con token recién creado
      // (login ya maneja el almacenamiento de tokens)
      return { 
        success: false, 
        message: 'Registro exitoso pero error al iniciar sesion automaticamente' 
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