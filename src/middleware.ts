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

    // Non-admin users can only access /singles/new
    if (path === "/singles" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/singles/new", req.url));
    }

    // Redirect root to appropriate page based on role
    if (path === "/") {
      return NextResponse.redirect(
        new URL(token.role === "ADMIN" ? "/singles" : "/singles/new", req.url)
      );
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
    "/singles",
    "/singles/new",
    "/auth/pending",
  ],
}; 