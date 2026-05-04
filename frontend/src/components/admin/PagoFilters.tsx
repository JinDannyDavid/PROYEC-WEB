// frontend/src/components/admin/PagoFilters.tsx
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

interface PagoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedMetodo: string;
  onMetodoChange: (value: string) => void;
}

const metodoOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'EFECTIVO', label: 'Efectivo' },
];

export default function PagoFilters({
  searchTerm,
  onSearchChange,
  selectedMetodo,
  onMetodoChange,
}: PagoFiltersProps) {
  const hasFilters = searchTerm !== '' || selectedMetodo !== 'todos';

  return (
    <div className="bg-gray-800 rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscador */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por código de operación, factura o dirección..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Filtro por método */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={selectedMetodo}
            onChange={(e) => onMetodoChange(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {metodoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onMetodoChange('todos');
            }}
            className="flex items-center gap-1 px-3 py-2 bg-gray-700 rounded-lg text-gray-400 hover:bg-gray-600 transition"
          >
            <FaTimes /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}