// frontend/src/components/receipts/ReceiptFilters.tsx
import { FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';

interface ReceiptFiltersProps {
  availableYears: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: 'todos', label: 'Todos', color: 'gray' },
  { value: 'PENDIENTE', label: 'Pendientes', color: 'orange' },
  { value: 'PAGADA', label: 'Pagadas', color: 'green' },
  { value: 'VENCIDA', label: 'Vencidas', color: 'red' },
];

export default function ReceiptFilters({
  availableYears,
  selectedYear,
  onYearChange,
  selectedStatus,
  onStatusChange,
}: ReceiptFiltersProps) {
  const hasFilters = selectedYear !== 'todos' || selectedStatus !== 'todos';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-white/60" />
          <span className="text-white/80 text-sm">Filtrar por:</span>
        </div>

        {/* Filtro de año */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-white/60" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="todos" className="bg-gray-800">Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year} className="bg-gray-800">
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de estado */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === status.value
                  ? `bg-${status.color}-500 text-white shadow-lg`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={() => {
              onYearChange('todos');
              onStatusChange('todos');
            }}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition text-sm"
          >
            <FaTimes /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}