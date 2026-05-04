// frontend/src/components/payments/PaymentSummary.tsx
import { FaClock, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';

interface Pago {
  id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
}

interface PaymentSummaryProps {
  totalPagado: number;
  cantidadPagos: number;
  ultimoPago: Pago | null;
}

export default function PaymentSummary({ totalPagado, cantidadPagos, ultimoPago }: PaymentSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total pagado */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Total pagado</p>
            <p className="text-white text-3xl font-bold mt-1">S/ {totalPagado.toFixed(2)}</p>
          </div>
          <FaMoneyBillWave className="text-white/30 text-5xl" />
        </div>
      </div>

      {/* Cantidad de pagos */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">N° de pagos</p>
            <p className="text-white text-3xl font-bold mt-1">{cantidadPagos}</p>
          </div>
          <FaReceipt className="text-white/30 text-5xl" />
        </div>
      </div>

      {/* Último pago */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Último pago</p>
            {ultimoPago ? (
              <>
                <p className="text-white text-xl font-bold mt-1">S/ {ultimoPago.monto.toFixed(2)}</p>
                <p className="text-white/70 text-xs mt-1">{formatDate(ultimoPago.fecha_pago)}</p>
              </>
            ) : (
              <p className="text-white/70 text-sm mt-1">Sin pagos</p>
            )}
          </div>
          <FaClock className="text-white/30 text-5xl" />
        </div>
      </div>
    </div>
  );
}