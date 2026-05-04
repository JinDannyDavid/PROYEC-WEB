import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full">
                <img 
                  src="/assets/images/logo_jass.png" 
                  alt="JASS Palian" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-lg">JASS Palian</span>
            </div>
            <p className="text-white/60 text-sm">
              Junta Administradora de Servicios de Saneamiento de Palian
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Iniciar Sesión</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Registrarse</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition">Política de Privacidad</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Horario de Atención</h3>
            <p className="text-white/60 text-sm">
              Lunes a Viernes: 8am - 4pm<br />
              Sábados: 9am - 12pm
            </p>
          </div>
        </div>
        
        <div className="text-center text-white/40 text-sm pt-8 border-t border-white/10">
          <p>© {new Date().getFullYear()} JASS Palian. Todos los derechos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Hecho con <FaHeart className="text-red-400 text-xs" /> para la comunidad de Palian
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;