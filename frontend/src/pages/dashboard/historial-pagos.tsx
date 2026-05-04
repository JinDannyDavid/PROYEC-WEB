// frontend/src/pages/dashboard/historial-pagos.tsx
import PaymentHistoryCard from '@/components/payments/PaymentHistoryCard';
import PaymentHistoryFilters from '@/components/payments/PaymentHistoryFilters';
import PaymentReceiptModal from '@/components/payments/PaymentReceiptModal';
import PaymentSummary from '@/components/payments/PaymentSummary';
import { useAuth } from '@/contexts/AuthContext';
import { Pago, paymentService } from '@/services/paymentService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';


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
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'VECINO') {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      cargarPagos();
    }
  }, [user]);

  const cargarPagos = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await paymentService.getMisPagos();
      setPagos(data);
      setPagosFiltrados(data);
    } catch (err) {
      console.error('Error cargando pagos:', err);
      setError('No se pudieron cargar los pagos');
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...pagos];
    
    if (selectedMethod !== 'todos') {
      filtered = filtered.filter(p => p.metodo_pago === selectedMethod);
    }
    
    setPagosFiltrados(filtered);
  }, [selectedMethod, pagos]);

  const stats = {
    totalPagado: pagosFiltrados.reduce((sum, p) => sum + p.monto, 0),
    cantidadPagos: pagosFiltrados.length,
    ultimoPago: pagosFiltrados.length > 0 ? pagosFiltrados[0] : null,
  };

  const handleVerComprobante = (pago: Pago) => {
    setSelectedPayment(pago);
    setModalAbierto(true);
  };

  const handleDescargarComprobante = (pago: Pago) => {
    // TODO: Implementar descarga de PDF
    alert(`Descargando comprobante del pago ${pago.codigo_operacion}`);
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando historial...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-white hover:text-cyan-200 transition p-2 rounded-full hover:bg-white/10"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Historial de Pagos</h1>
              <p className="text-white/70 text-sm">Consulta todos tus pagos realizados</p>
            </div>
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
              onClick={cargarPagos}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaRedoAlt className="text-sm" /> Reintentar
            </button>
          </div>
        )}

        {/* Tarjetas de resumen */}
        <PaymentSummary
          totalPagado={stats.totalPagado}
          cantidadPagos={stats.cantidadPagos}
          ultimoPago={stats.ultimoPago}
        />

        {/* Filtros */}
        <PaymentHistoryFilters
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />

        {/* Lista de pagos */}
        {pagosFiltrados.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-white text-xl font-semibold mb-2">No hay pagos registrados</h3>
            <p className="text-white/60">
              {pagos.length === 0 
                ? 'Aún no has realizado ningún pago.'
                : 'No se encontraron pagos con el filtro seleccionado.'}
            </p>
            {selectedMethod !== 'todos' && (
              <button
                onClick={() => setSelectedMethod('todos')}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pagosFiltrados.map((pago) => (
              <PaymentHistoryCard
                key={pago.id}
                pago={pago}
                onVerComprobante={handleVerComprobante}
                onDescargar={handleDescargarComprobante}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de comprobante */}
      <PaymentReceiptModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        pago={selectedPayment}
      />
    </div>
  );
}