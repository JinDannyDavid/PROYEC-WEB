// frontend/src/components/admin/Header.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (router.pathname === '/admin') return 'Dashboard';
    if (router.pathname === '/admin/usuarios') return 'Gestión de Usuarios';
    if (router.pathname === '/admin/propiedades') return 'Gestión de Propiedades';
    if (router.pathname === '/admin/facturas') return 'Gestión de Facturas';
    if (router.pathname === '/admin/pagos') return 'Registro de Pagos';
    if (router.pathname === '/admin/reclamos') return 'Gestión de Reclamos';
    if (router.pathname === '/admin/reportes') return 'Reportes y Estadísticas';
    return 'Administración';
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400 text-sm">Bienvenido, {userName}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Buscador */}
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-700 rounded-full transition"
              >
                <FaBell className="text-gray-300 text-xl" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Notificaciones</h3>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-gray-400">No hay notificaciones</p>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-gray-300 text-3xl" />
              <div className="hidden md:block">
                <p className="text-white text-sm font-medium">{userName}</p>
                <p className="text-gray-400 text-xs">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;