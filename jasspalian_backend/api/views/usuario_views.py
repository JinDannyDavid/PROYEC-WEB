from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from api.models import Usuario
from api.serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    CustomTokenObtainPairSerializer
)

# ============================================
# VISTAS PARA USUARIO CON JWT
# ============================================

class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para obtener token JWT con datos del usuario"""
    serializer_class = CustomTokenObtainPairSerializer


class UsuarioListCreateView(generics.ListCreateAPIView):
    """Listar todos los usuarios (solo admin) o crear uno nuevo (público)"""
    queryset = Usuario.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]  # Registro público
        return [IsAuthenticated()]  # Listar solo autenticados
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UsuarioRegistroSerializer
        return UsuarioSerializer
    
    def get_queryset(self):
        """Filtrar usuarios según permisos"""
        user = self.request.user
        if user.is_authenticated and user.tipo_usuario == 'ADMIN':
            return Usuario.objects.all()
        elif user.is_authenticated:
            # Usuarios normales solo ven su propio perfil
            return Usuario.objects.filter(id=user.id)
        return Usuario.objects.none()


class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar un usuario específico"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Usuarios solo pueden ver/editar su propio perfil, admin todos"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Usuario.objects.all()
        return Usuario.objects.filter(id=user.id)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_view(request):
    """Vista para obtener el perfil del usuario autenticado"""
    serializer = UsuarioSerializer(request.user)
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def actualizar_perfil_view(request):
    """Actualizar perfil del usuario autenticado"""
    usuario = request.user
    serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Perfil actualizado correctamente',
            'data': serializer.data
        })
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password_view(request):
    """Vista para cambiar la contraseña"""
    usuario = request.user
    password_actual = request.data.get('password_actual')
    nueva_password = request.data.get('nueva_password')
    confirm_password = request.data.get('confirm_password')
    
    # Validaciones básicas
    if not password_actual or not nueva_password or not confirm_password:
        return Response({
            'success': False,
            'error': 'Todos los campos son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if nueva_password != confirm_password:
        return Response({
            'success': False,
            'error': 'Las contraseñas nuevas no coinciden'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(nueva_password) < 6:
        return Response({
            'success': False,
            'error': 'La contraseña debe tener al menos 6 caracteres'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar contraseña actual
    if not usuario.check_password(password_actual):
        return Response({
            'success': False,
            'error': 'Contraseña actual incorrecta'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar contraseña
    usuario.set_password(nueva_password)
    usuario.save()
    
    return Response({
        'success': True,
        'message': 'Contraseña actualizada correctamente'
    })