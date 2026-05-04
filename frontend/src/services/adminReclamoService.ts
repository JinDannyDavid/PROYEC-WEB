// frontend/src/services/adminReclamoService.ts
import { api } from './api';

export interface Reclamo {
  id: number;
  usuario: number;
  usuario_nombre?: string;
  usuario_dni?: string;
  propiedad: number;
  propiedad_direccion?: string;
  tipo: string;
  descripcion: string;
  foto_url?: string;
  estado: string;
  fecha_creacion: string;
  respuesta?: string;
  fecha_respuesta?: string;
}

export interface UpdateReclamoData {
  estado: string;
  respuesta: string;
}

export const adminReclamoService = {
  // Obtener todos los reclamos
  getReclamos: async (): Promise<Reclamo[]> => {
    try {
      const response = await api.get('/reclamos/');
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

  // Actualizar estado y respuesta de un reclamo
  updateReclamo: async (id: number, data: UpdateReclamoData): Promise<Reclamo> => {
    try {
      const response = await api.patch(`/reclamos/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando reclamo ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un reclamo
  deleteReclamo: async (id: number): Promise<void> => {
    try {
      await api.delete(`/reclamos/${id}/`);
    } catch (error) {
      console.error(`Error eliminando reclamo ${id}:`, error);
      throw error;
    }
  },
};