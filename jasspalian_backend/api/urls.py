# api/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView
from .views.test_views import test_connection
from .views.admin_views import AdminEstadisticasView
from .views import (
    # Usuario
    CustomTokenObtainPairView,
    UsuarioListCreateView,
    UsuarioDetailView,
    perfil_view,
    actualizar_perfil_view,
    cambiar_password_view,
    
    # Propiedad
    PropiedadListCreateView,
    PropiedadDetailView,
    MisPropiedadesView,
    PropiedadesPorUsuarioView,
    buscar_propiedad_por_medidor,
    
    # Factura
    FacturaListCreateView,
    FacturaDetailView,
    FacturasPendientesView,
    FacturasVencidasView,
    FacturasPorPropiedadView,
    ResumenFacturasView,
    
    # Pago
    PagoListCreateView,
    PagoDetailView,
    PagosPorFacturaView,
    MisPagosView,
    ResumenPagosView,
    
    # Reclamo
    ReclamoListCreateView,
    ReclamoDetailView,
    MisReclamosView,
    ReclamosPorPropiedadView,
    ReclamosPendientesView,
    ReclamosEstadisticasView,
    
    # Notificacion
    NotificacionListCreateView,
    NotificacionDetailView,
    MisNotificacionesView,
    NotificacionesNoLeidasView,
    marcar_como_leida,
    marcar_todas_como_leidas,
    resumen_notificaciones,
)

urlpatterns = [
    # ============================================
    # URLs PARA AUTENTICACIÓN JWT
    # ============================================
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ============================================
    # URLs PARA USUARIO
    # ============================================
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
    path('perfil/', perfil_view, name='perfil'),
    path('perfil/actualizar/', actualizar_perfil_view, name='perfil-actualizar'),
    path('cambiar-password/', cambiar_password_view, name='cambiar-password'),
    
    # ============================================
    # URLs PARA PROPIEDAD
    # ============================================
    path('propiedades/', PropiedadListCreateView.as_view(), name='propiedad-list'),
    path('propiedades/<int:pk>/', PropiedadDetailView.as_view(), name='propiedad-detail'),
    path('mis-propiedades/', MisPropiedadesView.as_view(), name='mis-propiedades'),
    path('propiedades/usuario/<int:usuario_id>/', PropiedadesPorUsuarioView.as_view(), name='propiedades-usuario'),
    path('propiedades/buscar/', buscar_propiedad_por_medidor, name='buscar-propiedad'),
    
    # ============================================
    # URLs PARA FACTURA
    # ============================================
    path('facturas/', FacturaListCreateView.as_view(), name='factura-list'),
    path('facturas/<int:pk>/', FacturaDetailView.as_view(), name='factura-detail'),
    path('facturas/pendientes/', FacturasPendientesView.as_view(), name='facturas-pendientes'),
    path('facturas/vencidas/', FacturasVencidasView.as_view(), name='facturas-vencidas'),
    path('facturas/propiedad/<int:propiedad_id>/', FacturasPorPropiedadView.as_view(), name='facturas-propiedad'),
    path('facturas/resumen/', ResumenFacturasView.as_view(), name='facturas-resumen'),
    
    # ============================================
    # URLs PARA PAGO
    # ============================================
    path('pagos/', PagoListCreateView.as_view(), name='pago-list'),
    path('pagos/<int:pk>/', PagoDetailView.as_view(), name='pago-detail'),
    path('pagos/factura/<int:factura_id>/', PagosPorFacturaView.as_view(), name='pagos-factura'),
    path('mis-pagos/', MisPagosView.as_view(), name='mis-pagos'),
    path('pagos/resumen/', ResumenPagosView.as_view(), name='pagos-resumen'),
    
    # ============================================
    # URLs PARA RECLAMO
    # ============================================
    path('reclamos/', ReclamoListCreateView.as_view(), name='reclamo-list'),
    path('reclamos/<int:pk>/', ReclamoDetailView.as_view(), name='reclamo-detail'),
    path('mis-reclamos/', MisReclamosView.as_view(), name='mis-reclamos'),
    path('reclamos/propiedad/<int:propiedad_id>/', ReclamosPorPropiedadView.as_view(), name='reclamos-propiedad'),
    path('reclamos/pendientes/', ReclamosPendientesView.as_view(), name='reclamos-pendientes'),
    path('reclamos/estadisticas/', ReclamosEstadisticasView.as_view(), name='reclamos-estadisticas'),
    
    # ============================================
    # URLs PARA NOTIFICACION
    # ============================================
    path('notificaciones/', NotificacionListCreateView.as_view(), name='notificacion-list'),
    path('notificaciones/<int:pk>/', NotificacionDetailView.as_view(), name='notificacion-detail'),
    path('mis-notificaciones/', MisNotificacionesView.as_view(), name='mis-notificaciones'),
    path('notificaciones/no-leidas/', NotificacionesNoLeidasView.as_view(), name='notificaciones-no-leidas'),
    path('notificaciones/<int:pk>/leer/', marcar_como_leida, name='notificacion-leer'),
    path('notificaciones/leer-todas/', marcar_todas_como_leidas, name='notificaciones-leer-todas'),
    path('notificaciones/resumen/', resumen_notificaciones, name='notificaciones-resumen'),


    path('admin/estadisticas/', AdminEstadisticasView.as_view(), name='admin-estadisticas'),
    path('test/', test_connection, name='test'),
]