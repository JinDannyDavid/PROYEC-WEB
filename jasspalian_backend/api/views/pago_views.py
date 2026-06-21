from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from api.models import Pago, Factura
from api.serializers import PagoSerializer, PagoCreateSerializer
from api.constants import TipoUsuario, PagoEstado

# ============================================
# VISTAS PARA PAGO CON JWT
# ============================================

class PagoListCreateView(generics.ListCreateAPIView):
    """Listar todos los pagos o crear uno nuevo"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PagoCreateSerializer
        return PagoSerializer
    
    def get_queryset(self):
        """Filtrar pagos según el usuario"""
        user = self.request.user
        if TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.can_manage_billing(user.tipo_usuario):
            return Pago.objects.all().order_by('-fecha_pago')
        # Usuarios normales solo ven pagos de sus facturas
        return Pago.objects.filter(
            factura__propiedad__usuario=user
        ).order_by('-fecha_pago')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'success': True,
            'message': 'Pago registrado exitosamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)


class PagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar un pago específico"""
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Verificar permisos"""
        user = self.request.user
        if TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.can_manage_billing(user.tipo_usuario):
            return Pago.objects.all()
        return Pago.objects.filter(factura__propiedad__usuario=user)


class PagosPorFacturaView(generics.ListAPIView):
    """Listar pagos de una factura específica"""
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        factura_id = self.kwargs['factura_id']
        factura = get_object_or_404(Factura, id=factura_id)
        
        # Verificar permisos
        user = self.request.user
        if TipoUsuario.is_admin(user.tipo_usuario) or TipoUsuario.can_manage_billing(user.tipo_usuario) or factura.propiedad.usuario == user:
            return Pago.objects.filter(factura_id=factura_id).order_by('-fecha_pago')
        return Pago.objects.none()


class MisPagosView(generics.ListAPIView):
    """Listar pagos del usuario autenticado"""
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Pago.objects.filter(
            factura__propiedad__usuario=self.request.user
        ).order_by('-fecha_pago')


class ResumenPagosView(generics.GenericAPIView):
    """Obtener resumen de pagos del usuario"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        pagos = Pago.objects.filter(
            factura__propiedad__usuario=request.user,
            estado_comprobante='CONFIRMADO'
        )
        
        total_pagado = pagos.aggregate(total=Sum('monto'))['total'] or 0
        ultimo_pago = pagos.first()
        
        return Response({
            'success': True,
            'data': {
                'total_pagado': float(total_pagado),
                'cantidad_pagos': pagos.count(),
                'ultimo_pago': PagoSerializer(ultimo_pago).data if ultimo_pago else None
            }
        })