from django.db import models
from django.utils import timezone
from django.conf import settings
from .propiedad import Propiedad

def get_cargo_fijo_default():
    return getattr(settings, 'JASS_CARGO_FIJO_DEFAULT', 25.00)

def get_cargo_alcantarillado_default():
    return getattr(settings, 'JASS_CARGO_ALCANTARILLADO_DEFAULT', 15.00)

class Factura(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADA', 'Pagada'),
        ('VENCIDA', 'Vencida'),
        ('ANULADA', 'Anulada'),
    ]
    
    propiedad = models.ForeignKey(
        Propiedad,
        on_delete=models.CASCADE,
        related_name='facturas',
        verbose_name="Propiedad"
    )
    numero_factura = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Número de factura"
    )
    periodo = models.CharField(
        max_length=7,
        verbose_name="Período (MM/YYYY)",
        help_text="Formato: MM/YYYY"
    )
    fecha_emision = models.DateField(verbose_name="Fecha de emisión")
    fecha_vencimiento = models.DateField(verbose_name="Fecha de vencimiento")
    
    # Lecturas del medidor
    lectura_anterior = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Lectura anterior (m³)"
    )
    lectura_actual = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Lectura actual (m³)"
    )
    consumo_m3 = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Consumo (m³)",
        editable=False  # Se calcula automáticamente
    )
    
    # Cargos
    cargo_fijo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=get_cargo_fijo_default,
        verbose_name="Cargo fijo (S/)"
    )
    cargo_consumo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Cargo por consumo (S/)",
        editable=False  # Se calcula automáticamente
    )
    cargo_alcantarillado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=get_cargo_alcantarillado_default,
        verbose_name="Cargo por alcantarillado (S/)"
    )
    monto_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Monto total (S/)",
        editable=False  # Se calcula automáticamente
    )
    
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE',
        verbose_name="Estado"
    )
    
    class Meta:
        db_table = 'facturas'
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        indexes = [
            models.Index(fields=['propiedad', 'periodo']),
            models.Index(fields=['fecha_vencimiento', 'estado']),
            models.Index(fields=['numero_factura']),
        ]
        unique_together = ['propiedad', 'periodo']  # Una factura por propiedad y período
    
    def __str__(self):
        return f"{self.numero_factura} - {self.periodo}"
    
    def save(self, *args, **kwargs):
        # Calcular consumo
        self.consumo_m3 = self.lectura_actual - self.lectura_anterior
        
        # Calcular cargo por consumo (configurable via settings)
        tarifa_por_m3 = getattr(settings, 'JASS_TARIFA_POR_M3', 3.50)
        self.cargo_consumo = self.consumo_m3 * tarifa_por_m3
        
        # Calcular monto total
        self.monto_total = self.cargo_fijo + self.cargo_consumo + self.cargo_alcantarillado
        
        super().save(*args, **kwargs)
    
    @property
    def esta_vencida(self):
        """Verifica si la factura está vencida (usa fecha actual)"""
        return self._esta_vencida_en(timezone.now().date())
    
    def _esta_vencida_en(self, fecha_referencia):
        """Verifica vencimiento en una fecha específica (para testing/batches)"""
        return self.estado == 'PENDIENTE' and self.fecha_vencimiento < fecha_referencia
    
    @property
    def estado_actual(self):
        """Retorna el estado considerando vencimiento"""
        if self.esta_vencida:
            return 'VENCIDA'
        return self.estado
    
    @property
    def monto_formateado(self):
        """Retorna el monto con formato S/"""
        return f"S/ {self.monto_total:.2f}"