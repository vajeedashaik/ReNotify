import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update request cookies
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
        // Create new response with updated cookies
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        // Set cookies on response - preserve Supabase's original options
        // Only override if not already set
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            // Only set defaults if not provided by Supabase
            sameSite: options?.sameSite || 'lax',
            secure: options?.secure ?? (process.env.NODE_ENV === 'production'),
            path: options?.path || '/',
            // Don't override maxAge if Supabase set it
            ...(options?.maxAge ? {} : { maxAge: 60 * 60 * 24 * 7 }), // 7 days default only if not set
          });
        });
      },
    },
  });

  // Refresh session if expired - this is critical for maintaining auth state
  // This will automatically refresh expired tokens and update cookies
  try {
    const { data: { user } } = await supabase.auth.getUser();
    // If user exists, session is valid (or was just refreshed)
    // The cookies are automatically updated by getUser()
  } catch (error) {
    // Silent fail - session might not exist yet
    console.debug('Middleware session check:', error instanceof Error ? error.message : 'Unknown error');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
