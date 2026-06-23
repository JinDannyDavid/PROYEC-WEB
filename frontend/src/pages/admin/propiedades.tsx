import AdminLayout from '@/components/admin/AdminLayout';
import PropiedadDeleteModal from '@/components/admin/PropiedadDeleteModal';
import PropiedadFilters from '@/components/admin/PropiedadFilters';
import PropiedadFormModal from '@/components/admin/PropiedadesFormModal';
import PropiedadesTable from '@/components/admin/PropiedadesTable';
import { useAuth } from '@/contexts/AuthContext';
import { adminPropiedadService, Propiedad } from '@/services/adminPropiedadService';
import { adminUserService, Usuario } from '@/services/adminUserService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'ACTIVO', label: 'Activo', color: 'green' },
  { value: 'CORTADO', label: 'Cortado', color: 'red' },
  { value: 'MOROSO', label: 'Moroso', color: 'orange' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: 'gray' },
];

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

  useEffect(() => {
    let filtered = [...propiedades];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.numero_medidor.includes(searchTerm) || 
        p.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.usuario_nombre && p.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(p => p.estado === selectedEstado);
    }
    
    setPropiedadesFiltradas(filtered);
  }, [searchTerm, selectedEstado, propiedades]);

  const handleNuevaPropiedad = () => {
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

  const confirmarEliminar = async () => {
    if (!propiedadSeleccionada) return;
    
    try {
      await adminPropiedadService.deletePropiedad(propiedadSeleccionada.id);
      toast.success('Propiedad eliminada correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
      toast.error('No se pudo eliminar la propiedad');
    } finally {
      setDeleteModalAbierto(false);
      setPropiedadSeleccionada(null);
    }
  };

  const guardarPropiedad = async (data: any) => {
    try {
      if (modoEdicion && propiedadSeleccionada) {
        await adminPropiedadService.updatePropiedad(propiedadSeleccionada.id, data);
        toast.success('Propiedad actualizada correctamente');
      } else {
        await adminPropiedadService.createPropiedad(data);
        toast.success('Propiedad creada correctamente');
      }
      cargarDatos();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error guardando propiedad:', error);
      toast.error('No se pudo guardar la propiedad');
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
          <h1 className="text-2xl font-bold text-paper-900">Gestion de Propiedades</h1>
          <p className="text-paper-600">Administrar propiedades y numeros de medidor</p>
        </div>
        <button
          onClick={handleNuevaPropiedad}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Nueva Propiedad
        </button>
      </div>

      <PropiedadFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedEstado={selectedEstado}
        onEstadoChange={setSelectedEstado}
        estadoOptions={estadoOptions}
      />

      <PropiedadesTable
        propiedades={propiedadesFiltradas}
        onEdit={handleEditarPropiedad}
        onDelete={handleEliminarPropiedad}
      />

      {propiedadesFiltradas.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay propiedades</h3>
          <p className="text-paper-500">
            {searchTerm || selectedEstado !== 'todos'
              ? 'No se encontraron propiedades con los filtros seleccionados.'
              : 'No hay propiedades registradas en el sistema.'}
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

      <PropiedadFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarPropiedad}
        propiedad={propiedadSeleccionada}
        isEditing={modoEdicion}
        usuarios={usuarios}
      />

      <PropiedadDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={confirmarEliminar}
        propiedad={propiedadSeleccionada}
      />
    </AdminLayout>
  );
}