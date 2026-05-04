// frontend/src/pages/admin/reclamos.tsx
import Header from '@/components/admin/Header';
import ReclamoDeleteModal from '@/components/admin/ReclamoDeleteModal';
import ReclamoDetailModal from '@/components/admin/ReclamoDetailModal';
import ReclamoFilters from '@/components/admin/ReclamoFilters';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminReclamoService, Reclamo } from '@/services/adminReclamoService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaEye, FaHourglassHalf, FaTrash } from 'react-icons/fa';

export default function ReclamosPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [reclamosFiltrados, setReclamosFiltrados] = useState<Reclamo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  
  const [detailModalAbierto, setDetailModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null);

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
      cargarReclamos();
    }
  }, [user]);

  const cargarReclamos = async () => {
    setCargando(true);
    try {
      const data = await adminReclamoService.getReclamos();
      setReclamos(data);
      setReclamosFiltrados(data);
    } catch (error) {
      console.error('Error cargando reclamos:', error);
      toast.error('No se pudieron cargar los reclamos');
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reclamos];
    
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.usuario_dni?.includes(searchTerm) ||
        r.propiedad_direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(r => r.estado === selectedEstado);
    }
    
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(r => r.tipo === selectedTipo);
    }
    
    setReclamosFiltrados(filtered);
  }, [searchTerm, selectedEstado, selectedTipo, reclamos]);

  const handleVerDetalle = (reclamo: Reclamo) => {
    setReclamoSeleccionado(reclamo);
    setDetailModalAbierto(true);
  };

  const handleEliminarReclamo = (reclamo: Reclamo) => {
    setReclamoSeleccionado(reclamo);
    setDeleteModalAbierto(true);
  };

  const handleResponderReclamo = async (id: number, estado: string, respuesta: string) => {
    try {
      await adminReclamoService.updateReclamo(id, { estado, respuesta });
      toast.success('Reclamo actualizado correctamente');
      await cargarReclamos();
      setDetailModalAbierto(false);
    } catch (error) {
      toast.error('Error al actualizar reclamo');
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (reclamoSeleccionado) {
      try {
        await adminReclamoService.deleteReclamo(reclamoSeleccionado.id);
        toast.success('Reclamo eliminado correctamente');
        await cargarReclamos();
        setDeleteModalAbierto(false);
      } catch (error) {
        toast.error('Error al eliminar reclamo');
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const stats = {
    total: reclamos.length,
    pendientes: reclamos.filter(r => r.estado === 'PENDIENTE').length,
    enProceso: reclamos.filter(r => r.estado === 'EN_PROCESO').length,
    resueltos: reclamos.filter(r => r.estado === 'RESUELTO').length,
    rechazados: reclamos.filter(r => r.estado === 'RECHAZADO').length,
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando reclamos...</div>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Gestión de Reclamos</h1>
            <p className="text-gray-400 text-sm">Administra y responde los reclamos de los vecinos</p>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-orange-500/20 rounded-2xl p-4 text-center">
              <p className="text-orange-400 text-sm">Pendientes</p>
              <p className="text-orange-400 text-2xl font-bold">{stats.pendientes}</p>
              <FaHourglassHalf className="text-orange-400 mx-auto mt-1" />
            </div>
            <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
              <p className="text-blue-400 text-sm">En proceso</p>
              <p className="text-blue-400 text-2xl font-bold">{stats.enProceso}</p>
              <FaClock className="text-blue-400 mx-auto mt-1" />
            </div>
            <div className="bg-green-500/20 rounded-2xl p-4 text-center">
              <p className="text-green-400 text-sm">Resueltos</p>
              <p className="text-green-400 text-2xl font-bold">{stats.resueltos}</p>
              <FaCheckCircle className="text-green-400 mx-auto mt-1" />
            </div>
            <div className="bg-red-500/20 rounded-2xl p-4 text-center">
              <p className="text-red-400 text-sm">Rechazados</p>
              <p className="text-red-400 text-2xl font-bold">{stats.rechazados}</p>
            </div>
          </div>

          {/* Filtros */}
          <ReclamoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            selectedTipo={selectedTipo}
            onTipoChange={setSelectedTipo}
          />

          {/* Tabla de reclamos */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">ID</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Usuario</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Descripción</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Propiedad</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Fecha</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reclamosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No hay reclamos registrados
                      </td>
                    </tr>
                  ) : (
                    reclamosFiltrados.map((reclamo) => (
                      <tr key={reclamo.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4 text-white">#{reclamo.id}</td>
                        <td className="p-4 text-white">
                          {reclamo.usuario_nombre || `Usuario #${reclamo.usuario}`}<br />
                          <span className="text-gray-500 text-xs">{reclamo.usuario_dni}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reclamo.tipo === 'FUGA' ? 'bg-blue-500/20 text-blue-400' :
                            reclamo.tipo === 'CALIDAD_AGUA' ? 'bg-cyan-500/20 text-cyan-400' :
                            reclamo.tipo === 'MEDIDOR' ? 'bg-purple-500/20 text-purple-400' :
                            reclamo.tipo === 'FACTURACION' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {reclamo.tipo === 'FUGA' ? 'Fuga' :
                             reclamo.tipo === 'CALIDAD_AGUA' ? 'Calidad' :
                             reclamo.tipo === 'MEDIDOR' ? 'Medidor' :
                             reclamo.tipo === 'FACTURACION' ? 'Facturación' : 'Otro'}
                          </span>
                        </td>
                        <td className="p-4 text-white max-w-xs truncate">{reclamo.descripcion}</td>
                        <td className="p-4 text-white max-w-xs truncate">
                          {reclamo.propiedad_direccion || `Propiedad #${reclamo.propiedad}`}
                        </td>
                        <td className="p-4 text-white">
                          {new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reclamo.estado === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400' :
                            reclamo.estado === 'EN_PROCESO' ? 'bg-blue-500/20 text-blue-400' :
                            reclamo.estado === 'RESUELTO' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {reclamo.estado === 'PENDIENTE' ? 'Pendiente' :
                             reclamo.estado === 'EN_PROCESO' ? 'En proceso' :
                             reclamo.estado === 'RESUELTO' ? 'Resuelto' : 'Rechazado'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerDetalle(reclamo)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Ver detalle"
                            >
                              <FaEye className="text-cyan-400" />
                            </button>
                            <button
                              onClick={() => handleEliminarReclamo(reclamo)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Eliminar"
                            >
                              <FaTrash className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <ReclamoDetailModal
        isOpen={detailModalAbierto}
        onClose={() => setDetailModalAbierto(false)}
        reclamo={reclamoSeleccionado}
        onResponder={handleResponderReclamo}
      />

      <ReclamoDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={handleConfirmarEliminacion}
        reclamo={reclamoSeleccionado}
      />
    </div>
  );
}