// frontend/src/components/complaints/ComplaintDetailModal.tsx
import { FaCalendarAlt, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface Reclamo {
  id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  respuesta?: string;
  fecha_respuesta?: string;
  foto_url?: string;
  propiedad_nombre?: string;
}

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
}

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'FUGA': return 'Fuga de agua';
    case 'CALIDAD_AGUA': return 'Calidad del agua';
    case 'MEDIDOR': return 'Problema con medidor';
    case 'FACTURACION': return 'Problema de facturación';
    default: return 'Otro';
  }
};

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return { label: 'Pendiente', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', icon: '⏰' };
    case 'EN_PROCESO':
      return { label: 'En proceso', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔧' };
    case 'RESUELTO':
      return { label: 'Resuelto', color: 'green', bg: 'bg-green-100', text: 'text-green-700', icon: '✅' };
    case 'RECHAZADO':
      return { label: 'Rechazado', color: 'red', bg: 'bg-red-100', text: 'text-red-700', icon: '❌' };
    default:
      return { label: estado, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', icon: '📋' };
  }
};

export default function ComplaintDetailModal({ isOpen, onClose, reclamo }: ComplaintDetailModalProps) {
  if (!isOpen || !reclamo) return null;

  const tipoLabel = getTipoLabel(reclamo.tipo);
  const status = getStatusConfig(reclamo.estado);
  const fechaFormateada = new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Detalle del Reclamo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ID y estado */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">ID: #{reclamo.id}</span>
            <div className={`${status.bg} px-3 py-1 rounded-full flex items-center gap-1`}>
              <span className={status.text}>{status.icon}</span>
              <span className={`${status.text} text-xs font-medium`}>{status.label}</span>
            </div>
          </div>

          {/* Tipo */}
          <div>
            <h3 className="text-gray-500 text-sm mb-1">Tipo de reclamo</h3>
            <p className="text-gray-800 font-medium">{tipoLabel}</p>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-gray-500 text-sm mb-1">Descripción</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{reclamo.descripcion}</p>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaCalendarAlt className="text-xs" />
            <span>Reportado el {fechaFormateada}</span>
          </div>

          {/* Respuesta (si existe) */}
          {reclamo.respuesta && (
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-green-500" />
                <h3 className="text-green-700 font-semibold text-sm">Respuesta de JASS</h3>
              </div>
              <p className="text-gray-700 text-sm">{reclamo.respuesta}</p>
              {reclamo.fecha_respuesta && (
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(reclamo.fecha_respuesta).toLocaleDateString('es-PE')}
                </p>
              )}
            </div>
          )}

          {/* Contacto */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs">
              ¿Necesitas más información?<br />
              Contacta a la oficina de JASS Palian al (064) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}