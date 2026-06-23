// frontend/src/components/admin/ReclamosTable.tsx
import { Reclamo } from '@/services/adminReclamoService';
import { FaEye, FaTrash } from 'react-icons/fa';

interface ReclamosTableProps {
  reclamos: Reclamo[];
  onView: (reclamo: Reclamo) => void;
  onDelete: (reclamo: Reclamo) => void;
}

function getTipoLabel(tipo: string): string {
  switch (tipo) {
    case 'FUGA':
      return 'Fuga de agua';
    case 'CALIDAD_AGUA':
      return 'Calidad del agua';
    case 'MEDIDOR':
      return 'Problema con medidor';
    case 'FACTURACION':
      return 'Problema de facturacion';
    default:
      return tipo;
  }
}

export default function ReclamosTable({ reclamos, onView, onDelete }: ReclamosTableProps) {
  if (reclamos.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripcion</th>
              <th>Estado</th>
              <th>Fecha de Creacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {reclamos.map((reclamo) => (
              <tr key={reclamo.id} className="table-row">
                <td className="font-mono text-paper-500">#{reclamo.id}</td>
                <td className="text-paper-900">
                  <span className="badge badge-info">
                    {getTipoLabel(reclamo.tipo)}
                  </span>
                </td>
                <td className="text-paper-700 max-w-xs truncate">
                  {reclamo.descripcion}
                </td>
                <td>
                  <span className={`badge ${
                    reclamo.estado === 'PENDIENTE' ? 'badge-warning' :
                    reclamo.estado === 'EN_PROCESO' ? 'badge-info' :
                    reclamo.estado === 'RESUELTO' ? 'badge-success' :
                    'badge-danger'
                  }`}>
                    {reclamo.estado}
                  </span>
                </td>
                <td className="text-paper-600">
                  {new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE')}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(reclamo)}
                      className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                      title="Ver detalle"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reclamo)}
                      className="p-1 text-paper-600 hover:text-stamp-red transition-colors"
                      title="Eliminar"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}