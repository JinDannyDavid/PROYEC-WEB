// frontend/src/pages/admin/facturas.tsx
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...facturas];
    
    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.propiedad_direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.periodo.includes(searchTerm)
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(f => f.estado === selectedEstado);
    }
    
    setFacturasFiltradas(filtered);
  }, [searchTerm, selectedEstado, facturas]);

  const handleCrearFactura = () => {
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

  const handleGuardarFactura = async (data: any) => {
    try {
      if (modoEdicion && facturaSeleccionada) {
        await adminFacturaService.updateFactura(facturaSeleccionada.id, data);
        toast.success('Factura actualizada correctamente');
      } else {
        await adminFacturaService.createFactura(data);
        toast.success('Factura creada correctamente');
      }
      await cargarDatos();
      setModalAbierto(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al guardar factura');
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (facturaSeleccionada) {
      try {
        await adminFacturaService.deleteFactura(facturaSeleccionada.id);
        toast.success('Factura eliminada correctamente');
        await cargarDatos();
        setDeleteModalAbierto(false);
      } catch (error) {
        toast.error('Error al eliminar factura');
      }
    }
  };

  const handleImprimirFactura = (factura: Factura) => {
    // TODO: Implementar impresión de factura
    toast.success(`Imprimiendo factura ${factura.numero_factura}`);
  };

  const handleLogout = () => {
    logout();
  };

  const totalPendiente = facturasFiltradas
    .filter(f => f.estado === 'PENDIENTE')
    .reduce((sum, f) => sum + f.monto_total, 0);
    
  const totalPagado = facturasFiltradas
    .filter(f => f.estado === 'PAGADA')
    .reduce((sum, f) => sum + f.monto_total, 0);
    
  const totalVencido = facturasFiltradas
    .filter(f => f.estado === 'VENCIDA')
    .reduce((sum, f) => sum + f.monto_total, 0);

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando facturas...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="ml-72">
        <Header userName={user.nombres} />

        <main className="p-6">
          {/* Header con título y botón */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Facturas</h1>
              <p className="text-gray-400 text-sm">Administra las facturas de agua</p>
            </div>
            <button
              onClick={handleCrearFactura}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <FaPlus /> Nueva Factura
            </button>
          </div>

          {/* Resumen de facturas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">Pendiente</p>
              <p className="text-white text-2xl font-bold">S/ {totalPendiente.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">Vencido</p>
              <p className="text-white text-2xl font-bold">S/ {totalVencido.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">Pagado</p>
              <p className="text-white text-2xl font-bold">S/ {totalPagado.toFixed(2)}</p>
            </div>
          </div>

          {/* Filtros */}
          <FacturaFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
          />

          {/* Tabla de facturas */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">N° Factura</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Propiedad</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Período</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Vencimiento</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Consumo</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Monto</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No hay facturas registradas
                      </td>
                    </tr>
                  ) : (
                    facturasFiltradas.map((factura) => (
                      <tr key={factura.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4 text-white font-mono">{factura.numero_factura}</td>
                        <td className="p-4 text-white max-w-xs truncate">
                          {factura.propiedad_direccion || `Propiedad #${factura.propiedad}`}
                         </td>
                        <td className="p-4 text-white">{factura.periodo}</td>
                        <td className="p-4 text-white">
                          {new Date(factura.fecha_vencimiento).toLocaleDateString('es-PE')}
                         </td>
                        <td className="p-4 text-white">{factura.consumo_m3} m³</td>
                        <td className="p-4 text-white font-semibold">S/ {factura.monto_total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            factura.estado === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400' :
                            factura.estado === 'PAGADA' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {factura.estado === 'PENDIENTE' ? 'Pendiente' :
                             factura.estado === 'PAGADA' ? 'Pagada' : 'Vencida'}
                          </span>
                         </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarFactura(factura)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Editar"
                            >
                              <FaEdit className="text-yellow-400" />
                            </button>
                            <button
                              onClick={() => handleImprimirFactura(factura)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Imprimir"
                            >
                              <FaPrint className="text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleEliminarFactura(factura)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Eliminar"
                            >
                              <FaTrash className="text-red-400" />
                            </button>
                          </div>
                         </td>
                       </tr>
                    ))
                  )}
                </tbody>
               </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <FacturaFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarFactura}
        factura={facturaSeleccionada}
        isEditing={modoEdicion}
        propiedades={propiedades}
      />

      <FacturaDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={handleConfirmarEliminacion}
        factura={facturaSeleccionada}
      />
    </div>
  );
}