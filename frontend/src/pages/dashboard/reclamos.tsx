// frontend/src/pages/dashboard/reclamos.tsx
import ComplaintCard from '@/components/complaints/ComplaintCard';
import ComplaintDetailModal from '@/components/complaints/ComplaintDetailModal';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import ComplaintFormModal from '@/components/complaints/ComplaintFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaPlus, FaRedoAlt } from 'react-icons/fa';

interface Reclamo {
  id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  respuesta?: string;
  foto_url?: string;
  propiedad_nombre?: string;
}

export default function ReclamosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [reclamosFiltrados, setReclamosFiltrados] = useState<Reclamo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'VECINO') {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      cargarReclamos();
    }
  }, [user]);

  const cargarReclamos = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await api.get('/mis-reclamos/');
      let data = response.data.results ? response.data.results : response.data;
      setReclamos(data);
      setReclamosFiltrados(data);
    } catch (err) {
      console.error('Error cargando reclamos:', err);
      setError('No se pudieron cargar los reclamos');
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reclamos];
    
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(r => r.estado === selectedStatus);
    }
    
    setReclamosFiltrados(filtered);
  }, [selectedStatus, reclamos]);

  const stats = {
    total: reclamos.length,
    pendientes: reclamos.filter(r => r.estado === 'PENDIENTE').length,
    enProceso: reclamos.filter(r => r.estado === 'EN_PROCESO').length,
    resueltos: reclamos.filter(r => r.estado === 'RESUELTO').length,
  };

  const handleVerDetalle = (reclamo: Reclamo) => {
    setSelectedReclamo(reclamo);
    setModalDetalleAbierto(true);
  };

  const handleReclamoCreado = () => {
    cargarReclamos();
    setModalFormAbierto(false);
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando reclamos...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-white hover:text-cyan-200 transition p-2 rounded-full hover:bg-white/10"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Mis Reclamos</h1>
                <p className="text-white/70 text-sm">Reporta y da seguimiento a tus reclamos</p>
              </div>
            </div>
            <button
              onClick={() => setModalFormAbierto(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition shadow-lg"
            >
              <FaPlus /> Nuevo Reclamo
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 text-center mb-8 backdrop-blur-sm">
            <FaExclamationTriangle className="text-red-300 text-3xl mx-auto mb-3" />
            <p className="text-red-200 text-sm mb-3">{error}</p>
            <button
              onClick={cargarReclamos}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaRedoAlt className="text-sm" /> Reintentar
            </button>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center">
            <p className="text-white/70 text-sm">Total</p>
            <p className="text-white text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-lg rounded-2xl p-4 text-center">
            <p className="text-orange-200/80 text-sm">Pendientes</p>
            <p className="text-orange-200 text-2xl font-bold">{stats.pendientes}</p>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 text-center">
            <p className="text-blue-200/80 text-sm">En proceso</p>
            <p className="text-blue-200 text-2xl font-bold">{stats.enProceso}</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 text-center">
            <p className="text-green-200/80 text-sm">Resueltos</p>
            <p className="text-green-200 text-2xl font-bold">{stats.resueltos}</p>
          </div>
        </div>

        {/* Filtros */}
        <ComplaintFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Lista de reclamos */}
        {reclamosFiltrados.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-white text-xl font-semibold mb-2">No hay reclamos</h3>
            <p className="text-white/60">
              {reclamos.length === 0 
                ? 'Aún no has realizado ningún reclamo.'
                : 'No se encontraron reclamos con el filtro seleccionado.'}
            </p>
            {selectedStatus !== 'todos' && (
              <button
                onClick={() => setSelectedStatus('todos')}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reclamosFiltrados.map((reclamo) => (
              <ComplaintCard
                key={reclamo.id}
                reclamo={reclamo}
                onVerDetalle={handleVerDetalle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de nuevo reclamo */}
      <ComplaintFormModal
        isOpen={modalFormAbierto}
        onClose={() => setModalFormAbierto(false)}
        onSuccess={handleReclamoCreado}
      />

      {/* Modal de detalle */}
      <ComplaintDetailModal
        isOpen={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        reclamo={selectedReclamo}
      />
    </div>
  );
}