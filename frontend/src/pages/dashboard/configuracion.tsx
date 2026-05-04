import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/SideBar';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Configuracion() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen water-gradient">
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 animate-float"
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

      <Sidebar onLogout={logout} />

      <div className="ml-72">
        <Header userName={user?.nombres || 'Usuario'} />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Configuración</h1>
            <p className="text-white/70">Personaliza tu experiencia</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preferencias Generales */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Preferencias</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Notificaciones</p>
                    <p className="text-white/60 text-sm">Recibir alertas de pagos y reclamos</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      notifications ? 'bg-cyan-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-300 mt-0.5 ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Modo Oscuro</p>
                    <p className="text-white/60 text-sm">Cambiar tema de la aplicación</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-cyan-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-300 mt-0.5 ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Métodos de Pago</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Yape</span>
                  <span className="text-green-400 text-sm">Conectado</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Plin</span>
                  <span className="text-yellow-400 text-sm">No conectado</span>
                </div>
                <button className="w-full mt-3 py-2 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600 transition">
                  Agregar método de pago
                </button>
              </div>
            </div>

            {/* Ayuda y Soporte */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">Ayuda y Soporte</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-white/5 rounded-lg text-white hover:bg-white/10 transition text-center">
                  📞 Contacto
                </button>
                <button className="p-4 bg-white/5 rounded-lg text-white hover:bg-white/10 transition text-center">
                  ❓ Preguntas Frecuentes
                </button>
                <button className="p-4 bg-white/5 rounded-lg text-white hover:bg-white/10 transition text-center">
                  📋 Términos y Condiciones
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}