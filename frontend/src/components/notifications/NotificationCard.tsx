import { Notificacion } from '@/services/notificationService';

interface NotificationCardProps {
  notificacion: Notificacion;
  onMarcarLeida: (id: number) => void;
}

const tipoColor: Record<string, string> = {
  PAGO: 'text-canal-ok bg-canal-ok/10',
  CORTE: 'text-stamp-red bg-stamp-red/10',
  RECORDATORIO: 'text-alert bg-alert/10',
  COMUNICADO: 'text-pvc-blue bg-pvc-blue/10',
  RECLAMO: 'text-stamp-blue bg-stamp-blue/10',
};

export default function NotificationCard({ notificacion, onMarcarLeida }: NotificationCardProps) {
  const colorClass = tipoColor[notificacion.tipo] || tipoColor.COMUNICADO;
  const fecha = new Date(notificacion.fecha_creacion).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={`card p-5 ${!notificacion.leida ? 'border-l-4 border-l-pvc-blue' : ''}`}>
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${colorClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`font-semibold text-sm ${notificacion.leida ? 'text-paper-700' : 'text-paper-900'}`}>
                {notificacion.titulo}
              </h3>
              <p className="text-paper-400 text-xs mt-0.5">{fecha}</p>
            </div>
            {!notificacion.leida && (
              <button
                onClick={() => onMarcarLeida(notificacion.id)}
                className="p-1.5 rounded-lg text-paper-400 hover:text-pvc-blue hover:bg-paper-200 transition flex-shrink-0"
                title="Marcar como leida"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-paper-600 text-sm mt-2 leading-relaxed">{notificacion.mensaje}</p>
        </div>
      </div>
    </div>
  );
}