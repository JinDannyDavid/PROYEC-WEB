// frontend/src/components/receipts/ReceiptCard.tsx
import { FaCalendarAlt, FaEye, FaMoneyBillWave, FaTint } from 'react-icons/fa';

interface Factura {
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

// ✅ Props correctamente definidas
interface ReceiptCardProps {
  factura: Factura;
  onVerDetalle: (factura: Factura) => void;  // ← Función que recibe factura
  onPagar: (factura: Factura) => void;       // ← Función que recibe factura
}

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return { label: 'Pendiente', color: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-400', icon: '⏰' };
    case 'PAGADA':
      return { label: 'Pagada', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅' };
    case 'VENCIDA':
      return { label: 'Vencida', color: 'red', bg: 'bg-red-500/20', text: 'text-red-400', icon: '⚠️' };
    default:
      return { label: estado, color: 'gray', bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '📄' };
  }
};

export default function ReceiptCard({ factura, onVerDetalle, onPagar }: ReceiptCardProps) {
  const status = getStatusConfig(factura.estado);
  const [mes, año] = factura.periodo.split('/');
  const nombreMes = new Date(parseInt(año), parseInt(mes) - 1).toLocaleString('es-PE', { month: 'long' });

  return (
    <div className="group bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Header con periodo y estado */}
      <div className="relative p-5 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-bold text-xl capitalize">{nombreMes}</h3>
            <p className="text-white/60 text-sm">{factura.periodo}</p>
          </div>
          <div className={`${status.bg} rounded-full px-3 py-1 flex items-center gap-1`}>
            <span className={status.text}>{status.icon}</span>
            <span className={`${status.text} text-xs font-medium`}>{status.label}</span>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="p-5 pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Factura N°</span>
            <span className="text-white font-mono text-sm">{factura.numero_factura}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Consumo</span>
            <span className="text-white flex items-center gap-1">
              <FaTint className="text-cyan-400 text-xs" />
              {factura.consumo_m3} m³
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Vencimiento</span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <FaCalendarAlt className="text-cyan-400 text-xs" />
              {new Date(factura.fecha_vencimiento).toLocaleDateString('es-PE')}
            </span>
          </div>
        </div>

        {/* Monto y acciones */}
        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/60 text-sm">Total</span>
            <span className={`text-2xl font-bold ${factura.estado === 'PENDIENTE' ? 'text-cyan-300' : 'text-white'}`}>
              S/ {factura.monto_total.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            {/* ✅ onVerDetalle recibe factura como argumento */}
            <button
              onClick={() => onVerDetalle(factura)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              <FaEye className="text-sm" />
              <span className="text-sm font-medium">Detalle</span>
            </button>
            
            {/* ✅ onPagar recibe factura como argumento (solo si no está pagada) */}
            {factura.estado !== 'PAGADA' && (
              <button
                onClick={() => onPagar(factura)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition shadow-lg"
              >
                <FaMoneyBillWave />
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}