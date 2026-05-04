// frontend/src/components/admin/PropiedadFormModal.tsx
import { Propiedad } from '@/services/adminPropiedadService';
import { Usuario } from '@/services/adminUserService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PropiedadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  propiedad: Propiedad | null;
  isEditing: boolean;
  usuarios: Usuario[];
}

const tipoOptions = [
  { value: 'DOMESTICO', label: 'Doméstico' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
];

const estadoOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'CORTADO', label: 'Cortado' },
  { value: 'MOROSO', label: 'Moroso' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
];

export default function PropiedadFormModal({ isOpen, onClose, onSave, propiedad, isEditing, usuarios }: PropiedadFormModalProps) {
  const [formData, setFormData] = useState({
    usuario: '',
    direccion: '',
    sector: '',
    numero_medidor: '',
    tipo_propiedad: 'DOMESTICO',
    estado: 'ACTIVO',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propiedad && isEditing) {
      setFormData({
        usuario: propiedad.usuario.toString(),
        direccion: propiedad.direccion,
        sector: propiedad.sector,
        numero_medidor: propiedad.numero_medidor,
        tipo_propiedad: propiedad.tipo_propiedad,
        estado: propiedad.estado,
      });
    } else {
      setFormData({
        usuario: '',
        direccion: '',
        sector: '',
        numero_medidor: '',
        tipo_propiedad: 'DOMESTICO',
        estado: 'ACTIVO',
      });
    }
  }, [propiedad, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar propiedad');
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
            {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
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

          {/* Propietario */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Propietario *</label>
            <select
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              disabled={isEditing}
            >
              <option value="">Seleccionar propietario</option>
              {usuarios.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.dni} - {user.nombres} {user.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Número de medidor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Número de Medidor *</label>
              <input
              type="text"
              value={formData.numero_medidor}
              onChange={(e) => setFormData({ ...formData, numero_medidor: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Dirección */}
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

          {/* Sector */}
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

          {/* Tipo de propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Propiedad *</label>
            <select
              value={formData.tipo_propiedad}
              onChange={(e) => setFormData({ ...formData, tipo_propiedad: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {tipoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado *</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {estadoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}