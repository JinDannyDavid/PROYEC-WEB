// frontend/src/pages/dashboard/pagos.tsx
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

// Componentes de pasos
import PaymentConfirmation from '@/components/payments/PaymentConfirmation';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';
import PaymentReceipt from '@/components/payments/PaymentReceipt';
import PaymentSteps from '@/components/payments/PaymentSteps';

// Tipos
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
  
  // Estados
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  // Estado del pago
  const [currentStep, setCurrentStep] = useState(0);
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [comprobante, setComprobante] = useState<any>(null);

  // Cargar facturas pendientes
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
    try {
      const response = await api.get('/facturas/pendientes/');
      let data = response.data;
      if (data.results) data = data.results;
      setFacturas(data);
      if (data.length > 0) {
        setFacturaSeleccionada(data[0]);
      }
    } catch (err) {
      console.error('Error cargando facturas:', err);
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
      // Generar código de operación
      const codigoOperacion = `${metodoPago}-${Date.now()}`;
      
      const response = await api.post('/pagos/', {
        factura: facturaSeleccionada.id,
        monto: facturaSeleccionada.monto_total,
        metodo_pago: metodoPago,
        codigo_operacion: codigoOperacion
      });
      
      setComprobante(response.data);
      setPagoExitoso(true);
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Error procesando pago:', err);
      setError(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  const handleVolver = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleFinalizar = () => {
    router.push('/dashboard');
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'VECINO') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex items-center gap-4">
          <button 
            onClick={handleVolver}
            className="text-white hover:text-cyan-200 transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-white">Pagar Servicio</h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Indicador de pasos */}
        <PaymentSteps currentStep={currentStep} />

        {/* Contenido según el paso */}
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