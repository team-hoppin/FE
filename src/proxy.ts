import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.cookies.has("onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
}

export const config = {
  matcher: ["/"],
};
