# api/serializers/__init__.py

from .usuario_serializer import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
)

from .propiedad_serializer import (
    PropiedadSerializer,
    PropiedadCreateSerializer,
)

from .factura_serializer import (
    FacturaSerializer,
    FacturaCreateSerializer,
)

from .pago_serializer import (
    PagoSerializer,
    PagoCreateSerializer,
)

from .reclamo_serializer import (
    ReclamoSerializer,
    ReclamoCreateSerializer,
    ReclamoUpdateSerializer,
)

from .notificacion_serializer import (
    NotificacionSerializer,
    NotificacionCreateSerializer,
    NotificacionUpdateSerializer,
)

from .token_serializer import CustomTokenObtainPairSerializer  # ← NUEVO

__all__ = [
    # Usuario
    'UsuarioSerializer',
    'UsuarioRegistroSerializer',
    
    # Propiedad
    'PropiedadSerializer',
    'PropiedadCreateSerializer',
    
    # Factura
    'FacturaSerializer',
    'FacturaCreateSerializer',
    
    # Pago
    'PagoSerializer',
    'PagoCreateSerializer',
    
    # Reclamo
    'ReclamoSerializer',
    'ReclamoCreateSerializer',
    'ReclamoUpdateSerializer',
    
    # Notificacion
    'NotificacionSerializer',
    'NotificacionCreateSerializer',
    'NotificacionUpdateSerializer',
    
    # Token
    'CustomTokenObtainPairSerializer',  # ← NUEVO
]