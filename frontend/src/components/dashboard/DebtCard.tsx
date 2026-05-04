import { FaCalendarAlt } from 'react-icons/fa';

interface DebtCardProps {
  amount: number;
  dueDate: string;
  consumption: number;
}

const DebtCard = ({ amount, dueDate, consumption }: DebtCardProps) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/80 text-sm">Deuda Actual</p>
          <p className="text-3xl font-bold">S/ {amount.toFixed(2)}</p>
        </div>
        <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
          {consumption} m³ este mes
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-white/80" />
          <span className="text-sm">Vence: {dueDate}</span>
        </div>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          Pagar Ahora
        </button>
      </div>
    </div>
  );
};

export default DebtCard;