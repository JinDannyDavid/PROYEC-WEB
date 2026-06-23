import AdminLayout from '@/components/admin/AdminLayout';
import ReportCharts from '@/components/admin/ReportCharts';
import ReportFilters from '@/components/admin/ReportFilters';
import ReportStats from '@/components/admin/ReportStats';
import ReportTables from '@/components/admin/ReportTables';
import { useAuth } from '@/contexts/AuthContext';
import { adminReportService, DashboardStats, IngresoMensual, MetodoPagoStats, ReclamoPorTipo, UsuarioTop } from '@/services/adminReportService';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa';

export default function ReportesPage() {
  const { user } = useAuth();
  
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
      setReclamosPorTipo(reclamosData);
      setMetodosPago(metodosData);
      // For now, set empty topUsuarios since the function is commented out
      setTopUsuarios([]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-paper-600">Cargando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-paper-900">Reportes y Estadisticas</h1>
          <p className="text-paper-600">Ver reportes y estadisticas del sistema</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-paper-600">Año:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-base text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => toast.success('Reporte descargado')}
            className="btn-primary flex items-center gap-2"
          >
            <FaDownload /> Descargar Reporte
          </button>
        </div>
      </div>

      <ReportStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportCharts
          ingresosMensuales={ingresosMensuales}
          reclamosPorTipo={reclamosPorTipo}
          metodosPago={metodosPago}
        />
        <ReportTables
          topUsuarios={topUsuarios}
        />
      </div>

      <ReportFilters
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
    </AdminLayout>
  );
}