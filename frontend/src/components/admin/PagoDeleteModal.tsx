// frontend/src/components/admin/PagoDeleteModal.tsx
import { Pago } from '@/services/adminPagoService';
import { FaExclamationTriangle } from 'react-icons/fa';

interface PagoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pago: Pago | null;
}

export default function PagoDeleteModal({ isOpen, onClose, onConfirm, pago }: PagoDeleteModalProps) {
  if (!isOpen || !pago) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full animate-slide-up">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Eliminar Pago</h2>
          <p className="text-gray-400 mb-4">
            ¿Estás seguro de que deseas eliminar el pago con código <span className="text-white font-medium">{pago.codigo_operacion}</span>?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Factura: {pago.factura_numero || `#${pago.factura}`}<br />
            Monto: S/ {pago.monto.toFixed(2)}<br />
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}