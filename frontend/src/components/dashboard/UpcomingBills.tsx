interface Bill {
  id: number;
  period: string;
  amount: number;
  dueDate: string;
}

interface UpcomingBillsProps {
  bills: Bill[];
}

export default function UpcomingBills({ bills }: UpcomingBillsProps) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-paper-900 text-lg mb-4">Proximas facturas</h3>

      {bills.length === 0 ? (
        <p className="text-paper-500 text-sm py-4 text-center">No hay facturas pendientes</p>
      ) : (
        <div className="space-y-2">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-3 rounded-lg bg-paper-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-paper-900 text-sm">{bill.period}</p>
                  <p className="text-xs text-paper-500">Vence: {bill.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-paper-900">S/ {bill.amount.toFixed(2)}</p>
                <button className="text-xs font-medium text-pvc-blue hover:underline mt-0.5">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}