// frontend/src/components/admin/PropiedadDeleteModal.tsx
import { Propiedad } from '@/services/adminPropiedadService';
import { FaExclamationTriangle } from 'react-icons/fa';

interface PropiedadDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propiedad: Propiedad | null;
}

export default function PropiedadDeleteModal({ isOpen, onClose, onConfirm, propiedad }: PropiedadDeleteModalProps) {
  if (!isOpen || !propiedad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full animate-slide-up">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Eliminar Propiedad</h2>
          <p className="text-gray-400 mb-4">
            ¿Estás seguro de que deseas eliminar la propiedad en <span className="text-white font-medium">{propiedad.direccion}</span>?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Medidor: {propiedad.numero_medidor}<br />
            Esta acción no se puede deshacer y eliminará todas las facturas asociadas.
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