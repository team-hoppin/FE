import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/onboarding", "/auth/success"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    /^\/album\/[^/]+$/.test(pathname);

  if (pathname === "/") {
    if (!request.cookies.has("onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return;
  }

  if (!isPublic && !request.cookies.has("refreshToken")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
