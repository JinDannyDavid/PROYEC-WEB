// frontend/src/components/notifications/NotificationFilters.tsx
import { FaFilter, FaTimes } from 'react-icons/fa';

interface NotificationFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  totalCount: number;
  unreadCount: number;
}

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'no-leidas', label: 'No leídas' },
];

export default function NotificationFilters({ selectedFilter, onFilterChange, totalCount, unreadCount }: NotificationFiltersProps) {
  const hasFilters = selectedFilter !== 'todas';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-white/60" />
          <span className="text-white/80 text-sm">Filtrar por:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedFilter === filter.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {filter.label}
              {filter.id === 'no-leidas' && unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
              {filter.id === 'todas' && totalCount > 0 && (
                <span className="ml-2 text-white/50 text-xs">({totalCount})</span>
              )}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => onFilterChange('todas')}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition text-sm"
          >
            <FaTimes /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}