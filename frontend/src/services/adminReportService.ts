// frontend/src/services/adminReportService.ts
import { api } from './api';

export interface DashboardStats {
  totalUsuarios: number;
  totalPropiedades: number;
  totalFacturasPendientes: number;
  totalPagosMes: number;
  totalReclamosPendientes: number;
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
  // Obtener estadísticas del dashboard
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
      };
    }
  },

  // Obtener ingresos mensuales
  getIngresosMensuales: async (anio: number): Promise<IngresoMensual[]> => {
    try {
      const response = await api.get(`/admin/ingresos-mensuales/?anio=${anio}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ingresos mensuales:', error);
      // Datos de ejemplo
      return [
        { mes: 'Ene', total: 1250 },
        { mes: 'Feb', total: 1320 },
        { mes: 'Mar', total: 1480 },
        { mes: 'Abr', total: 1560 },
        { mes: 'May', total: 1620 },
        { mes: 'Jun', total: 1710 },
      ];
    }
  },

  // Obtener reclamos por tipo
  getReclamosPorTipo: async (): Promise<ReclamoPorTipo[]> => {
    try {
      const response = await api.get('/reclamos/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reclamos por tipo:', error);
      return [
        { tipo: 'Fugas', cantidad: 12 },
        { tipo: 'Calidad', cantidad: 8 },
        { tipo: 'Medidor', cantidad: 5 },
        { tipo: 'Facturación', cantidad: 10 },
        { tipo: 'Otros', cantidad: 3 },
      ];
    }
  },

  // Obtener estadísticas de métodos de pago
  getMetodosPagoStats: async (): Promise<MetodoPagoStats[]> => {
    try {
      const response = await api.get('/admin/metodos-pago/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      return [
        { metodo: 'Yape', cantidad: 45, total: 3825 },
        { metodo: 'Plin', cantidad: 30, total: 2550 },
        { metodo: 'Transferencia', cantidad: 20, total: 1700 },
        { metodo: 'Efectivo', cantidad: 15, total: 1275 },
      ];
    }
  },

  // Obtener top usuarios por pagos
  //    getTopUsuarios: async (): Promise<UsuarioTop[]> => {
   //     try {
   //       const response = await api.get('/admin/top-usuarios/');
   //       return response.data;
   //     } catch (error) {
     //     console.error('Error obteniendo top usuarios:', error);
    //      return [
  //          { id: 1, nombre: 'Juan Pérez', pagos: 12, total: 1020 },
   //         { id: 2, nombre: 'María López', pagos: 10, total: 850 },
  //          { id: 3, nombre: 'Carlos Ramírez', pagos: 8, total: 680 },
  //          { id: 4, nombre: 'Ana Torres', pagos: 7, total: 595 },
   //         { id: 5, nombre: 'Luis García', pagos: 6, total: 510 },
  //        ];
  //      }
  //    },
};