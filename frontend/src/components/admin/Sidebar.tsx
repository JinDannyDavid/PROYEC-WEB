// frontend/src/components/admin/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaChartLine,
  FaExclamationTriangle,
  FaFileInvoice,
  FaHome,
  FaMoneyBillWave,
  FaHome as FaProperty,
  FaSignOutAlt, FaTint,
  FaUsers
} from 'react-icons/fa';

interface SidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: FaHome },
  { name: 'Usuarios', path: '/admin/usuarios', icon: FaUsers },
  { name: 'Propiedades', path: '/admin/propiedades', icon: FaProperty },
  { name: 'Facturas', path: '/admin/facturas', icon: FaFileInvoice },
  { name: 'Pagos', path: '/admin/pagos', icon: FaMoneyBillWave },
  { name: 'Reclamos', path: '/admin/reclamos', icon: FaExclamationTriangle },
  { name: 'Reportes', path: '/admin/reportes', icon: FaChartLine },
];

const Sidebar = ({ onLogout }: SidebarProps) => {
  const router = useRouter();

  return (
    <aside className="w-72 bg-gray-900 min-h-screen fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
            <FaTint className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">JASS Palian</h1>
            <p className="text-gray-400 text-xs">Panel de Administración</p>
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
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 w-full mt-8 border-t border-gray-700 pt-6"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;