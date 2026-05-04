// frontend/src/components/notifications/NotificationEmptyState.tsx
import { FaBell, FaInbox } from 'react-icons/fa';

interface NotificationEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function NotificationEmptyState({ hasFilters, onClearFilters }: NotificationEmptyStateProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
        {hasFilters ? (
          <FaInbox className="text-white/30 text-3xl" />
        ) : (
          <FaBell className="text-white/30 text-3xl" />
        )}
      </div>
      
      <h3 className="text-white text-xl font-semibold mb-2">
        {hasFilters ? 'No hay notificaciones con este filtro' : 'No hay notificaciones'}
      </h3>
      
      <p className="text-white/60 max-w-md mx-auto">
        {hasFilters 
          ? 'No se encontraron notificaciones con los filtros seleccionados.'
          : 'Cuando recibas notificaciones importantes, aparecerán aquí.'}
      </p>
      
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}