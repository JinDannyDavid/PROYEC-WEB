from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from api.models import Reclamo, Propiedad
from api.serializers import (
    ReclamoSerializer,
    ReclamoCreateSerializer,
    ReclamoUpdateSerializer
)

# ============================================
# VISTAS PARA RECLAMO CON JWT
# ============================================

class ReclamoListCreateView(generics.ListCreateAPIView):
    """Listar todos los reclamos o crear uno nuevo"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tipo', 'estado']
    ordering_fields = ['fecha_creacion']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReclamoCreateSerializer
        return ReclamoSerializer
    
    def get_queryset(self):
        """Filtrar reclamos según el usuario"""
        user = self.request.user
        if user.tipo_usuario in ['ADMIN', 'TECNICO']:
            return Reclamo.objects.all().order_by('-fecha_creacion')
        # Usuarios normales solo ven sus reclamos
        return Reclamo.objects.filter(usuario=user).order_by('-fecha_creacion')
    
    def perform_create(self, serializer):
        """Crear reclamo (verificar propiedad)"""
        propiedad_id = self.request.data.get('propiedad')
        propiedad = get_object_or_404(Propiedad, id=propiedad_id)
        
        # Verificar que la propiedad pertenezca al usuario
        if propiedad.usuario != self.request.user:
            raise permissions.PermissionDenied("La propiedad no te pertenece")
        
        serializer.save(usuario=self.request.user)


class ReclamoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar un reclamo específico"""
    queryset = Reclamo.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ReclamoUpdateSerializer
        return ReclamoSerializer
    
    def get_queryset(self):
        """Verificar permisos"""
        user = self.request.user
        if user.tipo_usuario in ['ADMIN', 'TECNICO']:
            return Reclamo.objects.all()
        return Reclamo.objects.filter(usuario=user)
    
    def perform_update(self, serializer):
        """Actualizar reclamo (solo admin/tecnico pueden cambiar estado)"""
        user = self.request.user
        if user.tipo_usuario not in ['ADMIN', 'TECNICO']:
            # Usuarios normales solo pueden ver, no actualizar
            raise permissions.PermissionDenied("No tienes permisos para actualizar reclamos")
        
        # Si se está resolviendo, agregar fecha de respuesta
        if 'estado' in serializer.validated_data:
            serializer.validated_data['fecha_respuesta'] = timezone.now()
        
        serializer.save()


class MisReclamosView(generics.ListAPIView):
    """Listar reclamos del usuario autenticado"""
    serializer_class = ReclamoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Reclamo.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')


class ReclamosPorPropiedadView(generics.ListAPIView):
    """Listar reclamos de una propiedad específica"""
    serializer_class = ReclamoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        propiedad_id = self.kwargs['propiedad_id']
        propiedad = get_object_or_404(Propiedad, id=propiedad_id)
        
        # Verificar permisos
        user = self.request.user
        if user.tipo_usuario in ['ADMIN', 'TECNICO'] or propiedad.usuario == user:
            return Reclamo.objects.filter(propiedad_id=propiedad_id).order_by('-fecha_creacion')
        return Reclamo.objects.none()


class ReclamosPendientesView(generics.ListAPIView):
    """Listar reclamos pendientes (solo admin/tecnico)"""
    serializer_class = ReclamoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.tipo_usuario not in ['ADMIN', 'TECNICO']:
            return Reclamo.objects.none()
        
        return Reclamo.objects.filter(estado='PENDIENTE').order_by('fecha_creacion')


class ReclamosEstadisticasView(generics.GenericAPIView):
    """Obtener estadísticas de reclamos (solo admin/tecnico)"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.tipo_usuario not in ['ADMIN', 'TECNICO']:
            return Response({
                'success': False,
                'error': 'No tienes permisos'
            }, status=status.HTTP_403_FORBIDDEN)
        
        reclamos = Reclamo.objects.all()
        
        return Response({
            'success': True,
            'data': {
                'total': reclamos.count(),
                'pendientes': reclamos.filter(estado='PENDIENTE').count(),
                'en_proceso': reclamos.filter(estado='EN_PROCESO').count(),
                'resueltos': reclamos.filter(estado='RESUELTO').count(),
                'rechazados': reclamos.filter(estado='RECHAZADO').count(),
            }
        })