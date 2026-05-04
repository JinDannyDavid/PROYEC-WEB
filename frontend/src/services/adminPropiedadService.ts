// frontend/src/services/adminPropiedadService.ts
import { api } from './api';

export interface Propiedad {
  id: number;
  usuario: number;
  usuario_nombre?: string;
  direccion: string;
  sector: string;
  numero_medidor: string;
  tipo_propiedad: string;
  estado: string;
  ultimo_consumo?: number;
  ultima_lectura?: string;
}

export interface CreatePropiedadData {
  usuario: number;
  direccion: string;
  sector: string;
  numero_medidor: string;
  tipo_propiedad: string;
  estado: string;
}

export interface UpdatePropiedadData {
  direccion?: string;
  sector?: string;
  numero_medidor?: string;
  tipo_propiedad?: string;
  estado?: string;
}

export const adminPropiedadService = {
  // Obtener todas las propiedades
  getPropiedades: async (): Promise<Propiedad[]> => {
    try {
      const response = await api.get('/propiedades/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo propiedades:', error);
      throw error;
    }
  },

  // Obtener una propiedad por ID
  getPropiedadById: async (id: number): Promise<Propiedad> => {
    try {
      const response = await api.get(`/propiedades/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo propiedad ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva propiedad
  createPropiedad: async (data: CreatePropiedadData): Promise<Propiedad> => {
    try {
      const response = await api.post('/propiedades/', data);
      return response.data;
    } catch (error) {
      console.error('Error creando propiedad:', error);
      throw error;
    }
  },

  // Actualizar una propiedad
  updatePropiedad: async (id: number, data: UpdatePropiedadData): Promise<Propiedad> => {
    try {
      const response = await api.patch(`/propiedades/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando propiedad ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una propiedad
  deletePropiedad: async (id: number): Promise<void> => {
    try {
      await api.delete(`/propiedades/${id}/`);
    } catch (error) {
      console.error(`Error eliminando propiedad ${id}:`, error);
      throw error;
    }
  },
};