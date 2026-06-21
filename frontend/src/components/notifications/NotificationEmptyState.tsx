interface NotificationEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function NotificationEmptyState({ hasFilters, onClearFilters }: NotificationEmptyStateProps) {
  return (
    <div className="card p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
        <svg className="w-8 h-8 text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-paper-900 mb-2">
        {hasFilters ? 'No hay notificaciones con este filtro' : 'No hay notificaciones'}
      </h3>
      <p className="text-paper-500 max-w-md mx-auto">
        {hasFilters
          ? 'No se encontraron notificaciones con los filtros seleccionados.'
          : 'Cuando recibas notificaciones importantes, apareceran aqui.'}
      </p>
      {hasFilters && (
        <button onClick={onClearFilters} className="btn-primary mt-4 text-sm">
          Limpiar filtros
        </button>
      )}
    </div>
  );
}