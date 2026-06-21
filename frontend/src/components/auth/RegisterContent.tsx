'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function RegisterContent() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
    sector: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirm_password) {
      setError('Las contrasenas no coinciden');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccessMessage('Usuario registrado exitosamente. Redirigiendo al inicio de sesion...');
      setFormData({
        dni: '', nombres: '', apellidos: '', telefono: '',
        email: '', direccion: '', sector: '', password: '', confirm_password: ''
      });
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setError(result.message || 'Error al registrar usuario');
    }

    setLoading(false);
  };

  const inputClass = "input-base w-full";
  const fieldClass = "space-y-1";
  const labelClass = "block text-sm font-medium text-paper-700";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-1">
      <div className="absolute inset-0 bg-[url('/assets/images/paper-texture.png')] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-pvc-blue flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-paper-900">Crear cuenta</h1>
            <p className="text-paper-600 mt-2">
              Registrate para acceder a los servicios de agua potable
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="badge-danger p-3 text-sm" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="badge-success p-3 text-sm" role="status">
                {successMessage}
              </div>
            )}

            <div className={fieldClass}>
              <label htmlFor="reg-dni" className={labelClass}>DNI *</label>
              <input
                id="reg-dni"
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleChange}
                className={inputClass}
                placeholder="12345678"
                required
                inputMode="numeric"
                maxLength={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="reg-nombres" className={labelClass}>Nombres *</label>
                <input
                  id="reg-nombres"
                  name="nombres"
                  type="text"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Juan"
                  required
                />
              </div>
              <div className={fieldClass}>
                <label htmlFor="reg-apellidos" className={labelClass}>Apellidos *</label>
                <input
                  id="reg-apellidos"
                  name="apellidos"
                  type="text"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Perez"
                  required
                />
              </div>
            </div>

            <div className={fieldClass}>
              <label htmlFor="reg-telefono" className={labelClass}>Telefono *</label>
              <input
                id="reg-telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className={inputClass}
                placeholder="987654321"
                required
              />
            </div>

            <div className={fieldClass}>
              <label htmlFor="reg-email" className={labelClass}>Email <span className="text-paper-400 font-normal">(opcional)</span></label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="juan@email.com"
              />
            </div>

            <div className={fieldClass}>
              <label htmlFor="reg-direccion" className={labelClass}>Direccion *</label>
              <input
                id="reg-direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                className={inputClass}
                placeholder="Calle Los Pinos 123"
                required
              />
            </div>

            <div className={fieldClass}>
              <label htmlFor="reg-sector" className={labelClass}>Sector *</label>
              <input
                id="reg-sector"
                name="sector"
                type="text"
                value={formData.sector}
                onChange={handleChange}
                className={inputClass}
                placeholder="Centro"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="reg-password" className={labelClass}>Contrasena *</label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="input-base w-full pr-10"
                    placeholder="........"
                    required
                    minLength={6}
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
              <div className={fieldClass}>
                <label htmlFor="reg-confirm-password" className={labelClass}>Confirmar *</label>
                <input
                  id="reg-confirm-password"
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="........"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="reg-show-password"
                type="checkbox"
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-paper-300 text-pvc-blue focus:ring-pvc-blue focus:ring-2"
              />
              <label htmlFor="reg-show-password" className="text-sm text-paper-700 cursor-pointer">
                Mostrar contrasenas
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="reg-terms"
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-paper-300 text-pvc-blue focus:ring-pvc-blue focus:ring-2"
                required
              />
              <label htmlFor="reg-terms" className="text-sm text-paper-700">
                Acepto los{' '}
                <a href="/terminos" className="text-pvc-blue hover:underline">terminos y condiciones</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-paper-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-pvc-blue hover:underline">
                Inicia sesion
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