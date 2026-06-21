import ReceiptCard from '@/components/receipts/ReceiptCard';
import ReceiptDetailModal from '@/components/receipts/ReceiptDetailModal';
import ReceiptFilters from '@/components/receipts/ReceiptFilters';
import ReceiptSummary from '@/components/receipts/ReceiptSummary';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'VECINO') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => { if (user) cargarFacturas(); }, [user]);

  const cargarFacturas = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await api.get('/facturas/');
      const data: FacturaData[] = response.data.results || response.data;
      setFacturas(data);
      setFacturasFiltradas(data);
      const years = [...new Set(data.map((f) => f.periodo.split('/')[1]))];
      setAvailableYears(years.sort().reverse());
    } catch {
      setError('No se pudieron cargar las facturas. Verifica tu conexion.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...facturas];
    if (selectedYear !== 'todos') filtered = filtered.filter((f) => f.periodo.includes(selectedYear));
    if (selectedStatus !== 'todos') filtered = filtered.filter((f) => f.estado === selectedStatus);
    setFacturasFiltradas(filtered);
  }, [selectedYear, selectedStatus, facturas]);

  const totalPendiente = facturasFiltradas.filter((f) => f.estado === 'PENDIENTE').reduce((s, f) => s + f.monto_total, 0);
  const totalPagado = facturasFiltradas.filter((f) => f.estado === 'PAGADA').reduce((s, f) => s + f.monto_total, 0);
  const totalVencido = facturasFiltradas.filter((f) => f.estado === 'VENCIDA').reduce((s, f) => s + f.monto_total, 0);

  const handleVerDetalle = (factura: FacturaData) => { setSelectedFactura(factura); setModalAbierto(true); };
  const handlePagar = (factura: FacturaData) => router.push(`/dashboard/pagos?factura=${factura.id}`);

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando recibos...</div>
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
              <h1 className="text-xl font-bold text-paper-900">Mis recibos</h1>
              <p className="text-paper-500 text-sm">Historial de facturas de agua</p>
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
            <button onClick={cargarFacturas} className="btn-outline text-sm px-4 py-2">
              Reintentar
            </button>
          </div>
        )}

        <ReceiptSummary totalPendiente={totalPendiente} totalPagado={totalPagado} totalVencido={totalVencido} cantidadFacturas={facturasFiltradas.length} />
        <ReceiptFilters availableYears={availableYears} selectedYear={selectedYear} onYearChange={setSelectedYear} selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

        {facturasFiltradas.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay facturas</h3>
            <p className="text-paper-500">
              {facturas.length === 0 ? 'Aun no tienes facturas registradas.' : 'No se encontraron facturas con los filtros seleccionados.'}
            </p>
            {(selectedYear !== 'todos' || selectedStatus !== 'todos') && (
              <button onClick={() => { setSelectedYear('todos'); setSelectedStatus('todos'); }} className="btn-primary mt-4 text-sm">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facturasFiltradas.map((factura) => (
              <ReceiptCard key={factura.id} factura={factura} onVerDetalle={handleVerDetalle} onPagar={handlePagar} />
            ))}
          </div>
        )}
      </div>

      <ReceiptDetailModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} factura={selectedFactura} onPagar={handlePagar} />
    </div>
  );
}