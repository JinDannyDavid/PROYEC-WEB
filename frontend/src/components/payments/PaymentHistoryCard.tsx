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

const methodLabel: Record<string, string> = {
  YAPE: 'Yape', PLIN: 'Plin', TRANSFERENCIA: 'Transferencia',
};

export default function PaymentHistoryCard({ pago, onVerComprobante, onDescargar }: PaymentHistoryCardProps) {
  const label = methodLabel[pago.metodo_pago] || pago.metodo_pago;
  const fecha = new Date(pago.fecha_pago).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-canal-ok/10 text-canal-ok flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-paper-900">{label}</h3>
            <p className="text-paper-500 text-xs">{fecha}</p>
          </div>
        </div>
        <span className="text-xs text-canal-ok font-medium badge-success">Confirmado</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-paper-500">Codigo de operacion</span>
          <span className="font-mono text-paper-900 text-xs">{pago.codigo_operacion}</span>
        </div>
        {pago.factura_numero && (
          <div className="flex justify-between text-sm">
            <span className="text-paper-500">Factura</span>
            <span className="text-paper-900">{pago.factura_numero}</span>
          </div>
        )}
      </div>

      <div className="border-t border-paper-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-paper-500 text-sm">Monto pagado</span>
          <span className="text-2xl font-bold text-paper-900">S/ {pago.monto.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onVerComprobante(pago)} className="btn-outline flex-1 text-sm py-2">
            Comprobante
          </button>
          <button onClick={() => onDescargar(pago)} className="btn-outline flex-1 text-sm py-2">
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}