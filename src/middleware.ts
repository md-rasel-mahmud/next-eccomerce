// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;

  // Check for /admin routes
  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      // Unauthorized access to admin route
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Define protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/cart", "/profile"],
};
