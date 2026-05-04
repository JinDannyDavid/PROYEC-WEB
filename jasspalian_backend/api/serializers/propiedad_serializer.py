from rest_framework import serializers
from api.models import Propiedad

class PropiedadSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    estado_texto = serializers.SerializerMethodField()
    tipo_texto = serializers.SerializerMethodField()
    
    class Meta:
        model = Propiedad
        fields = [
            'id', 'usuario', 'usuario_nombre', 'direccion', 'sector',
            'numero_medidor', 'tipo_propiedad', 'tipo_texto',
            'estado', 'estado_texto'
        ]
    
    def get_estado_texto(self, obj):
        return obj.estado_texto
    
    def get_tipo_texto(self, obj):
        return obj.tipo_texto


class PropiedadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = [
            'usuario', 'direccion', 'sector', 'numero_medidor',
            'tipo_propiedad', 'estado'
        ]
    
    def validate_numero_medidor(self, value):
        if Propiedad.objects.filter(numero_medidor=value).exists():
            raise serializers.ValidationError('Este número de medidor ya está registrado')
        return value