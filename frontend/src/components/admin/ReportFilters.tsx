// frontend/src/components/admin/ReportFilters.tsx
import { FaCalendarAlt } from 'react-icons/fa';

interface ReportFiltersProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const years = [2023, 2024, 2025, 2026];

export default function ReportFilters({ selectedYear, onYearChange }: ReportFiltersProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <span className="text-gray-300 text-sm">Filtrar por año:</span>
        </div>
        <div className="flex gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedYear === year
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}