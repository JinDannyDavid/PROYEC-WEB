from rest_framework import serializers
from django.db import transaction
from api.models import Pago, Factura
from api.serializers.mixins import ChoiceDisplayMixin

class PagoSerializer(ChoiceDisplayMixin, serializers.ModelSerializer):
    factura_numero = serializers.CharField(source='factura.numero_factura', read_only=True)
    monto_formateado = serializers.SerializerMethodField()
    fecha_pago_formateada = serializers.SerializerMethodField()
    
    class Meta:
        model = Pago
        fields = [
            'id', 'factura', 'factura_numero', 'monto', 'monto_formateado',
            'metodo_pago', 'metodo_pago_display', 'codigo_operacion',
            'fecha_pago', 'fecha_pago_formateada', 'estado_comprobante', 'estado_comprobante_display'
        ]
        read_only_fields = ['fecha_pago']
    
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
        # Validaciones básicas sin lock (solo lectura)
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
    
    def create(self, validated_data):
        # Validación y creación en transacción atómica con lock
        with transaction.atomic():
            factura = Factura.objects.select_for_update().get(pk=validated_data['factura'].pk)
            
            # Re-validar dentro de la transacción (double-check)
            if validated_data['monto'] != factura.monto_total:
                raise serializers.ValidationError({
                    'monto': f'El monto debe ser S/ {factura.monto_total}'
                })
            
            if factura.estado == 'PAGADA':
                raise serializers.ValidationError({
                    'factura': 'Esta factura ya está pagada'
                })
            
            validated_data['factura'] = factura
            return super().create(validated_data)