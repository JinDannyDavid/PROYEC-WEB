// frontend/src/components/admin/ReportStats.tsx
import { DashboardStats } from '@/services/adminReportService';
import { FaExclamationTriangle, FaFileInvoice, FaHome, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

interface ReportStatsProps {
  stats: DashboardStats;
}

export default function ReportStats({ stats }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Usuarios</p>
            <p className="text-white text-3xl font-bold mt-1">{stats.totalUsuarios}</p>
          </div>
          <FaUsers className="text-white/30 text-4xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Propiedades</p>
            <p className="text-white text-3xl font-bold mt-1">{stats.totalPropiedades}</p>
          </div>
          <FaHome className="text-white/30 text-4xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Facturas Pendientes</p>
            <p className="text-white text-3xl font-bold mt-1">{stats.totalFacturasPendientes}</p>
          </div>
          <FaFileInvoice className="text-white/30 text-4xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Pagos (este mes)</p>
            <p className="text-white text-3xl font-bold mt-1">S/ {stats.totalPagosMes.toFixed(2)}</p>
          </div>
          <FaMoneyBillWave className="text-white/30 text-4xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Reclamos Pendientes</p>
            <p className="text-white text-3xl font-bold mt-1">{stats.totalReclamosPendientes}</p>
          </div>
          <FaExclamationTriangle className="text-white/30 text-4xl" />
        </div>
      </div>
    </div>
  );
}