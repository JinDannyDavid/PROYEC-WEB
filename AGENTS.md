# AGENTS.md - JASS Palian Web Portal

## Project Overview
Monorepo with Django REST API backend + Next.js 14 frontend. Docker Compose orchestrates MySQL, backend (port 8000), frontend (port 3000).

## Code Navigation (graphify)
Structural index available via graphify CLI:
```bash
$env:PATH += ";C:\Users\ROG\.bun\bin"; graphify build jasspalian_backend/
$env:PATH += ";C:\Users\ROG\.bun\bin"; graphify build frontend/
graphify query jasspalian_backend/graphify-out/graph.json <symbol>
graphify query frontend/graphify-out/graph.json <symbol>
graphify auto-update jasspalian_backend/
```

## Key Commands

### Frontend (Next.js 14 + TypeScript)
```bash
cd frontend
npm run dev          # dev server on :3000
npm run build        # production build (outputs standalone)
npm run start        # run production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

### Backend (Django 4.2 + DRF)
```bash
cd jasspalian_backend
python manage.py migrate       # run migrations
python manage.py collectstatic # collect static files
python manage.py runserver     # dev server on :8000
python manage.py createsuperuser
```

### Docker (recommended)
```bash
docker-compose up -d --build   # build and start all services
docker-compose down            # stop
docker-compose logs -f backend # view backend logs
```

## Architecture Notes

### Backend (`jasspalian_backend/`)
- **Entry**: `manage.py` → `jasspalian_backend/settings.py`
- **Custom User**: `AUTH_USER_MODEL = 'api.Usuario'` (model in `api/models/usuario.py:29`)
- **Auth**: JWT via `djangorestframework-simplejwt` (access 1d, refresh 7d)
- **Database**: MySQL 8.0 (config via env vars)
- **API Root**: `/api/` (see `api/urls.py`)
- **CORS**: Allows `localhost:3000`, `192.168.100.x:8000`
- **Apps**: `api` (models, views, serializers for Usuario, Propiedad, Factura, Pago, Reclamo, Notificacion)
- **Key Models**: `Usuario` (custom user), `Propiedad`, `Factura`, `Pago`, `Reclamo`, `Notificacion`
- **Key Views**: `UsuarioListCreateView`, `UsuarioDetailView`, `PropiedadListCreateView`, etc.
- **Serializers**: `UsuarioSerializer`, `UsuarioRegistroSerializer`, `PropiedadSerializer`, etc.
- **Tests**: `api/tests.py` has basic model/serializer tests (see `UsuarioModelTest`, `UsuarioSerializerTest`)

### Frontend (`frontend/`)
- **Framework**: Next.js 14 (App Router not used; uses `pages/` directory)
- **Styling**: Tailwind CSS with custom `jass-*` color palette
- **Auth**: JWT in `localStorage` + cookies; middleware protects routes
- **API Client**: `src/services/api.ts` (axios with token interceptor)
- **Middleware** (`src/middleware.ts`): Redirects unauthenticated users to `/login`; admin routes under `/admin/*`
- **Core Services**: `src/core/services/api.service.ts` (BaseApiService, createApiService)
- **Hooks**: `src/hooks/useApi.ts` (ApiCache, useApi, invalidateApiCache)
- **Config**: `src/core/config/api.config.ts`

### Environment Variables
| File | Purpose |
|------|---------|
| `.env` | Docker Compose DB credentials |
| `frontend/.env.local` | Frontend dev config (`NEXT_PUBLIC_API_URL=http://localhost:8000/api`) |
| `docker-compose.yml` | Backend env: `DB_HOST=host.docker.internal`, `SECRET_KEY`, `DEBUG=1` |

## Common Gotchas
- **DB Host**: In Docker, backend uses `host.docker.internal:3306` (not `db:3306`) because MySQL runs on host port 3307 mapped to 3306
- **Static Files**: Backend `STATIC_ROOT = '/app/staticfiles'` collected via entrypoint.sh
- **Frontend Build**: Outputs `standalone` mode for Docker; `server.js` is entrypoint
- **No Tests**: Backend `api/tests.py` is empty; frontend has no test config
- **G0DM0D3/**: Separate Astro/React project (unrelated to main app)
- **Graphify**: Requires Bun runtime (`C:\Users\ROG\.bun\bin` in PATH)

## Design System (Frontend)
See `frontend/tailwind.config.js` for full token set. Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `paper-base` | `#f5f0e8` | Page backgrounds |
| `paper-200` | `#e8e0d0` | Card/row alt backgrounds |
| `paper-300` | `#d4c9b3` | Hover/border states |
| `paper-900` | `#2c2416` | Primary text |
| `pvc-blue` | `#1a5276` | Primary actions, links |
| `stamp-red` | `#c0392b` | Danger/errors |
| `canal-ok` | `#27ae60` | Success/paid |
| `alert` | `#e67e22` | Warnings/pending |

### Utility Classes (in `globals.css` `@layer components`)
- **Surfaces**: `.surface-1`, `.surface-2`, `.surface-3`, `.card`
- **Buttons**: `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-danger`
- **Inputs**: `.input-base`, `.select-base`, `.textarea-base`
- **Badges**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`
- **Tables**: `.table-base`, `.table-header`, `.table-row`
- **Typography**: `.label`, `.stat-value`, `.heading`

### Global CSS Layers
- `@layer base` — IBM Plex Sans/Mono, base resets
- `@layer components` — all utility classes above
- `@layer utilities` — paper texture, scrollbar, focus-visible

## Design Progress

### ✅ COMPLETED
- **Landing Page** (9 sections): Navbar, Hero (ReciboVivo), Stats (tabla), Features (4 pasos), About (oficina real), Testimonials (voces vecinales), Contact (WhatsApp+form+mapa), CTA (registro guiado), Footer (institucional)
- **Auth Pages**: Login, Register — paper surface, no glassmorphism/gradients
- **Dashboard Residente** (8 pages):
  - Layout: DashboardLayout, Sidebar, Header
  - Home: DebtCard, QuickActions, RecentPayments, UpcomingBills, ConsumptionChart
  - Recibos, Pagos, Historial, Reclamos, Notificaciones, Perfil, Configuracion
  - All child components refactored (ReceiptCard, PaymentSteps, ComplaintCard, etc.)

### 🔄 PENDING
- **Admin Dashboard** (7 pages): /admin (home), usuarios, propiedades, facturas, pagos, reclamos, reportes
- **Admin Components** (30+): Sidebar, Header, tables (UsuariosTable, etc.), form modals, filters, delete modals, charts, stats