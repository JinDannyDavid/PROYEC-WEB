// frontend/src/services/adminService.ts
import { api } from './api';

export interface DashboardStats {
  totalUsuarios: number;
  totalPropiedades: number;
  totalFacturasPendientes: number;
  totalPagosMes: number;
  totalReclamosPendientes: number;
  ingresosMensuales: { mes: string; total: number }[];
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/admin/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Datos de ejemplo mientras no hay endpoint
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
};