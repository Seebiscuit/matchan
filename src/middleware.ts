import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Not approved
    if (!token.isApproved && path !== "/auth/pending") {
      return NextResponse.redirect(new URL("/auth/pending", req.url));
    }

    // Redirect root to singles page for approved users
    if (path === "/" && token.isApproved && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/singles/new", req.url));
    }

    // Admin only routes
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/singles/new", req.url));
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
    "/",
    "/singles/:path*",
    "/admin/:path*",
    "/auth/pending",
  ],
}; 