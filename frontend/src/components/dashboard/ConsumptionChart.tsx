interface ConsumptionData {
  month: string;
  consumption: number;
}

interface ConsumptionChartProps {
  data: ConsumptionData[];
}

export default function ConsumptionChart({ data }: ConsumptionChartProps) {
  const maxConsumption = Math.max(...data.map((d) => d.consumption));

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-canal-ok/10 text-canal-ok flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="font-semibold text-paper-900">Consumo de agua</h3>
      </div>

      <div className="h-48 flex items-end gap-4">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-paper-900">{item.consumption}</span>
            <div
              className="w-full rounded-md bg-canal-ok transition-all duration-500 hover:bg-canal-ok/80"
              style={{ height: `${(item.consumption / maxConsumption) * 160}px` }}
            />
            <span className="text-xs text-paper-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}