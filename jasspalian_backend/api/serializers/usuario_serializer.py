from rest_framework import serializers
from api.models import Usuario
from api.serializers.mixins import ChoiceDisplayMixin

class UsuarioSerializer(ChoiceDisplayMixin, serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    fecha_registro_formateada = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'dni', 'nombres', 'apellidos', 'nombre_completo',
            'telefono', 'email', 'direccion', 'sector', 'tipo_usuario', 'tipo_usuario_display',
            'foto_url', 'fecha_registro', 'fecha_registro_formateada', 'activo',
            'is_active', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['id', 'fecha_registro']
    
    def get_nombre_completo(self, obj):
        return obj.nombre_completo
    
    def get_fecha_registro_formateada(self, obj):
        if obj.fecha_registro:
            return obj.fecha_registro.strftime('%d/%m/%Y')
        return None

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Usuario
        fields = [
            'dni', 'nombres', 'apellidos', 'telefono', 'email',
            'direccion', 'sector', 'password', 'confirm_password'
        ]
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Las contraseñas no coinciden'
            })
        
        # Validar fortaleza de contraseña (consistente con cambiar_password)
        password = data['password']
        import re
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({
                'password': 'La contraseña debe contener al menos una mayúscula'
            })
        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError({
                'password': 'La contraseña debe contener al menos una minúscula'
            })
        if not re.search(r'\d', password):
            raise serializers.ValidationError({
                'password': 'La contraseña debe contener al menos un número'
            })
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
            raise serializers.ValidationError({
                'password': 'La contraseña debe contener al menos un carácter especial'
            })
        
        return data
    
    def validate_dni(self, value):
        if Usuario.objects.filter(dni=value).exists():
            raise serializers.ValidationError('Este DNI ya está registrado')
        return value
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        dni = validated_data.pop('dni')
        
        usuario = Usuario.objects.create_user(
            dni=dni,
            password=password,
            **validated_data
        )
        return usuario