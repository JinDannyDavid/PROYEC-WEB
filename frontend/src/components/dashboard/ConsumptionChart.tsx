import { FaWater } from 'react-icons/fa';

interface ConsumptionData {
  month: string;
  consumption: number;
}

interface ConsumptionChartProps {
  data: ConsumptionData[];
}

const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  const maxConsumption = Math.max(...data.map(d => d.consumption));

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaWater className="text-cyan-400 text-xl" />
        <h3 className="text-white font-semibold text-lg">Consumo de Agua</h3>
      </div>

      <div className="h-64 flex items-end gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-gradient-to-t from-cyan-400 to-blue-500 rounded-lg transition-all duration-500 hover:from-cyan-500 hover:to-blue-600"
              style={{ height: `${(item.consumption / maxConsumption) * 200}px` }}
            />
            <span className="text-white/70 text-sm">{item.month}</span>
            <span className="text-white text-xs font-semibold">{item.consumption}m³</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumptionChart;