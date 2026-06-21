from rest_framework import serializers


class DisplayFieldMixin:
    """
    Mixin para agregar campos de display automáticos para choices.
    Uso: agregar `display_fields = ['tipo', 'estado']` en la clase Meta del serializer.
    """

    def get_display_fields(self):
        return getattr(self.Meta, 'display_fields', [])

    def get_fields(self):
        fields = super().get_fields()
        display_fields = self.get_display_fields()

        for field_name in display_fields:
            if field_name in fields:
                # El campo ya existe, agregar versión _display
                display_field_name = f'{field_name}_display'
                if display_field_name not in fields:
                    fields[display_field_name] = serializers.SerializerMethodField()

        return fields

    # Los métodos get_<field>_display se definen dinámicamente via __getattr__
    # Esto evita setattr en __init__ que rompe el caching de DRF
    def __getattr__(self, name: str):
        if name.startswith('get_') and name.endswith('_display'):
            field_name = name[4:-8]  # Remover 'get_' y '_display'
            if field_name in self.get_display_fields():
                def get_display(obj):
                    field = obj._meta.get_field(field_name)
                    if hasattr(field, 'choices') and field.choices:
                        return dict(field.choices).get(getattr(obj, field_name), getattr(obj, field_name))
                    return getattr(obj, field_name)
                get_display.__name__ = name
                return get_display
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'")


class ChoiceDisplayMixin:
    """
    Mixin simple para campos choice - agrega _display para cada campo choice en el modelo.
    """

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Auto-agregar _display para todos los campos choice del modelo
        for field in instance._meta.fields:
            if hasattr(field, 'choices') and field.choices:
                field_name = field.name
                value = getattr(instance, field_name, None)
                if value is not None:
                    data[f'{field_name}_display'] = dict(field.choices).get(value, value)
        return data


class NestedSerializerMixin:
    """
    Mixin para serializers anidados con control de profundidad.
    """

    def get_nested_depth(self):
        return getattr(self.Meta, 'nested_depth', 0)

    def to_representation(self, instance):
        depth = self.get_nested_depth()
        if depth <= 0:
            return super().to_representation(instance)

        # Usar contexto para pasar profundidad en lugar de mutar Meta
        original_context = self.context
        self.context = {**self.context, 'nested_depth': depth - 1}
        try:
            return super().to_representation(instance)
        finally:
            self.context = original_context


class DynamicFieldsMixin:
    """
    Mixin para permitir selección dinámica de campos via query param ?fields=field1,field2
    """

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.query_params.get('fields'):
            requested_fields = request.query_params['fields'].split(',')
            existing = set(fields.keys())
            for field_name in list(fields.keys()):
                if field_name not in requested_fields:
                    fields.pop(field_name)
        return fields