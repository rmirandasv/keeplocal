import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip assets, API routes, and internal Next.js requests
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const locales = ["en", "es"];
  const defaultLocale = "en";

  // Check if pathname has a locale prefix (e.g. /en or /es)
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    // If the path starts with the default locale prefix (/en), we redirect to remove the prefix
    if (pathname === `/${defaultLocale}`) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith(`/${defaultLocale}/`)) {
      const cleanPathname = pathname.slice(defaultLocale.length + 1); // remove '/en'
      return NextResponse.redirect(new URL(cleanPathname, request.url));
    }
    // If it starts with non-default locale (e.g. /es), let Next.js match the [lang] route naturally
    return NextResponse.next();
  }

  // 3. For the default locale (English) without a prefix, rewrite internally to /[defaultLocale]/path
  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  // Intercept all routes except static assets, internal paths, and API routes
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
