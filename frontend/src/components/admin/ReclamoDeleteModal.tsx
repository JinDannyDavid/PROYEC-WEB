// frontend/src/components/admin/ReclamoDeleteModal.tsx
import { Reclamo } from '@/services/adminReclamoService';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ReclamoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reclamo: Reclamo | null;
}

export default function ReclamoDeleteModal({ isOpen, onClose, onConfirm, reclamo }: ReclamoDeleteModalProps) {
  if (!isOpen || !reclamo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full animate-slide-up">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Eliminar Reclamo</h2>
          <p className="text-gray-400 mb-4">
            ¿Estás seguro de que deseas eliminar el reclamo #{reclamo.id}?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Usuario: {reclamo.usuario_nombre || `Usuario #${reclamo.usuario}`}<br />
            Tipo: {reclamo.tipo}<br />
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