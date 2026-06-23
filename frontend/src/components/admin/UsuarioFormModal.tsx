// frontend/src/components/admin/UsuarioFormModal.tsx
import { Usuario } from '@/services/adminUserService';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  usuario: Usuario | null;
  isEditing: boolean;
}

const tipoOptions = [
  { value: 'VECINO', label: 'Vecino' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'CAJERO', label: 'Cajero' },
  { value: 'TECNICO', label: 'Técnico' },
];

export default function UsuarioFormModal({ isOpen, onClose, onSave, usuario, isEditing }: UsuarioFormModalProps) {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
    sector: '',
    tipo_usuario: 'VECINO',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario && isEditing) {
      setFormData({
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        email: usuario.email || '',
        direccion: usuario.direccion,
        sector: usuario.sector,
        tipo_usuario: usuario.tipo_usuario,
        password: '',
        confirm_password: '',
      });
    } else {
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        direccion: '',
        sector: '',
        tipo_usuario: 'VECINO',
        password: '',
        confirm_password: '',
      });
    }
  }, [usuario, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar contraseñas si se proporcionan (en creación siempre, en edición solo si se llenan)
    const isChangingPassword = formData.password || formData.confirm_password;
    if (isChangingPassword && formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (isChangingPassword && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Si no se cambia contraseña, no enviarla al backend
      const payload = isChangingPassword ? formData : { ...formData, password: '', confirm_password: '' };
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition">
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">DNI *</label>
            <input
              type="text"
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              disabled={isEditing}
            />
          </div>

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombres *</label>
              <input
                type="text"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Apellidos *</label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono *</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Dirección y Sector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Dirección *</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sector *</label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          {/* Tipo de usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de usuario *</label>
            <select
              value={formData.tipo_usuario}
              onChange={(e) => setFormData({ ...formData, tipo_usuario: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {tipoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña (solo para nuevo usuario o si se quiere cambiar) */}
          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar Contraseña *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}