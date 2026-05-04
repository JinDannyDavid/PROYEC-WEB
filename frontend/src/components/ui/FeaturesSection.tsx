import { FaHeadset, FaMoneyBillWave, FaNewspaper, FaQrcode, FaShieldAlt, FaWater } from 'react-icons/fa';

const features = [
  { icon: FaWater, title: 'Gestión de Agua', description: 'Controla tu consumo y mantente al día con tus pagos.', color: 'from-blue-400 to-blue-600' },
  { icon: FaMoneyBillWave, title: 'Pagos Digitales', description: 'Paga con Yape, Plin o transferencia bancaria.', color: 'from-green-400 to-green-600' },
  { icon: FaQrcode, title: 'Código QR', description: 'Escanea y paga al instante desde tu celular.', color: 'from-purple-400 to-purple-600' },
  { icon: FaHeadset, title: 'Soporte 24/7', description: 'Atención personalizada para resolver tus dudas.', color: 'from-orange-400 to-orange-600' },
  { icon: FaNewspaper, title: 'Noticias y Alertas', description: 'Infórmate sobre cortes y novedades.', color: 'from-red-400 to-red-600' },
  { icon: FaShieldAlt, title: 'Seguridad', description: 'Tus datos están protegidos y seguros.', color: 'from-indigo-400 to-indigo-600' },
];

const FeaturesSection = () => {
  return (
    <section id="servicios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-cyan-300">Servicios</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Ofrecemos una plataforma completa para la gestión del servicio de agua potable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 group"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;