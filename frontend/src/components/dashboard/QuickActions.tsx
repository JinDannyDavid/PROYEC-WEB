import { FaChartLine, FaExclamationTriangle, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';

const actions = [
  { icon: FaMoneyBillWave, label: 'Pagar', color: 'from-green-500 to-green-600', href: '/dashboard/pagos' },
  { icon: FaReceipt, label: 'Recibos', color: 'from-blue-500 to-blue-600', href: '/dashboard/recibos' },
  { icon: FaExclamationTriangle, label: 'Reclamos', color: 'from-orange-500 to-orange-600', href: '/dashboard/reclamos' },
  { icon: FaChartLine, label: 'Consumo', color: 'from-purple-500 to-purple-600', href: '/dashboard/consumo' },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.href}
          className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white text-center hover:scale-105 transition-transform duration-300 shadow-lg`}
        >
          <action.icon className="text-2xl mx-auto mb-2" />
          <span className="font-semibold">{action.label}</span>
        </a>
      ))}
    </div>
  );
};

export default QuickActions;