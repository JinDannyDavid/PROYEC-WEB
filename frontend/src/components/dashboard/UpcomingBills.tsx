import { FaFileInvoiceDollar } from 'react-icons/fa';

interface Bill {
  id: number;
  period: string;
  amount: number;
  dueDate: string;
}

interface UpcomingBillsProps {
  bills: Bill[];
}

const UpcomingBills = ({ bills }: UpcomingBillsProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Próximas Facturas</h3>
      
      <div className="space-y-3">
        {bills.map((bill) => (
          <div key={bill.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <FaFileInvoiceDollar className="text-cyan-400" />
              <div>
                <p className="text-white font-medium">{bill.period}</p>
                <p className="text-white/60 text-xs">Vence: {bill.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">S/ {bill.amount.toFixed(2)}</p>
              <button className="text-xs text-cyan-300 hover:text-cyan-200 mt-1">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingBills;