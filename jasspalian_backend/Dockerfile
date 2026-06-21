FROM python:3.12-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache \
    gcc \
    musl-dev \
    mysql-dev \
    mariadb-connector-c-dev \
    pkgconfig

# Instalar setuptools y gunicorn
RUN pip install --no-cache-dir setuptools wheel gunicorn

# Copiar y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "jasspalian_backend.wsgi:application"]