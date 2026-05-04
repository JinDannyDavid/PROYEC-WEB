// src/contexts/AuthContext.tsx
import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
  login: (dni: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      const response = await axios.get(`${API_URL}/perfil/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Guardar el usuario
      const userData = response.data.data || response.data;
      setUser(userData);
      
      // Asegurar que el token también esté en localStorage
      localStorage.setItem('access_token', token);
      
    } catch (error) {
      console.error('Error fetching user:', error);
      // Si el token es inválido, limpiar todo
      localStorage.removeItem('access_token');
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // En AuthContext.tsx
const login = async (dni: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { dni, password });
    
    const { access, refresh, user: userData } = response.data;
    
        
    // Guardar en localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // Guardar en cookies para el middleware
    document.cookie = `access_token=${access}; path=/; max-age=86400`;
    document.cookie = `refresh_token=${refresh}; path=/; max-age=604800`;
    
    setUser(userData);
    
    // ✅ REDIRECCIÓN SEGÚN EL ROL
    if (userData.tipo_usuario === 'ADMIN') {
      console.log('🟢 Redirigiendo a /admin');
      window.location.href = '/admin';
    } else {
      console.log('🟢 Redirigiendo a /dashboard');
      window.location.href = '/dashboard';
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Login error:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al iniciar sesión'
    };
  }
};

  const register = async (userData: any) => {
  try {
    console.log('🟡 Datos de registro enviados:', userData);
    const response = await axios.post(`${API_URL}/usuarios/`, userData);
    
    console.log('🟢 Registro exitoso:', response.data);
    
    return { 
      success: true, 
      message: 'Usuario registrado correctamente' 
    };
  } catch (error: any) {
    console.error('🔴 Register error:', error.response?.data);
    
    let errorMessage = 'Error al registrar usuario';
    
    // Extraer mensajes de error del backend
    if (error.response?.data) {
      const data = error.response.data;
      
      // Error de DNI duplicado
      if (data.dni && Array.isArray(data.dni)) {
        errorMessage = data.dni[0];
      }
      // Otros errores
      else if (data.detail) {
        errorMessage = data.detail;
      }
      else if (data.message) {
        errorMessage = data.message;
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Limpiar cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
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