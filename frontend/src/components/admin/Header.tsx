import { useRouter } from 'next/router';
import { useState } from 'react';

interface HeaderProps {
  userName: string;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/usuarios': 'Gestion de Usuarios',
  '/admin/propiedades': 'Gestion de Propiedades',
  '/admin/facturas': 'Gestion de Facturas',
  '/admin/pagos': 'Registro de Pagos',
  '/admin/reclamos': 'Gestion de Reclamos',
  '/admin/reportes': 'Reportes y Estadisticas',
};

export default function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-paper-base border-b border-paper-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-paper-900">{pageTitles[router.pathname] || 'Administracion'}</h1>
            <p className="text-paper-500 text-sm">Bienvenido, {userName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar..."
                className="input-base pl-10 w-64"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-paper-500 hover:bg-paper-200 transition-colors"
                aria-label="Notificaciones"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 card z-50 overflow-hidden">
                    <div className="p-4 border-b border-paper-200">
                      <h3 className="font-semibold text-paper-900">Notificaciones</h3>
                    </div>
                    <div className="p-8 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-paper-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <p className="text-paper-600 font-medium">No hay notificaciones</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-paper-200">
              <div className="w-9 h-9 rounded-lg bg-pvc-blue flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-paper-900">{userName}</p>
                <p className="text-xs text-paper-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}