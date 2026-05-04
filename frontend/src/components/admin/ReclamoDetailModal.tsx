// frontend/src/components/admin/ReclamoDetailModal.tsx
import { Reclamo } from '@/services/adminReclamoService';
import { useEffect, useState } from 'react';
import { FaCalendar, FaFileAlt, FaHome, FaReply, FaTimes, FaUser } from 'react-icons/fa';

interface ReclamoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onResponder: (id: number, estado: string, respuesta: string) => Promise<void>;
}

const estadoOptions = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'orange' },
  { value: 'EN_PROCESO', label: 'En proceso', color: 'blue' },
  { value: 'RESUELTO', label: 'Resuelto', color: 'green' },
  { value: 'RECHAZADO', label: 'Rechazado', color: 'red' },
];

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'FUGA': return 'Fuga de agua';
    case 'CALIDAD_AGUA': return 'Calidad del agua';
    case 'MEDIDOR': return 'Problema con medidor';
    case 'FACTURACION': return 'Problema de facturación';
    default: return 'Otro';
  }
};

export default function ReclamoDetailModal({ isOpen, onClose, reclamo, onResponder }: ReclamoDetailModalProps) {
  const [respuesta, setRespuesta] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (reclamo) {
      setRespuesta(reclamo.respuesta || '');
      setEstado(reclamo.estado);
    }
  }, [reclamo]);

  if (!isOpen || !reclamo) return null;

  const handleSubmit = async () => {
    if (!respuesta.trim() && estado !== 'PENDIENTE') {
      alert('Debes escribir una respuesta');
      return;
    }

    setLoading(true);
    try {
      await onResponder(reclamo.id, estado, respuesta);
      setModoEdicion(false);
    } finally {
      setLoading(false);
    }
  };

  const fechaFormateada = new Date(reclamo.fecha_creacion).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Detalle del Reclamo</h2>
            <p className="text-gray-400 text-sm">ID: #{reclamo.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition">
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Información del usuario */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FaUser className="text-cyan-400" /> Información del usuario
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Nombre</p>
                <p className="text-white">{reclamo.usuario_nombre || `Usuario #${reclamo.usuario}`}</p>
              </div>
              <div>
                <p className="text-gray-400">DNI</p>
                <p className="text-white font-mono">{reclamo.usuario_dni || 'No disponible'}</p>
              </div>
            </div>
          </div>

          {/* Información de la propiedad */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FaHome className="text-cyan-400" /> Propiedad afectada
            </h3>
            <p className="text-white">{reclamo.propiedad_direccion || `Propiedad #${reclamo.propiedad}`}</p>
          </div>

          {/* Detalle del reclamo */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FaFileAlt className="text-cyan-400" /> Detalle del reclamo
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Tipo</p>
                <p className="text-white">{getTipoLabel(reclamo.tipo)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fecha de creación</p>
                <p className="text-white flex items-center gap-2">
                  <FaCalendar className="text-gray-500" /> {fechaFormateada}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Descripción</p>
                <p className="text-white bg-gray-800 p-3 rounded-lg mt-1">{reclamo.descripcion}</p>
              </div>
            </div>
          </div>

          {/* Estado y respuesta */}
          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaReply className="text-cyan-400" /> Gestión del reclamo
              </h3>
              {!modoEdicion && reclamo.estado !== 'RESUELTO' && reclamo.estado !== 'RECHAZADO' && (
                <button
                  onClick={() => setModoEdicion(true)}
                  className="text-cyan-400 text-sm hover:text-cyan-300"
                >
                  Responder
                </button>
              )}
            </div>

            {modoEdicion ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {estadoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Respuesta</label>
                  <textarea
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Escribe tu respuesta aquí..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModoEdicion(false)}
                    className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar respuesta'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <p className="text-gray-400 text-sm">Estado actual</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${
                    reclamo.estado === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400' :
                    reclamo.estado === 'EN_PROCESO' ? 'bg-blue-500/20 text-blue-400' :
                    reclamo.estado === 'RESUELTO' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {reclamo.estado === 'PENDIENTE' ? 'Pendiente' :
                     reclamo.estado === 'EN_PROCESO' ? 'En proceso' :
                     reclamo.estado === 'RESUELTO' ? 'Resuelto' : 'Rechazado'}
                  </span>
                </div>
                {(reclamo.respuesta || respuesta) && (
                  <div>
                    <p className="text-gray-400 text-sm">Respuesta de JASS</p>
                    <p className="text-white bg-gray-800 p-3 rounded-lg mt-1">
                      {reclamo.respuesta || respuesta}
                    </p>
                    {reclamo.fecha_respuesta && (
                      <p className="text-gray-500 text-xs mt-2">
                        Respondido el {new Date(reclamo.fecha_respuesta).toLocaleDateString('es-PE')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}