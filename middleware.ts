import { NextResponse, type NextRequest } from "next/server"
import { verifySession, SESSION_COOKIE } from "@/lib/session"

const ADMIN_LOGIN_PATH = "/admin/login"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Allow login page without session
  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next()
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = ADMIN_LOGIN_PATH
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  const session = await verifySession(token)
  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = ADMIN_LOGIN_PATH
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
