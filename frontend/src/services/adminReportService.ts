// frontend/src/services/adminReportService.ts
import { api } from './api';

export interface DashboardStats {
  totalUsuarios: number;
  totalPropiedades: number;
  totalFacturasPendientes: number;
  totalPagosMes: number;
  totalReclamosPendientes: number;
  ingresosMensuales: IngresoMensual[];
}

export interface IngresoMensual {
  mes: string;
  total: number;
}

export interface ReclamoPorTipo {
  tipo: string;
  cantidad: number;
}

export interface MetodoPagoStats {
  metodo: string;
  cantidad: number;
  total: number;
}

export interface UsuarioTop {
  id: number;
  nombre: string;
  pagos: number;
  total: number;
}

export const adminReportService = {
  // Obtener estadísticas del dashboard (incluye ingresosMensuales)
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/admin/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalUsuarios: 0,
        totalPropiedades: 0,
        totalFacturasPendientes: 0,
        totalPagosMes: 0,
        totalReclamosPendientes: 0,
        ingresosMensuales: [],
      };
    }
  },

  // Obtener ingresos mensuales (12 meses del año)
  getIngresosMensuales: async (anio: number): Promise<IngresoMensual[]> => {
    try {
      const response = await api.get(`/admin/ingresos-mensuales/?anio=${anio}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ingresos mensuales:', error);
      return [];
    }
  },

  // Obtener reclamos por tipo
  getReclamosPorTipo: async (): Promise<ReclamoPorTipo[]> => {
    try {
      const response = await api.get('/admin/reclamos-por-tipo/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reclamos por tipo:', error);
      return [];
    }
  },

  // Obtener estadísticas de métodos de pago
  getMetodosPagoStats: async (): Promise<MetodoPagoStats[]> => {
    try {
      const response = await api.get('/admin/metodos-pago/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      return [];
    }
  },

  // Obtener top usuarios por pagos
  getTopUsuarios: async (): Promise<UsuarioTop[]> => {
    try {
      const response = await api.get('/admin/top-usuarios/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo top usuarios:', error);
      return [];
    }
  },
};