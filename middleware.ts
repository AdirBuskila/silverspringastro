import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - spacekit (3D viewer assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|spacekit|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

