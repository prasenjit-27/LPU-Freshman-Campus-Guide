import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// List of routes that strictly require authenticated student or admin access
const protectedPrefixes = [
  "/campus-map",
  "/freshmen-guide",
  "/academics",
  "/hostel",
  "/dining",
  "/services",
  "/events",
  "/buddy",
  "/settings",
  "/dashboard",
];

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // Check if account status was deactivated
    if (token.status === "deactivated") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "AccountDeactivated");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/campus-map/:path*",
    "/freshmen-guide/:path*",
    "/academics/:path*",
    "/hostel/:path*",
    "/dining/:path*",
    "/services/:path*",
    "/events/:path*",
    "/buddy/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
  ],
};
