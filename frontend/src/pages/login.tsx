import dynamic from 'next/dynamic';

// Importa el componente de login sin SSR
const LoginContent = dynamic(() => import('@/components/auth/LoginContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600">
      <div className="text-white text-xl">Cargando...</div>
    </div>
  ),
});

export default function Login() {
  return <LoginContent />;
}