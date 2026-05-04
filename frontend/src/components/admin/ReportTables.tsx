// frontend/src/components/admin/ReportTables.tsx
import { UsuarioTop } from '@/services/adminReportService';
import { FaTrophy } from 'react-icons/fa';

interface ReportTablesProps {
  topUsuarios: UsuarioTop[];
}

export default function ReportTables({ topUsuarios }: ReportTablesProps) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          <h3 className="text-white font-bold text-lg">Top Usuarios por Pagos</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50 border-b border-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-semibold">#</th>
              <th className="text-left p-4 text-gray-300 font-semibold">Usuario</th>
              <th className="text-left p-4 text-gray-300 font-semibold">N° Pagos</th>
              <th className="text-left p-4 text-gray-300 font-semibold">Total Pagado</th>
            </tr>
          </thead>
          <tbody>
            {topUsuarios.map((usuario, index) => (
              <tr key={usuario.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                <td className="p-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-500/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-700 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="p-4 text-white">{usuario.nombre}</td>
                <td className="p-4 text-white">{usuario.pagos}</td>
                <td className="p-4 text-white font-semibold">S/ {usuario.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}