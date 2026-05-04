import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600">
        <div className="absolute inset-0 bg-[url('/assets/wave-pattern.svg')] opacity-10 animate-wave bg-repeat-x" />
      </div>
      
      {/* Burbujas grandes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white/10 ${
              i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'
            }`}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-float">
          <div className="w-40 h-40 mx-auto mb-8 rounded-full flex items-center justify-center p-2">
            <img 
              src="/assets/images/logo_jass_1.png" 
              alt="JASS Palian" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          JASS <span className="text-cyan-300">Palian</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4">
          Junta Administradora de Servicios de Saneamiento
        </p>

        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
          Gestiona tus pagos, reporta reclamos y mantente informado sobre el servicio de agua potable en tu comunidad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Comenzar Ahora
            </button>
          </Link>
          <Link href="#servicios">
            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Ver Servicios
            </button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <FaChevronDown className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default HeroSection;