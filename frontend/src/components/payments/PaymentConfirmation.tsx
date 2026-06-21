interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
  fecha_vencimiento: string;
}

interface PaymentConfirmationProps {
  factura: Factura;
  metodoSeleccionado?: string;
  onSelectMetodo?: (metodo: string) => void;
  onConfirm?: () => void;
  onBack: () => void;
  procesando?: boolean;
}

const methods = [
  { id: 'YAPE', name: 'Yape', desc: 'Escanea el codigo QR' },
  { id: 'PLIN', name: 'Plin', desc: 'Paga con tu celular' },
  { id: 'TRANSFERENCIA', name: 'Transferencia', desc: 'Transferencia bancaria' },
  { id: 'EFECTIVO', name: 'Efectivo', desc: 'Paga en oficina JASS' },
];

const methodInstructions: Record<string, string[]> = {
  YAPE: ['Abre Yape', 'Escanea el codigo QR', 'Confirma el pago'],
  PLIN: ['Abre Plin', 'Selecciona Pagar servicio', 'Busca JASS Palian', 'Ingresa el monto', 'Confirma'],
  TRANSFERENCIA: ['Banco: BCP', 'Cuenta: 123-4567890-01', 'Beneficiario: JASS Palian', 'Enviar voucher a WhatsApp'],
  EFECTIVO: ['Direccion: Palian, Huancayo', 'Horario: Lun-Vie 8am-4pm', 'Llevar DNI y numero de medidor'],
};

export default function PaymentConfirmation({
  factura, metodoSeleccionado, onSelectMetodo, onConfirm, onBack, procesando = false,
}: PaymentConfirmationProps) {
  if (!metodoSeleccionado) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h2 className="font-bold text-lg text-paper-900 mb-4">Selecciona metodo de pago</h2>

          <div className="bg-paper-200 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-paper-500">Factura:</span>
              <span className="font-medium text-paper-900">{factura.numero_factura}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-paper-500">Periodo:</span>
              <span className="font-medium text-paper-900">{factura.periodo}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-paper-300">
              <span className="font-bold text-paper-900">Total:</span>
              <span className="text-xl font-bold text-pvc-blue">S/ {factura.monto_total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMetodo?.(m.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-paper-200 hover:bg-paper-300 transition text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-paper-900">{m.name}</p>
                  <p className="text-paper-500 text-sm">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-paper-500 hover:text-paper-900 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a facturas
          </button>
        </div>
      </div>
    );
  }

  const metodo = methods.find((m) => m.id === metodoSeleccionado);
  const instructions = methodInstructions[metodoSeleccionado] || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h2 className="font-bold text-lg text-paper-900 mb-4">Confirmar pago</h2>

        <div className="bg-paper-200 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-paper-500">Factura:</span>
            <span className="font-medium text-paper-900">{factura.numero_factura}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-paper-500">Periodo:</span>
            <span className="font-medium text-paper-900">{factura.periodo}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-paper-300">
            <span className="font-bold text-paper-900">Total a pagar:</span>
            <span className="text-xl font-bold text-pvc-blue">S/ {factura.monto_total.toFixed(2)}</span>
          </div>
        </div>

        {metodo && (
          <div className="bg-pvc-blue/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-pvc-blue text-white flex items-center justify-center font-bold text-sm">
                {metodo.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-paper-900">Pagar con {metodo.name}</p>
                <p className="text-paper-500 text-sm">{metodo.desc}</p>
              </div>
            </div>
            <div className="space-y-1.5 mt-3">
              {instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-pvc-blue font-bold flex-shrink-0 w-5">{idx + 1}.</span>
                  <span className="text-paper-700">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-outline flex-1">Atras</button>
          <button
            onClick={onConfirm}
            disabled={procesando}
            className={`btn-primary flex-1 ${procesando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {procesando ? 'Procesando...' : 'Confirmar pago'}
          </button>
        </div>
      </div>
    </div>
  );
}