from django.db import models
from .usuario import Usuario
from .propiedad import Propiedad

class Reclamo(models.Model):
    """Modelo para reclamos y quejas de usuarios"""
    
    TIPO_CHOICES = [
        ('FUGA', 'Fuga de agua'),
        ('CALIDAD_AGUA', 'Calidad del agua'),
        ('MEDIDOR', 'Problema con medidor'),
        ('FACTURACION', 'Problema de facturación'),
        ('CORTE', 'Corte de servicio'),
        ('OTRO', 'Otro'),
    ]
    
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROCESO', 'En proceso'),
        ('RESUELTO', 'Resuelto'),
        ('RECHAZADO', 'Rechazado'),
    ]
    
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='reclamos',
        verbose_name="Usuario que reporta"
    )
    propiedad = models.ForeignKey(
        Propiedad,
        on_delete=models.CASCADE,
        related_name='reclamos',
        verbose_name="Propiedad afectada"
    )
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        verbose_name="Tipo de reclamo"
    )
    descripcion = models.TextField(
        verbose_name="Descripción del problema",
        help_text="Describa detalladamente el problema"
    )
    foto_url = models.URLField(
        null=True,
        blank=True,
        verbose_name="URL de foto",
        help_text="Foto del problema (opcional)"
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE',
        verbose_name="Estado"
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )
    respuesta = models.TextField(
        null=True,
        blank=True,
        verbose_name="Respuesta de JASS",
        help_text="Respuesta del personal de JASS"
    )
    fecha_respuesta = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de respuesta"
    )
    
    class Meta:
        db_table = 'reclamos'
        verbose_name = "Reclamo"
        verbose_name_plural = "Reclamos"
        indexes = [
            models.Index(fields=['usuario', 'estado']),
            models.Index(fields=['fecha_creacion']),
            models.Index(fields=['tipo']),
        ]
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Reclamo #{self.id} - {self.get_tipo_display()}"
    
    def save(self, *args, **kwargs):
        # Si hay respuesta y no tiene fecha, poner fecha actual
        if self.respuesta and not self.fecha_respuesta:
            from django.utils import timezone
            self.fecha_respuesta = timezone.now()
        super().save(*args, **kwargs)
    
    @property
    def tipo_texto(self):
        """Retorna el tipo en formato legible"""
        return dict(self.TIPO_CHOICES).get(self.tipo, self.tipo)
    
    @property
    def estado_texto(self):
        """Retorna el estado en formato legible"""
        return dict(self.ESTADO_CHOICES).get(self.estado, self.estado)
    
    @property
    def tiempo_transcurrido(self):
        """Retorna el tiempo transcurrido desde la creación"""
        from django.utils import timezone
        delta = timezone.now() - self.fecha_creacion
        dias = delta.days
        if dias == 0:
            horas = delta.seconds // 3600
            if horas == 0:
                minutos = (delta.seconds // 60) % 60
                return f"Hace {minutos} minutos"
            return f"Hace {horas} horas"
        elif dias == 1:
            return "Ayer"
        else:
            return f"Hace {dias} días"