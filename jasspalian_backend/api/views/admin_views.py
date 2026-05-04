from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from api.models import Usuario, Propiedad, Factura, Pago
from datetime import datetime

class AdminEstadisticasView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Verificar que es administrador
        if request.user.tipo_usuario != 'ADMIN':
            return Response({'error': 'No autorizado'}, status=403)
        
        # Calcular estadísticas
        total_usuarios = Usuario.objects.filter(tipo_usuario='VECINO').count()
        total_propiedades = Propiedad.objects.count()
        total_facturas_pendientes = Factura.objects.filter(estado='PENDIENTE').count()
        
        # Pagos del mes actual
        ahora = datetime.now()
        pagos_mes = Pago.objects.filter(
            fecha_pago__year=ahora.year,
            fecha_pago__month=ahora.month,
            estado_comprobante='CONFIRMADO'
        )
        total_pagos_mes = sum(p.monto for p in pagos_mes)
        
        return Response({
            'totalUsuarios': total_usuarios,
            'totalPropiedades': total_propiedades,
            'totalFacturasPendientes': total_facturas_pendientes,
            'totalPagosMes': float(total_pagos_mes),
        })