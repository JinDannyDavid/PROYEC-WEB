import AdminLayout from '@/components/admin/AdminLayout';
import FacturaDeleteModal from '@/components/admin/FacturaDeleteModal';
import FacturaFilters from '@/components/admin/FacturaFilters';
import FacturaFormModal from '@/components/admin/FacturaFormModal';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminFacturaService, Factura } from '@/services/adminFacturaService';
import { adminPropiedadService, Propiedad } from '@/services/adminPropiedadService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaPlus, FaPrint, FaTrash } from 'react-icons/fa';

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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-header">
              <tr>
                <th>Numero de Factura</th>
                <th>Periodo</th>
                <th>Propiedad</th>
                <th>Consumo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200">
              {facturasFiltradas.map((factura) => (
                <tr key={factura.id} className="table-row">
                  <td className="font-mono font-medium text-pvc-blue">{factura.numero_factura}</td>
                  <td className="text-paper-900">{factura.periodo}</td>
                  <td className="text-paper-600">{factura.propiedad_direccion || '-'}</td>
                  <td className="text-paper-600">{factura.consumo_m3} m³</td>
                  <td className="font-semibold text-paper-900">S/ {factura.monto_total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      factura.estado === 'PENDIENTE' ? 'badge-warning' :
                      factura.estado === 'PAGADA' ? 'badge-success' :
                      factura.estado === 'VENCIDA' ? 'badge-danger' :
                      'badge-info'
                    }`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditarFactura(factura)}
                        className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                        title="Editar"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarFactura(factura)}
                        className="p-1 text-paper-600 hover:text-stamp-red transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Imprimir factura
                          window.open(`/api/facturas/${factura.id}/pdf`, '_blank');
                        }}
                        className="p-1 text-paper-600 hover:text-canal-ok transition-colors"
                        title="Imprimir"
                      >
                        <FaPrint className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>

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