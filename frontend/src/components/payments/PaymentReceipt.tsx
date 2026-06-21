interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
}

interface Comprobante {
  id: number;
  codigo_operacion: string;
  metodo_pago: string;
  fecha_pago: string;
}

interface PaymentReceiptProps {
  comprobante: Comprobante;
  factura: Factura;
  onFinish: () => void;
}

export default function PaymentReceipt({ comprobante, factura, onFinish }: PaymentReceiptProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card overflow-hidden">
        <div className="bg-canal-ok p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold">Pago exitoso</h2>
          <p className="text-white/80 text-sm">Tu pago ha sido registrado correctamente</p>
        </div>

        <div className="p-6">
          <div className="border-b border-paper-200 pb-4 mb-4">
            <p className="text-paper-500 text-xs label">Codigo de operacion</p>
            <p className="font-mono font-bold text-paper-900">{comprobante.codigo_operacion}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Factura', value: factura.numero_factura },
              { label: 'Periodo', value: factura.periodo },
              { label: 'Metodo de pago', value: comprobante.metodo_pago },
              { label: 'Fecha', value: new Date(comprobante.fecha_pago).toLocaleDateString('es-PE') },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-paper-500 text-xs label">{item.label}</p>
                <p className="font-semibold text-paper-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-canal-ok/10 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-paper-700">Total pagado</span>
              <span className="text-2xl font-bold text-canal-ok">S/ {factura.monto_total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button className="btn-outline flex-1" onClick={() => alert('Funcionalidad en desarrollo')}>
              Descargar
            </button>
            <button className="btn-outline flex-1" onClick={() => alert('Funcionalidad en desarrollo')}>
              Compartir
            </button>
          </div>

          <button onClick={onFinish} className="btn-primary w-full">
            Volver al inicio
          </button>
        </div>

        <div className="bg-paper-200 p-4 text-center">
          <p className="text-paper-400 text-xs">
            Este comprobante es valido como constancia de pago.
            Guarda este codigo para cualquier consulta.
          </p>
        </div>
      </div>
    </div>
  );
}