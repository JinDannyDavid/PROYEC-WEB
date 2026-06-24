# ===========================================
# JASS Palian Backend - Multi-stage Dockerfile
# ===========================================

# -------------------------------------------
# STAGE 1: Base / Dependencies
# -------------------------------------------
FROM python:3.12-alpine AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    mariadb-connector-c-dev \
    pkgconfig \
    libffi-dev \
    openssl-dev \
    curl \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# Set work directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt


# -------------------------------------------
# STAGE 2: Development
# -------------------------------------------
FROM base AS development

# Install dev dependencies
RUN pip install --no-cache-dir \
    django-debug-toolbar \
    ipdb \
    pytest \
    pytest-django \
    pytest-cov \
    black \
    flake8 \
    isort

# Copy entrypoint
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy source code
COPY . .

# Change ownership to app user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Run with entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


# -------------------------------------------
# ----------------------------------------
# STAGE 3: Production
# -------------------------------------------
FROM base AS production

# Copy entrypoint
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy source code
COPY . .

# Collect static files (will be done at runtime via entrypoint)
# RUN python manage.py collectstatic --noinput --verbosity 0

# Change ownership to app user
RUN chown -R appuser:appgroup /app /entrypoint.sh

# Create directories for static/media with correct permissions
RUN mkdir -p /app/staticfiles /app/mediafiles && \
    chown -R appuser:appgroup /app/staticfiles /app/mediafiles

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Run with entrypoint and gunicorn
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--worker-class", "gthread", \
     "--threads", "2", \
     "--worker-connections", "1000", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "100", \
     "--timeout", "60", \
     "--keep-alive", "5", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--log-level", "info", \
     "jasspalian_backend.wsgi:application"]