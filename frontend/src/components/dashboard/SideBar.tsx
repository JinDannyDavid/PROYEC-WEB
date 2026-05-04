import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaCog,
  FaExclamationTriangle,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaSignOutAlt,
  FaUser,
  FaWater
} from 'react-icons/fa';

const menuItems = [
  { name: 'Inicio', path: '/dashboard', icon: FaHome },
  { name: 'Pagos', path: '/dashboard/pagos', icon: FaMoneyBillWave },
  { name: 'Recibos', path: '/dashboard/recibos', icon: FaReceipt },
  { name: 'Reclamos', path: '/dashboard/reclamos', icon: FaExclamationTriangle },
  { name: 'Perfil', path: '/dashboard/perfil', icon: FaUser },
  { name: 'Configuración', path: '/dashboard/configuracion', icon: FaCog },
];

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const router = useRouter();

  return (
    <aside className="w-72 bg-white/10 backdrop-blur-lg border-r border-white/20 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/20">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
            <FaWater className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">JASS Palian</h1>
            <p className="text-white/60 text-xs">Portal de Vecinos</p>
          </div>
        </div>

        {/* Menú */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón cerrar sesión */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 w-full mt-8 border-t border-white/20 pt-6"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;