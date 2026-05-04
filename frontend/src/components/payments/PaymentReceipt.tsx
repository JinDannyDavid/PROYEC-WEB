// frontend/src/components/payments/PaymentReceipt.tsx
import { FaCheckCircle, FaDownload, FaHome, FaShare } from 'react-icons/fa';

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
  const handleDownload = () => {
    // TODO: Implementar descarga de PDF
    alert('Funcionalidad en desarrollo');
  };

  const handleShare = () => {
    // TODO: Implementar compartir
    alert('Funcionalidad en desarrollo');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header verde de éxito */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
          <FaCheckCircle className="text-white text-5xl mx-auto mb-3" />
          <h2 className="text-white text-2xl font-bold">¡Pago Exitoso!</h2>
          <p className="text-white/80">Tu pago ha sido registrado correctamente</p>
        </div>

        {/* Detalle del comprobante */}
        <div className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <p className="text-gray-500 text-sm">Código de operación</p>
            <p className="text-gray-800 font-mono font-bold">{comprobante.codigo_operacion}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-sm">Factura</p>
              <p className="text-gray-800 font-semibold">{factura.numero_factura}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Período</p>
              <p className="text-gray-800 font-semibold">{factura.periodo}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Método de pago</p>
              <p className="text-gray-800 font-semibold">{comprobante.metodo_pago}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Fecha</p>
              <p className="text-gray-800 font-semibold">
                {new Date(comprobante.fecha_pago).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total pagado</span>
              <span className="text-2xl font-bold text-green-600">
                S/ {factura.monto_total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 border border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition flex items-center justify-center gap-2"
            >
              <FaDownload /> Descargar
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 border border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition flex items-center justify-center gap-2"
            >
              <FaShare /> Compartir
            </button>
          </div>

          <button
            onClick={onFinish}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
          >
            <FaHome /> Volver al Inicio
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-400 text-xs">
            Este comprobante es válido como constancia de pago.
            Guarda este código para cualquier consulta.
          </p>
        </div>
      </div>
    </div>
  );
}