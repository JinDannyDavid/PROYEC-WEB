// frontend/src/services/paymentService.ts
import { api } from './api';
import { BaseApiService, defaultExtractData } from './baseApi';

export interface Factura {
  id: number;
  numero_factura: string;
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
  propiedad_id?: number;
  propiedad_direccion?: string;
}

export interface Pago {
  id: number;
  factura: number;
  monto: number;
  metodo_pago: string;
  codigo_operacion: string;
  fecha_pago: string;
  estado_comprobante: string;
  factura_numero?: string;
}

export interface CreatePagoData {
  factura: number;
  monto: number;
  metodo_pago: string;
  codigo_operacion: string;
}

// Servicios usando BaseApiService para CRUD estándar
const facturasService = new BaseApiService<Factura>({ endpoint: '/facturas/', extractData: defaultExtractData });
const pagosService = new BaseApiService<Pago, CreatePagoData>({ endpoint: '/pagos/', extractData: defaultExtractData });

export const paymentService = {
  // Obtener todas las facturas del usuario
  getFacturas: () => facturasService.getAll(),

  // Obtener facturas pendientes (endpoint personalizado)
  getFacturasPendientes: async (): Promise<Factura[]> => {
    try {
      const response = await api.get('/facturas/pendientes/');
      return defaultExtractData(response);
    } catch (error) {
      console.error('Error obteniendo facturas pendientes:', error);
      throw error;
    }
  },

  // Obtener una factura por ID
  getFacturaById: (id: number) => facturasService.getById(id),

  // Obtener historial de pagos del usuario
  getMisPagos: async (): Promise<Pago[]> => {
    try {
      const response = await api.get('/mis-pagos/');
      return defaultExtractData(response);
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      throw error;
    }
  },

  // Registrar un nuevo pago
  createPago: (data: CreatePagoData) => pagosService.create(data),

  // Obtener resumen de pagos
  getResumenPagos: async (): Promise<{
    total_pagado: number;
    cantidad_pagos: number;
    ultimo_pago: Pago | null;
  }> => {
    try {
      const response = await api.get('/pagos/resumen/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen de pagos:', error);
      throw error;
    }
  },
};