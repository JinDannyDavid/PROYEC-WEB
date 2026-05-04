from .usuario_views import (
    CustomTokenObtainPairView,
    UsuarioListCreateView,
    UsuarioDetailView,
    perfil_view,
    actualizar_perfil_view,
    cambiar_password_view,
)

from .propiedad_views import (
    PropiedadListCreateView,
    PropiedadDetailView,
    MisPropiedadesView,
    PropiedadesPorUsuarioView,
    buscar_propiedad_por_medidor,
)

from .factura_views import (
    FacturaListCreateView,
    FacturaDetailView,
    FacturasPendientesView,
    FacturasVencidasView,
    FacturasPorPropiedadView,
    ResumenFacturasView,
)

from .pago_views import (
    PagoListCreateView,
    PagoDetailView,
    PagosPorFacturaView,
    MisPagosView,
    ResumenPagosView,
)

from .reclamo_views import (
    ReclamoListCreateView,
    ReclamoDetailView,
    MisReclamosView,
    ReclamosPorPropiedadView,
    ReclamosPendientesView,
    ReclamosEstadisticasView,
)

from .notificacion_views import (
    NotificacionListCreateView,
    NotificacionDetailView,
    MisNotificacionesView,
    NotificacionesNoLeidasView,
    marcar_como_leida,
    marcar_todas_como_leidas,
    resumen_notificaciones,
)

__all__ = [
    # Usuario
    'CustomTokenObtainPairView',
    'UsuarioListCreateView',
    'UsuarioDetailView',
    'perfil_view',
    'actualizar_perfil_view',
    'cambiar_password_view',
    
    # Propiedad
    'PropiedadListCreateView',
    'PropiedadDetailView',
    'MisPropiedadesView',
    'PropiedadesPorUsuarioView',
    'buscar_propiedad_por_medidor',
    
    # Factura
    'FacturaListCreateView',
    'FacturaDetailView',
    'FacturasPendientesView',
    'FacturasVencidasView',
    'FacturasPorPropiedadView',
    'ResumenFacturasView',
    
    # Pago
    'PagoListCreateView',
    'PagoDetailView',
    'PagosPorFacturaView',
    'MisPagosView',
    'ResumenPagosView',
    
    # Reclamo
    'ReclamoListCreateView',
    'ReclamoDetailView',
    'MisReclamosView',
    'ReclamosPorPropiedadView',
    'ReclamosPendientesView',
    'ReclamosEstadisticasView',
    
    # Notificacion
    'NotificacionListCreateView',
    'NotificacionDetailView',
    'MisNotificacionesView',
    'NotificacionesNoLeidasView',
    'marcar_como_leida',
    'marcar_todas_como_leidas',
    'resumen_notificaciones',
]