from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from api.models import Propiedad, Usuario
from api.serializers import PropiedadSerializer, PropiedadCreateSerializer

# ============================================
# VISTAS PARA PROPIEDAD CON JWT
# ============================================

class PropiedadListCreateView(generics.ListCreateAPIView):
    """Listar todas las propiedades o crear una nueva"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropiedadCreateSerializer
        return PropiedadSerializer
    
    def get_queryset(self):
        """Filtrar propiedades según el usuario"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Propiedad.objects.all().order_by('-id')
        # Usuarios normales solo ven sus propiedades
        return Propiedad.objects.filter(usuario=user).order_by('-id')
    
    def perform_create(self, serializer):
        """Asignar el usuario autenticado a la propiedad"""
        serializer.save(usuario=self.request.user)


class PropiedadDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar una propiedad específica"""
    queryset = Propiedad.objects.all()
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Verificar permisos"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Propiedad.objects.all()
        return Propiedad.objects.filter(usuario=user)
    
    def perform_update(self, serializer):
        """Actualizar propiedad"""
        serializer.save()
    
    def perform_destroy(self, instance):
        """Eliminar propiedad"""
        instance.delete()


class MisPropiedadesView(generics.ListAPIView):
    """Listar propiedades del usuario autenticado"""
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Propiedad.objects.filter(usuario=self.request.user).order_by('-id')


class PropiedadesPorUsuarioView(generics.ListAPIView):
    """Listar propiedades de un usuario específico (solo admin)"""
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.tipo_usuario != 'ADMIN':
            return Propiedad.objects.none()
        
        usuario_id = self.kwargs.get('usuario_id')
        return Propiedad.objects.filter(usuario_id=usuario_id).order_by('-id')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buscar_propiedad_por_medidor(request):
    """Buscar propiedad por número de medidor"""
    numero_medidor = request.query_params.get('medidor')
    
    if not numero_medidor:
        return Response({
            'success': False,
            'error': 'Debe proporcionar número de medidor'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        propiedad = Propiedad.objects.get(numero_medidor=numero_medidor)
        serializer = PropiedadSerializer(propiedad)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Propiedad.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Propiedad no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)