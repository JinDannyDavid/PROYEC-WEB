// frontend/src/components/receipts/ReceiptSummary.tsx
import { FaCheckCircle, FaExclamationTriangle, FaFileInvoice, FaMoneyBillWave } from 'react-icons/fa';

interface ReceiptSummaryProps {
  totalPendiente: number;
  totalPagado: number;
  totalVencido: number;
  cantidadFacturas: number;
}

export default function ReceiptSummary({
  totalPendiente,
  totalPagado,
  totalVencido,
  cantidadFacturas,
}: ReceiptSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total facturas */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Total facturas</p>
            <p className="text-white text-3xl font-bold mt-1">{cantidadFacturas}</p>
          </div>
          <FaFileInvoice className="text-white/30 text-5xl" />
        </div>
      </div>

      {/* Pendiente */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Por pagar</p>
            <p className="text-white text-3xl font-bold mt-1">S/ {totalPendiente.toFixed(2)}</p>
          </div>
          <FaMoneyBillWave className="text-white/30 text-5xl" />
        </div>
      </div>

      {/* Vencido */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Vencido</p>
            <p className="text-white text-3xl font-bold mt-1">S/ {totalVencido.toFixed(2)}</p>
          </div>
          <FaExclamationTriangle className="text-white/30 text-5xl" />
        </div>
      </div>

      {/* Pagado */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Pagado</p>
            <p className="text-white text-3xl font-bold mt-1">S/ {totalPagado.toFixed(2)}</p>
          </div>
          <FaCheckCircle className="text-white/30 text-5xl" />
        </div>
      </div>
    </div>
  );
}