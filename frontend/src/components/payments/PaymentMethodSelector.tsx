interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
  fecha_vencimiento: string;
}

interface PaymentMethodSelectorProps {
  facturas: Factura[];
  facturaSeleccionada: Factura | null;
  onSelectFactura: (factura: Factura) => void;
  error: string;
}

export default function PaymentMethodSelector({
  facturas, facturaSeleccionada, onSelectFactura, error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="badge-danger p-3 text-sm rounded-lg mb-6">{error}</div>
      )}

      {facturas.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-paper-900 text-lg">No tienes facturas pendientes</p>
          <button onClick={() => window.location.href = '/dashboard'} className="btn-primary mt-4">
            Volver al Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg text-paper-900 mb-4">Selecciona la factura a pagar</h2>
            <div className="space-y-3">
              {facturas.map((factura) => (
                <label
                  key={factura.id}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border ${
                    facturaSeleccionada?.id === factura.id
                      ? 'bg-pvc-blue/10 border-pvc-blue'
                      : 'bg-paper-200 border-transparent hover:bg-paper-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="factura"
                      checked={facturaSeleccionada?.id === factura.id}
                      onChange={() => onSelectFactura(factura)}
                      className="w-4 h-4 text-pvc-blue"
                    />
                    <div>
                      <p className="font-semibold text-paper-900">{factura.periodo}</p>
                      <p className="text-paper-500 text-sm">Factura: {factura.numero_factura}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-paper-900">S/ {factura.monto_total.toFixed(2)}</p>
                    <p className="text-paper-400 text-xs">Vence: {factura.fecha_vencimiento}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {facturaSeleccionada && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-paper-900 mb-4">Selecciona el metodo de pago</h2>
              <p className="text-paper-500 text-sm">Puedes pagar con Yape, Plin o en nuestra oficina</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}