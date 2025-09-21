import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
    cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the request so that
          // Server Components can see the latest value
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
          request.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request so that
          // Server Components can see the latest value
          request.cookies.set({ name, value: "", ...options })
          response.cookies.set({ name, value: "", ...options })
          request.cookies.set(name, "", options)
      },
    },
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Protect authenticated routes
  const protectedPaths = ["/track", "/community", "/chat", "/analytics", "/achievements", "/matching", "/resources"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/auth/login", "/auth/sign-up"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL("/track", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
}
