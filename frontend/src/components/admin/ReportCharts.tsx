// frontend/src/components/admin/ReportCharts.tsx
import { IngresoMensual, MetodoPagoStats, ReclamoPorTipo } from '@/services/adminReportService';
import { FaChartLine, FaChartPie } from 'react-icons/fa';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

interface ReportChartsProps {
  ingresosMensuales: IngresoMensual[];
  reclamosPorTipo: ReclamoPorTipo[];
  metodosPago: MetodoPagoStats[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportCharts({ ingresosMensuales, reclamosPorTipo, metodosPago }: ReportChartsProps) {
  // Datos para gráfico de métodos de pago
  const metodosPagoData = metodosPago.map(m => ({
    name: m.metodo,
    value: m.cantidad,
    total: m.total,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de ingresos mensuales */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-cyan-400" />
            <h3 className="text-white font-bold text-lg">Ingresos Mensuales</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ingresosMensuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                formatter={(value) => [`S/ ${value}`, 'Ingresos']}
              />
              <Legend />
              <Area type="monotone" dataKey="total" name="Ingresos" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de reclamos por tipo */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="text-cyan-400" />
            <h3 className="text-white font-bold text-lg">Reclamos por Tipo</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reclamosPorTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884D8"
                dataKey="cantidad"
                nameKey="tipo"
              >
                {reclamosPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                formatter={(value, name) => [`${value} reclamos`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de métodos de pago */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-cyan-400" />
          <h3 className="text-white font-bold text-lg">Métodos de Pago</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metodosPagoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#22D3EE" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'total') return [`S/ ${value}`, 'Total'];
                return [value, 'Cantidad'];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="value" name="Cantidad" fill="#FFBB28" />
            <Bar yAxisId="right" dataKey="total" name="Total (S/)" fill="#22D3EE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}