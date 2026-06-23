import AdminLayout from '@/components/admin/AdminLayout';
import PagoDeleteModal from '@/components/admin/PagoDeleteModal';
import PagoFilters from '@/components/admin/PagoFilters';
import PagoFormModal from '@/components/admin/PagoFormModal';
import PagosTable from '@/components/admin/PagosTable';
import { useAuth } from '@/contexts/AuthContext';
import { adminFacturaService, Factura } from '@/services/adminFacturaService';
import { adminPagoService, Pago } from '@/services/adminPagoService';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

export default function PagosPage() {
  const { user } = useAuth();
  
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [pagosFiltrados, setPagosFiltrados] = useState<Pago[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetodo, setSelectedMetodo] = useState('todos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (user && user.tipo_usuario === 'ADMIN') {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [pagosData, facturasData] = await Promise.all([
        adminPagoService.getPagos(),
        adminFacturaService.getFacturas(),
      ]);
      setPagos(pagosData);
      setPagosFiltrados(pagosData);
      setFacturas(facturasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...pagos];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.factura_numero?.includes(searchTerm) || 
        p.codigo_operacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedMetodo !== 'todos') {
      filtered = filtered.filter(p => p.metodo_pago === selectedMetodo);
    }
    
    setPagosFiltrados(filtered);
  }, [searchTerm, selectedMetodo, pagos]);

  const handleNuevoPago = () => {
    setPagoSeleccionado(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleEditarPago = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleEliminarPago = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setDeleteModalAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!pagoSeleccionado) return;
    
    try {
      await adminPagoService.deletePago(pagoSeleccionado.id);
      toast.success('Pago eliminado correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando pago:', error);
      toast.error('No se pudo eliminar el pago');
    } finally {
      setDeleteModalAbierto(false);
      setPagoSeleccionado(null);
    }
  };

  const guardarPago = async (data: any) => {
    try {
      if (modoEdicion && pagoSeleccionado) {
        await adminPagoService.updatePago(pagoSeleccionado.id, data);
        toast.success('Pago actualizado correctamente');
      } else {
        await adminPagoService.createPago(data);
        toast.success('Pago registrado correctamente');
      }
      cargarDatos();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error guardando pago:', error);
      toast.error('No se pudo guardar el pago');
      throw error;
    }
  };

  if (cargando) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-paper-600">Cargando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-paper-900">Registro de Pagos</h1>
          <p className="text-paper-600">Registrar pagos realizados por usuarios</p>
        </div>
        <button
          onClick={handleNuevoPago}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Nuevo Pago
        </button>
      </div>

      <PagoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedMetodo={selectedMetodo}
        onMetodoChange={setSelectedMetodo}
      />

      <PagosTable
        pagos={pagosFiltrados}
        onEdit={handleEditarPago}
        onDelete={handleEliminarPago}
      />

      {pagosFiltrados.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay pagos</h3>
          <p className="text-paper-500">
            {searchTerm || selectedMetodo !== 'todos'
              ? 'No se encontraron pagos con los filtros seleccionados.'
              : 'No hay pagos registrados en el sistema.'}
          </p>
          {(searchTerm || selectedMetodo !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMetodo('todos');
              }}
              className="btn-primary mt-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <PagoFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarPago}
        pago={pagoSeleccionado}
        isEditing={modoEdicion}
        facturas={facturas}
      />

      <PagoDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={confirmarEliminar}
        pago={pagoSeleccionado}
      />
    </AdminLayout>
  );
}