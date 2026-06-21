from rest_framework import serializers
from api.models import Factura
from api.serializers.mixins import ChoiceDisplayMixin

class FacturaSerializer(ChoiceDisplayMixin, serializers.ModelSerializer):
    propiedad_direccion = serializers.CharField(source='propiedad.direccion', read_only=True)
    estado_actual = serializers.SerializerMethodField()
    monto_formateado = serializers.SerializerMethodField()
    esta_vencida = serializers.SerializerMethodField()
    
    class Meta:
        model = Factura
        fields = [
            'id', 'propiedad', 'propiedad_direccion', 'numero_factura',
            'periodo', 'fecha_emision', 'fecha_vencimiento',
            'lectura_anterior', 'lectura_actual', 'consumo_m3',
            'cargo_fijo', 'cargo_consumo', 'cargo_alcantarillado', 'monto_total',
            'monto_formateado', 'estado', 'estado_actual', 'esta_vencida'
        ]
        read_only_fields = ['consumo_m3', 'cargo_consumo', 'monto_total']
    
    def get_estado_actual(self, obj):
        return obj.estado_actual
    
    def get_monto_formateado(self, obj):
        return obj.monto_formateado
    
    def get_esta_vencida(self, obj):
        return obj.esta_vencida


class FacturaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = [
            'propiedad', 'numero_factura', 'periodo',
            'fecha_emision', 'fecha_vencimiento',
            'lectura_anterior', 'lectura_actual',
            'cargo_fijo', 'cargo_alcantarillado'
        ]
    
    def validate(self, data):
        if data['lectura_actual'] <= data['lectura_anterior']:
            raise serializers.ValidationError({
                'lectura_actual': 'La lectura actual debe ser mayor que la anterior'
            })
        return data