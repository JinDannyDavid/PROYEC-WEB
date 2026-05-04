// frontend/src/pages/admin/propiedades.tsx
import Header from '@/components/admin/Header';
import PropiedadDeleteModal from '@/components/admin/PropiedadDeleteModal';
import PropiedadFilters from '@/components/admin/PropiedadFilters';
import PropiedadFormModal from '@/components/admin/PropiedadesFormModal';
import Sidebar from '@/components/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { adminPropiedadService, Propiedad } from '@/services/adminPropiedadService';
import { adminUserService, Usuario } from '@/services/adminUserService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function PropiedadesPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState<Propiedad[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<Propiedad | null>(null);
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
      const [propiedadesData, usuariosData] = await Promise.all([
        adminPropiedadService.getPropiedades(),
        adminUserService.getUsuarios(),
      ]);
      setPropiedades(propiedadesData);
      setPropiedadesFiltradas(propiedadesData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...propiedades];
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.numero_medidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.usuario_nombre && p.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(p => p.estado === selectedEstado);
    }
    
    setPropiedadesFiltradas(filtered);
  }, [searchTerm, selectedEstado, propiedades]);

  const handleCrearPropiedad = () => {
    setPropiedadSeleccionada(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleEditarPropiedad = (propiedad: Propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleEliminarPropiedad = (propiedad: Propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setDeleteModalAbierto(true);
  };

  const handleGuardarPropiedad = async (data: any) => {
    try {
      if (modoEdicion && propiedadSeleccionada) {
        await adminPropiedadService.updatePropiedad(propiedadSeleccionada.id, data);
        toast.success('Propiedad actualizada correctamente');
      } else {
        await adminPropiedadService.createPropiedad(data);
        toast.success('Propiedad creada correctamente');
      }
      await cargarDatos();
      setModalAbierto(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al guardar propiedad');
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (propiedadSeleccionada) {
      try {
        await adminPropiedadService.deletePropiedad(propiedadSeleccionada.id);
        toast.success('Propiedad eliminada correctamente');
        await cargarDatos();
        setDeleteModalAbierto(false);
      } catch (error) {
        toast.error('Error al eliminar propiedad');
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando propiedades...</div>
      </div>
    );
  }

  if (!user || user.tipo_usuario !== 'ADMIN') return null;

  const estadoOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'ACTIVO', label: 'Activo', color: 'green' },
    { value: 'CORTADO', label: 'Cortado', color: 'red' },
    { value: 'MOROSO', label: 'Moroso', color: 'orange' },
    { value: 'SUSPENDIDO', label: 'Suspendido', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar onLogout={handleLogout} />
      
      <div className="ml-72">
        <Header userName={user.nombres} />

        <main className="p-6">
          {/* Header con título y botón */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Propiedades</h1>
              <p className="text-gray-400 text-sm">Administra las propiedades registradas</p>
            </div>
            <button
              onClick={handleCrearPropiedad}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <FaPlus /> Nueva Propiedad
            </button>
          </div>

          {/* Filtros */}
          <PropiedadFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            estadoOptions={estadoOptions}
          />

          {/* Tabla de propiedades */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">ID</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Medidor</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Dirección</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Sector</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Propietario</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {propiedadesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No hay propiedades registradas
                      </td>
                    </tr>
                  ) : (
                    propiedadesFiltradas.map((propiedad) => (
                      <tr key={propiedad.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4 text-white">{propiedad.id}</td>
                        <td className="p-4 text-white font-mono">{propiedad.numero_medidor}</td>
                        <td className="p-4 text-white max-w-xs truncate">{propiedad.direccion}</td>
                        <td className="p-4 text-white">{propiedad.sector}</td>
                        <td className="p-4 text-white">
                          {propiedad.usuario_nombre || `Usuario #${propiedad.usuario}`}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                            {propiedad.tipo_propiedad === 'DOMESTICO' ? 'Doméstico' :
                             propiedad.tipo_propiedad === 'COMERCIAL' ? 'Comercial' :
                             propiedad.tipo_propiedad === 'INDUSTRIAL' ? 'Industrial' :
                             propiedad.tipo_propiedad}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            propiedad.estado === 'ACTIVO' ? 'bg-green-500/20 text-green-400' :
                            propiedad.estado === 'CORTADO' ? 'bg-red-500/20 text-red-400' :
                            propiedad.estado === 'MOROSO' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {propiedad.estado === 'ACTIVO' ? 'Activo' :
                             propiedad.estado === 'CORTADO' ? 'Cortado' :
                             propiedad.estado === 'MOROSO' ? 'Moroso' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarPropiedad(propiedad)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Editar"
                            >
                              <FaEdit className="text-yellow-400" />
                            </button>
                            <button
                              onClick={() => handleEliminarPropiedad(propiedad)}
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
      <PropiedadFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarPropiedad}
        propiedad={propiedadSeleccionada}
        isEditing={modoEdicion}
        usuarios={usuarios}
      />

      <PropiedadDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={handleConfirmarEliminacion}
        propiedad={propiedadSeleccionada}
      />
    </div>
  );
}