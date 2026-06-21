import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationEmptyState from '@/components/notifications/NotificationEmptyState';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import { useAuth } from '@/contexts/AuthContext';
import { Notificacion, notificationService } from '@/services/notificationService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NotificacionesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todas');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'VECINO') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => { if (user) cargarNotificaciones(); }, [user]);

  const cargarNotificaciones = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await notificationService.getMisNotificaciones();
      setNotificaciones(data);
      setNotificacionesFiltradas(data);
    } catch {
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...notificaciones];
    if (selectedFilter === 'no-leidas') filtered = filtered.filter((n) => !n.leida);
    setNotificacionesFiltradas(filtered);
  }, [selectedFilter, notificaciones]);

  const handleMarcarComoLeida = async (id: number) => {
    try {
      await notificationService.marcarComoLeida(id);
      setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      toast.success('Notificacion marcada como leida');
    } catch {
      toast.error('Error al marcar notificacion');
    }
  };

  const handleMarcarTodasComoLeidas = async () => {
    const noLeidas = notificaciones.filter((n) => !n.leida);
    if (noLeidas.length === 0) { toast('No hay notificaciones no leidas'); return; }
    try {
      await notificationService.marcarTodasComoLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      toast.success('Todas las notificaciones marcadas como leidas');
    } catch {
      toast.error('Error al marcar notificaciones');
    }
  };

  const stats = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter((n) => !n.leida).length,
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando notificaciones...</div>
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
                <h1 className="text-xl font-bold text-paper-900">Notificaciones</h1>
                <p className="text-paper-500 text-sm">Mantente informado sobre tu servicio de agua</p>
              </div>
            </div>
            <button onClick={handleMarcarTodasComoLeidas} className="btn-outline text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Marcar todas como leidas
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
            <button onClick={cargarNotificaciones} className="btn-outline text-sm px-4 py-2">
              Reintentar
            </button>
          </div>
        )}

        <NotificationFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} totalCount={stats.total} unreadCount={stats.noLeidas} />

        {notificacionesFiltradas.length === 0 ? (
          <NotificationEmptyState hasFilters={selectedFilter !== 'todas'} onClearFilters={() => setSelectedFilter('todas')} />
        ) : (
          <div className="space-y-3">
            {notificacionesFiltradas.map((notificacion) => (
              <NotificationCard key={notificacion.id} notificacion={notificacion} onMarcarLeida={handleMarcarComoLeida} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}