import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import Sidebar from './SideBar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen surface-1 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header userName={`${user.nombres} ${user.apellidos}`} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}