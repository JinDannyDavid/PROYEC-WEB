// frontend/src/components/admin/UsuariosTable.tsx
import { Usuario } from '@/services/adminUserService';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

export default function UsuariosTable({ usuarios, onEdit, onDelete }: UsuariosTableProps) {
  if (usuarios.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th>DNI</th>
              <th>Nombre Completo</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Sector</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="table-row">
                <td className="font-mono">{usuario.dni}</td>
                <td className="font-medium text-paper-900">
                  {usuario.nombres} {usuario.apellidos}
                </td>
                <td className="text-paper-600">{usuario.telefono}</td>
                <td className="text-paper-600">{usuario.email || '-'}</td>
                <td className="text-paper-600">{usuario.sector}</td>
                <td>
                  <span className={`badge ${
                    usuario.tipo_usuario === 'ADMIN' ? 'badge-info' :
                    usuario.tipo_usuario === 'CAJERO' ? 'badge-success' :
                    usuario.tipo_usuario === 'TECNICO' ? 'badge-warning' :
                    'badge-primary'
                  }`}>
                    {usuario.tipo_usuario}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(usuario)}
                      className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                      title="Editar"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(usuario)}
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