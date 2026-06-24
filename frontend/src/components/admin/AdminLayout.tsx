import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (user && user.tipo_usuario !== 'ADMIN') router.push('/dashboard');
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || !user || user.tipo_usuario !== 'ADMIN') {
    return (
      <div className="min-h-screen surface-1 flex items-center justify-center">
        <div className="text-paper-600 text-lg">Cargando panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen surface-1 flex">
      <Sidebar onLogout={logout} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header userName={user.nombres} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}