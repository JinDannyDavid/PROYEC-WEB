# JASS Palian Web Portal

Portal web para la administración de la Junta de Agua y Saneamiento (JASS) Palian. Sistema completo de gestión de usuarios, propiedades, facturación, pagos, reclamos y notificaciones.

---

## 🏗️ Arquitectura del Proyecto

Monorepo con arquitectura cliente-servidor:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Database      │
│   Next.js 14    │     │   Django 4.2    │     │   MySQL 8.0     │
│   Puerto 3000   │     │   Puerto 8000   │     │   Puerto 3307   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Comunicación

- **API REST** bajo `/api/` (Django REST Framework)
- **Autenticación JWT** (access token 1 día, refresh token 7 días)
- **CORS** configurado para `localhost:3000` y redes locales `192.168.100.x`

---

## 🛠️ Tecnologías

### Backend (`jasspalian_backend/`)

| Tecnología                    | Versión | Uso               |
| ----------------------------- | ------- | ----------------- |
| Python                        | 3.11+   | Runtime           |
| Django                        | 4.2     | Framework web     |
| Django REST Framework         | 3.14    | API REST          |
| djangorestframework-simplejwt | 5.3     | Autenticación JWT |
| mysqlclient                   | 2.2     | Driver MySQL      |
| django-cors-headers           | 4.3     | CORS              |

### Frontend (`frontend/`)

| Tecnología          | Versión           | Uso                 |
| ------------------- | ----------------- | ------------------- |
| Node.js             | 18+               | Runtime             |
| Next.js             | 14 (Pages Router) | Framework React     |
| TypeScript          | 5.3               | Tipado estático     |
| Tailwind CSS        | 3.4               | Estilos utilitarios |
| Axios               | 1.6               | Cliente HTTP        |
| React Hook Form     | 7.50              | Formularios         |
| Chart.js / Recharts | -                 | Gráficos            |

### Infraestructura

| Herramienta    | Uso                          |
| -------------- | ---------------------------- |
| Docker Compose | Orquestación de servicios    |
| Nginx (prod)   | Reverse proxy / static files |

---

## 📁 Estructura del Proyecto

```
jasspalian_web/
├── docker-compose.yml          # Orquestación completa
├── .env                        # Variables de entorno (DB, secrets)
├── README.md                   # Este archivo
│
├── jasspalian_backend/         # Backend Django
│   ├── manage.py
│   ├── jasspalian_backend/     # Configuración del proyecto
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api/                    # App principal
│   │   ├── models/             # Modelos (Usuario, Propiedad, Factura, Pago, Reclamo, Notificacion)
│   │   ├── views/              # Vistas (ViewSets, APIViews)
│   │   ├── serializers/        # Serializers DRF
│   │   ├── urls.py             # Rutas API
│   │   └── tests.py            # Tests unitarios
│   ├── entrypoint.sh           # Script de entrada Docker (migraciones, collectstatic)
│   ├── requirements.txt        # Dependencias Python
│   └── Dockerfile
│
└── frontend/                   # Frontend Next.js
    ├── src/
    │   ├── pages/              # Páginas (Next.js Pages Router)
    │   │   ├── index.tsx       # Landing page
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   ├── dashboard/      # Dashboard Residente
    │   │   └── admin/          # Dashboard Admin (pendiente)
    │   ├── components/         # Componentes reutilizables
    │   ├── core/               # Servicios base, config, hooks
    │   ├── hooks/              # Custom hooks (useApi, cache)
    │   ├── services/           # Cliente API (axios + interceptors)
    │   ├── middleware.ts       # Protección de rutas
    │   └── styles/             # globals.css, Tailwind
    ├── public/                 # Assets estáticos
    ├── tailwind.config.js      # Design system (colores JASS)
    ├── next.config.js          # Config Next.js (standalone output)
    ├── package.json
    └── Dockerfile
```

---

## 🚀 Modo de Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up -d --build

# Ver logs del backend
docker-compose logs -f backend

# Ver logs del frontend
docker-compose logs -f frontend

# Detener servicios
docker-compose down
```

**Servicios disponibles:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/
- MySQL: localhost:3307 (usuario/password en `.env`)

---

### Opción 2: Desarrollo Local (Sin Docker)

#### Backend

```bash
cd jasspalian_backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (copiar .env.example a .env y editar)
cp .env.example .env

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## ⚙️ Variables de Entorno

### `.env` (Raíz - Docker Compose)

```env
# Base de datos
DB_NAME=jasspalian
DB_USER=jasspalian
DB_PASSWORD=tu_password_seguro
DB_HOST=host.docker.internal
DB_PORT=3306

# Django
SECRET_KEY=tu_secret_key_muy_larga_y_segura
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1,backend
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 👤 Credenciales por Defecto

Después de `docker-compose up` y migraciones:

| Rol       | Email                          | Contraseña |
| --------- | ------------------------------ | ---------- |
| Admin     | admin@jasspalian.gob.pe        | admin123   |
| Residente | (crear desde registro o admin) | -          |

> **Nota**: Cambiar contraseñas en producción inmediatamente.

---

## 📱 Funcionalidades Implementadas

### ✅ Landing Page (9 secciones)

- Navbar, diseño papel oficio)
- Hero con recibo interactivo
- Estadísticas en tabla responsiva
- 4 pasos del proceso
- Sobre nosotros (oficina real)
- Testimonios vecinos
- Contacto (WhatsApp + formulario + mapa)
- CTA registro guiado
- Footer institucional

### ✅ Autenticación

- Login / Register con validación
- JWT en localStorage + cookies HttpOnly
- Middleware protege rutas `/dashboard/*` y `/admin/*`

### ✅ Dashboard Residente (8 páginas)

| Página         | Componentes Principales                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Home           | DebtCard, QuickActions, RecentPayments, UpcomingBills, ConsumptionChart |
| Recibos        | ReceiptList, ReceiptCard, FilterBar                                     |
| Pagos          | PaymentSteps (wizard 3 pasos), PaymentMethodSelector                    |
| Historial      | HistoryTable, ExportButtons, DateRangePicker                            |
| Reclamos       | ComplaintCard, ComplaintForm, StatusBadge                               |
| Notificaciones | NotificationBell, NotificationList, MarkAllRead                         |
| Perfil         | ProfileForm, AvatarUpload, ChangePassword                               |
| Configuración  | SettingsTabs, NotificationPreferences, ThemeToggle                      |

### 🔄 Pendiente: Dashboard Admin (7 páginas)

- `/admin` (Home con stats)
- `/admin/usuarios`, `/admin/propiedades`, `/admin/facturas`
- `/admin/pagos`, `/admin/reclamos`, `/admin/reportes`
- 30+ componentes (tablas, modales, filtros, charts)

---

## 🎨 Design System (Frontend)

Colores definidos en `frontend/tailwind.config.js`:

| Token        | Hex       | Uso                       |
| ------------ | --------- | ------------------------- |
| `paper-base` | `#f5f0e8` | Fondos página             |
| `paper-200`  | `#e8e0d0` | Cards, filas alternas     |
| `paper-300`  | `#d4c9b3` | Hover, bordes             |
| `paper-900`  | `#2c2416` | Texto principal           |
| `pvc-blue`   | `#1a5276` | Acciones primarias, links |
| `stamp-red`  | `#c0392b` | Peligro, errores          |
| `canal-ok`   | `#27ae60` | Éxito, pagado             |
| `alert`      | `#e67e22` | Advertencias, pendiente   |

### Clases Utilitarias (`src/styles/globals.css`)

- **Superficies**: `.surface-1`, `.surface-2`, `.surface-3`, `.card`
- **Botones**: `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-danger`
- **Inputs**: `.input-base`, `.select-base`, `.textarea-base`
- **Badges**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`
- **Tablas**: `.table-base`, `.table-header`, `.table-row`
- **Tipografía**: `.label`, `.stat-value`, `.heading`

---

## 🧪 Testing

### Backend

```bash
cd jasspalian_backend
python manage.py test api.tests
```

### Frontend

```bash
cd frontend
# No hay tests configurados actualmente
# Agregar: npm test (configurar Jest + React Testing Library)
```

---

## 🔍 Exploración de Código (Graphify)

```bash
# Backend
$env:PATH += ";C:\Users\ROG\.bun\bin"; graphify build jasspalian_backend/
graphify query jasspalian_backend/graphify-out/graph.json <simbolo>

# Frontend
$env:PATH += ";C:\Users\ROG\.bun\bin"; graphify build frontend/
graphify query frontend/graphify-out/graph.json <simbolo>

# Auto-actualizar índice
graphify auto-update jasspalian_backend/
```

---

## 🐛 Gotchas Comunes

| Problema                        | Solución                                                                |
| ------------------------------- | ----------------------------------------------------------------------- |
| DB connection refused en Docker | Backend usa `host.docker.internal:3306` (MySQL en host port 3307)       |
| Static files 404                | Ejecutar `collectstatic` y verificar `STATIC_ROOT = '/app/staticfiles'` |
| CORS error                      | Verificar `CORS_ALLOWED_ORIGINS` en `settings.py`                       |
| JWT invalid                     | Verificar `SECRET_KEY` consistente entre backend y `.env`               |
| Frontend no conecta a API       | Verificar `NEXT_PUBLIC_API_URL` en `.env.local`                         |

---

## 📦 Despliegue a Producción

1. **Configurar variables de producción** (`.env.production`, `frontend/.env.production`)
2. **Build imágenes**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```
3. **Ejecutar con Nginx reverse proxy** (terminación SSL, static files)
4. **Configurar backup automático de MySQL**
5. **Monitoreo**: logs, health checks, alertas

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: descripción clara"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

### Estándares de Código

- Backend: `black`, `flake8`, `isort`
- Frontend: `eslint`, `prettier`, `tsc --noEmit`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)

---

## 📄 Licencia

Proyecto privado - JASS Palian. Todos los derechos reservados.

---

## 📞 Soporte

- **Email**: 71433164@continental.edu.pe
- **WhatsApp**: +51 967801686
- **Issues**: GitHub Issues del repositorio
