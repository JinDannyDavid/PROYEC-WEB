from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar datos personalizados al token
        token['dni'] = user.dni
        token['nombre_completo'] = user.nombre_completo
        token['tipo_usuario'] = user.tipo_usuario
        
        return token
    
    def validate(self, attrs):
        # Asegurar que use 'dni' como campo de autenticación
        attrs['username'] = attrs.get('dni')  # ¡IMPORTANTE!
        
        data = super().validate(attrs)
        
        # Agregar datos del usuario en la respuesta
        user = self.user
        data['user'] = {
            'id': user.id,
            'dni': user.dni,
            'nombres': user.nombres,
            'apellidos': user.apellidos,
            'nombre_completo': user.nombre_completo,
            'email': user.email,
            'telefono': user.telefono,
            'tipo_usuario': user.tipo_usuario,
            'direccion': user.direccion,
            'sector': user.sector,
        }
        
        return data