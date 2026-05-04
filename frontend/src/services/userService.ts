// frontend/src/services/userService.ts
import { api } from './api';

export interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion: string;
  sector: string;
  tipo_usuario: string;
  foto_url?: string;
  fecha_registro: string;
}

export interface UpdateUserData {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  sector?: string;
}

export interface ChangePasswordData {
  password_actual: string;
  nueva_password: string;
  confirm_password: string;
}

export const userService = {
  // Obtener perfil del usuario
  getPerfil: async (): Promise<Usuario> => {
    try {
      const response = await api.get('/perfil/');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil
  updatePerfil: async (data: UpdateUserData): Promise<Usuario> => {
    try {
      const response = await api.patch('/perfil/actualizar/', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/cambiar-password/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error cambiando contraseña:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Error al cambiar contraseña'
      };
    }
  },
};