interface DebtCardProps {
  amount: number;
  dueDate: string;
  consumo: number;
}

export default function DebtCard({ amount, dueDate, consumo }: DebtCardProps) {
  return (
    <div className="card p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-paper-500 label">Deuda actual</p>
          <p className="text-3xl font-bold text-paper-900 mt-1">
            S/ {amount.toFixed(2)}
          </p>
        </div>
        <div className="badge-info text-xs">
          {consumo} m³ este mes
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-paper-200 mt-auto">
        <div className="flex items-center gap-1.5 text-sm text-paper-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Vence: {dueDate}</span>
        </div>
        <a href="/dashboard/pagos" className="btn-primary text-sm px-5 py-2">
          Pagar ahora
        </a>
      </div>
    </div>
  );
}