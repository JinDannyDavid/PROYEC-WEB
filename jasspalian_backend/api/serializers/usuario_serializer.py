from rest_framework import serializers
from api.models import Usuario
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    fecha_registro_formateada = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'dni', 'nombres', 'apellidos', 'nombre_completo',
            'telefono', 'email', 'direccion', 'sector', 'tipo_usuario',
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
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    
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
        return data
    
    def validate_dni(self, value):
        if Usuario.objects.filter(dni=value).exists():
            raise serializers.ValidationError('Este DNI ya está registrado')
        return value
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        # Usar create_user para hashear la contraseña
        usuario = Usuario.objects.create(
            dni=validated_data.pop('dni'),
            password=password,
            **validated_data
        )
        return usuario