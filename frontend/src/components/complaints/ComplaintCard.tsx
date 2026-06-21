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

const tipoLabel: Record<string, string> = {
  FUGA: 'Fuga de agua',
  CALIDAD_AGUA: 'Calidad del agua',
  MEDIDOR: 'Problema con medidor',
  FACTURACION: 'Problema de facturacion',
};

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
  PENDIENTE: { label: 'Pendiente', badge: 'badge-warning', dot: 'bg-alert' },
  EN_PROCESO: { label: 'En proceso', badge: 'badge-info', dot: 'bg-pvc-blue' },
  RESUELTO: { label: 'Resuelto', badge: 'badge-success', dot: 'bg-canal-ok' },
  RECHAZADO: { label: 'Rechazado', badge: 'badge-danger', dot: 'bg-stamp-red' },
};

const tipoIcons: Record<string, string> = {
  FUGA: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  CALIDAD_AGUA: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
};

export default function ComplaintCard({ reclamo, onVerDetalle }: ComplaintCardProps) {
  const tipo = tipoLabel[reclamo.tipo] || 'Otro';
  const status = statusConfig[reclamo.estado] || statusConfig.PENDIENTE;
  const fecha = new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE');

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-alert/10 text-alert flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-paper-900 text-sm">{tipo}</h3>
            <p className="text-paper-500 text-xs">{fecha}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className={`${status.badge} text-xs`}>{status.label}</span>
        </div>
      </div>
      <p className="text-paper-700 text-sm line-clamp-2 mb-4">{reclamo.descripcion}</p>
      <div className="flex justify-between items-center pt-3 border-t border-paper-200">
        {reclamo.propiedad_nombre && (
          <span className="text-paper-400 text-xs">{reclamo.propiedad_nombre}</span>
        )}
        <button onClick={() => onVerDetalle(reclamo)} className="btn-outline text-xs py-1.5 px-3">
          Ver detalle
        </button>
      </div>
    </div>
  );
}