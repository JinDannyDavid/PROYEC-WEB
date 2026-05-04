import { FaCheckCircle, FaUsers, FaWater } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-20 bg-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Quiénes <span className="text-cyan-300">Somos</span>?
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              La Junta Administradora de Servicios de Saneamiento (JASS) Palian es una 
              organización comunitaria encargada de administrar el servicio de agua potable 
              en el sector de Palian, Huancayo.
            </p>
            <p className="text-white/80 mb-6 leading-relaxed">
              Nuestra misión es garantizar el acceso al agua potable mediante una gestión 
              eficiente, transparente y sostenible, trabajando de la mano con la comunidad.
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <FaCheckCircle className="text-cyan-300 text-xl" />
                <span className="text-white">Compromiso con la comunidad</span>
              </div>
              <div className="flex gap-3 items-center">
                <FaCheckCircle className="text-cyan-300 text-xl" />
                <span className="text-white">Gestión transparente</span>
              </div>
              <div className="flex gap-3 items-center">
                <FaCheckCircle className="text-cyan-300 text-xl" />
                <span className="text-white">Tecnología al servicio del vecino</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-float">
                <FaWater className="text-white text-8xl opacity-50" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaUsers className="text-cyan-300 text-4xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;