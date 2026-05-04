// frontend/src/components/dashboard/Header.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  // Por ahora, sin notificaciones (vacío)
  const notifications: any[] = [];
  const unreadCount = 0;

  return (
    <header className="bg-white/20 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Título de la página (dinámico según la ruta) */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {router.pathname.includes('/perfil') ? 'Mi Perfil' :
               router.pathname.includes('/pagos') ? 'Pagos' :
               router.pathname.includes('/recibos') ? 'Mis Recibos' :
               router.pathname.includes('/reclamos') ? 'Mis Reclamos' :
               router.pathname.includes('/historial-pagos') ? 'Historial de Pagos' :
               'Dashboard'}
            </h1>
            <p className="text-white/60 text-sm">
              {router.pathname.includes('/perfil') ? 'Administra tu información personal' :
               router.pathname.includes('/pagos') ? 'Realiza tus pagos de agua' :
               router.pathname.includes('/recibos') ? 'Consulta tus facturas' :
               router.pathname.includes('/reclamos') ? 'Reporta y da seguimiento' :
               router.pathname.includes('/historial-pagos') ? 'Consulta todos tus pagos' :
               'Bienvenido al sistema de gestión de agua'}
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {/* Buscador */}
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/15 rounded-full transition"
              >
                <FaBell className="text-white text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <>
                  {/* Fondo semitransparente detrás del dropdown */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                    {/* Header del dropdown */}
                    <div className="p-4 border-b border-gray-700 bg-gray-800/95">
                      <h3 className="text-white font-semibold">Notificaciones</h3>
                    </div>
                    
                    {/* Lista de notificaciones - Estado vacío */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                          <FaBell className="text-gray-500 text-2xl" />
                        </div>
                        <p className="text-gray-400 font-medium">No hay notificaciones</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Cuando recibas notificaciones, aparecerán aquí
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/dashboard/notificaciones')}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition content-center w-full py-3 border-t border-gray-700 bg-gray-800/95"
                      >
                            Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Perfil */}
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-white text-3xl" />
              <div className="hidden md:block">
                <p className="text-white text-sm font-medium">{userName}</p>
                <p className="text-white/60 text-xs">Vecino</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;