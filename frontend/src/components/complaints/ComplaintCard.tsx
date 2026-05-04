// frontend/src/components/complaints/ComplaintCard.tsx
import { FaEye, FaQuestion, FaReceipt, FaTint, FaTools, FaWater } from 'react-icons/fa';

interface Reclamo {
  id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  respuesta?: string;
  foto_url?: string;
  propiedad_nombre?: string;
}

interface ComplaintCardProps {
  reclamo: Reclamo;
  onVerDetalle: (reclamo: Reclamo) => void;
}

const getTipoConfig = (tipo: string) => {
  switch (tipo) {
    case 'FUGA':
      return { icon: FaWater, label: 'Fuga de agua', color: 'blue' };
    case 'CALIDAD_AGUA':
      return { icon: FaTint, label: 'Calidad del agua', color: 'cyan' };
    case 'MEDIDOR':
      return { icon: FaTools, label: 'Problema con medidor', color: 'purple' };
    case 'FACTURACION':
      return { icon: FaReceipt, label: 'Problema de facturación', color: 'orange' };
    default:
      return { icon: FaQuestion, label: 'Otro', color: 'gray' };
  }
};

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return { label: 'Pendiente', color: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' };
    case 'EN_PROCESO':
      return { label: 'En proceso', color: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' };
    case 'RESUELTO':
      return { label: 'Resuelto', color: 'green', bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' };
    case 'RECHAZADO':
      return { label: 'Rechazado', color: 'red', bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' };
    default:
      return { label: estado, color: 'gray', bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-500' };
  }
};

export default function ComplaintCard({ reclamo, onVerDetalle }: ComplaintCardProps) {
  const tipo = getTipoConfig(reclamo.tipo);
  const status = getStatusConfig(reclamo.estado);
  const IconComponent = tipo.icon;

  const fechaFormateada = new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE');

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-${tipo.color}-500/20 flex items-center justify-center`}>
              <IconComponent className={`text-${tipo.color}-400 text-lg`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{tipo.label}</h3>
              <p className="text-white/50 text-xs">{fechaFormateada}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
            <span className={`${status.text} text-xs font-medium`}>{status.label}</span>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-white/80 text-sm line-clamp-2 mb-4">
          {reclamo.descripcion}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          {reclamo.propiedad_nombre && (
            <span className="text-white/40 text-xs">📍 {reclamo.propiedad_nombre}</span>
          )}
          <button
            onClick={() => onVerDetalle(reclamo)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition text-sm"
          >
            <FaEye className="text-xs" /> Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}