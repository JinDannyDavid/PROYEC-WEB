from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum, Count, Q
from api.models import Factura, Propiedad
from api.serializers import FacturaSerializer, FacturaCreateSerializer
from api.constants import TipoUsuario, FacturaEstado

# ============================================
# VISTAS PARA FACTURA CON JWT
# ============================================

class FacturaListCreateView(generics.ListCreateAPIView):
    """Listar todas las facturas o crear una nueva"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['estado', 'periodo']
    ordering_fields = ['fecha_emision', 'fecha_vencimiento', 'monto_total']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FacturaCreateSerializer
        return FacturaSerializer
    
    def get_queryset(self):
        """Filtrar facturas según el usuario"""
        user = self.request.user
        if TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.is_tecnico(user.tipo_usuario):
            return Factura.objects.all().order_by('-fecha_emision')
        # Usuarios normales solo ven facturas de sus propiedades
        return Factura.objects.filter(
            propiedad__usuario=user
        ).order_by('-fecha_emision')
    
    def filter_queryset(self, queryset):
        """Filtrar por propiedad solo si es admin/tecnico, sino ignorar filtro propiedad"""
        queryset = super().filter_queryset(queryset)
        user = self.request.user
        propiedad_id = self.request.query_params.get('propiedad')
        
        if propiedad_id and (TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.is_tecnico(user.tipo_usuario)):
            queryset = queryset.filter(propiedad_id=propiedad_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """Crear factura (solo admin/técnico)"""
        user = self.request.user
        if not (TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.is_tecnico(user.tipo_usuario)):
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
        if TipoUsuario.is_admin(user.tipo_usuario):
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
        if TipoUsuario.is_admin(user.tipo_usuario) or propiedad.usuario == user:
            return Factura.objects.filter(propiedad_id=propiedad_id).order_by('-periodo')
        return Factura.objects.none()


class ResumenFacturasView(generics.GenericAPIView):
    """Obtener resumen de facturas del usuario"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        hoy = timezone.now().date()
        facturas = Factura.objects.filter(propiedad__usuario=request.user)
        
        # Agregaciones en una sola query (incluye vencidas con filter)
        agg = facturas.aggregate(
            total_pendiente=Sum('monto_total', filter=Q(estado='PENDIENTE')),
            total_pagado=Sum('monto_total', filter=Q(estado='PAGADA')),
            total_vencido=Sum('monto_total', filter=Q(estado='PENDIENTE', fecha_vencimiento__lt=hoy)),
            cantidad_pendientes=Count('id', filter=Q(estado='PENDIENTE')),
            cantidad_pagadas=Count('id', filter=Q(estado='PAGADA')),
            cantidad_vencidas=Count('id', filter=Q(estado='PENDIENTE', fecha_vencimiento__lt=hoy)),
        )
        
        return Response({
            'success': True,
            'data': {
                'total_pendiente': float(agg['total_pendiente'] or 0),
                'total_vencido': float(agg['total_vencido'] or 0),
                'total_pagado': float(agg['total_pagado'] or 0),
                'cantidad_pendientes': agg['cantidad_pendientes'],
                'cantidad_vencidas': agg['cantidad_vencidas'],
                'cantidad_pagadas': agg['cantidad_pagadas'],
            }
        })