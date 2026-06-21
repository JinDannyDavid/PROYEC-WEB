"""Constantes compartidas para la API"""

class TipoUsuario:
    VECINO = 'VECINO'
    ADMIN = 'ADMIN'
    CAJERO = 'CAJERO'
    TECNICO = 'TECNICO'
    
    CHOICES = [
        (VECINO, 'Vecino'),
        (ADMIN, 'Administrador'),
        (CAJERO, 'Cajero'),
        (TECNICO, 'Técnico'),
    ]
    
    @classmethod
    def is_admin(cls, tipo: str) -> bool:
        return tipo == cls.ADMIN
    
    @classmethod
    def is_staff(cls, tipo: str) -> bool:
        return tipo in [cls.ADMIN, cls.CAJERO, cls.TECNICO]
    
    @classmethod
    def can_manage_billing(cls, tipo: str) -> bool:
        return tipo in [cls.ADMIN, cls.CAJERO]
    
    @classmethod
    def can_manage_technical(cls, tipo: str) -> bool:
        return tipo in [cls.ADMIN, cls.TECNICO]
    
    @classmethod
    def is_tecnico(cls, tipo: str) -> bool:
        return tipo == cls.TECNICO


class FacturaEstado:
    PENDIENTE = 'PENDIENTE'
    PAGADA = 'PAGADA'
    VENCIDA = 'VENCIDA'
    ANULADA = 'ANULADA'
    
    CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (PAGADA, 'Pagada'),
        (VENCIDA, 'Vencida'),
        (ANULADA, 'Anulada'),
    ]


class PagoEstado:
    PENDIENTE = 'PENDIENTE'
    CONFIRMADO = 'CONFIRMADO'
    RECHAZADO = 'RECHAZADO'
    
    CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (CONFIRMADO, 'Confirmado'),
        (RECHAZADO, 'Rechazado'),
    ]


class ReclamoEstado:
    PENDIENTE = 'PENDIENTE'
    EN_PROCESO = 'EN_PROCESO'
    RESUELTO = 'RESUELTO'
    RECHAZADO = 'RECHAZADO'
    
    CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (EN_PROCESO, 'En proceso'),
        (RESUELTO, 'Resuelto'),
        (RECHAZADO, 'Rechazado'),
    ]


class ReclamoTipo:
    FUGA = 'FUGA'
    CALIDAD_AGUA = 'CALIDAD_AGUA'
    MEDIDOR = 'MEDIDOR'
    FACTURACION = 'FACTURACION'
    CORTE = 'CORTE'
    OTRO = 'OTRO'
    
    CHOICES = [
        (FUGA, 'Fuga de agua'),
        (CALIDAD_AGUA, 'Calidad del agua'),
        (MEDIDOR, 'Problema con medidor'),
        (FACTURACION, 'Problema de facturación'),
        (CORTE, 'Corte de servicio'),
        (OTRO, 'Otro'),
    ]


class NotificacionTipo:
    PAGO = 'PAGO'
    CORTE = 'CORTE'
    RECORDATORIO = 'RECORDATORIO'
    COMUNICADO = 'COMUNICADO'
    RECLAMO = 'RECLAMO'
    FACTURA = 'FACTURA'
    
    CHOICES = [
        (PAGO, 'Pago realizado'),
        (CORTE, 'Corte programado'),
        (RECORDATORIO, 'Recordatorio de pago'),
        (COMUNICADO, 'Comunicado general'),
        (RECLAMO, 'Actualización de reclamo'),
        (FACTURA, 'Nueva factura'),
    ]


class PropiedadEstado:
    ACTIVO = 'ACTIVO'
    CORTADO = 'CORTADO'
    MOROSO = 'MOROSO'
    SUSPENDIDO = 'SUSPENDIDO'
    
    CHOICES = [
        (ACTIVO, 'Activo'),
        (CORTADO, 'Cortado'),
        (MOROSO, 'Moroso'),
        (SUSPENDIDO, 'Suspendido'),
    ]


class PropiedadTipo:
    DOMESTICO = 'DOMESTICO'
    COMERCIAL = 'COMERCIAL'
    INDUSTRIAL = 'INDUSTRIAL'
    
    CHOICES = [
        (DOMESTICO, 'Doméstico'),
        (COMERCIAL, 'Comercial'),
        (INDUSTRIAL, 'Industrial'),
    ]


class PagoMetodo:
    YAPE = 'YAPE'
    PLIN = 'PLIN'
    TRANSFERENCIA = 'TRANSFERENCIA'
    EFECTIVO = 'EFECTIVO'
    
    CHOICES = [
        (YAPE, 'Yape'),
        (PLIN, 'Plin'),
        (TRANSFERENCIA, 'Transferencia bancaria'),
        (EFECTIVO, 'Efectivo'),
    ]