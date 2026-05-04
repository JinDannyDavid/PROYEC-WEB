import { FaCheckCircle, FaClock } from 'react-icons/fa';

interface Payment {
  id: number;
  date: string;
  amount: number;
  status: 'pagado' | 'pendiente';
  method: string;
}

interface RecentPaymentsProps {
  payments: Payment[];
}

const RecentPayments = ({ payments }: RecentPaymentsProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Últimos Pagos</h3>
      
      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              {payment.status === 'pagado' ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaClock className="text-yellow-400" />
              )}
              <div>
                <p className="text-white font-medium">S/ {payment.amount.toFixed(2)}</p>
                <p className="text-white/60 text-xs">{payment.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                payment.status === 'pagado' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {payment.status === 'pagado' ? 'Pagado' : 'Pendiente'}
              </span>
              <p className="text-white/50 text-xs mt-1">{payment.method}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-center text-cyan-300 hover:text-cyan-200 text-sm transition">
        Ver historial completo →
      </button>
    </div>
  );
};

export default RecentPayments;