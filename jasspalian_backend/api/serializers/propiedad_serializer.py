from rest_framework import serializers
from api.models import Propiedad
from api.serializers.mixins import ChoiceDisplayMixin

class PropiedadSerializer(ChoiceDisplayMixin, serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    
    class Meta:
        model = Propiedad
        fields = [
            'id', 'usuario', 'usuario_nombre', 'direccion', 'sector',
            'numero_medidor', 'tipo_propiedad', 'tipo_propiedad_display',
            'estado', 'estado_display'
        ]


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