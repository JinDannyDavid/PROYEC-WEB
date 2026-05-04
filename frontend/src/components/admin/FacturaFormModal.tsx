// frontend/src/components/admin/FacturaFormModal.tsx
import { Factura } from '@/services/adminFacturaService';
import { Propiedad } from '@/services/adminPropiedadService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface FacturaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  factura: Factura | null;
  isEditing: boolean;
  propiedades: Propiedad[];
}

export default function FacturaFormModal({
  isOpen,
  onClose,
  onSave,
  factura,
  isEditing,
  propiedades,
}: FacturaFormModalProps) {
  const [formData, setFormData] = useState({
    propiedad: '',
    periodo: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    lectura_anterior: '',
    lectura_actual: '',
    cargo_fijo: '25.00',
    cargo_alcantarillado: '15.00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consumoCalculado, setConsumoCalculado] = useState(0);
  const [montoCalculado, setMontoCalculado] = useState(0);

  useEffect(() => {
    if (factura && isEditing) {
      setFormData({
        propiedad: factura.propiedad.toString(),
        periodo: factura.periodo,
        fecha_emision: factura.fecha_emision,
        fecha_vencimiento: factura.fecha_vencimiento,
        lectura_anterior: factura.lectura_anterior.toString(),
        lectura_actual: factura.lectura_actual.toString(),
        cargo_fijo: factura.cargo_fijo.toString(),
        cargo_alcantarillado: factura.cargo_alcantarillado.toString(),
      });
      setConsumoCalculado(factura.consumo_m3);
      setMontoCalculado(factura.monto_total);
    } else {
      setFormData({
        propiedad: '',
        periodo: '',
        fecha_emision: new Date().toISOString().split('T')[0],
        fecha_vencimiento: '',
        lectura_anterior: '',
        lectura_actual: '',
        cargo_fijo: '25.00',
        cargo_alcantarillado: '15.00',
      });
      setConsumoCalculado(0);
      setMontoCalculado(0);
    }
  }, [factura, isEditing, isOpen]);

  // Calcular consumo y monto cuando cambian las lecturas
  useEffect(() => {
    const lecturaAnt = parseFloat(formData.lectura_anterior) || 0;
    const lecturaAct = parseFloat(formData.lectura_actual) || 0;
    const consumo = Math.max(0, lecturaAct - lecturaAnt);
    setConsumoCalculado(consumo);
    
    const cargoFijo = parseFloat(formData.cargo_fijo) || 0;
    const cargoAlcant = parseFloat(formData.cargo_alcantarillado) || 0;
    const cargoConsumo = consumo * 3.5; // Tarifa por m³
    setMontoCalculado(cargoFijo + cargoConsumo + cargoAlcant);
  }, [formData.lectura_anterior, formData.lectura_actual, formData.cargo_fijo, formData.cargo_alcantarillado]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.propiedad) {
      setError('Selecciona una propiedad');
      setLoading(false);
      return;
    }

    if (!formData.periodo) {
      setError('Ingresa el período');
      setLoading(false);
      return;
    }

    if (!formData.fecha_vencimiento) {
      setError('Ingresa la fecha de vencimiento');
      setLoading(false);
      return;
    }

    const lecturaAnt = parseFloat(formData.lectura_anterior);
    const lecturaAct = parseFloat(formData.lectura_actual);
    
    if (isNaN(lecturaAnt) || isNaN(lecturaAct)) {
      setError('Las lecturas deben ser números válidos');
      setLoading(false);
      return;
    }

    if (lecturaAct <= lecturaAnt) {
      setError('La lectura actual debe ser mayor que la lectura anterior');
      setLoading(false);
      return;
    }

    const submitData = {
      propiedad: parseInt(formData.propiedad),
      periodo: formData.periodo,
      fecha_emision: formData.fecha_emision,
      fecha_vencimiento: formData.fecha_vencimiento,
      lectura_anterior: parseFloat(formData.lectura_anterior),
      lectura_actual: parseFloat(formData.lectura_actual),
      cargo_fijo: parseFloat(formData.cargo_fijo),
      cargo_alcantarillado: parseFloat(formData.cargo_alcantarillado),
    };

    try {
      await onSave(submitData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar factura');
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
            {isEditing ? 'Editar Factura' : 'Nueva Factura'}
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

          {/* Propiedad */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Propiedad *</label>
            <select
              value={formData.propiedad}
              onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              disabled={isEditing}
            >
              <option value="">Seleccionar propiedad</option>
              {propiedades.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.direccion} - Medidor: {prop.numero_medidor}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Período *</label>
            <input
              type="text"
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              placeholder="MM/YYYY"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <p className="text-gray-500 text-xs mt-1">Formato: 01/2024 (mes/año)</p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Emisión</label>
              <input
                type="date"
                value={formData.fecha_emision}
                onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vencimiento *</label>
              <input
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          {/* Lecturas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lectura Anterior (m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.lectura_anterior}
                onChange={(e) => setFormData({ ...formData, lectura_anterior: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lectura Actual (m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.lectura_actual}
                onChange={(e) => setFormData({ ...formData, lectura_actual: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          {/* Consumo calculado */}
          {consumoCalculado > 0 && (
            <div className="bg-cyan-500/10 rounded-xl p-3">
              <p className="text-cyan-400 text-sm">Consumo calculado: <span className="font-bold">{consumoCalculado} m³</span></p>
            </div>
          )}

          {/* Cargos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cargo Fijo (S/)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cargo_fijo}
                onChange={(e) => setFormData({ ...formData, cargo_fijo: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alcantarillado (S/)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cargo_alcantarillado}
                onChange={(e) => setFormData({ ...formData, cargo_alcantarillado: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Monto total calculado */}
          {montoCalculado > 0 && (
            <div className="bg-gray-700 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monto Total:</span>
                <span className="text-2xl font-bold text-cyan-400">S/ {montoCalculado.toFixed(2)}</span>
              </div>
            </div>
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
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Factura')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}