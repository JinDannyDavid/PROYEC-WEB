import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useState } from 'react';

export default function Configuracion() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-lg text-paper-900 mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-paper-900">Notificaciones</p>
                <p className="text-sm text-paper-500">Recibir alertas de pagos y reclamos</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-pvc-blue' : 'bg-paper-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform mt-0.5 ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-paper-900">Modo oscuro</p>
                <p className="text-sm text-paper-500">Cambiar tema de la aplicacion</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-pvc-blue' : 'bg-paper-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform mt-0.5 ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg text-paper-900 mb-4">Metodos de pago</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-paper-200">
              <span className="text-paper-900 font-medium">Yape</span>
              <span className="text-sm text-canal-ok font-medium">Conectado</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-paper-200">
              <span className="text-paper-900 font-medium">Plin</span>
              <span className="text-sm text-alert font-medium">No conectado</span>
            </div>
            <button className="btn-outline w-full mt-2">
              Agregar metodo de pago
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg text-paper-900 mb-4">Ayuda y soporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 rounded-lg bg-paper-200 text-paper-700 hover:bg-paper-300 transition text-sm font-medium text-center">
              Contacto
            </button>
            <button className="p-4 rounded-lg bg-paper-200 text-paper-700 hover:bg-paper-300 transition text-sm font-medium text-center">
              Preguntas frecuentes
            </button>
            <button className="p-4 rounded-lg bg-paper-200 text-paper-700 hover:bg-paper-300 transition text-sm font-medium text-center">
              Terminos y condiciones
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}