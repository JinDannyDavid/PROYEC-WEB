from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from api.models import Notificacion
from api.serializers import (
    NotificacionSerializer,
    NotificacionCreateSerializer,
    NotificacionUpdateSerializer
)

# ============================================
# VISTAS PARA NOTIFICACION CON JWT
# ============================================

class NotificacionListCreateView(generics.ListCreateAPIView):
    """Listar todas las notificaciones o crear una nueva"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NotificacionCreateSerializer
        return NotificacionSerializer
    
    def get_queryset(self):
        """Filtrar notificaciones según el usuario"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Notificacion.objects.all().order_by('-fecha_creacion')
        # Usuarios normales solo ven sus notificaciones
        return Notificacion.objects.filter(usuario=user).order_by('-fecha_creacion')
    
    def perform_create(self, serializer):
        """Crear notificación (solo admin)"""
        if self.request.user.tipo_usuario != 'ADMIN':
            raise permissions.PermissionDenied("No tienes permisos para crear notificaciones")
        serializer.save()


class NotificacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar una notificación específica"""
    queryset = Notificacion.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return NotificacionUpdateSerializer
        return NotificacionSerializer
    
    def get_queryset(self):
        """Verificar permisos"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Notificacion.objects.all()
        return Notificacion.objects.filter(usuario=user)


class MisNotificacionesView(generics.ListAPIView):
    """Listar notificaciones del usuario autenticado"""
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')


class NotificacionesNoLeidasView(generics.ListAPIView):
    """Listar notificaciones no leídas del usuario"""
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notificacion.objects.filter(
            usuario=self.request.user,
            leida=False
        ).order_by('-fecha_creacion')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marcar_como_leida(request, pk):
    """Vista para marcar una notificación como leída"""
    try:
        notificacion = Notificacion.objects.get(pk=pk, usuario=request.user)
        notificacion.marcar_como_leida()
        serializer = NotificacionSerializer(notificacion)
        return Response({
            'success': True,
            'message': 'Notificación marcada como leída',
            'data': serializer.data
        })
    except Notificacion.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Notificación no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marcar_todas_como_leidas(request):
    """Vista para marcar todas las notificaciones del usuario como leídas"""
    notificaciones = Notificacion.objects.filter(usuario=request.user, leida=False)
    count = notificaciones.count()
    
    for notif in notificaciones:
        notif.marcar_como_leida()
    
    return Response({
        'success': True,
        'message': f'{count} notificaciones marcadas como leídas'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resumen_notificaciones(request):
    """Obtener resumen de notificaciones del usuario"""
    no_leidas = Notificacion.objects.filter(usuario=request.user, leida=False).count()
    total = Notificacion.objects.filter(usuario=request.user).count()
    
    return Response({
        'success': True,
        'data': {
            'no_leidas': no_leidas,
            'total': total,
            'tiene_no_leidas': no_leidas > 0
        }
    })