import dynamic from 'next/dynamic';

const RegisterContent = dynamic(() => import('@/components/auth/RegisterContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center surface-1">
      <div className="text-paper-600 text-lg">Cargando...</div>
    </div>
  ),
});

export default function Register() {
  return <RegisterContent />;
}