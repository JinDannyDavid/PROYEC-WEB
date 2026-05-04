// frontend/src/services/notificationService.ts
import { api } from './api';

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fecha_creacion: string;
  fecha_lectura?: string;
}

export const notificationService = {
  // Obtener todas las notificaciones del usuario
  getMisNotificaciones: async (): Promise<Notificacion[]> => {
    try {
      const response = await api.get('/mis-notificaciones/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw error;
    }
  },

  // Marcar una notificación como leída
  marcarComoLeida: async (id: number): Promise<void> => {
    try {
      await api.post(`/notificaciones/${id}/leer/`);
    } catch (error) {
      console.error(`Error marcando notificación ${id} como leída:`, error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  marcarTodasComoLeidas: async (): Promise<void> => {
    try {
      await api.post('/notificaciones/leer-todas/');
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
      throw error;
    }
  },
};