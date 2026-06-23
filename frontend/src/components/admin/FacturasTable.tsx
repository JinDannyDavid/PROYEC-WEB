// frontend/src/components/admin/FacturasTable.tsx
import { Factura } from '@/services/adminFacturaService';
import { FaEdit, FaPrint, FaTrash } from 'react-icons/fa';

interface FacturasTableProps {
  facturas: Factura[];
  onEdit: (factura: Factura) => void;
  onDelete: (factura: Factura) => void;
  onPrint: (factura: Factura) => void;
}

export default function FacturasTable({ facturas, onEdit, onDelete, onPrint }: FacturasTableProps) {
  if (facturas.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th>Numero de Factura</th>
              <th>Periodo</th>
              <th>Propiedad</th>
              <th>Consumo</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {facturas.map((factura) => (
              <tr key={factura.id} className="table-row">
                <td className="font-mono font-medium text-pvc-blue">{factura.numero_factura}</td>
                <td className="text-paper-900">{factura.periodo}</td>
                <td className="text-paper-600">{factura.propiedad_direccion || '-'}</td>
                <td className="text-paper-600">{factura.consumo_m3} m³</td>
                <td className="font-semibold text-paper-900">S/ {factura.monto_total.toFixed(2)}</td>
                <td>
                  <span className={`badge ${
                    factura.estado === 'PENDIENTE' ? 'badge-warning' :
                    factura.estado === 'PAGADA' ? 'badge-success' :
                    factura.estado === 'VENCIDA' ? 'badge-danger' :
                    'badge-info'
                  }`}>
                    {factura.estado}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(factura)}
                      className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(factura)}
                      className="p-1 text-paper-600 hover:text-stamp-red transition-colors"
                      title="Eliminar"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPrint(factura)}
                      className="p-1 text-paper-600 hover:text-canal-ok transition-colors"
                      title="Imprimir"
                    >
                      <FaPrint className="w-4 h-4" />
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