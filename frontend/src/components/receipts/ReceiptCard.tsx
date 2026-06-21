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

interface ReceiptCardProps {
  factura: Factura;
  onVerDetalle: (factura: Factura) => void;
  onPagar: (factura: Factura) => void;
}

const statusConfig: Record<string, { label: string; border: string; badge: string }> = {
  PENDIENTE: { label: 'Pendiente', border: 'border-l-alert', badge: 'badge-warning' },
  PAGADA: { label: 'Pagada', border: 'border-l-canal-ok', badge: 'badge-success' },
  VENCIDA: { label: 'Vencida', border: 'border-l-stamp-red', badge: 'badge-danger' },
};

export default function ReceiptCard({ factura, onVerDetalle, onPagar }: ReceiptCardProps) {
  const status = statusConfig[factura.estado] || statusConfig.PENDIENTE;
  const [mes, anio] = factura.periodo.split('/');
  const nombreMes = new Date(parseInt(anio), parseInt(mes) - 1).toLocaleString('es-PE', { month: 'long' });

  return (
    <div className={`card p-5 border-l-4 ${status.border} flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-paper-900 capitalize">{nombreMes}</h3>
          <p className="text-paper-500 text-sm">{factura.periodo}</p>
        </div>
        <span className={`${status.badge} text-xs`}>{status.label}</span>
      </div>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex justify-between text-sm">
          <span className="text-paper-500">Factura N°</span>
          <span className="font-mono text-paper-900 font-medium">{factura.numero_factura}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-paper-500">Consumo</span>
          <span className="text-paper-900 font-medium">{factura.consumo_m3} m³</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-paper-500">Vencimiento</span>
          <span className="text-paper-900">{new Date(factura.fecha_vencimiento).toLocaleDateString('es-PE')}</span>
        </div>
      </div>

      <div className="border-t border-paper-200 pt-4 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-paper-500 text-sm">Total</span>
          <span className="text-2xl font-bold text-paper-900">S/ {factura.monto_total.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onVerDetalle(factura)} className="btn-outline flex-1 text-sm py-2">
            Detalle
          </button>
          {factura.estado !== 'PAGADA' && (
            <button onClick={() => onPagar(factura)} className="btn-primary flex-1 text-sm py-2">
              Pagar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}