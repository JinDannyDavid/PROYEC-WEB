// frontend/src/components/complaints/ComplaintFormModal.tsx
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Propiedad {
  id: number;
  direccion: string;
  numero_medidor: string;
}

const complaintTypes = [
  { id: 'FUGA', label: 'Fuga de agua', description: 'Reportar una fuga en tu domicilio o vía pública' },
  { id: 'CALIDAD_AGUA', label: 'Calidad del agua', description: 'Agua turbia, mal olor, mal sabor' },
  { id: 'MEDIDOR', label: 'Problema con medidor', description: 'Medidor dañado o lectura incorrecta' },
  { id: 'FACTURACION', label: 'Problema de facturación', description: 'Factura muy alta o cobro incorrecto' },
  { id: 'OTRO', label: 'Otro', description: 'Otro tipo de problema' },
];

export default function ComplaintFormModal({ isOpen, onClose, onSuccess }: ComplaintFormModalProps) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  const [formData, setFormData] = useState({
    propiedad_id: '',
    tipo: '',
    descripcion: '',
  });

  useEffect(() => {
    if (isOpen) {
      cargarPropiedades();
    }
  }, [isOpen]);

  const cargarPropiedades = async () => {
    setCargando(true);
    try {
      const response = await api.get('/mis-propiedades/');
      let data = response.data.results ? response.data.results : response.data;
      setPropiedades(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, propiedad_id: data[0].id.toString() }));
      }
    } catch (err) {
      console.error('Error cargando propiedades:', err);
      toast.error('No se pudieron cargar tus propiedades');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.propiedad_id) {
      toast.error('Debes seleccionar una propiedad');
      return;
    }
    if (!formData.tipo) {
      toast.error('Debes seleccionar un tipo de reclamo');
      return;
    }
    if (!formData.descripcion.trim()) {
      toast.error('Debes describir el problema');
      return;
    }

    setEnviando(true);
    try {
      await api.post('/reclamos/', {
        propiedad: parseInt(formData.propiedad_id),
        tipo: formData.tipo,
        descripcion: formData.descripcion,
      });
      toast.success('Reclamo enviado correctamente');
      onSuccess();
      onClose();
      setFormData({ propiedad_id: '', tipo: '', descripcion: '' });
    } catch (err) {
      console.error('Error enviando reclamo:', err);
      toast.error('Error al enviar el reclamo');
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Reclamo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Selección de propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propiedad afectada *
            </label>
            {cargando ? (
              <div className="text-gray-500">Cargando propiedades...</div>
            ) : propiedades.length === 0 ? (
              <div className="text-red-500 text-sm">
                No tienes propiedades registradas. Contacta a la JASS.
              </div>
            ) : (
              <select
                value={formData.propiedad_id}
                onChange={(e) => setFormData({ ...formData, propiedad_id: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                {propiedades.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.direccion} - Medidor: {prop.numero_medidor}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tipo de reclamo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de reclamo *
            </label>
            <div className="space-y-2">
              {complaintTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    formData.tipo === type.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={type.id}
                    checked={formData.tipo === type.id}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{type.label}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del problema *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              placeholder="Describe detalladamente el problema..."
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe el problema con la mayor cantidad de detalles posible.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || propiedades.length === 0}
              className={`flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition ${
                enviando ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-600'
              }`}
            >
              {enviando ? 'Enviando...' : <><FaPaperPlane /> Enviar Reclamo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}