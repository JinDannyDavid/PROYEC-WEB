// src/pages/dashboard/index.tsx
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Factura {
  id: number;
  numero_factura: string;
  periodo: string;
  monto_total: number;
  fecha_vencimiento: string;
  estado: string;
}

interface Pago {
  id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargandoFacturas, setCargandoFacturas] = useState(true);
  const [cargandoPagos, setCargandoPagos] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Cargar facturas pendientes
  useEffect(() => {
    if (!user) return;
    
    const fetchFacturas = async () => {
      try {
        const response = await api.get('/facturas/pendientes/');
        
        // ✅ Manejar diferentes formatos de respuesta
        let facturasData = [];
        if (Array.isArray(response.data)) {
          facturasData = response.data;
        } else if (response.data.results) {
          facturasData = response.data.results;
        } else {
          facturasData = [];
        }
        
        setFacturas(facturasData);
      } catch (err) {
        console.error('Error al cargar facturas:', err);
        setError('No se pudieron cargar las facturas');
      } finally {
        setCargandoFacturas(false);
      }
    };
    
    fetchFacturas();
  }, [user]);

  // Cargar historial de pagos
  useEffect(() => {
    if (!user) return;
    
    const fetchPagos = async () => {
      try {
        const response = await api.get('/mis-pagos/');
        
        // ✅ Manejar diferentes formatos de respuesta
        let pagosData = [];
        if (Array.isArray(response.data)) {
          pagosData = response.data;
        } else if (response.data.results) {
          pagosData = response.data.results;
        } else {
          pagosData = [];
        }
        
        setPagos(pagosData);
      } catch (err) {
        console.error('Error al cargar pagos:', err);
      } finally {
        setCargandoPagos(false);
      }
    };
    
    fetchPagos();
  }, [user]);

  // ✅ Asegurar que facturas es un array antes de usar reduce
  const facturasArray = Array.isArray(facturas) ? facturas : [];
  const pagosArray = Array.isArray(pagos) ? pagos : [];
  
  const totalDeuda = facturasArray.reduce((sum, f) => sum + (f.monto_total || 0), 0);
  const ultimosPagos = pagosArray.slice(0, 3);

  if (authLoading || cargandoFacturas || cargandoPagos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dashboard JASS Palian</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('access_token');
              document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              router.push('/login');
            }}
            className="text-white/70 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto p-6">
        {/* Bienvenida */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            ¡Bienvenido, {user.nombres} {user.apellidos}!
          </h2>
          <p className="text-white/70">DNI: {user.dni} | {user.email || 'Sin email'}</p>
        </div>

        {/* Resumen de deuda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6">
            <p className="text-white/80 text-sm">Deuda Actual</p>
            <p className="text-white text-3xl font-bold">S/ {totalDeuda.toFixed(2)}</p>
            <p className="text-white/70 text-sm mt-2">{facturasArray.length} factura(s) pendiente(s)</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <p className="text-white/80 text-sm">Últimos pagos</p>
            {ultimosPagos.length === 0 ? (
              <p className="text-white/60 text-sm mt-2">No hay pagos registrados</p>
            ) : (
              <div className="mt-2 space-y-1">
                {ultimosPagos.map((pago) => (
                  <div key={pago.id} className="flex justify-between">
                    <span className="text-white/70 text-sm">{new Date(pago.fecha_pago).toLocaleDateString('es-PE')}</span>
                    <span className="text-white font-semibold">S/ {pago.monto.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <a href="/dashboard/pagos" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💰</div>
            <div className="text-white font-semibold text-sm">Pagar</div>
          </a>
          <a href="/dashboard/historial-pagos" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <div className="text-white font-semibold text-sm">Historial</div>
          </a>
          <a href="/dashboard/recibos" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
            <div className="text-white font-semibold text-sm">Recibos</div>
          </a>
          <a href="/dashboard/reclamos" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
            <div className="text-white font-semibold text-sm">Reclamos</div>
          </a>
          <a href="/dashboard/perfil" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
            <div className="text-white font-semibold text-sm">Perfil</div>
          </a>
        </div>

        {/* Contacto */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center">
          <p className="text-white/70 text-sm">
            📞 Oficina: (064) 123-4567 | ✉️ soporte@jasspalian.com
          </p>
        </div>
      </div>
    </div>
  );
}