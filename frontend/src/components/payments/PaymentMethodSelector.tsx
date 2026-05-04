// frontend/src/components/payments/PaymentMethodSelector.tsx
import { FaBuilding, FaMoneyBillWave, FaPhone, FaYenSign } from 'react-icons/fa';

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

const paymentMethods = [
  { id: 'YAPE', name: 'Yape', icon: FaYenSign, color: 'green', description: 'Paga escaneando el código QR' },
  { id: 'PLIN', name: 'Plin', icon: FaPhone, color: 'purple', description: 'Paga con tu número de celular' },
  { id: 'TRANSFERENCIA', name: 'Transferencia', icon: FaBuilding, color: 'blue', description: 'Transferencia bancaria' },
  { id: 'EFECTIVO', name: 'Efectivo', icon: FaMoneyBillWave, color: 'orange', description: 'Paga en oficina JASS' },
];

export default function PaymentMethodSelector({
  facturas,
  facturaSeleccionada,
  onSelectFactura,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {facturas.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <p className="text-white text-lg">No tienes facturas pendientes</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Selección de factura */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">Selecciona la factura a pagar</h2>
            <div className="space-y-3">
              {facturas.map((factura) => (
                <label
                  key={factura.id}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${
                    facturaSeleccionada?.id === factura.id
                      ? 'bg-cyan-500/30 border border-cyan-400'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="factura"
                      checked={facturaSeleccionada?.id === factura.id}
                      onChange={() => onSelectFactura(factura)}
                      className="w-4 h-4 text-cyan-500"
                    />
                    <div>
                      <p className="text-white font-semibold">{factura.periodo}</p>
                      <p className="text-white/70 text-sm">Factura: {factura.numero_factura}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">S/ {factura.monto_total.toFixed(2)}</p>
                    <p className="text-white/60 text-xs">Vence: {factura.fecha_vencimiento}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Selección de método de pago */}
          {facturaSeleccionada && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Selecciona el método de pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      // Guardar método y avanzar al siguiente paso
                      // (la lógica se maneja en el padre)
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-left"
                  >
                    <div className={`w-12 h-12 rounded-full bg-${method.color}-500/20 flex items-center justify-center`}>
                      <method.icon className={`text-${method.color}-400 text-xl`} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{method.name}</p>
                      <p className="text-white/60 text-sm">{method.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}