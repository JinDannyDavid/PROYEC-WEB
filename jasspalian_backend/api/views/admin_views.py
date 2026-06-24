from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from django.utils import timezone
from api.models import Usuario, Propiedad, Factura, Pago, Reclamo
from api.constants import TipoUsuario
from datetime import datetime

class AdminEstadisticasView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not TipoUsuario.is_admin(request.user.tipo_usuario):
            return Response({'error': 'No autorizado'}, status=403)
        
        # Calcular estadísticas
        total_usuarios = Usuario.objects.filter(tipo_usuario='VECINO').count()
        total_propiedades = Propiedad.objects.count()
        total_facturas_pendientes = Factura.objects.filter(estado='PENDIENTE').count()
        total_reclamos_pendientes = Reclamo.objects.filter(estado='PENDIENTE').count()
        
        # Pagos del mes actual (usando aggregate en BD)
        ahora = timezone.now()
        total_pagos_mes = Pago.objects.filter(
            fecha_pago__year=ahora.year,
            fecha_pago__month=ahora.month,
            estado_comprobante='CONFIRMADO'
        ).aggregate(total=Sum('monto'))['total'] or 0
        
        # Ingresos mensuales últimos 6 meses
        ingresos_mensuales = []
        for i in range(5, -1, -1):
            mes = ahora.month - i
            año = ahora.year
            if mes <= 0:
                mes += 12
                año -= 1
            total_mes = Pago.objects.filter(
                fecha_pago__year=año,
                fecha_pago__month=mes,
                estado_comprobante='CONFIRMADO'
            ).aggregate(total=Sum('monto'))['total'] or 0
            ingresos_mensuales.append({
                'mes': f'{mes:02d}/{año}',
                'total': float(total_mes)
            })
        
        return Response({
            'totalUsuarios': total_usuarios,
            'totalPropiedades': total_propiedades,
            'totalFacturasPendientes': total_facturas_pendientes,
            'totalPagosMes': float(total_pagos_mes),
            'totalReclamosPendientes': total_reclamos_pendientes,
            'ingresosMensuales': ingresos_mensuales,
        })


class IngresosMensualesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not TipoUsuario.is_admin(request.user.tipo_usuario):
            return Response({'error': 'No autorizado'}, status=403)
        
        anio = int(request.query_params.get('anio', timezone.now().year))
        ahora = timezone.now()
        
        ingresos_mensuales = []
        for i in range(11, -1, -1):
            mes = ahora.month - i
            año = ahora.year
            if mes <= 0:
                mes += 12
                año -= 1
            if año != anio:
                continue
            total_mes = Pago.objects.filter(
                fecha_pago__year=año,
                fecha_pago__month=mes,
                estado_comprobante='CONFIRMADO'
            ).aggregate(total=Sum('monto'))['total'] or 0
            meses_nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            ingresos_mensuales.append({
                'mes': meses_nombres[mes - 1],
                'total': float(total_mes)
            })
        
        return Response(ingresos_mensuales)


class ReclamosPorTipoView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not TipoUsuario.is_admin(request.user.tipo_usuario):
            return Response({'error': 'No autorizado'}, status=403)
        
        reclamos = Reclamo.objects.values('tipo').annotate(cantidad=Count('id')).order_by('-cantidad')
        
        tipo_map = {
            'FUGA': 'Fugas',
            'CALIDAD': 'Calidad',
            'MEDIDOR': 'Medidor',
            'FACTURACION': 'Facturación',
            'OTRO': 'Otros',
        }
        
        data = []
        for r in reclamos:
            tipo_key = r['tipo']
            data.append({
                'tipo': tipo_map.get(tipo_key, tipo_key),
                'cantidad': r['cantidad']
            })
        
        return Response(data)


class MetodosPagoView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not TipoUsuario.is_admin(request.user.tipo_usuario):
            return Response({'error': 'No autorizado'}, status=403)
        
        metodos = Pago.objects.filter(
            estado_comprobante='CONFIRMADO'
        ).values('metodo_pago').annotate(
            cantidad=Count('id'),
            total=Sum('monto')
        ).order_by('-cantidad')
        
        metodo_map = {
            'YAPE': 'Yape',
            'PLIN': 'Plin',
            'TRANSFERENCIA': 'Transferencia',
            'EFECTIVO': 'Efectivo',
        }
        
        data = []
        for m in metodos:
            metodo_key = m['metodo_pago']
            data.append({
                'metodo': metodo_map.get(metodo_key, metodo_key),
                'cantidad': m['cantidad'],
                'total': float(m['total'] or 0)
            })
        
        return Response(data)


class TopUsuariosView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not TipoUsuario.is_admin(request.user.tipo_usuario):
            return Response({'error': 'No autorizado'}, status=403)
        
        # Top usuarios por cantidad de pagos
        top = Pago.objects.filter(
            estado_comprobante='CONFIRMADO'
        ).values(
            'factura__propiedad__usuario__id',
            'factura__propiedad__usuario__nombres',
            'factura__propiedad__usuario__apellidos'
        ).annotate(
            pagos=Count('id'),
            total=Sum('monto')
        ).order_by('-pagos')[:10]
        
        data = []
        for u in top:
            data.append({
                'id': u['factura__propiedad__usuario__id'],
                'nombre': f"{u['factura__propiedad__usuario__nombres']} {u['factura__propiedad__usuario__apellidos']}",
                'pagos': u['pagos'],
                'total': float(u['total'] or 0)
            })
        
        return Response(data)