interface ReceiptSummaryProps {
  totalPendiente: number;
  totalPagado: number;
  totalVencido: number;
  cantidadFacturas: number;
}

export default function ReceiptSummary({
  totalPendiente, totalPagado, totalVencido, cantidadFacturas,
}: ReceiptSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="card p-5 border-l-4 border-l-pvc-blue">
        <p className="text-xs text-paper-500 label">Total facturas</p>
        <p className="text-3xl font-bold text-paper-900 mt-1">{cantidadFacturas}</p>
      </div>
      <div className="card p-5 border-l-4 border-l-alert">
        <p className="text-xs text-paper-500 label">Por pagar</p>
        <p className="text-3xl font-bold text-alert mt-1">S/ {totalPendiente.toFixed(2)}</p>
      </div>
      <div className="card p-5 border-l-4 border-l-stamp-red">
        <p className="text-xs text-paper-500 label">Vencido</p>
        <p className="text-3xl font-bold text-stamp-red mt-1">S/ {totalVencido.toFixed(2)}</p>
      </div>
      <div className="card p-5 border-l-4 border-l-canal-ok">
        <p className="text-xs text-paper-500 label">Pagado</p>
        <p className="text-3xl font-bold text-canal-ok mt-1">S/ {totalPagado.toFixed(2)}</p>
      </div>
    </div>
  );
}