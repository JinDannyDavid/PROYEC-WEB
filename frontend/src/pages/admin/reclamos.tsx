import AdminLayout from '@/components/admin/AdminLayout';
import ReclamoDeleteModal from '@/components/admin/ReclamoDeleteModal';
import ReclamoDetailModal from '@/components/admin/ReclamoDetailModal';
import ReclamoFilters from '@/components/admin/ReclamoFilters';
import ReclamosTable from '@/components/admin/ReclamosTable';
import { useAuth } from '@/contexts/AuthContext';
import { adminReclamoService, Reclamo } from '@/services/adminReclamoService';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ReclamosPage() {
  const { user } = useAuth();
  
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [reclamosFiltrados, setReclamosFiltrados] = useState<Reclamo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  
  const [detailModalAbierto, setDetailModalAbierto] = useState(false);
  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null);

  useEffect(() => {
    if (user && user.tipo_usuario === 'ADMIN') {
      cargarReclamos();
    }
  }, [user]);

  const cargarReclamos = async () => {
    setCargando(true);
    try {
      const data = await adminReclamoService.getReclamos();
      setReclamos(data);
      setReclamosFiltrados(data);
    } catch (error) {
      console.error('Error cargando reclamos:', error);
      toast.error('No se pudieron cargar los reclamos');
    } finally {
      setCargando(false);
    }
  };

  const handleResponderReclamo = async (id: number, estado: string, respuesta: string) => {
    try {
      await adminReclamoService.updateReclamo(id, { estado, respuesta });
      toast.success('Reclamo actualizado correctamente');
      cargarReclamos();
    } catch (error) {
      console.error('Error actualizando reclamo:', error);
      toast.error('No se pudo actualizar el reclamo');
      throw error;
    }
  };

  useEffect(() => {
    let filtered = [...reclamos];
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.id.toString().includes(searchTerm) || 
        r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(r => r.estado === selectedEstado);
    }
    
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(r => r.tipo === selectedTipo);
    }
    
    setReclamosFiltrados(filtered);
  }, [searchTerm, selectedEstado, selectedTipo, reclamos]);

  const handleVerDetalle = (reclamo: Reclamo) => {
    setReclamoSeleccionado(reclamo);
    setDetailModalAbierto(true);
  };

  const handleEliminarReclamo = (reclamo: Reclamo) => {
    setReclamoSeleccionado(reclamo);
    setDeleteModalAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!reclamoSeleccionado) return;
    
    try {
      await adminReclamoService.deleteReclamo(reclamoSeleccionado.id);
      toast.success('Reclamo eliminado correctamente');
      cargarReclamos();
    } catch (error) {
      console.error('Error eliminando reclamo:', error);
      toast.error('No se pudo eliminar el reclamo');
    } finally {
      setDeleteModalAbierto(false);
      setReclamoSeleccionado(null);
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
          <h1 className="text-2xl font-bold text-paper-900">Gestion de Reclamos</h1>
          <p className="text-paper-600">Atender y resolver reclamos de usuarios</p>
        </div>
      </div>

      <ReclamoFilters
        selectedEstado={selectedEstado}
        onEstadoChange={setSelectedEstado}
        selectedTipo={selectedTipo}
        onTipoChange={setSelectedTipo}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-paper-500 label">Total</p>
          <p className="text-2xl font-bold text-paper-900">{reclamos.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-l-orange-500">
          <p className="text-xs text-paper-500 label">Pendientes</p>
          <p className="text-2xl font-bold text-orange-600">
            {reclamos.filter(r => r.estado === 'PENDIENTE').length}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-l-blue-500">
          <p className="text-xs text-paper-500 label">En proceso</p>
          <p className="text-2xl font-bold text-blue-600">
            {reclamos.filter(r => r.estado === 'EN_PROCESO').length}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-l-green-500">
          <p className="text-xs text-paper-500 label">Resueltos</p>
          <p className="text-2xl font-bold text-green-600">
            {reclamos.filter(r => r.estado === 'RESUELTO').length}
          </p>
        </div>
      </div>

      <ReclamosTable
        reclamos={reclamosFiltrados}
        onView={handleVerDetalle}
        onDelete={handleEliminarReclamo}
      />

      {reclamosFiltrados.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-paper-900 mb-2">No hay reclamos</h3>
          <p className="text-paper-500">
            {searchTerm || selectedEstado !== 'todos' || selectedTipo !== 'todos'
              ? 'No se encontraron reclamos con los filtros seleccionados.'
              : 'No hay reclamos registrados en el sistema.'}
          </p>
          {(searchTerm || selectedEstado !== 'todos' || selectedTipo !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedEstado('todos');
                setSelectedTipo('todos');
              }}
              className="btn-primary mt-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <ReclamoDetailModal
        isOpen={detailModalAbierto}
        onClose={() => setDetailModalAbierto(false)}
        reclamo={reclamoSeleccionado}
        onResponder={handleResponderReclamo}
      />

      <ReclamoDeleteModal
        isOpen={deleteModalAbierto}
        onClose={() => setDeleteModalAbierto(false)}
        onConfirm={confirmarEliminar}
        reclamo={reclamoSeleccionado}
      />
    </AdminLayout>
  );
}