import ComplaintCard from '@/components/complaints/ComplaintCard';
import ComplaintDetailModal from '@/components/complaints/ComplaintDetailModal';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import ComplaintFormModal from '@/components/complaints/ComplaintFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'VECINO') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => { if (user) cargarReclamos(); }, [user]);

  const cargarReclamos = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await api.get('/mis-reclamos/');
      const data = response.data.results || response.data;
      setReclamos(data);
      setReclamosFiltrados(data);
    } catch {
      setError('No se pudieron cargar los reclamos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...reclamos];
    if (selectedStatus !== 'todos') filtered = filtered.filter((r) => r.estado === selectedStatus);
    setReclamosFiltrados(filtered);
  }, [selectedStatus, reclamos]);

  const stats = {
    total: reclamos.length,
    pendientes: reclamos.filter((r) => r.estado === 'PENDIENTE').length,
    enProceso: reclamos.filter((r) => r.estado === 'EN_PROCESO').length,
    resueltos: reclamos.filter((r) => r.estado === 'RESUELTO').length,
  };

  const handleVerDetalle = (reclamo: Reclamo) => { setSelectedReclamo(reclamo); setModalDetalleAbierto(true); };
  const handleReclamoCreado = () => { cargarReclamos(); setModalFormAbierto(false); };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando reclamos...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen surface-1 flex flex-col">
      <header className="bg-paper-base border-b border-paper-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg text-paper-500 hover:bg-paper-200 transition" aria-label="Volver">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-paper-900">Mis reclamos</h1>
                <p className="text-paper-500 text-sm">Reporta y da seguimiento a tus reclamos</p>
              </div>
            </div>
            <button onClick={() => setModalFormAbierto(true)} className="btn-primary text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo reclamo
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {error && (
          <div className="badge-danger p-6 mb-8 text-center text-sm rounded-lg">
            <svg className="w-6 h-6 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="mb-3">{error}</p>
            <button onClick={cargarReclamos} className="btn-outline text-sm px-4 py-2">
              Reintentar
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-xs text-paper-500 label">Total</p>
            <p className="text-2xl font-bold text-paper-900">{stats.total}</p>
          </div>
          <div className="card p-4 text-center border-l-4 border-l-alert">
            <p className="text-xs text-paper-500 label">Pendientes</p>
            <p className="text-2xl font-bold text-alert">{stats.pendientes}</p>
          </div>
          <div className="card p-4 text-center border-l-4 border-l-pvc-blue">
            <p className="text-xs text-paper-500 label">En proceso</p>
            <p className="text-2xl font-bold text-pvc-blue">{stats.enProceso}</p>
          </div>
          <div className="card p-4 text-center border-l-4 border-l-canal-ok">
            <p className="text-xs text-paper-500 label">Resueltos</p>
            <p className="text-2xl font-bold text-canal-ok">{stats.resueltos}</p>
          </div>
        </div>

        <ComplaintFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

        {reclamosFiltrados.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-paper-900 mb-2">
              {reclamos.length === 0 ? 'No hay reclamos' : 'No se encontraron reclamos'}
            </h3>
            <p className="text-paper-500">
              {reclamos.length === 0 ? 'Aun no has realizado ningun reclamo.' : 'No se encontraron reclamos con el filtro seleccionado.'}
            </p>
            {selectedStatus !== 'todos' && (
              <button onClick={() => setSelectedStatus('todos')} className="btn-primary mt-4 text-sm">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {reclamosFiltrados.map((reclamo) => (
              <ComplaintCard key={reclamo.id} reclamo={reclamo} onVerDetalle={handleVerDetalle} />
            ))}
          </div>
        )}
      </div>

      <ComplaintFormModal isOpen={modalFormAbierto} onClose={() => setModalFormAbierto(false)} onSuccess={handleReclamoCreado} />
      <ComplaintDetailModal isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} reclamo={selectedReclamo} />
    </div>
  );
}