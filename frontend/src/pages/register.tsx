// src/pages/register.tsx
import dynamic from 'next/dynamic';

const RegisterContent = dynamic(() => import('@/components/auth/RegisterContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600">
      <div className="text-white text-xl">Cargando...</div>
    </div>
  ),
});

export default function Register() {
  return <RegisterContent />;
}