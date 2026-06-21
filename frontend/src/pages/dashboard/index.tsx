import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useFacturasPendientes, useMisPagos } from '@/hooks/useApi';
import Sidebar from '@/components/dashboard/SideBar';
import Header from '@/components/dashboard/Header';
import DebtCard from '@/components/dashboard/DebtCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentPayments from '@/components/dashboard/RecentPayments';
import UpcomingBills from '@/components/dashboard/UpcomingBills';
import ConsumptionChart from '@/components/dashboard/ConsumptionChart';

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

  const { data: facturas = [], loading: cargandoFacturas, error: errorFacturas } = useFacturasPendientes();
  const { data: pagos = [], loading: cargandoPagos } = useMisPagos();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  const facturasArray = Array.isArray(facturas) ? facturas : [];
  const pagosArray = Array.isArray(pagos) ? pagos : [];

  const totalDeuda = facturasArray.reduce((sum, f) => sum + (f.monto_total || 0), 0);
  const ultimosPagos = pagosArray.slice(0, 3).map((p: Pago) => ({
    id: p.id,
    date: new Date(p.fecha_pago).toLocaleDateString('es-PE'),
    amount: p.monto,
    status: 'pagado' as const,
    method: p.metodo_pago,
  }));

  const bills = facturasArray.slice(0, 4).map((f: Factura) => ({
    id: f.id,
    period: f.periodo,
    amount: f.monto_total,
    dueDate: new Date(f.fecha_vencimiento).toLocaleDateString('es-PE'),
  }));

  if (authLoading || cargandoFacturas || cargandoPagos) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen surface-1 flex">
      <Sidebar onLogout={handleLogout} />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header userName={`${user.nombres} ${user.apellidos}`} />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DebtCard
              amount={totalDeuda}
              dueDate={facturasArray[0]?.fecha_vencimiento
                ? new Date(facturasArray[0].fecha_vencimiento).toLocaleDateString('es-PE')
                : '—'}
              consumo={28}
            />
            <RecentPayments payments={ultimosPagos} />
          </div>

          <div className="mb-6">
            <QuickActions />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingBills bills={bills} />
            <ConsumptionChart
              data={[
                { month: 'Ene', consumption: 22 },
                { month: 'Feb', consumption: 25 },
                { month: 'Mar', consumption: 28 },
                { month: 'Abr', consumption: 24 },
                { month: 'May', consumption: 30 },
                { month: 'Jun', consumption: 26 },
              ]}
            />
          </div>

          <div className="mt-6 card p-4 text-center">
            <p className="text-sm text-paper-600">
              Oficina: (064) 123-4567 | soporte@jasspalian.com
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}