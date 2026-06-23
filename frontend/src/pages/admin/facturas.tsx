import AdminLayout from '@/components/admin/AdminLayout';
import FacturaDeleteModal from '@/components/admin/FacturaDeleteModal';
import FacturaFilters from '@/components/admin/FacturaFilters';
import FacturaFormModal from '@/components/admin/FacturaFormModal';
import FacturasTable from '@/components/admin/FacturasTable';
import { useAuth } from '@/contexts/AuthContext';
import { adminFacturaService, Factura } from '@/services/adminFacturaService';
import { adminPropiedadService, Propiedad } from '@/services/adminPropiedadService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

export default function FacturasPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState<Factura[]>([]);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user && user.tipo_usuario !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user && user.tipo_usuario === 'ADMIN') {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [facturasData, propiedadesData] = await Promise.all([
        adminFacturaService.getFacturas(),
        adminPropiedadService.getPropiedades(),
      ]);
      setFacturas(facturasData);
      setFacturasFiltradas(facturasData);
      setPropiedades(propiedadesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...facturas];
    
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.numero_factura.includes(searchTerm) || 
        f.periodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.propiedad_direccion && f.propiedad_direccion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(f => f.estado === selectedEstado);
    }
    
    setFacturasFiltradas(filtered);
  }, [searchTerm, selectedEstado, facturas]);

  const handleNuevaFactura = () => {
    setFacturaSeleccionada(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleEditarFactura = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleEliminarFactura = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setDeleteModalAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!facturaSeleccionada) return;
    
    try {
      await adminFacturaService.deleteFactura(facturaSeleccionada.id);
      toast.success('Factura eliminada correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando factura:', error);
      toast.error('No se pudo eliminar la factura');
    } finally {
      setDeleteModalAbierto(false);
      setFacturaSeleccionada(null);
    }
  };

  const guardarFactura = async (data: any) => {
    try {
      if (modoEdicion && facturaSeleccionada) {
        await adminFacturaService.updateFactura(facturaSeleccionada.id, data);
        toast.success('Factura actualizada correctamente');
      } else {
        await adminFacturaService.createFactura(data);
        toast.success('Factura creada correctamente');
      }
      cargarDatos();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error guardando factura:', error);
      toast.error('No se pudo guardar la factura');
      throw error;
    }
  };

  if (authLoading || cargando) {
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
          <h1 className="text-2xl font-bold text-paper-900">Gestion de Facturas</h1>
          <p className="text-paper-600">Crear y gestionar facturas de agua</p>
        </div>
        <button
          onClick={handleNuevaFactura}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Nueva Factura
        </button>
      </div>

      <FacturaFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedEstado={selectedEstado}
        onEstadoChange={setSelectedEstado}
      />

      <FacturasTable
        facturas={facturasFiltradas}
        onEdit={handleEditarFactura}
        onDelete={handleEliminarFactura}
        onPrint={(factura) => window.open(`/api/facturas/${factura.id}/pdf`, '_blank')}
      />

      {facturasFiltradas.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay facturas</h3>
          <p className="text-paper-500">
            {searchTerm || selectedEstado !== 'todos'
              ? 'No se encontraron facturas con los filtros seleccionados.'
              : 'No hay facturas registradas en el sistema.'}
          </p>
          {(searchTerm || selectedEstado !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedEstado('todos');
              }}
              className="btn-primary mt-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <FacturaFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarFactura}
        factura={facturaSeleccionada}
        isEditing={modoEdicion}
        propiedades={propiedades}
      />

      <FacturaDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={confirmarEliminar}
        factura={facturaSeleccionada}
      />
    </AdminLayout>
  );
}