// frontend/src/services/complaintService.ts
import { api } from './api';

export interface Reclamo {
  id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  respuesta?: string;
  fecha_respuesta?: string;
  foto_url?: string;
  propiedad_id?: number;
  propiedad_nombre?: string;
}

export interface CreateReclamoData {
  propiedad: number;
  tipo: string;
  descripcion: string;
  foto_url?: string;
}

export const complaintService = {
  // Obtener todos los reclamos del usuario
  getMisReclamos: async (): Promise<Reclamo[]> => {
    try {
      const response = await api.get('/mis-reclamos/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo reclamos:', error);
      throw error;
    }
  },

  // Obtener un reclamo por ID
  getReclamoById: async (id: number): Promise<Reclamo> => {
    try {
      const response = await api.get(`/reclamos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo reclamo ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo reclamo
  createReclamo: async (data: CreateReclamoData): Promise<Reclamo> => {
    try {
      const response = await api.post('/reclamos/', data);
      return response.data;
    } catch (error) {
      console.error('Error creando reclamo:', error);
      throw error;
    }
  },

  // Actualizar estado de un reclamo (solo admin)
  updateReclamoEstado: async (id: number, estado: string, respuesta?: string): Promise<Reclamo> => {
    try {
      const response = await api.patch(`/reclamos/${id}/`, { estado, respuesta });
      return response.data;
    } catch (error) {
      console.error(`Error actualizando reclamo ${id}:`, error);
      throw error;
    }
  },
};