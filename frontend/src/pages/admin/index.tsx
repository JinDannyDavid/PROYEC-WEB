// frontend/src/pages/admin/index.tsx
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, DashboardStats } from '@/services/adminService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FaChartLine,
  FaExclamationTriangle,
  FaFileInvoice,
  FaHome,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
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
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

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

  const handleLogout = () => {
    logout();
  };

  if (loading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando panel...</div>
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
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:bg-gray-750 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuarios</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.totalUsuarios}</p>
                </div>
                <FaUsers className="text-blue-500 text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:bg-gray-750 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Propiedades</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.totalPropiedades}</p>
                </div>
                <FaHome className="text-green-500 text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:bg-gray-750 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Facturas Pendientes</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.totalFacturasPendientes}</p>
                </div>
                <FaFileInvoice className="text-yellow-500 text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:bg-gray-750 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pagos (este mes)</p>
                  <p className="text-white text-2xl font-bold mt-1">S/ {stats.totalPagosMes.toFixed(2)}</p>
                </div>
                <FaMoneyBillWave className="text-green-500 text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:bg-gray-750 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reclamos Pendientes</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.totalReclamosPendientes}</p>
                </div>
                <FaExclamationTriangle className="text-red-500 text-3xl opacity-50" />
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <h2 className="text-xl font-bold text-white mb-4">Módulos de Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => router.push('/admin/usuarios')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition">
                  <FaUsers className="text-blue-400 text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg">Gestionar Usuarios</h3>
              </div>
              <p className="text-gray-400 text-sm">Crear, editar o eliminar usuarios del sistema</p>
            </div>

            <div 
              onClick={() => router.push('/admin/propiedades')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition">
                  <FaHome className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg">Gestionar Propiedades</h3>
              </div>
              <p className="text-gray-400 text-sm">Administrar propiedades y números de medidor</p>
            </div>

            <div 
              onClick={() => router.push('/admin/facturas')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition">
                  <FaFileInvoice className="text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg">Gestionar Facturas</h3>
              </div>
              <p className="text-gray-400 text-sm">Crear y gestionar facturas de agua</p>
            </div>

            <div 
              onClick={() => router.push('/admin/pagos')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition">
                  <FaMoneyBillWave className="text-green-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg">Registrar Pagos</h3>
              <p className="text-gray-400 text-sm">Registrar pagos realizados por usuarios</p>
            </div>

            <div 
              onClick={() => router.push('/admin/reclamos')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg">Gestionar Reclamos</h3>
              <p className="text-gray-400 text-sm">Atender y resolver reclamos de usuarios</p>
            </div>

            <div 
              onClick={() => router.push('/admin/reportes')}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition">
                  <FaChartLine className="text-purple-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg">Reportes y Estadísticas</h3>
              <p className="text-gray-400 text-sm">Ver reportes y estadísticas del sistema</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}