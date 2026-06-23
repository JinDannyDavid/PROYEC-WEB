import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas publicas (no requieren autenticacion)
const publicRoutes = ['/', '/login', '/register', '/test-api'];

// Rutas de administrador (solo para ADMIN)
const adminRoutes = ['/admin', '/admin/usuarios', '/admin/propiedades', '/admin/facturas', '/admin/pagos', '/admin/reclamos', '/admin/reportes'];

function decodeJWTPayload(token: string): { exp?: number; tipo_usuario?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Si no hay token y la ruta no es publica, redirigir a login
  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Si hay token, verificar que no este expirado
  if (token && isTokenExpired(token)) {
    // Si hay refresh token, intentar refrescar via cliente
    // El middleware no puede hacer refresh directamente, pero puede permitir
    // que la request continue y el interceptor del cliente haga el refresh
    if (refreshToken) {
      // Permitir que continue; el interceptor en el cliente manejara el refresh
      // Agregar header para indicar que el token esta expirado
      const response = NextResponse.next();
      response.headers.set('x-token-expired', 'true');
      return response;
    } else {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
  }

  // Verificar rol para rutas admin (validacion basica, completa en frontend/backend)
  if (isAdminRoute && token) {
    const payload = decodeJWTPayload(token);
    if (payload?.tipo_usuario !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};