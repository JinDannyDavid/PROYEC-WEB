from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.db.utils import OperationalError


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


@csrf_exempt
def health_check(request):
    """
    Health check endpoint for Docker and load balancers.
    Checks database connectivity and returns status.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    # Check database connection
    db_status = 'healthy'
    db_error = None
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except OperationalError as e:
        db_status = 'unhealthy'
        db_error = str(e)
    except Exception as e:
        db_status = 'unhealthy'
        db_error = f"Unexpected error: {str(e)}"

    # Overall status
    overall_status = 'healthy' if db_status == 'healthy' else 'unhealthy'
    status_code = 200 if overall_status == 'healthy' else 503

    return JsonResponse({
        'status': overall_status,
        'version': '1.0.0',
        'checks': {
            'database': {
                'status': db_status,
                'error': db_error
            }
        }
    }, status=status_code)