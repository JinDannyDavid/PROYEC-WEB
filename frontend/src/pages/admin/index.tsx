import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, DashboardStats } from '@/services/adminService';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalPropiedades: 0,
    totalFacturasPendientes: 0,
    totalPagosMes: 0,
    totalReclamosPendientes: 0,
    ingresosMensuales: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user && user.tipo_usuario === 'ADMIN') {
      cargarEstadisticas();
    }
  }, [user]);

  const cargarEstadisticas = async () => {
    setCargando(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-paper-600 text-lg">Cargando panel...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-paper-900 mb-2">Dashboard</h1>
        <p className="text-paper-600">Bienvenido al panel de administración de JASS Palian</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card p-5 border-l-4 border-l-pvc-blue">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-paper-500 label">Usuarios</p>
              <p className="text-2xl font-bold text-paper-900 mt-1">{stats.totalUsuarios}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-canal-ok">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-paper-500 label">Propiedades</p>
              <p className="text-2xl font-bold text-paper-900 mt-1">{stats.totalPropiedades}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-canal-ok/10 text-canal-ok flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-alert">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-paper-500 label">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-paper-900 mt-1">{stats.totalFacturasPendientes}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-alert/10 text-alert flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-canal-ok">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-paper-500 label">Pagos (este mes)</p>
              <p className="text-2xl font-bold text-paper-900 mt-1">S/ {stats.totalPagosMes.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-canal-ok/10 text-canal-ok flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-stamp-red">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-paper-500 label">Reclamos Pendientes</p>
              <p className="text-2xl font-bold text-paper-900 mt-1">{stats.totalReclamosPendientes}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stamp-red/10 text-stamp-red flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-paper-900 mb-4">Modulos de Gestion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => window.location.href = '/admin/usuarios'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-pvc-blue/10 text-pvc-blue group-hover:bg-pvc-blue group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Gestion de Usuarios</h3>
            </div>
            <p className="text-sm text-paper-600">Crear, editar o eliminar usuarios del sistema</p>
          </div>

          <div
            onClick={() => window.location.href = '/admin/propiedades'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-canal-ok/10 text-canal-ok group-hover:bg-canal-ok group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Gestion de Propiedades</h3>
            </div>
            <p className="text-sm text-paper-600">Administrar propiedades y numeros de medidor</p>
          </div>

          <div
            onClick={() => window.location.href = '/admin/facturas'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-alert/10 text-alert group-hover:bg-alert group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Gestion de Facturas</h3>
            </div>
            <p className="text-sm text-paper-600">Crear y gestionar facturas de agua</p>
          </div>

          <div
            onClick={() => window.location.href = '/admin/pagos'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-canal-ok/10 text-canal-ok group-hover:bg-canal-ok group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Registrar Pagos</h3>
            </div>
            <p className="text-sm text-paper-600">Registrar pagos realizados por usuarios</p>
          </div>

          <div
            onClick={() => window.location.href = '/admin/reclamos'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-stamp-red/10 text-stamp-red group-hover:bg-stamp-red group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Gestion de Reclamos</h3>
            </div>
            <p className="text-sm text-paper-600">Atender y resolver reclamos de usuarios</p>
          </div>

          <div
            onClick={() => window.location.href = '/admin/reportes'}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl bg-pvc-blue/10 text-pvc-blue group-hover:bg-pvc-blue group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-paper-900">Reportes y Estadisticas</h3>
            </div>
            <p className="text-sm text-paper-600">Ver reportes y estadisticas del sistema</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}