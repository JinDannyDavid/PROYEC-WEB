# Este archivo hace que la carpeta sea un "módulo Python"
# Y exporta todos los modelos para que Django los vea

from .usuario import Usuario
from .propiedad import Propiedad
from .factura import Factura
from .pago import Pago
from .reclamo import Reclamo
from .notificacion import Notificacion

# Esto es como decir: "cuando alguien importe models, que vea estas clases"
__all__ = [
    'Usuario',
    'Propiedad',
    'Factura',
    'Pago',
    'Reclamo',
    'Notificacion',
]