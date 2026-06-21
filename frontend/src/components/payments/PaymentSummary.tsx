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
  const formatDate = (s: string) => new Date(s).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="card p-5 border-l-4 border-l-canal-ok">
        <p className="text-xs text-paper-500 label">Total pagado</p>
        <p className="text-3xl font-bold text-canal-ok mt-1">S/ {totalPagado.toFixed(2)}</p>
      </div>
      <div className="card p-5 border-l-4 border-l-pvc-blue">
        <p className="text-xs text-paper-500 label">N° de pagos</p>
        <p className="text-3xl font-bold text-paper-900 mt-1">{cantidadPagos}</p>
      </div>
      <div className="card p-5 border-l-4 border-l-alert">
        <p className="text-xs text-paper-500 label">Ultimo pago</p>
        {ultimoPago ? (
          <>
            <p className="text-xl font-bold text-paper-900 mt-1">S/ {ultimoPago.monto.toFixed(2)}</p>
            <p className="text-xs text-paper-500 mt-0.5">{formatDate(ultimoPago.fecha_pago)}</p>
          </>
        ) : (
          <p className="text-paper-500 text-sm mt-1">Sin pagos</p>
        )}
      </div>
    </div>
  );
}