#!/bin/sh
# ===========================================
# JASS Palian Backend - Entrypoint Script
# ===========================================
# Handles database migrations, static files, and server startup
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_WAIT_TIMEOUT=${DB_WAIT_TIMEOUT:-60}
DB_WAIT_INTERVAL=${DB_WAIT_INTERVAL:-2}
MAX_RETRIES=$((DB_WAIT_TIMEOUT / DB_WAIT_INTERVAL))

# Function to log messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Wait for database to be ready
wait_for_db() {
    log_info "Esperando conexión a MySQL en ${DB_HOST}:${DB_PORT} (timeout: ${DB_WAIT_TIMEOUT}s)..."

    for i in $(seq 1 $MAX_RETRIES); do
        if python -c "
import socket
import os
host = os.environ.get('DB_HOST', 'localhost')
port = int(os.environ.get('DB_PORT', '3306'))
s = socket.socket()
s.settimeout(2)
try:
    s.connect((host, port))
    s.close()
    exit(0)
except Exception:
    exit(1)
" 2>/dev/null; then
            log_info "MySQL está disponible"
            return 0
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            log_error "Timeout esperando MySQL después de ${DB_WAIT_TIMEOUT}s"
            return 1
        fi

        log_warn "Esperando MySQL... ($i/$MAX_RETRIES)"
        sleep $DB_WAIT_INTERVAL
    done
}

# Run database migrations
run_migrations() {
    log_info "Ejecutando migraciones..."
    python manage.py migrate --noinput
    if [ $? -eq 0 ]; then
        log_info "Migraciones completadas exitosamente"
    else
        log_error "Error en migraciones"
        return 1
    fi
}

# Collect static files
collect_static() {
    log_info "Recopilando archivos estáticos..."
    python manage.py collectstatic --noinput --verbosity 0
    if [ $? -eq 0 ]; then
        log_info "Archivos estáticos recopilados"
    else
        log_warn "Advertencia: error recopilando archivos estáticos"
    fi
}

# Create superuser if needed (only in development)
create_superuser() {
    if [ "$DEBUG" = "1" ] && [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
        log_info "Creando superusuario..."
        python manage.py createsuperuser \
            --username "$DJANGO_SUPERUSER_USERNAME" \
            --email "$DJANGO_SUPERUSER_EMAIL" \
            --noinput || log_warn "Superusuario ya existe o error al crear"
    fi
}

# Main execution
main() {
    log_info "=== JASS Palian Backend Starting ==="
    log_info "Environment: ${DEBUG:-0}"
    log_info "Database: ${DB_HOST}:${DB_PORT}"

    # Wait for database
    wait_for_db || exit 1

    # Run migrations
    run_migrations || exit 1

    # Collect static files
    collect_static

    # Create superuser in development
    create_superuser

    log_info "=== Starting Application ==="

    # Execute the command passed to the container
    exec "$@"
}

# Run main function
main "$@"