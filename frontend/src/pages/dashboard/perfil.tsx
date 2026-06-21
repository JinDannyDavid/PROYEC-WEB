import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useAuth } from '@/contexts/AuthContext';
import { userService, Usuario } from '@/services/userService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) cargarPerfil();
  }, [user]);

  const cargarPerfil = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await userService.getPerfil();
      setPerfil(data);
    } catch {
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
    } catch {
      toast.error('Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (data: { password_actual: string; nueva_password: string; confirm_password: string }) => {
    const result = await userService.changePassword(data);
    if (result.success) {
      toast.success('Contrasena cambiada correctamente');
      setPasswordModalOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  if (cargando) {
    return (
      <DashboardLayout>
        <div className="text-paper-600">Cargando perfil...</div>
      </DashboardLayout>
    );
  }

  if (!user || !perfil) return null;

  const fechaRegistro = new Date(perfil.fecha_registro).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long',
  });

  return (
    <DashboardLayout>
      {error && (
        <div className="badge-danger p-4 mb-6 text-center text-sm rounded-lg">
          <p>{error}</p>
          <button onClick={cargarPerfil} className="mt-2 btn-outline text-sm px-3 py-1">
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pvc-blue/10 text-pvc-blue flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-paper-500 text-xs label">Miembro desde</p>
              <p className="font-semibold text-paper-900">{fechaRegistro}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-canal-ok/10 text-canal-ok flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-paper-500 text-xs label">Total pagado</p>
              <p className="font-semibold text-paper-900">S/ 0.00</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-alert/10 text-alert flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-paper-500 text-xs label">Reclamos</p>
              <p className="font-semibold text-paper-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-paper-200">
          <h2 className="text-lg font-bold text-paper-900">Informacion personal</h2>
          <p className="text-paper-500 text-sm">Tus datos de contacto y direccion</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-paper-200">
            <div className="w-16 h-16 rounded-xl bg-pvc-blue flex items-center justify-center text-white text-2xl font-bold">
              {perfil.nombres?.charAt(0)}{perfil.apellidos?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-paper-900">{perfil.nombres} {perfil.apellidos}</h3>
              <p className="text-paper-500">Vecino</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'DNI', value: perfil.dni },
              { label: 'Telefono', value: perfil.telefono },
              ...(perfil.email ? [{ label: 'Correo electronico', value: perfil.email }] : []),
              { label: 'Direccion', value: perfil.direccion },
              { label: 'Sector', value: perfil.sector },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-paper-200">
                <div>
                  <p className="text-xs text-paper-500 label">{item.label}</p>
                  <p className="font-medium text-paper-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button onClick={() => setEditModalOpen(true)} className="btn-primary flex-1">
          Editar perfil
        </button>
        <button onClick={() => setPasswordModalOpen(true)} className="btn-outline flex-1">
          Cambiar contrasena
        </button>
      </div>

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
    </DashboardLayout>
  );
}