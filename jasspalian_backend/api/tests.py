from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from api.models import Usuario, Propiedad, Factura, Pago, Reclamo, Notificacion
from api.serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    FacturaSerializer,
    FacturaCreateSerializer,
    PagoSerializer,
    PagoCreateSerializer,
    ReclamoSerializer,
    ReclamoCreateSerializer,
    NotificacionSerializer,
    PropiedadSerializer,
)


class UsuarioModelTest(TestCase):
    def setUp(self):
        self.usuario_data = {
            'dni': '12345678',
            'nombres': 'Juan',
            'apellidos': 'Pérez',
            'telefono': '987654321',
            'email': 'juan@example.com',
            'direccion': 'Av. Principal 123',
            'sector': 'Centro',
            'tipo_usuario': 'VECINO',
        }

    def test_create_usuario(self):
        usuario = Usuario.objects.create_user(
            dni=self.usuario_data['dni'],
            password='Test123!',
            **{k: v for k, v in self.usuario_data.items() if k != 'dni'}
        )
        self.assertEqual(usuario.dni, '12345678')
        self.assertTrue(usuario.check_password('Test123!'))
        self.assertEqual(usuario.tipo_usuario, 'VECINO')
        self.assertTrue(usuario.is_active)

    def test_create_superuser(self):
        admin = Usuario.objects.create_superuser(
            dni='87654321',
            password='Admin123!'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.tipo_usuario, 'ADMIN')

    def test_dni_validation(self):
        with self.assertRaises(Exception):
            Usuario.objects.create_user(
                dni='1234567',  # 7 dígitos - inválido
                password='Test123!',
                **{k: v for k, v in self.usuario_data.items() if k != 'dni'}
            )

    def test_nombre_completo_property(self):
        usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            **{k: v for k, v in self.usuario_data.items() if k != 'dni'}
        )
        self.assertEqual(usuario.nombre_completo, 'Juan Pérez')


class PropiedadModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )

    def test_create_propiedad(self):
        propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )
        self.assertEqual(propiedad.numero_medidor, 'MED001')
        self.assertEqual(propiedad.estado, 'ACTIVO')


class FacturaModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )

    def test_factura_calculos_automaticos(self):
        factura = Factura.objects.create(
            propiedad=self.propiedad,
            numero_factura='FAC-001',
            periodo='01/2024',
            fecha_emision=timezone.now().date(),
            fecha_vencimiento=timezone.now().date(),
            lectura_anterior=Decimal('100.00'),
            lectura_actual=Decimal('115.00'),
            cargo_fijo=Decimal('25.00'),
            cargo_alcantarillado=Decimal('15.00'),
        )
        # consumo = 115 - 100 = 15
        self.assertEqual(factura.consumo_m3, Decimal('15.00'))
        # cargo_consumo = 15 * 3.50 = 52.50
        self.assertEqual(factura.cargo_consumo, Decimal('52.50'))
        # total = 25 + 52.50 + 15 = 92.50
        self.assertEqual(factura.monto_total, Decimal('92.50'))

    def test_esta_vencida_property(self):
        from datetime import timedelta
        ayer = timezone.now().date() - timedelta(days=1)
        manana = timezone.now().date() + timedelta(days=1)

        factura_vencida = Factura.objects.create(
            propiedad=self.propiedad,
            numero_factura='FAC-002',
            periodo='01/2024',
            fecha_emision=timezone.now().date(),
            fecha_vencimiento=ayer,
            lectura_anterior=Decimal('100.00'),
            lectura_actual=Decimal('115.00'),
            cargo_fijo=Decimal('25.00'),
            cargo_alcantarillado=Decimal('15.00'),
            estado='PENDIENTE',
        )
        factura_vigente = Factura.objects.create(
            propiedad=self.propiedad,
            numero_factura='FAC-003',
            periodo='02/2024',
            fecha_emision=timezone.now().date(),
            fecha_vencimiento=manana,
            lectura_anterior=Decimal('100.00'),
            lectura_actual=Decimal('115.00'),
            cargo_fijo=Decimal('25.00'),
            cargo_alcantarillado=Decimal('15.00'),
            estado='PENDIENTE',
        )
        self.assertTrue(factura_vencida.esta_vencida)
        self.assertFalse(factura_vigente.esta_vencida)


class PagoModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )
        self.factura = Factura.objects.create(
            propiedad=self.propiedad,
            numero_factura='FAC-001',
            periodo='01/2024',
            fecha_emision=timezone.now().date(),
            fecha_vencimiento=timezone.now().date(),
            lectura_anterior=Decimal('100.00'),
            lectura_actual=Decimal('115.00'),
            cargo_fijo=Decimal('25.00'),
            cargo_alcantarillado=Decimal('15.00'),
        )

    def test_pago_confirma_factura(self):
        pago = Pago.objects.create(
            factura=self.factura,
            monto=self.factura.monto_total,
            metodo_pago='YAPE',
            codigo_operacion='YAPE123',
            estado_comprobante='CONFIRMADO',
        )
        self.factura.refresh_from_db()
        self.assertEqual(self.factura.estado, 'PAGADA')

    def test_pago_pendiente_no_cambia_factura(self):
        Pago.objects.create(
            factura=self.factura,
            monto=self.factura.monto_total,
            metodo_pago='YAPE',
            codigo_operacion='YAPE123',
            estado_comprobante='PENDIENTE',
        )
        self.factura.refresh_from_db()
        self.assertEqual(self.factura.estado, 'PENDIENTE')


class ReclamoModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )

    def test_reclamo_fecha_respuesta_auto(self):
        reclamo = Reclamo.objects.create(
            usuario=self.usuario,
            propiedad=self.propiedad,
            tipo='FUGA',
            descripcion='Fuga de agua en la calle principal',
            estado='RESUELTO',
            respuesta='Se reparó la tubería',
        )
        self.assertIsNotNone(reclamo.fecha_respuesta)


class NotificacionModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )

    def test_marcar_como_leida(self):
        notif = Notificacion.objects.create(
            usuario=self.usuario,
            titulo='Test',
            mensaje='Mensaje de prueba',
            tipo='COMUNICADO',
        )
        self.assertFalse(notif.leida)
        notif.marcar_como_leida()
        self.assertTrue(notif.leida)
        self.assertIsNotNone(notif.fecha_lectura)


class UsuarioSerializerTest(TestCase):
    def test_usuario_registro_serializer_valid(self):
        data = {
            'dni': '12345678',
            'nombres': 'Juan',
            'apellidos': 'Pérez',
            'telefono': '987654321',
            'email': 'juan@example.com',
            'direccion': 'Av. Principal 123',
            'sector': 'Centro',
            'password': 'Test123!',
            'confirm_password': 'Test123!',
        }
        serializer = UsuarioRegistroSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_usuario_registro_password_mismatch(self):
        data = {
            'dni': '12345678',
            'nombres': 'Juan',
            'apellidos': 'Pérez',
            'telefono': '987654321',
            'email': 'juan@example.com',
            'direccion': 'Av. Principal 123',
            'sector': 'Centro',
            'password': 'Test123!',
            'confirm_password': 'Otro123!',
        }
        serializer = UsuarioRegistroSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('confirm_password', serializer.errors)

    def test_usuario_registro_weak_password(self):
        data = {
            'dni': '12345678',
            'nombres': 'Juan',
            'apellidos': 'Pérez',
            'telefono': '987654321',
            'email': 'juan@example.com',
            'direccion': 'Av. Principal 123',
            'sector': 'Centro',
            'password': '123456',  # Débil
            'confirm_password': '123456',
        }
        serializer = UsuarioRegistroSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)


class FacturaSerializerTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )

    def test_factura_create_valid(self):
        data = {
            'propiedad': self.propiedad.id,
            'numero_factura': 'FAC-001',
            'periodo': '01/2024',
            'fecha_emision': '2024-01-01',
            'fecha_vencimiento': '2024-01-31',
            'lectura_anterior': '100.00',
            'lectura_actual': '115.00',
            'cargo_fijo': '25.00',
            'cargo_alcantarillado': '15.00',
        }
        serializer = FacturaCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_factura_create_lectura_invalida(self):
        data = {
            'propiedad': self.propiedad.id,
            'numero_factura': 'FAC-001',
            'periodo': '01/2024',
            'fecha_emision': '2024-01-01',
            'fecha_vencimiento': '2024-01-31',
            'lectura_anterior': '115.00',
            'lectura_actual': '100.00',  # Menor que anterior
            'cargo_fijo': '25.00',
            'cargo_alcantarillado': '15.00',
        }
        serializer = FacturaCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('lectura_actual', serializer.errors)


class PagoSerializerTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )
        self.factura = Factura.objects.create(
            propiedad=self.propiedad,
            numero_factura='FAC-001',
            periodo='01/2024',
            fecha_emision=timezone.now().date(),
            fecha_vencimiento=timezone.now().date(),
            lectura_anterior=Decimal('100.00'),
            lectura_actual=Decimal('115.00'),
            cargo_fijo=Decimal('25.00'),
            cargo_alcantarillado=Decimal('15.00'),
        )

    def test_pago_create_valid(self):
        data = {
            'factura': self.factura.id,
            'monto': str(self.factura.monto_total),
            'metodo_pago': 'YAPE',
            'codigo_operacion': 'YAPE123',
        }
        serializer = PagoCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_pago_create_monto_invalido(self):
        data = {
            'factura': self.factura.id,
            'monto': '50.00',  # Diferente al total
            'metodo_pago': 'YAPE',
            'codigo_operacion': 'YAPE123',
        }
        serializer = PagoCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('monto', serializer.errors)


class ReclamoSerializerTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            dni='12345678',
            password='Test123!',
            nombres='Juan',
            apellidos='Pérez',
            telefono='987654321',
            direccion='Av. Principal 123',
            sector='Centro',
        )
        self.propiedad = Propiedad.objects.create(
            usuario=self.usuario,
            direccion='Calle 123',
            sector='Norte',
            numero_medidor='MED001',
            tipo_propiedad='DOMESTICO',
            estado='ACTIVO',
        )

    def test_reclamo_create_valid(self):
        data = {
            'usuario': self.usuario.id,
            'propiedad': self.propiedad.id,
            'tipo': 'FUGA',
            'descripcion': 'Fuga de agua en la calle principal',
            'foto_url': '',
        }
        serializer = ReclamoCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_reclamo_create_descripcion_corta(self):
        data = {
            'usuario': self.usuario.id,
            'propiedad': self.propiedad.id,
            'tipo': 'FUGA',
            'descripcion': 'Corto',  # Menos de 10 chars
            'foto_url': '',
        }
        serializer = ReclamoCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('descripcion', serializer.errors)