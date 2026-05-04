// frontend/src/components/payments/PaymentHistoryFilters.tsx
import { FaFilter, FaTimes } from 'react-icons/fa';

interface PaymentHistoryFiltersProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const methodOptions = [
  { value: 'todos', label: 'Todos', color: 'gray' },
  { value: 'YAPE', label: 'Yape', color: 'green' },
  { value: 'PLIN', label: 'Plin', color: 'purple' },
  { value: 'TRANSFERENCIA', label: 'Transferencia', color: 'blue' },
  { value: 'EFECTIVO', label: 'Efectivo', color: 'orange' },
];

export default function PaymentHistoryFilters({ selectedMethod, onMethodChange }: PaymentHistoryFiltersProps) {
  const hasFilters = selectedMethod !== 'todos';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-white/60" />
          <span className="text-white/80 text-sm">Filtrar por método:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {methodOptions.map((method) => (
            <button
              key={method.value}
              onClick={() => onMethodChange(method.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedMethod === method.value
                  ? `bg-${method.color}-500 text-white shadow-lg`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => onMethodChange('todos')}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition text-sm"
          >
            <FaTimes /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
}