from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinLengthValidator, RegexValidator
from django.utils import timezone

class UsuarioManager(BaseUserManager):
    def create_user(self, dni, password=None, **extra_fields):
        if not dni:
            raise ValueError('El DNI es obligatorio')
        
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('tipo_usuario', 'VECINO')
        
        user = self.model(dni=dni, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, dni, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo_usuario', 'ADMIN')
        
        return self.create_user(dni, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    TIPO_USUARIO_CHOICES = [
        ('VECINO', 'Vecino'),
        ('ADMIN', 'Administrador'),
        ('CAJERO', 'Cajero'),
        ('TECNICO', 'Técnico'),
    ]
    
    dni = models.CharField(
        max_length=8,
        unique=True,
        validators=[
            MinLengthValidator(8),
            RegexValidator(r'^[0-9]+$', 'Solo números permitidos')
        ],
        verbose_name="DNI"
    )
    nombres = models.CharField(max_length=100, verbose_name="Nombres")
    apellidos = models.CharField(max_length=100, verbose_name="Apellidos")
    telefono = models.CharField(
        max_length=9,
        validators=[
            MinLengthValidator(9),
            RegexValidator(r'^[0-9]+$', 'Solo números permitidos')
        ],
        verbose_name="Teléfono"
    )
    email = models.EmailField(null=True, blank=True, verbose_name="Correo electrónico")
    direccion = models.TextField(verbose_name="Dirección")
    sector = models.CharField(max_length=100, verbose_name="Sector")
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        default='VECINO',
        verbose_name="Tipo de usuario"
    )
    foto_url = models.URLField(max_length=200, null=True, blank=True, verbose_name="Foto")
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de registro")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    # Campos requeridos por Django
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = ['nombres', 'apellidos', 'telefono', 'direccion', 'sector']
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        indexes = [
            models.Index(fields=['dni']),
            models.Index(fields=['email']),
            models.Index(fields=['tipo_usuario']),
        ]
    
    def __str__(self):
        return f"{self.nombres} {self.apellidos} - {self.dni}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellidos}".strip()