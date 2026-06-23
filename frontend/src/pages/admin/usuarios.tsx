import AdminLayout from '@/components/admin/AdminLayout';
import UsuarioDeleteModal from '@/components/admin/UsuarioDeleteModal';
import UsuarioFilters from '@/components/admin/UsuarioFilters';
import UsuarioFormModal from '@/components/admin/UsuarioFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { adminUserService, Usuario } from '@/services/adminUserService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function UsuariosPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
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
      cargarUsuarios();
    }
  }, [user]);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const data = await adminUserService.getUsuarios();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let filtered = [...usuarios];
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.dni.includes(searchTerm) || 
        u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(u => u.tipo_usuario === selectedTipo);
    }
    
    setUsuariosFiltrados(filtered);
  }, [searchTerm, selectedTipo, usuarios]);

  const handleNuevoUsuario = () => {
    setUsuarioSeleccionado(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleEliminarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setDeleteModalAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!usuarioSeleccionado) return;
    
    try {
      await adminUserService.deleteUsuario(usuarioSeleccionado.id);
      toast.success('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      toast.error('No se pudo eliminar el usuario');
    } finally {
      setDeleteModalAbierto(false);
      setUsuarioSeleccionado(null);
    }
  };

  const guardarUsuario = async (data: any) => {
    try {
      if (modoEdicion && usuarioSeleccionado) {
        await adminUserService.updateUsuario(usuarioSeleccionado.id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await adminUserService.createUsuario(data);
        toast.success('Usuario creado correctamente');
      }
      cargarUsuarios();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      toast.error('No se pudo guardar el usuario');
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
          <h1 className="text-2xl font-bold text-paper-900">Gestion de Usuarios</h1>
          <p className="text-paper-600">Administrar usuarios del sistema</p>
        </div>
        <button
          onClick={handleNuevoUsuario}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <UsuarioFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTipo={selectedTipo}
        onTipoChange={setSelectedTipo}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-header">
              <tr>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Sector</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="table-row">
                  <td className="font-mono">{usuario.dni}</td>
                  <td className="font-medium text-paper-900">
                    {usuario.nombres} {usuario.apellidos}
                  </td>
                  <td className="text-paper-600">{usuario.telefono}</td>
                  <td className="text-paper-600">{usuario.email || '-'}</td>
                  <td className="text-paper-600">{usuario.sector}</td>
                  <td>
                    <span className={`badge ${
                      usuario.tipo_usuario === 'ADMIN' ? 'badge-info' :
                      usuario.tipo_usuario === 'CAJERO' ? 'badge-success' :
                      usuario.tipo_usuario === 'TECNICO' ? 'badge-warning' :
                      'badge-primary'
                    }`}>
                      {usuario.tipo_usuario}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditarUsuario(usuario)}
                        className="p-1 text-paper-600 hover:text-pvc-blue transition-colors"
                        title="Editar"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarUsuario(usuario)}
                        className="p-1 text-paper-600 hover:text-stamp-red transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuariosFiltrados.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay usuarios</h3>
            <p className="text-paper-500">
              {searchTerm || selectedTipo !== 'todos'
                ? 'No se encontraron usuarios con los filtros seleccionados.'
                : 'No hay usuarios registrados en el sistema.'}
            </p>
            {(searchTerm || selectedTipo !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTipo('todos');
                }}
                className="btn-primary mt-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <UsuarioFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarUsuario}
        usuario={usuarioSeleccionado}
        isEditing={modoEdicion}
      />

      <UsuarioDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={confirmarEliminar}
        usuario={usuarioSeleccionado}
      />
    </AdminLayout>
  );
}