from django.db import models
from .factura import Factura

class Pago(models.Model):
    """Modelo para los pagos realizados"""
    
    METODO_CHOICES = [
        ('YAPE', 'Yape'),
        ('PLIN', 'Plin'),
        ('TRANSFERENCIA', 'Transferencia bancaria'),
        ('EFECTIVO', 'Efectivo'),
    ]
    
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('CONFIRMADO', 'Confirmado'),
        ('RECHAZADO', 'Rechazado'),
    ]
    
    factura = models.ForeignKey(
        Factura,
        on_delete=models.CASCADE,
        related_name='pagos',
        verbose_name="Factura asociada"
    )
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Monto pagado (S/)"
    )
    metodo_pago = models.CharField(
        max_length=20,
        choices=METODO_CHOICES,
        verbose_name="Método de pago"
    )
    codigo_operacion = models.CharField(
        max_length=100,
        verbose_name="Código de operación",
        help_text="Código de Yape, Plin o transferencia"
    )
    fecha_pago = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de pago"
    )
    estado_comprobante = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE',
        verbose_name="Estado del comprobante"
    )
    
    class Meta:
        db_table = 'pagos'
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"
        indexes = [
            models.Index(fields=['fecha_pago']),
            models.Index(fields=['factura', 'estado_comprobante']),
            models.Index(fields=['codigo_operacion']),
        ]
        ordering = ['-fecha_pago']
    
    def __str__(self):
        return f"Pago {self.codigo_operacion} - S/{self.monto}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Si el pago es confirmado, actualizar estado de factura
        if self.estado_comprobante == 'CONFIRMADO':
            self.factura.estado = 'PAGADA'
            self.factura.save()
    
    @property
    def metodo_pago_texto(self):
        """Retorna el método de pago en formato legible"""
        return dict(self.METODO_CHOICES).get(self.metodo_pago, self.metodo_pago)
    
    @property
    def monto_formateado(self):
        """Retorna el monto con formato S/"""
        return f"S/ {self.monto:.2f}"