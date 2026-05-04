from rest_framework import serializers
from api.models import Pago

class PagoSerializer(serializers.ModelSerializer):
    factura_numero = serializers.CharField(source='factura.numero_factura', read_only=True)
    metodo_pago_texto = serializers.SerializerMethodField()
    monto_formateado = serializers.SerializerMethodField()
    fecha_pago_formateada = serializers.SerializerMethodField()
    
    class Meta:
        model = Pago
        fields = [
            'id', 'factura', 'factura_numero', 'monto', 'monto_formateado',
            'metodo_pago', 'metodo_pago_texto', 'codigo_operacion',
            'fecha_pago', 'fecha_pago_formateada', 'estado_comprobante'
        ]
        read_only_fields = ['fecha_pago']
    
    def get_metodo_pago_texto(self, obj):
        return obj.metodo_pago_texto
    
    def get_monto_formateado(self, obj):
        return obj.monto_formateado
    
    def get_fecha_pago_formateada(self, obj):
        if obj.fecha_pago:
            return obj.fecha_pago.strftime('%d/%m/%Y %H:%M')
        return None


class PagoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ['factura', 'monto', 'metodo_pago', 'codigo_operacion']
    
    def validate(self, data):
        factura = data['factura']
        if data['monto'] != factura.monto_total:
            raise serializers.ValidationError({
                'monto': f'El monto debe ser S/ {factura.monto_total}'
            })
        
        if factura.estado == 'PAGADA':
            raise serializers.ValidationError({
                'factura': 'Esta factura ya está pagada'
            })
        
        return data