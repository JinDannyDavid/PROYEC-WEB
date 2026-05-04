import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas públicas (no requieren autenticación)
const publicRoutes = ['/', '/login', '/register', '/test-api', '/admin'];

// Rutas de administrador (solo para ADMIN)
const adminRoutes = ['/admin', '/admin/usuarios', '/admin/propiedades', '/admin/facturas', '/admin/pagos', '/admin/reclamos', '/admin/reportes'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Si hay token, verificar rol (esto requiere decodificar el token)
  // Por simplicidad, asumimos que si es ruta admin, el usuario debe ser admin
  // La verificación real se hará en el frontend

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};