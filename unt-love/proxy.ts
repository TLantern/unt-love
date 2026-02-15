import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/", "/verify", "/about-you", "/your-type", "/youre-all-set"];

function isPublicPath(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) return true;
  return false;
}

function isProtectedPath(pathname: string): boolean {
  return protectedRoutes.includes(pathname);
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = isProtectedPath(path);
  const isPublic = isPublicPath(path);

  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // Redirect to /verify if accessing protected routes without session
  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL('/verify', req.nextUrl));
  }

  // Allow access to public routes and API routes
  if (isPublic) {
    return NextResponse.next();
  }

  // For any other routes, allow access (since we handle auth in individual routes/pages)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};