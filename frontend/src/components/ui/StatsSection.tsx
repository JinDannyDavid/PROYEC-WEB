import { FaChartLine, FaHandsHelping, FaTint, FaUsers } from 'react-icons/fa';

const stats = [
  { icon: FaUsers, number: '1,500+', label: 'Familias Beneficiadas' },
  { icon: FaTint, number: '50,000+', label: 'm³ Suministrados' },
  { icon: FaHandsHelping, number: '98%', label: 'Satisfacción' },
  { icon: FaChartLine, number: '100%', label: 'Digitalizado' },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="text-cyan-300 text-2xl" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;