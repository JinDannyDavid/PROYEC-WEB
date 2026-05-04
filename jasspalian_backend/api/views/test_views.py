from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def test_connection(request):
    if request.method == 'GET':
        return JsonResponse({
            'success': True,
            'message': 'Backend JASS Palian funcionando',
            'data': {
                'status': 'online',
                'version': '1.0.0'
            }
        })
    return JsonResponse({'error': 'Método no permitido'}, status=405)