from django.db import models
from .usuario import Usuario

class Notificacion(models.Model):
    """Modelo para notificaciones a usuarios"""
    
    TIPO_CHOICES = [
        ('PAGO', 'Pago realizado'),
        ('CORTE', 'Corte programado'),
        ('RECORDATORIO', 'Recordatorio de pago'),
        ('COMUNICADO', 'Comunicado general'),
        ('RECLAMO', 'Actualización de reclamo'),
        ('FACTURA', 'Nueva factura'),
    ]
    
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='notificaciones',
        verbose_name="Usuario destinatario"
    )
    titulo = models.CharField(
        max_length=200,
        verbose_name="Título de la notificación"
    )
    mensaje = models.TextField(
        verbose_name="Mensaje"
    )
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        verbose_name="Tipo de notificación"
    )
    leida = models.BooleanField(
        default=False,
        verbose_name="Leída"
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )
    fecha_lectura = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de lectura"
    )
    
    class Meta:
        db_table = 'notificaciones'
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        indexes = [
            models.Index(fields=['usuario', 'leida']),
            models.Index(fields=['fecha_creacion']),
            models.Index(fields=['tipo']),
        ]
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.titulo} - {self.usuario}"
    
    def marcar_como_leida(self):
        """Marca la notificación como leída"""
        if not self.leida:
            from django.utils import timezone
            self.leida = True
            self.fecha_lectura = timezone.now()
            self.save()
    
    @property
    def tipo_texto(self):
        """Retorna el tipo en formato legible"""
        return dict(self.TIPO_CHOICES).get(self.tipo, self.tipo)
    
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
        elif dias < 7:
            return f"Hace {dias} días"
        else:
            semanas = dias // 7
            return f"Hace {semanas} semanas"