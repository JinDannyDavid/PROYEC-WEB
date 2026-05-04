from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from api.models import Factura, Propiedad
from api.serializers import FacturaSerializer, FacturaCreateSerializer

# ============================================
# VISTAS PARA FACTURA CON JWT
# ============================================

class FacturaListCreateView(generics.ListCreateAPIView):
    """Listar todas las facturas o crear una nueva"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['propiedad', 'estado', 'periodo']
    ordering_fields = ['fecha_emision', 'fecha_vencimiento', 'monto_total']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FacturaCreateSerializer
        return FacturaSerializer
    
    def get_queryset(self):
        """Filtrar facturas según el usuario"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Factura.objects.all().order_by('-fecha_emision')
        # Usuarios normales solo ven facturas de sus propiedades
        return Factura.objects.filter(
            propiedad__usuario=user
        ).order_by('-fecha_emision')
    
    def perform_create(self, serializer):
        """Crear factura (solo admin/técnico)"""
        if self.request.user.tipo_usuario not in ['ADMIN', 'TECNICO']:
            raise permissions.PermissionDenied("No tienes permisos para crear facturas")
        serializer.save()


class FacturaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar una factura específica"""
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Verificar permisos"""
        user = self.request.user
        if user.tipo_usuario == 'ADMIN':
            return Factura.objects.all()
        return Factura.objects.filter(propiedad__usuario=user)


class FacturasPendientesView(generics.ListAPIView):
    """Listar facturas pendientes del usuario autenticado"""
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Factura.objects.filter(
            propiedad__usuario=self.request.user,
            estado='PENDIENTE'
        ).order_by('fecha_vencimiento')


class FacturasVencidasView(generics.ListAPIView):
    """Listar facturas vencidas del usuario autenticado"""
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        hoy = timezone.now().date()
        return Factura.objects.filter(
            propiedad__usuario=self.request.user,
            estado='PENDIENTE',
            fecha_vencimiento__lt=hoy
        ).order_by('fecha_vencimiento')


class FacturasPorPropiedadView(generics.ListAPIView):
    """Listar facturas de una propiedad específica"""
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        propiedad_id = self.kwargs['propiedad_id']
        propiedad = get_object_or_404(Propiedad, id=propiedad_id)
        
        # Verificar permisos
        user = self.request.user
        if user.tipo_usuario == 'ADMIN' or propiedad.usuario == user:
            return Factura.objects.filter(propiedad_id=propiedad_id).order_by('-periodo')
        return Factura.objects.none()


class ResumenFacturasView(generics.GenericAPIView):
    """Obtener resumen de facturas del usuario"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        facturas = Factura.objects.filter(propiedad__usuario=request.user)
        
        total_pendiente = sum(f.monto_total for f in facturas if f.estado == 'PENDIENTE')
        total_vencido = sum(f.monto_total for f in facturas if f.esta_vencida)
        total_pagado = sum(f.monto_total for f in facturas if f.estado == 'PAGADA')
        
        return Response({
            'success': True,
            'data': {
                'total_pendiente': float(total_pendiente),
                'total_vencido': float(total_vencido),
                'total_pagado': float(total_pagado),
                'cantidad_pendientes': facturas.filter(estado='PENDIENTE').count(),
                'cantidad_vencidas': sum(1 for f in facturas if f.esta_vencida),
                'cantidad_pagadas': facturas.filter(estado='PAGADA').count(),
            }
        })