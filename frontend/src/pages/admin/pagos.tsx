// frontend/src/pages/admin/pagos.tsx
import Header from '@/components/admin/Header';
import PagoDeleteModal from '@/components/admin/PagoDeleteModal';
import PagoFilters from '@/components/admin/PagoFilters';
import PagoFormModal from '@/components/admin/PagoFormModal';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminFacturaService, Factura } from '@/services/adminFacturaService';
import { adminPagoService, Pago } from '@/services/adminPagoService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaEdit, FaMoneyBillWave, FaPlus, FaTrash } from 'react-icons/fa';

export default function PagosPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...pagos];
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.codigo_operacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.factura_numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.propiedad_direccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedMetodo !== 'todos') {
      filtered = filtered.filter(p => p.metodo_pago === selectedMetodo);
    }
    
    setPagosFiltrados(filtered);
  }, [searchTerm, selectedMetodo, pagos]);

  const handleRegistrarPago = () => {
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

  const handleGuardarPago = async (data: any) => {
    try {
      if (modoEdicion && pagoSeleccionado) {
        await adminPagoService.updatePago(pagoSeleccionado.id, data);
        toast.success('Pago actualizado correctamente');
      } else {
        await adminPagoService.createPago(data);
        toast.success('Pago registrado correctamente');
      }
      await cargarDatos();
      setModalAbierto(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al guardar pago');
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (pagoSeleccionado) {
      try {
        await adminPagoService.deletePago(pagoSeleccionado.id);
        toast.success('Pago eliminado correctamente');
        await cargarDatos();
        setDeleteModalAbierto(false);
      } catch (error) {
        toast.error('Error al eliminar pago');
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const totalPagado = pagosFiltrados.reduce((sum, p) => sum + p.monto, 0);
  const totalPagos = pagosFiltrados.length;
  const pagosConfirmados = pagosFiltrados.filter(p => p.estado_comprobante === 'CONFIRMADO').length;

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando pagos...</div>
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
              <h1 className="text-2xl font-bold text-white">Registro de Pagos</h1>
              <p className="text-gray-400 text-sm">Administra los pagos registrados</p>
            </div>
            <button
              onClick={handleRegistrarPago}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <FaPlus /> Registrar Pago
            </button>
          </div>

          {/* Resumen de pagos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Pagado</p>
                  <p className="text-white text-2xl font-bold">S/ {totalPagado.toFixed(2)}</p>
                </div>
                <FaMoneyBillWave className="text-green-500 text-3xl opacity-50" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">N° de Pagos</p>
                  <p className="text-white text-2xl font-bold">{totalPagos}</p>
                </div>
                <FaCheckCircle className="text-blue-500 text-3xl opacity-50" />
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pagos Confirmados</p>
                  <p className="text-white text-2xl font-bold">{pagosConfirmados}</p>
                </div>
                <FaClock className="text-cyan-500 text-3xl opacity-50" />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <PagoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedMetodo={selectedMetodo}
            onMetodoChange={setSelectedMetodo}
          />

          {/* Tabla de pagos */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Código</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Factura</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Propiedad</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Monto</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Método</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Fecha</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No hay pagos registrados
                      </td>
                    </tr>
                  ) : (
                    pagosFiltrados.map((pago) => (
                      <tr key={pago.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4 text-white font-mono text-sm">{pago.codigo_operacion}</td>
                        <td className="p-4 text-white">{pago.factura_numero || `#${pago.factura}`}</td>
                        <td className="p-4 text-white max-w-xs truncate">
                          {pago.propiedad_direccion || '-'}
                        </td>
                        <td className="p-4 text-white font-semibold">S/ {pago.monto.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            pago.metodo_pago === 'YAPE' ? 'bg-green-500/20 text-green-400' :
                            pago.metodo_pago === 'PLIN' ? 'bg-purple-500/20 text-purple-400' :
                            pago.metodo_pago === 'TRANSFERENCIA' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {pago.metodo_pago}
                          </span>
                        </td>
                        <td className="p-4 text-white">
                          {new Date(pago.fecha_pago).toLocaleDateString('es-PE')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            pago.estado_comprobante === 'CONFIRMADO' 
                              ? 'bg-green-500/20 text-green-400'
                              : pago.estado_comprobante === 'PENDIENTE'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {pago.estado_comprobante === 'CONFIRMADO' ? 'Confirmado' :
                             pago.estado_comprobante === 'PENDIENTE' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarPago(pago)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Editar"
                            >
                              <FaEdit className="text-yellow-400" />
                            </button>
                            <button
                              onClick={() => handleEliminarPago(pago)}
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
      <PagoFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarPago}
        pago={pagoSeleccionado}
        isEditing={modoEdicion}
        facturas={facturas}
      />

      <PagoDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={handleConfirmarEliminacion}
        pago={pagoSeleccionado}
      />
    </div>
  );
}