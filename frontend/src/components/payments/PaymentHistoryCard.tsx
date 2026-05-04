// frontend/src/components/payments/PaymentHistoryCard.tsx
import { FaBuilding, FaCheckCircle, FaDownload, FaEye, FaMoneyBillWave, FaPhone, FaYenSign } from 'react-icons/fa';

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

interface PaymentHistoryCardProps {
  pago: Pago;
  onVerComprobante: (pago: Pago) => void;
  onDescargar: (pago: Pago) => void;
}

const getMethodConfig = (metodo: string) => {
  switch (metodo) {
    case 'YAPE':
      return { icon: FaYenSign, label: 'Yape', color: 'green', bg: 'bg-green-500/20' };
    case 'PLIN':
      return { icon: FaPhone, label: 'Plin', color: 'purple', bg: 'bg-purple-500/20' };
    case 'TRANSFERENCIA':
      return { icon: FaBuilding, label: 'Transferencia', color: 'blue', bg: 'bg-blue-500/20' };
    default:
      return { icon: FaMoneyBillWave, label: 'Efectivo', color: 'orange', bg: 'bg-orange-500/20' };
  }
};

export default function PaymentHistoryCard({ pago, onVerComprobante, onDescargar }: PaymentHistoryCardProps) {
  const method = getMethodConfig(pago.metodo_pago);
  const IconComponent = method.icon;
  const fechaFormateada = new Date(pago.fecha_pago).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${method.bg} flex items-center justify-center`}>
              <IconComponent className={`text-${method.color}-400 text-lg`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{method.label}</h3>
              <p className="text-white/50 text-xs">{fechaFormateada}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-400 text-sm" />
            <span className="text-green-400 text-xs font-medium">Confirmado</span>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Código de operación</span>
            <span className="text-white/80 font-mono text-xs">{pago.codigo_operacion}</span>
          </div>
          {pago.factura_numero && (
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Factura</span>
              <span className="text-white/80 text-sm">{pago.factura_numero}</span>
            </div>
          )}
        </div>

        {/* Monto y acciones */}
        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/60 text-sm">Monto pagado</span>
            <span className="text-2xl font-bold text-cyan-300">S/ {pago.monto.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onVerComprobante(pago)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              <FaEye className="text-sm" />
              <span className="text-sm font-medium">Comprobante</span>
            </button>
            <button
              onClick={() => onDescargar(pago)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              <FaDownload className="text-sm" />
              <span className="text-sm font-medium">Descargar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}