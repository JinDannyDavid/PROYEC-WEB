// frontend/src/components/admin/PropiedadesTable.tsx
import { Propiedad } from '@/services/adminPropiedadService';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface PropiedadesTableProps {
  propiedades: Propiedad[];
  onEdit: (propiedad: Propiedad) => void;
  onDelete: (propiedad: Propiedad) => void;
}

export default function PropiedadesTable({ propiedades, onEdit, onDelete }: PropiedadesTableProps) {
  if (propiedades.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th>Numero de Medidor</th>
              <th>Direccion</th>
              <th>Propietario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {propiedades.map((propiedad) => (
              <tr key={propiedad.id} className="table-row">
                <td className="font-mono font-medium text-pvc-blue">{propiedad.numero_medidor}</td>
                <td className="text-paper-900">{propiedad.direccion}</td>
                <td className="text-paper-600">
                  {propiedad.usuario_nombre}
                </td>
                <td>
                  <span className={`badge ${
                    propiedad.estado === 'ACTIVO' ? 'badge-success' :
                    propiedad.estado === 'CORTADO' ? 'badge-danger' :
                    propiedad.estado === 'MOROSO' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {propiedad.estado}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(propiedad)}
                      className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(propiedad)}
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