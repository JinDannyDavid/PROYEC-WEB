// frontend/src/pages/dashboard/notificaciones.tsx
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationEmptyState from '@/components/notifications/NotificationEmptyState';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import { useAuth } from '@/contexts/AuthContext';
import { Notificacion, notificationService } from '@/services/notificationService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCheckDouble, FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';

export default function NotificacionesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todas');

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
      cargarNotificaciones();
    }
  }, [user]);

  const cargarNotificaciones = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await notificationService.getMisNotificaciones();
      setNotificaciones(data);
      setNotificacionesFiltradas(data);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...notificaciones];
    
    if (selectedFilter === 'no-leidas') {
      filtered = filtered.filter(n => !n.leida);
    }
    
    setNotificacionesFiltradas(filtered);
  }, [selectedFilter, notificaciones]);

  const handleMarcarComoLeida = async (id: number) => {
    try {
      await notificationService.marcarComoLeida(id);
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
      toast.success('Notificación marcada como leída');
    } catch (err) {
      toast.error('Error al marcar notificación');
    }
  };

  const handleMarcarTodasComoLeidas = async () => {
    const noLeidas = notificaciones.filter(n => !n.leida);
    if (noLeidas.length === 0) {
      toast('No hay notificaciones no leídas');
      return;
    }
    
    try {
      await notificationService.marcarTodasComoLeidas();
      setNotificaciones(prev =>
        prev.map(n => ({ ...n, leida: true }))
      );
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (err) {
      toast.error('Error al marcar notificaciones');
    }
  };

  const stats = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter(n => !n.leida).length,
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando notificaciones...</div>
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
                <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
                <p className="text-white/70 text-sm">Mantente informado sobre tu servicio de agua</p>
              </div>
            </div>
            <button
              onClick={handleMarcarTodasComoLeidas}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              <FaCheckDouble /> Marcar todas como leídas
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 text-center mb-8 backdrop-blur-sm">
            <FaExclamationTriangle className="text-red-300 text-3xl mx-auto mb-3" />
            <p className="text-red-200 text-sm mb-3">{error}</p>
            <button
              onClick={cargarNotificaciones}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaRedoAlt className="text-sm" /> Reintentar
            </button>
          </div>
        )}

        {/* Filtros */}
        <NotificationFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          totalCount={stats.total}
          unreadCount={stats.noLeidas}
        />

        {/* Lista de notificaciones */}
        {notificacionesFiltradas.length === 0 ? (
          <NotificationEmptyState
            hasFilters={selectedFilter !== 'todas'}
            onClearFilters={() => setSelectedFilter('todas')}
          />
        ) : (
          <div className="space-y-3">
            {notificacionesFiltradas.map((notificacion) => (
              <NotificationCard
                key={notificacion.id}
                notificacion={notificacion}
                onMarcarLeida={handleMarcarComoLeida}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}