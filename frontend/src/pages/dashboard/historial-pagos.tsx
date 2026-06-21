import PaymentHistoryCard from '@/components/payments/PaymentHistoryCard';
import PaymentHistoryFilters from '@/components/payments/PaymentHistoryFilters';
import PaymentReceiptModal from '@/components/payments/PaymentReceiptModal';
import PaymentSummary from '@/components/payments/PaymentSummary';
import { useAuth } from '@/contexts/AuthContext';
import { Pago, paymentService } from '@/services/paymentService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HistorialPagosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [pagosFiltrados, setPagosFiltrados] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('todos');
  const [selectedPayment, setSelectedPayment] = useState<Pago | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'VECINO') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => { if (user) cargarPagos(); }, [user]);

  const cargarPagos = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await paymentService.getMisPagos();
      setPagos(data);
      setPagosFiltrados(data);
    } catch {
      setError('No se pudieron cargar los pagos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...pagos];
    if (selectedMethod !== 'todos') filtered = filtered.filter((p) => p.metodo_pago === selectedMethod);
    setPagosFiltrados(filtered);
  }, [selectedMethod, pagos]);

  const stats = {
    totalPagado: pagosFiltrados.reduce((sum, p) => sum + p.monto, 0),
    cantidadPagos: pagosFiltrados.length,
    ultimoPago: pagosFiltrados.length > 0 ? pagosFiltrados[0] : null,
  };

  const handleVerComprobante = (pago: Pago) => { setSelectedPayment(pago); setModalAbierto(true); };
  const handleDescargarComprobante = () => alert('Descargando comprobante...');

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando historial...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen surface-1 flex flex-col">
      <header className="bg-paper-base border-b border-paper-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg text-paper-500 hover:bg-paper-200 transition" aria-label="Volver">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-paper-900">Historial de pagos</h1>
              <p className="text-paper-500 text-sm">Consulta todos tus pagos realizados</p>
            </div>
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
            <button onClick={cargarPagos} className="btn-outline text-sm px-4 py-2">
              Reintentar
            </button>
          </div>
        )}

        <PaymentSummary totalPagado={stats.totalPagado} cantidadPagos={stats.cantidadPagos} ultimoPago={stats.ultimoPago} />
        <PaymentHistoryFilters selectedMethod={selectedMethod} onMethodChange={setSelectedMethod} />

        {pagosFiltrados.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-paper-900 mb-2">
              {pagos.length === 0 ? 'No hay pagos registrados' : 'No se encontraron pagos'}
            </h3>
            <p className="text-paper-500">
              {pagos.length === 0 ? 'Aun no has realizado ningun pago.' : 'No se encontraron pagos con el filtro seleccionado.'}
            </p>
            {selectedMethod !== 'todos' && (
              <button onClick={() => setSelectedMethod('todos')} className="btn-primary mt-4 text-sm">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {pagosFiltrados.map((pago) => (
              <PaymentHistoryCard key={pago.id} pago={pago} onVerComprobante={handleVerComprobante} onDescargar={handleDescargarComprobante} />
            ))}
          </div>
        )}
      </div>

      <PaymentReceiptModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} pago={selectedPayment} />
    </div>
  );
}