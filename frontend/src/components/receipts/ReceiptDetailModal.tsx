// frontend/src/components/receipts/ReceiptDetailModal.tsx
import { FaCalendarAlt, FaCheckCircle, FaMoneyBillWave, FaTimes, FaTint } from 'react-icons/fa';

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

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura | null;
  onPagar: (factura: Factura) => void;
}

export default function ReceiptDetailModal({
  isOpen,
  onClose,
  factura,
  onPagar,
}: ReceiptDetailModalProps) {
  if (!isOpen || !factura) return null;

  const [mes, año] = factura.periodo.split('/');
  const nombreMes = new Date(parseInt(año), parseInt(mes) - 1).toLocaleString('es-PE', { month: 'long' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detalle de Factura</h2>
            <p className="text-gray-500 text-sm">{factura.numero_factura}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-5">
          {/* Periodo y estado */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Período</p>
              <p className="text-gray-800 font-semibold text-lg capitalize">{nombreMes} {año}</p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              factura.estado === 'PENDIENTE' ? 'bg-orange-100 text-orange-600' :
              factura.estado === 'PAGADA' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {factura.estado === 'PENDIENTE' ? 'Pendiente' : factura.estado === 'PAGADA' ? 'Pagada' : 'Vencida'}
            </div>
          </div>

          {/* Detalle de consumo */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaTint className="text-cyan-500" /> Detalle de consumo
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Lectura anterior</span>
                <span className="text-gray-700">{factura.lectura_anterior} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lectura actual</span>
                <span className="text-gray-700">{factura.lectura_actual} m³</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-700 font-medium">Consumo</span>
                <span className="text-gray-800 font-bold">{factura.consumo_m3} m³</span>
              </div>
            </div>
          </div>

          {/* Detalle de cargos */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Detalle de cargos</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Cargo fijo</span>
                <span className="text-gray-700">S/ {factura.cargo_fijo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cargo por consumo</span>
                <span className="text-gray-700">S/ {factura.cargo_consumo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cargo alcantarillado</span>
                <span className="text-gray-700">S/ {factura.cargo_alcantarillado.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-800 font-bold">Total</span>
                <span className="text-cyan-600 font-bold text-xl">S/ {factura.monto_total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <FaCalendarAlt className="text-gray-400 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">Emisión</p>
              <p className="text-gray-700 text-sm font-medium">
                {new Date(factura.fecha_emision).toLocaleDateString('es-PE')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <FaCalendarAlt className="text-gray-400 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">Vencimiento</p>
              <p className="text-gray-700 text-sm font-medium">
                {new Date(factura.fecha_vencimiento).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 rounded-b-2xl">
          {factura.estado !== 'PAGADA' ? (
            <button
              onClick={() => {
                onClose();
                onPagar(factura);
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
            >
              <FaMoneyBillWave /> Pagar ahora
            </button>
          ) : (
            <div className="text-center text-green-600 flex items-center justify-center gap-2">
              <FaCheckCircle /> Factura pagada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}