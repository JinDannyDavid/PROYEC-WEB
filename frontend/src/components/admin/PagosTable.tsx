// frontend/src/components/admin/PagosTable.tsx
import { Pago } from '@/services/adminPagoService';
import { FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';

interface PagosTableProps {
  pagos: Pago[];
  onEdit: (pago: Pago) => void;
  onDelete: (pago: Pago) => void;
}

export default function PagosTable({ pagos, onEdit, onDelete }: PagosTableProps) {
  if (pagos.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th>Fecha de Pago</th>
              <th>Factura</th>
              <th>Monto</th>
              <th>Método de Pago</th>
              <th>Código de Operación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {pagos.map((pago) => (
              <tr key={pago.id} className="table-row">
                <td className="text-paper-900">
                  {new Date(pago.fecha_pago).toLocaleDateString('es-PE')}
                </td>
                <td className="text-paper-600">{pago.factura_numero || '-'}</td>
                <td className="font-semibold text-paper-900">S/ {pago.monto.toFixed(2)}</td>
                <td>
                  <span className={`badge ${
                    pago.metodo_pago === 'YAPE' ? 'badge-success' :
                    pago.metodo_pago === 'PLIN' ? 'badge-warning' :
                    pago.metodo_pago === 'TRANSFERENCIA' ? 'badge-info' :
                    'badge-primary'
                  }`}>
                    {pago.metodo_pago}
                  </span>
                </td>
                <td className="font-mono text-xs text-paper-500">{pago.codigo_operacion}</td>
                <td>
                  <span className="badge badge-success">
                    <FaCheckCircle className="w-3 h-3 mr-1" /> Confirmado
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(pago)}
                      className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(pago)}
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