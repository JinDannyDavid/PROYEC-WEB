#!/bin/sh
set -e

# Configuración de timeout (configurable via env vars)
DB_WAIT_TIMEOUT=${DB_WAIT_TIMEOUT:-60}
DB_WAIT_INTERVAL=${DB_WAIT_INTERVAL:-2}
MAX_RETRIES=$((DB_WAIT_TIMEOUT / DB_WAIT_INTERVAL))

# Esperar conexión a MySQL
echo "Esperando conexión a MySQL en $DB_HOST:$DB_PORT (timeout: ${DB_WAIT_TIMEOUT}s)..."
for i in $(seq 1 $MAX_RETRIES); do
    if python -c "import socket; s=socket.socket(); s.settimeout(2); s.connect(('$DB_HOST', $DB_PORT)); s.close()" 2>/dev/null; then
        echo "MySQL está disponible"
        break
    fi
    if [ $i -eq $MAX_RETRIES ]; then
        echo "ERROR: Timeout esperando MySQL después de ${DB_WAIT_TIMEOUT}s"
        exit 1
    fi
    echo "Esperando MySQL... ($i/$MAX_RETRIES)"
    sleep $DB_WAIT_INTERVAL
done

echo "Ejecutando migraciones..."
python manage.py migrate --noinput
python manage.py collectstatic --noinput --verbosity 0

exec "$@"