import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Maintenance mode check
  if (process.env.MAINTENANCE_MODE === "true") {
    const path = request.nextUrl.pathname;
    if (!path.startsWith("/maintenance") && !path.startsWith("/api")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
