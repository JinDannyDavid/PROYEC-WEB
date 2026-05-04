// frontend/src/services/adminFacturaService.ts
import { api } from './api';

export interface Factura {
  id: number;
  numero_factura: string;
  propiedad: number;
  propiedad_direccion?: string;
  periodo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  lectura_anterior: number;
  lectura_actual: number;
  consumo_m3: number;
  cargo_fijo: number;
  cargo_consumo: number;
  cargo_alcantarillado: number;
  monto_total: number;
  estado: string;
}

export interface CreateFacturaData {
  propiedad: number;
  periodo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  lectura_anterior: number;
  lectura_actual: number;
  cargo_fijo: number;
  cargo_alcantarillado: number;
}

export interface UpdateFacturaData {
  fecha_vencimiento?: string;
  lectura_anterior?: number;
  lectura_actual?: number;
  cargo_fijo?: number;
  cargo_alcantarillado?: number;
  estado?: string;
}

export const adminFacturaService = {
  // Obtener todas las facturas
  getFacturas: async (): Promise<Factura[]> => {
    try {
      const response = await api.get('/facturas/');
      const data = response.data.results ? response.data.results : response.data;
      return data;
    } catch (error) {
      console.error('Error obteniendo facturas:', error);
      throw error;
    }
  },

  // Obtener una factura por ID
  getFacturaById: async (id: number): Promise<Factura> => {
    try {
      const response = await api.get(`/facturas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo factura ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva factura
  createFactura: async (data: CreateFacturaData): Promise<Factura> => {
    try {
      const response = await api.post('/facturas/', data);
      return response.data;
    } catch (error) {
      console.error('Error creando factura:', error);
      throw error;
    }
  },

  // Actualizar una factura
  updateFactura: async (id: number, data: UpdateFacturaData): Promise<Factura> => {
    try {
      const response = await api.patch(`/facturas/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando factura ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una factura
  deleteFactura: async (id: number): Promise<void> => {
    try {
      await api.delete(`/facturas/${id}/`);
    } catch (error) {
      console.error(`Error eliminando factura ${id}:`, error);
      throw error;
    }
  },
};