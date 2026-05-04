// frontend/src/services/adminUserService.ts
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
  activo: boolean;
  fecha_registro: string;
  propiedades_count?: number;
}

export interface CreateUsuarioData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email?: string;
  direccion: string;
  sector: string;
  tipo_usuario: string;
  password: string;
  confirm_password: string;
}

export interface UpdateUsuarioData {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  sector?: string;
  tipo_usuario?: string;
  activo?: boolean;
}

export const adminUserService = {
  // Obtener todos los usuarios (solo admin)
  getUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get('/usuarios/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id: number): Promise<Usuario> => {
    try {
      const response = await api.get(`/usuarios/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo usuario ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo usuario (admin)
  createUsuario: async (data: CreateUsuarioData): Promise<Usuario> => {
    try {
      const response = await api.post('/usuarios/', data);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario (admin)
  updateUsuario: async (id: number, data: UpdateUsuarioData): Promise<Usuario> => {
    try {
      const response = await api.patch(`/usuarios/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando usuario ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario (admin)
  deleteUsuario: async (id: number): Promise<void> => {
    try {
      await api.delete(`/usuarios/${id}/`);
    } catch (error) {
      console.error(`Error eliminando usuario ${id}:`, error);
      throw error;
    }
  },
};