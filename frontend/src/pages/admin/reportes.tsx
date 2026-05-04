// frontend/src/pages/admin/reportes.tsx
import Header from '@/components/admin/Header';
import ReportCharts from '@/components/admin/ReportCharts';
import ReportFilters from '@/components/admin/ReportFilters';
import ReportStats from '@/components/admin/ReportStats';
import ReportTables from '@/components/admin/ReportTables';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminReportService, DashboardStats, IngresoMensual, MetodoPagoStats, ReclamoPorTipo, UsuarioTop } from '@/services/adminReportService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaDownload, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';

export default function ReportesPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalPropiedades: 0,
    totalFacturasPendientes: 0,
    totalPagosMes: 0,
    totalReclamosPendientes: 0,
  });
  const [ingresosMensuales, setIngresosMensuales] = useState<IngresoMensual[]>([]);
  const [reclamosPorTipo, setReclamosPorTipo] = useState<ReclamoPorTipo[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoStats[]>([]);
  const [topUsuarios, setTopUsuarios] = useState<UsuarioTop[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user && user.tipo_usuario === 'ADMIN') {
      cargarDatos();
    }
  }, [user, selectedYear]);

   const cargarDatos = async () => {
     setCargando(true);
     try {
       const [statsData, ingresosData, reclamosData, metodosData] = await Promise.all([
         adminReportService.getDashboardStats(),
         adminReportService.getIngresosMensuales(selectedYear),
         adminReportService.getReclamosPorTipo(),
         adminReportService.getMetodosPagoStats(),
       ]);
       setStats(statsData);
       setIngresosMensuales(ingresosData);
       setReclamosPorTipo(Array.isArray(reclamosData) ? reclamosData : []);
       setMetodosPago(metodosData);
     } catch (error) {
       console.error('Error cargando datos:', error);
       toast.error('No se pudieron cargar los reportes');
     } finally {
       setCargando(false);
     }
   };

  const handleExportarReporte = () => {
    // TODO: Implementar exportación a PDF/Excel
    toast.success('Funcionalidad en desarrollo');
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando reportes...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="ml-72">
        <Header userName={user.nombres} />

        <main className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Reportes y Estadísticas</h1>
              <p className="text-gray-400 text-sm">Visualiza datos clave del sistema</p>
            </div>
            <button
              onClick={handleExportarReporte}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <FaDownload /> Exportar Reporte
            </button>
          </div>

          {/* Tarjetas de estadísticas */}
          <ReportStats stats={stats} />

          {/* Filtros */}
          <ReportFilters
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />

          {/* Gráficos */}
          <ReportCharts
            ingresosMensuales={ingresosMensuales}
            reclamosPorTipo={reclamosPorTipo}
            metodosPago={metodosPago}
          />

          {/* Tablas de datos */}
          <ReportTables topUsuarios={topUsuarios} />

          {/* Resumen adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-cyan-400" /> Resumen Financiero
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total pagado (este mes)</span>
                  <span className="text-white font-bold">S/ {stats.totalPagosMes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Facturas pendientes</span>
                  <span className="text-white font-bold">{stats.totalFacturasPendientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor pendiente estimado</span>
                  <span className="text-white font-bold">S/ {(stats.totalFacturasPendientes * 85).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-cyan-400" /> Resumen de Reclamos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total reclamos</span>
                   <span className="text-white font-bold">{reclamosPorTipo.reduce((sum, r) => sum + r.cantidad, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pendientes</span>
                  <span className="text-white font-bold">{stats.totalReclamosPendientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tasa de resolución</span>
                  <span className="text-white font-bold">
                     {reclamosPorTipo.reduce((sum, r) => sum + r.cantidad, 0) > 0
                       ? `${Math.round(((reclamosPorTipo.reduce((sum, r) => sum + r.cantidad, 0) - stats.totalReclamosPendientes) / reclamosPorTipo.reduce((sum, r) => sum + r.cantidad, 0)) * 100)}%`
                       : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}