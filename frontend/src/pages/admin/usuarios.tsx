// frontend/src/pages/admin/usuarios.tsx
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
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

  // Aplicar filtros
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

  const handleCrearUsuario = () => {
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

  const handleGuardarUsuario = async (data: any) => {
    try {
      if (modoEdicion && usuarioSeleccionado) {
        await adminUserService.updateUsuario(usuarioSeleccionado.id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await adminUserService.createUsuario(data);
        toast.success('Usuario creado correctamente');
      }
      await cargarUsuarios();
      setModalAbierto(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al guardar usuario');
    }
  };

  const handleConfirmarEliminacion = async () => {
    if (usuarioSeleccionado) {
      try {
        await adminUserService.deleteUsuario(usuarioSeleccionado.id);
        toast.success('Usuario eliminado correctamente');
        await cargarUsuarios();
        setDeleteModalAbierto(false);
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando usuarios...</div>
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
              <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
              <p className="text-gray-400 text-sm">Administra los usuarios del sistema</p>
            </div>
            <button
              onClick={handleCrearUsuario}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <FaPlus /> Nuevo Usuario
            </button>
          </div>

          {/* Filtros */}
          <UsuarioFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTipo={selectedTipo}
            onTipoChange={setSelectedTipo}
          />

          {/* Tabla de usuarios */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">ID</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">DNI</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Nombre</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Teléfono</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Tipo</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Estado</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Propiedades</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                        <td className="p-4 text-white">{usuario.id}</td>
                        <td className="p-4 text-white font-mono">{usuario.dni}</td>
                        <td className="p-4 text-white">{usuario.nombres} {usuario.apellidos}</td>
                        <td className="p-4 text-white">{usuario.telefono}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            usuario.tipo_usuario === 'ADMIN' 
                              ? 'bg-purple-500/20 text-purple-400'
                              : usuario.tipo_usuario === 'VECINO'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {usuario.tipo_usuario === 'ADMIN' ? 'Administrador' : 
                             usuario.tipo_usuario === 'VECINO' ? 'Vecino' : 
                             usuario.tipo_usuario}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            usuario.activo
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4 text-white">{usuario.propiedades_count || 0}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarUsuario(usuario)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition"
                              title="Editar"
                            >
                              <FaEdit className="text-yellow-400" />
                            </button>
                            <button
                              onClick={() => handleEliminarUsuario(usuario)}
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
      <UsuarioFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarUsuario}
        usuario={usuarioSeleccionado}
        isEditing={modoEdicion}
      />

      <UsuarioDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={handleConfirmarEliminacion}
        usuario={usuarioSeleccionado}
      />
    </div>
  );
}