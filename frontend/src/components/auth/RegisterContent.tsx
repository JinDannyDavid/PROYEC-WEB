// src/components/auth/RegisterContent.tsx
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccessMessage('✅ ¡Usuario registrado exitosamente! Redirigiendo al login...');
      setFormData({
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
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(result.message || 'Error al registrar usuario');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo acuático */}
      <div className="absolute inset-0 water-gradient" />
      
      {/* Burbujas decorativas */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Formulario */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Crear Cuenta</h2>
          <p className="mt-2 text-white/70">Regístrate para acceder a todos los servicios</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              ❌ {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-200 text-sm">
              {successMessage}
            </div>
          )}

          {/* DNI */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">DNI *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-white/50" />
              </div>
              <input
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="12345678"
                required
              />
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Nombres *</label>
              <input
                name="nombres"
                type="text"
                value={formData.nombres}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Juan"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Apellidos *</label>
              <input
                name="apellidos"
                type="text"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Teléfono *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-white/50" />
              </div>
              <input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="987654321"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email (opcional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-white/50" />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="juan@email.com"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Dirección *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-white/50" />
              </div>
              <input
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Calle Los Pinos 123"
                required
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Sector *</label>
            <input
              name="sector"
              type="text"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Centro"
              required
            />
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-white/50" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Confirmar Contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-white/50" />
                </div>
                <input
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mostrar contraseñas */}
          <div className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
            />
            <span className="ml-2 text-sm text-white/70">Mostrar contraseñas</span>
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400" 
              required 
            />
            <span className="ml-2 text-sm text-white/70">
              Acepto los <a href="#" className="text-cyan-300 hover:text-cyan-200">términos y condiciones</a>
            </span>
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          {/* Enlace a login */}
          <p className="text-center text-white/70">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold">
              Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}