// frontend/src/components/payments/PaymentReceiptModal.tsx
import { FaCheckCircle, FaDownload, FaPrint, FaTimes } from 'react-icons/fa';

interface Pago {
  id: number;
  factura: number;
  factura_numero?: string;
  monto: number;
  metodo_pago: string;
  codigo_operacion: string;
  fecha_pago: string;
  estado_comprobante: string;
}

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pago: Pago | null;
}

const getMethodLabel = (metodo: string) => {
  switch (metodo) {
    case 'YAPE': return 'Yape';
    case 'PLIN': return 'Plin';
    case 'TRANSFERENCIA': return 'Transferencia bancaria';
    default: return 'Efectivo';
  }
};

export default function PaymentReceiptModal({ isOpen, onClose, pago }: PaymentReceiptModalProps) {
  if (!isOpen || !pago) return null;

  const fechaFormateada = new Date(pago.fecha_pago).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implementar descarga de PDF
    alert('Funcionalidad en desarrollo');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Comprobante de Pago</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Contenido del comprobante */}
        <div className="p-5 space-y-5" id="receipt-content">
          {/* Header con logo */}
          <div className="text-center border-b border-gray-100 pb-4">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">JASS Palian</h3>
            <p className="text-gray-500 text-xs">Comprobante de pago electrónico</p>
          </div>

          {/* Detalles */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Código de operación</span>
              <span className="text-gray-800 font-mono text-sm font-medium">{pago.codigo_operacion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Fecha y hora</span>
              <span className="text-gray-800 text-sm">{fechaFormateada}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Método de pago</span>
              <span className="text-gray-800 text-sm font-medium">{getMethodLabel(pago.metodo_pago)}</span>
            </div>
            {pago.factura_numero && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Factura</span>
                <span className="text-gray-800 text-sm">{pago.factura_numero}</span>
              </div>
            )}
          </div>

          {/* Monto */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total pagado</span>
              <span className="text-2xl font-bold text-cyan-600">S/ {pago.monto.toFixed(2)}</span>
            </div>
          </div>

          {/* Código de barras simulado */}
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <div className="h-8 bg-gray-300 rounded flex items-center justify-center">
              <div className="flex gap-0.5">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-1 h-6 bg-gray-600" style={{ height: `${Math.random() * 8 + 4}px` }} />
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">{pago.codigo_operacion}</p>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs pt-3 border-t border-gray-100">
            <p>Este comprobante es válido como constancia de pago</p>
            <p className="mt-1">JASS Palian - Agua para nuestra comunidad</p>
          </div>
        </div>

        {/* Botones */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 rounded-b-2xl flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <FaPrint /> Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
          >
            <FaDownload /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}