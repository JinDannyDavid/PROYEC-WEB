// frontend/src/components/complaints/ComplaintFilters.tsx
import { FaFilter, FaTimes } from 'react-icons/fa';

interface ComplaintFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: 'todos', label: 'Todos', color: 'gray' },
  { value: 'PENDIENTE', label: 'Pendientes', color: 'orange' },
  { value: 'EN_PROCESO', label: 'En proceso', color: 'blue' },
  { value: 'RESUELTO', label: 'Resueltos', color: 'green' },
  { value: 'RECHAZADO', label: 'Rechazados', color: 'red' },
];

export default function ComplaintFilters({ selectedStatus, onStatusChange }: ComplaintFiltersProps) {
  const hasFilters = selectedStatus !== 'todos';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-white/60" />
          <span className="text-white/80 text-sm">Filtrar por estado:</span>
        </div>

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

        {hasFilters && (
          <button
            onClick={() => onStatusChange('todos')}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition text-sm"
          >
            <FaTimes /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}