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

export default function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-paper-900 text-lg mb-4">Ultimos pagos</h3>

      {payments.length === 0 ? (
        <p className="text-paper-500 text-sm py-4 text-center">No hay pagos registrados</p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-paper-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  payment.status === 'pagado' ? 'bg-canal-ok/10 text-canal-ok' : 'bg-alert/10 text-alert'
                }`}>
                  {payment.status === 'pagado' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-paper-900 text-sm">S/ {payment.amount.toFixed(2)}</p>
                  <p className="text-xs text-paper-500">{payment.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`badge text-xs ${
                  payment.status === 'pagado' ? 'badge-success' : 'badge-warning'
                }`}>
                  {payment.status === 'pagado' ? 'Pagado' : 'Pendiente'}
                </span>
                <p className="text-xs text-paper-400 mt-1">{payment.method}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href="/dashboard/historial-pagos"
        className="block w-full text-center mt-4 text-sm font-medium text-pvc-blue hover:underline"
      >
        Ver historial completo →
      </a>
    </div>
  );
}