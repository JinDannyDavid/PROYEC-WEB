from rest_framework import serializers
from api.models import Reclamo

class ReclamoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    propiedad_direccion = serializers.CharField(source='propiedad.direccion', read_only=True)
    tipo_texto = serializers.SerializerMethodField()
    estado_texto = serializers.SerializerMethodField()
    tiempo_transcurrido = serializers.SerializerMethodField()
    fecha_formateada = serializers.SerializerMethodField()
    
    class Meta:
        model = Reclamo
        fields = [
            'id', 'usuario', 'usuario_nombre', 'propiedad', 'propiedad_direccion',
            'tipo', 'tipo_texto', 'descripcion', 'foto_url',
            'estado', 'estado_texto', 'fecha_creacion', 'fecha_formateada',
            'tiempo_transcurrido', 'respuesta', 'fecha_respuesta'
        ]
        read_only_fields = ['fecha_creacion']
    
    def get_tipo_texto(self, obj):
        return obj.tipo_texto
    
    def get_estado_texto(self, obj):
        return obj.estado_texto
    
    def get_tiempo_transcurrido(self, obj):
        return obj.tiempo_transcurrido
    
    def get_fecha_formateada(self, obj):
        if obj.fecha_creacion:
            return obj.fecha_creacion.strftime('%d/%m/%Y')
        return None


class ReclamoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = ['usuario', 'propiedad', 'tipo', 'descripcion', 'foto_url']
    
    def validate_descripcion(self, value):
        if len(value) < 10:
            raise serializers.ValidationError(
                'La descripción debe tener al menos 10 caracteres'
            )
        return value


class ReclamoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = ['estado', 'respuesta']
    
    def validate(self, data):
        if data.get('estado') in ['RESUELTO', 'RECHAZADO'] and not data.get('respuesta'):
            raise serializers.ValidationError({
                'respuesta': 'Debe proporcionar una respuesta cuando resuelve o rechaza'
            })
        return data