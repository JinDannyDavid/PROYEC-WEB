from rest_framework import serializers
from api.models import Notificacion
from api.serializers.mixins import ChoiceDisplayMixin

class NotificacionSerializer(ChoiceDisplayMixin, serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    tiempo_transcurrido = serializers.SerializerMethodField()
    
    class Meta:
        model = Notificacion
        fields = [
            'id', 'usuario', 'usuario_nombre', 'titulo', 'mensaje',
            'tipo', 'tipo_display', 'leida', 'fecha_creacion',
            'fecha_lectura', 'tiempo_transcurrido'
        ]
        read_only_fields = ['fecha_creacion']
    
    def get_tiempo_transcurrido(self, obj):
        return obj.tiempo_transcurrido


class NotificacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['usuario', 'titulo', 'mensaje', 'tipo']


class NotificacionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['leida']