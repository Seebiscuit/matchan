import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Not approved
    if (!token.isApproved && req.nextUrl.pathname !== "/auth/pending") {
      return NextResponse.redirect(new URL("/auth/pending", req.url));
    }

    // Admin only routes
    if (
      req.nextUrl.pathname.startsWith("/admin") && 
      token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/singles/:path*",
    "/admin/:path*",
    "/search/:path*",
    "/",
  ],
}; 