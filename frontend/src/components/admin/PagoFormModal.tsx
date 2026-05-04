// frontend/src/components/admin/PagoFormModal.tsx
import { Factura } from '@/services/adminFacturaService';
import { Pago } from '@/services/adminPagoService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PagoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  pago: Pago | null;
  isEditing: boolean;
  facturas: Factura[];
}

const metodoOptions = [
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'EFECTIVO', label: 'Efectivo' },
];

export default function PagoFormModal({
  isOpen,
  onClose,
  onSave,
  pago,
  isEditing,
  facturas,
}: PagoFormModalProps) {
  const [formData, setFormData] = useState({
    factura: '',
    monto: '',
    metodo_pago: 'YAPE',
    codigo_operacion: '',
  });
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pago && isEditing) {
      setFormData({
        factura: pago.factura.toString(),
        monto: pago.monto.toString(),
        metodo_pago: pago.metodo_pago,
        codigo_operacion: pago.codigo_operacion,
      });
      const factura = facturas.find(f => f.id === pago.factura);
      setFacturaSeleccionada(factura || null);
    } else {
      setFormData({
        factura: '',
        monto: '',
        metodo_pago: 'YAPE',
        codigo_operacion: '',
      });
      setFacturaSeleccionada(null);
    }
  }, [pago, isEditing, isOpen, facturas]);

  // Actualizar monto cuando cambia la factura seleccionada
  useEffect(() => {
    if (formData.factura && !isEditing) {
      const factura = facturas.find(f => f.id === parseInt(formData.factura));
      setFacturaSeleccionada(factura || null);
      if (factura && factura.estado !== 'PAGADA') {
        setFormData(prev => ({
          ...prev,
          monto: factura.monto_total.toString(),
        }));
      }
    }
  }, [formData.factura, facturas, isEditing]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.factura) {
      setError('Selecciona una factura');
      setLoading(false);
      return;
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      setError('Ingresa un monto válido');
      setLoading(false);
      return;
    }

    if (!formData.codigo_operacion) {
      setError('Ingresa el código de operación');
      setLoading(false);
      return;
    }

    const submitData = {
      factura: parseInt(formData.factura),
      monto: parseFloat(formData.monto),
      metodo_pago: formData.metodo_pago,
      codigo_operacion: formData.codigo_operacion,
    };

    try {
      await onSave(submitData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar pago');
    } finally {
      setLoading(false);
    }
  };

  // Generar código de operación automático
  const generarCodigoOperacion = () => {
    const metodo = formData.metodo_pago;
    const timestamp = Date.now();
    const codigo = `${metodo.substring(0, 3)}-${timestamp}`;
    setFormData({ ...formData, codigo_operacion: codigo });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-5 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Pago' : 'Registrar Pago'}
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

          {/* Factura */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Factura *</label>
            <select
              value={formData.factura}
              onChange={(e) => setFormData({ ...formData, factura: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              disabled={isEditing}
            >
              <option value="">Seleccionar factura</option>
              {facturas
                .filter(f => f.estado !== 'PAGADA' || (isEditing && f.id === pago?.factura))
                .map((factura) => (
                  <option key={factura.id} value={factura.id}>
                    {factura.numero_factura} - {factura.propiedad_direccion || `Propiedad #${factura.propiedad}`} - S/ {factura.monto_total.toFixed(2)}
                  </option>
              ))}
            </select>
          </div>

          {/* Información de la factura seleccionada */}
          {facturaSeleccionada && (
            <div className="bg-gray-700 rounded-xl p-3">
              <p className="text-gray-300 text-sm">Detalle de factura:</p>
              <p className="text-white text-sm">Período: {facturaSeleccionada.periodo}</p>
              <p className="text-white text-sm">Consumo: {facturaSeleccionada.consumo_m3} m³</p>
              <p className="text-white text-sm">Vencimiento: {new Date(facturaSeleccionada.fecha_vencimiento).toLocaleDateString('es-PE')}</p>
              <p className="text-cyan-400 font-bold mt-1">Monto: S/ {facturaSeleccionada.monto_total.toFixed(2)}</p>
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Monto *</label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              readOnly={!isEditing && facturaSeleccionada !== null}
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Método de pago *</label>
            <select
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              {metodoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Código de operación */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Código de operación *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.codigo_operacion}
                onChange={(e) => setFormData({ ...formData, codigo_operacion: e.target.value })}
                className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="YAPE-1234567890"
                required
              />
              <button
                type="button"
                onClick={generarCodigoOperacion}
                className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
              >
                Generar
              </button>
            </div>
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
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar Pago')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}