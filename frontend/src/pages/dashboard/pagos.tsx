import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PaymentConfirmation from '@/components/payments/PaymentConfirmation';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';
import PaymentReceipt from '@/components/payments/PaymentReceipt';
import PaymentSteps from '@/components/payments/PaymentSteps';

interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
  fecha_vencimiento: string;
}

export default function PagosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [comprobante, setComprobante] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'VECINO') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => { if (user) cargarFacturas(); }, [user]);

  const cargarFacturas = async () => {
    setCargando(true);
    try {
      const response = await api.get('/facturas/pendientes/');
      let data = response.data;
      if (data.results) data = data.results;
      setFacturas(data);
      if (data.length > 0) setFacturaSeleccionada(data[0]);
    } catch {
      setError('No se pudieron cargar las facturas');
    } finally {
      setCargando(false);
    }
  };

  const handleSelectFactura = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setCurrentStep(1);
  };

  const handleSelectMetodo = (metodo: string) => {
    setMetodoPago(metodo);
    setCurrentStep(2);
  };

  const handleConfirmarPago = async () => {
    if (!facturaSeleccionada || !metodoPago) return;
    setProcesando(true);
    try {
      const codigoOperacion = `${metodoPago}-${Date.now()}`;
      const response = await api.post('/pagos/', {
        factura: facturaSeleccionada.id,
        monto: facturaSeleccionada.monto_total,
        metodo_pago: metodoPago,
        codigo_operacion: codigoOperacion,
      });
      setComprobante(response.data);
      setPagoExitoso(true);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  const handleVolver = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.push('/dashboard');
  };

  const handleFinalizar = () => router.push('/dashboard');

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen surface-1 flex flex-col">
      <header className="bg-paper-base border-b border-paper-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={handleVolver} className="p-2 rounded-lg text-paper-500 hover:bg-paper-200 transition" aria-label="Volver">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-paper-900">Pagar servicio</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <PaymentSteps currentStep={currentStep} />

        {error && (
          <div className="badge-danger p-3 text-sm rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mt-8">
          {currentStep === 0 && (
            <PaymentMethodSelector
              facturas={facturas}
              facturaSeleccionada={facturaSeleccionada}
              onSelectFactura={handleSelectFactura}
              error={error}
            />
          )}
          {currentStep === 1 && facturaSeleccionada && (
            <PaymentConfirmation
              factura={facturaSeleccionada}
              onSelectMetodo={handleSelectMetodo}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && facturaSeleccionada && metodoPago && (
            <PaymentConfirmation
              factura={facturaSeleccionada}
              metodoSeleccionado={metodoPago}
              onConfirm={handleConfirmarPago}
              onBack={() => setCurrentStep(1)}
              procesando={procesando}
            />
          )}
          {currentStep === 3 && comprobante && (
            <PaymentReceipt
              comprobante={comprobante}
              factura={facturaSeleccionada!}
              onFinish={handleFinalizar}
            />
          )}
        </div>
      </div>
    </div>
  );
}