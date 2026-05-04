// frontend/src/components/notifications/NotificationCard.tsx
import { Notificacion } from '@/services/notificationService';
import { FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle, FaMoneyBillWave, FaTools, FaWater } from 'react-icons/fa';

interface NotificationCardProps {
  notificacion: Notificacion;
  onMarcarLeida: (id: number) => void;
}

const getTipoConfig = (tipo: string) => {
  switch (tipo) {
    case 'PAGO':
      return { icon: FaMoneyBillWave, color: 'green', bg: 'bg-green-500/20', text: 'text-green-400' };
    case 'CORTE':
      return { icon: FaExclamationTriangle, color: 'red', bg: 'bg-red-500/20', text: 'text-red-400' };
    case 'RECORDATORIO':
      return { icon: FaBell, color: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-400' };
    case 'COMUNICADO':
      return { icon: FaInfoCircle, color: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-400' };
    case 'RECLAMO':
      return { icon: FaTools, color: 'purple', bg: 'bg-purple-500/20', text: 'text-purple-400' };
    default:
      return { icon: FaWater, color: 'cyan', bg: 'bg-cyan-500/20', text: 'text-cyan-400' };
  }
};

export default function NotificationCard({ notificacion, onMarcarLeida }: NotificationCardProps) {
  const tipo = getTipoConfig(notificacion.tipo);
  const IconComponent = tipo.icon;
  
  const fechaFormateada = new Date(notificacion.fecha_creacion).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
      !notificacion.leida ? 'border-l-4 border-l-cyan-400' : ''
    }`}>
      <div className="p-5">
        <div className="flex gap-4">
          {/* Icono */}
          <div className={`w-12 h-12 rounded-full ${tipo.bg} flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`${tipo.text} text-xl`} />
          </div>

          {/* Contenido */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className={`font-semibold ${!notificacion.leida ? 'text-white' : 'text-white/80'}`}>
                  {notificacion.titulo}
                </h3>
                <p className="text-white/60 text-xs mt-1">{fechaFormateada}</p>
              </div>
              {!notificacion.leida && (
                <button
                  onClick={() => onMarcarLeida(notificacion.id)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition"
                  title="Marcar como leída"
                >
                  <FaCheck className="text-cyan-400 text-sm" />
                </button>
              )}
            </div>
            <p className="text-white/80 text-sm mt-3 leading-relaxed">
              {notificacion.mensaje}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}