import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")

  const pathname = request.nextUrl.pathname

  const protectedRoutes = ["/dashboard", "/tasks", "/profile", "/admin"]

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
}
