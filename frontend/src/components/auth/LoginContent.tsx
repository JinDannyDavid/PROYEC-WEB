'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(dni, password);

    if (!result.success) {
      setError(result.message || 'Error al iniciar sesion');
      setLoading(false);
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-1">
      <div className="absolute inset-0 bg-[url('/assets/images/paper-texture.png')] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-pvc-blue flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-paper-900">Iniciar sesion</h1>
            <p className="text-paper-600 mt-2">Ingresa tu DNI y contrasena para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="badge-danger p-3 text-sm" role="alert">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-paper-700 mb-1">
                DNI
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="dni"
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="input-base pl-10"
                  placeholder="12345678"
                  required
                  inputMode="numeric"
                  maxLength={8}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-paper-700 mb-1">
                Contrasena
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-10 pr-10"
                  placeholder="........"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-400 hover:text-paper-600"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-paper-300 text-pvc-blue focus:ring-pvc-blue focus:ring-2"
                />
                <span className="text-sm text-paper-700">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-pvc-blue hover:text-pvc-blue/80 underline"
                onClick={() => alert('Funcionalidad de recuperacion de contrasena en desarrollo.\nContacte al administrador: soporte@jasspalian.com')}
              >
                ¿Olvidaste tu contrasena?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            </button>

            <p className="text-center text-sm text-paper-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-medium text-pvc-blue hover:underline">
                Registrate aqui
              </Link>
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-paper-200">
            <p className="text-xs text-center text-paper-500">
              JASS Palian — Junta Administradora de Servicios de Saneamiento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}