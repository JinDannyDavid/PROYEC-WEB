// src/pages/test-api.tsx
import { useEffect, useState } from 'react';

export default function TestAPI() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasToken, setHasToken] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // ✅ Verificar token solo en el cliente
  useEffect(() => {
    setHasToken(!!localStorage.getItem('access_token'));
  }, []);

  const testEndpoint = async (url: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const token = localStorage.getItem('access_token');
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log(`🟡 Probando: ${method} ${API_URL}/${url}`);
      const res = await fetch(`${API_URL}/${url}`, options);
      const data = await res.json();
      
      console.log(`🟢 Respuesta:`, data);
      setResponse({ url, status: res.status, data });
      
      // Actualizar estado del token después del login
      if (url === 'token/' && res.status === 200) {
        setHasToken(true);
      }
    } catch (err: any) {
      console.error(`🔴 Error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🧪 Prueba de Endpoints API</h1>
        
        {/* Estado actual */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
          <p className="text-white">🔗 API URL: <span className="font-mono text-sm">{API_URL}</span></p>
          <p className="text-white mt-1">🔑 Token: {hasToken ? '✅ Presente' : '❌ No hay token'}</p>
        </div>

        {/* Botones de prueba */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {/* Autenticación */}
          <button
            onClick={() => testEndpoint('token/', 'POST', { dni: '74185296', password: 'miau123#' })}
            disabled={loading}
            className="p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:opacity-50"
          >
            1. POST /token/ (ADMIN)
          </button>

          {/* Perfil */}
          <button
            onClick={() => testEndpoint('perfil/')}
            disabled={loading}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
          >
            2. GET /perfil/
          </button>

          {/* Propiedades */}
          <button
            onClick={() => testEndpoint('mis-propiedades/')}
            disabled={loading}
            className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
          >
            3. GET /mis-propiedades/
          </button>

          {/* Facturas pendientes */}
          <button
            onClick={() => testEndpoint('facturas/pendientes/')}
            disabled={loading}
            className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50"
          >
            4. GET /facturas/pendientes/
          </button>

          {/* Historial de pagos */}
          <button
            onClick={() => testEndpoint('mis-pagos/')}
            disabled={loading}
            className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            5. GET /mis-pagos/
          </button>

          {/* Reclamos */}
          <button
            onClick={() => testEndpoint('mis-reclamos/')}
            disabled={loading}
            className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50"
          >
            6. GET /mis-reclamos/
          </button>

          {/* Notificaciones */}
          <button
            onClick={() => testEndpoint('mis-notificaciones/')}
            disabled={loading}
            className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50"
          >
            7. GET /mis-notificaciones/
          </button>

          {/* Test de conexión */}
          <button
            onClick={() => testEndpoint('test/')}
            disabled={loading}
            className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 disabled:opacity-50"
          >
            8. GET /test/
          </button>
        </div>

        {/* Resultado */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="text-white text-xl">Cargando...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-4">
            <p className="text-red-200 font-semibold">❌ Error</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white font-semibold">
                📡 {response.url}
              </p>
              <span className={`px-2 py-1 rounded text-xs ${response.status >= 200 && response.status < 300 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                Status: {response.status}
              </span>
            </div>
            <pre className="bg-black/30 p-3 rounded-lg text-white/80 text-xs overflow-auto max-h-96">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-white text-sm">
            💡 <strong>Instrucciones:</strong>
          </p>
          <ul className="text-white/70 text-sm mt-2 list-disc list-inside">
            <li>Primero haz clic en <strong>"1. POST /token/"</strong> para obtener token</li>
            <li>Luego prueba los demás endpoints</li>
            <li>Los tokens se guardan automáticamente en localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}