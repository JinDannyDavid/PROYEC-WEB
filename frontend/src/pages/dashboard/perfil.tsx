// frontend/src/pages/dashboard/perfil.tsx
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/SideBar';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useAuth } from '@/contexts/AuthContext';
import { userService, Usuario } from '@/services/userService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClipboardList, FaEnvelope, FaIdCard, FaLock, FaMapMarkerAlt, FaMoneyBillWave, FaPhone, FaUserCircle, FaUserEdit, FaWater } from 'react-icons/fa';

export default function PerfilPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'VECINO') {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      cargarPerfil();
    }
  }, [user]);

  const cargarPerfil = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await userService.getPerfil();
      setPerfil(data);
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError('No se pudieron cargar los datos del perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleUpdatePerfil = async (data: Partial<Usuario>) => {
    try {
      const updated = await userService.updatePerfil(data);
      setPerfil(updated);
      toast.success('Perfil actualizado correctamente');
      setEditModalOpen(false);
    } catch (err) {
      toast.error('Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (data: { password_actual: string; nueva_password: string; confirm_password: string }) => {
    const result = await userService.changePassword(data);
    if (result.success) {
      toast.success('Contraseña cambiada correctamente');
      setPasswordModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando perfil...</div>
      </div>
    );
  }

  if (!user || !perfil || user.tipo_usuario !== 'VECINO') return null;

  const fechaRegistro = new Date(perfil.fecha_registro).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar onLogout={handleLogout} />

      {/* Contenido principal con margen para el sidebar */}
      <div className="ml-72">
        <Header userName={user.nombres} />

        <main className="p-6">
          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-2xl p-4 mb-6 text-center">
              <p className="text-red-200">{error}</p>
              <button
                onClick={cargarPerfil}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded-lg text-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <FaCalendarAlt className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Miembro desde</p>
                  <p className="text-white font-semibold">{fechaRegistro}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FaMoneyBillWave className="text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total pagado</p>
                  <p className="text-white font-semibold">S/ 0.00</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <FaClipboardList className="text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Reclamos</p>
                  <p className="text-white font-semibold">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Información Personal</h2>
              <p className="text-white/60 text-sm">Tus datos de contacto y dirección</p>
            </div>

            <div className="p-6">
              {/* Foto y nombre */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  {perfil.foto_url ? (
                    <img src={perfil.foto_url} alt="Perfil" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="text-cyan-400 text-5xl" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{perfil.nombres} {perfil.apellidos}</h3>
                  <p className="text-white/60">{perfil.tipo_usuario === 'VECINO' ? 'Vecino' : perfil.tipo_usuario}</p>
                </div>
              </div>

              {/* Datos personales - Grid de 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-cyan-400 w-5" />
                  <div>
                    <p className="text-white/60 text-sm">DNI</p>
                    <p className="text-white font-medium">{perfil.dni}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-cyan-400 w-5" />
                  <div>
                    <p className="text-white/60 text-sm">Teléfono</p>
                    <p className="text-white font-medium">{perfil.telefono}</p>
                  </div>
                </div>

                {perfil.email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-cyan-400 w-5" />
                    <div>
                      <p className="text-white/60 text-sm">Correo electrónico</p>
                      <p className="text-white font-medium">{perfil.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-cyan-400 w-5" />
                  <div>
                    <p className="text-white/60 text-sm">Dirección</p>
                    <p className="text-white font-medium">{perfil.direccion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaWater className="text-cyan-400 w-5" />
                  <div>
                    <p className="text-white/60 text-sm">Sector</p>
                    <p className="text-white font-medium">{perfil.sector}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition"
            >
              <FaUserEdit /> Editar Perfil
            </button>
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              <FaLock /> Cambiar Contraseña
            </button>
          </div>
        </main>
      </div>

      {/* Modales */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        usuario={perfil}
        onSave={handleUpdatePerfil}
      />

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
}