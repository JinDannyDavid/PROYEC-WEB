// frontend/src/services/adminPagoService.ts
import { api } from './api';

export interface Pago {
  id: number;
  factura: number;
  factura_numero?: string;
  propiedad_direccion?: string;
  monto: number;
  metodo_pago: string;
  codigo_operacion: string;
  fecha_pago: string;
  estado_comprobante: string;
}

export interface CreatePagoData {
  factura: number;
  monto: number;
  metodo_pago: string;
  codigo_operacion: string;
}

export interface UpdatePagoData {
  estado_comprobante?: string;
}

export const adminPagoService = {
  // Obtener todos los pagos
  getPagos: async (): Promise<Pago[]> => {
    try {
      const response = await api.get('/pagos/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      throw error;
    }
  },

  // Obtener un pago por ID
  getPagoById: async (id: number): Promise<Pago> => {
    try {
      const response = await api.get(`/pagos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo pago ${id}:`, error);
      throw error;
    }
  },

  // Registrar un nuevo pago
  createPago: async (data: CreatePagoData): Promise<Pago> => {
    try {
      const response = await api.post('/pagos/', data);
      return response.data;
    } catch (error) {
      console.error('Error registrando pago:', error);
      throw error;
    }
  },

  // Actualizar estado de un pago
  updatePago: async (id: number, data: UpdatePagoData): Promise<Pago> => {
    try {
      const response = await api.patch(`/pagos/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando pago ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un pago
  deletePago: async (id: number): Promise<void> => {
    try {
      await api.delete(`/pagos/${id}/`);
    } catch (error) {
      console.error(`Error eliminando pago ${id}:`, error);
      throw error;
    }
  },
};