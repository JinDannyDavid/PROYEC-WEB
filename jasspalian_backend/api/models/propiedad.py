from django.db import models
from .usuario import Usuario

class Propiedad(models.Model):
    TIPO_PROPIEDAD_CHOICES = [
        ('DOMESTICO', 'Doméstico'),
        ('COMERCIAL', 'Comercial'),
        ('INDUSTRIAL', 'Industrial'),
    ]
    
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('CORTADO', 'Cortado'),
        ('MOROSO', 'Moroso'),
        ('SUSPENDIDO', 'Suspendido'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='propiedades')
    direccion = models.TextField()
    sector = models.CharField(max_length=100)
    numero_medidor = models.CharField(max_length=20, unique=True)
    tipo_propiedad = models.CharField(max_length=20, choices=TIPO_PROPIEDAD_CHOICES, default='DOMESTICO')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ACTIVO')
    
    class Meta:
        db_table = 'propiedades'
    
    def __str__(self):
        return self.direccion