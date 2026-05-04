// frontend/src/pages/dashboard/recibos.tsx
import ReceiptCard from '@/components/receipts/ReceiptCard';
import ReceiptDetailModal from '@/components/receipts/ReceiptDetailModal';
import ReceiptFilters from '@/components/receipts/ReceiptFilters';
import ReceiptSummary from '@/components/receipts/ReceiptSummary';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';

interface FacturaData {
  id: number;
  numero_factura: string;
  periodo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  lectura_anterior: number;
  lectura_actual: number;
  consumo_m3: number;
  cargo_fijo: number;
  cargo_consumo: number;
  cargo_alcantarillado: number;
  monto_total: number;
  estado: string;
}

export default function RecibosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [facturas, setFacturas] = useState<FacturaData[]>([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState<FacturaData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedFactura, setSelectedFactura] = useState<FacturaData | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

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
      cargarFacturas();
    }
  }, [user]);

  const cargarFacturas = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await api.get('/facturas/');
      let data: FacturaData[] = response.data.results ? response.data.results : response.data;
      setFacturas(data);
      setFacturasFiltradas(data);
      
      // Extraer años únicos
      const years = [...new Set(data.map((f: FacturaData) => f.periodo.split('/')[1]))];
      setAvailableYears(years.sort().reverse());
    } catch (err) {
      console.error('Error cargando facturas:', err);
      setError('No se pudieron cargar las facturas. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // ✅ CORREGIDO: Eliminado el useEffect que reseteba filtros automáticamente

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...facturas];
    
    if (selectedYear !== 'todos') {
      filtered = filtered.filter(f => f.periodo.includes(selectedYear));
    }
    
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(f => f.estado === selectedStatus);
    }
    
    setFacturasFiltradas(filtered);
  }, [selectedYear, selectedStatus, facturas]);

  const totalPendiente = facturasFiltradas
    .filter(f => f.estado === 'PENDIENTE')
    .reduce((sum, f) => sum + f.monto_total, 0);
    
  const totalPagado = facturasFiltradas
    .filter(f => f.estado === 'PAGADA')
    .reduce((sum, f) => sum + f.monto_total, 0);
    
  const totalVencido = facturasFiltradas
    .filter(f => f.estado === 'VENCIDA')
    .reduce((sum, f) => sum + f.monto_total, 0);

  const handleVerDetalle = (factura: FacturaData) => {
    setSelectedFactura(factura);
    setModalAbierto(true);
  };

  const handlePagar = (factura: FacturaData) => {
    router.push(`/dashboard/pagos?factura=${factura.id}`);
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando recibos...</div>
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
              aria-label="Volver al dashboard"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Mis Recibos</h1>
              <p className="text-white/70 text-sm">Historial de facturas de agua</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de error mejorado */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 text-center mb-8 backdrop-blur-sm">
            <FaExclamationTriangle className="text-red-300 text-3xl mx-auto mb-3" />
            <p className="text-red-200 text-sm mb-3">{error}</p>
            <button
              onClick={cargarFacturas}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaRedoAlt className="text-sm" /> Reintentar
            </button>
          </div>
        )}

        {/* Tarjetas de resumen */}
        <ReceiptSummary
          totalPendiente={totalPendiente}
          totalPagado={totalPagado}
          totalVencido={totalVencido}
          cantidadFacturas={facturasFiltradas.length}
        />

        {/* Filtros */}
        <ReceiptFilters
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Lista de facturas */}
        {facturasFiltradas.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-white text-xl font-semibold mb-2">No hay facturas</h3>
            <p className="text-white/60">
              {facturas.length === 0 
                ? 'Aún no tienes facturas registradas.'
                : 'No se encontraron facturas con los filtros seleccionados.'}
            </p>
            {(selectedYear !== 'todos' || selectedStatus !== 'todos') && (
              <button
                onClick={() => {
                  setSelectedYear('todos');
                  setSelectedStatus('todos');
                }}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facturasFiltradas.map((factura) => (
              <ReceiptCard
                key={factura.id}
                factura={factura}
                onVerDetalle={handleVerDetalle}
                onPagar={handlePagar}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <ReceiptDetailModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        factura={selectedFactura}
        onPagar={handlePagar}
      />
    </div>
  );
}