// frontend/src/components/admin/ReclamoFilters.tsx
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

interface ReclamoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  selectedTipo: string;
  onTipoChange: (value: string) => void;
}

const estadoOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'RESUELTO', label: 'Resueltos' },
  { value: 'RECHAZADO', label: 'Rechazados' },
];

const tipoOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'FUGA', label: 'Fugas' },
  { value: 'CALIDAD_AGUA', label: 'Calidad del agua' },
  { value: 'MEDIDOR', label: 'Medidores' },
  { value: 'FACTURACION', label: 'Facturación' },
  { value: 'OTRO', label: 'Otros' },
];

export default function ReclamoFilters({
  searchTerm,
  onSearchChange,
  selectedEstado,
  onEstadoChange,
  selectedTipo,
  onTipoChange,
}: ReclamoFiltersProps) {
  const hasFilters = searchTerm !== '' || selectedEstado !== 'todos' || selectedTipo !== 'todos';

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
              placeholder="Buscar por usuario, DNI, dirección o descripción..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={selectedEstado}
            onChange={(e) => onEstadoChange(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {estadoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por tipo */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={selectedTipo}
            onChange={(e) => onTipoChange(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {tipoOptions.map((option) => (
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
              onEstadoChange('todos');
              onTipoChange('todos');
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