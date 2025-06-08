import { cookies as getCookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { AUTH_COOKIE, getAuthCookie, REFRESH_COOKIE } from "./lib/auth-cookie";
import { getApiUrl, getMainAppUrl } from "@/lib/utils";

const unauthenticatedRoutes = [
  "/sign-up",
  "/sign-in",
  "/auth/google",
  "/auth/github",
];

export async function middleware(
  request: NextRequest,
): Promise<NextResponse | Response | undefined> {
  const cookiesStore = await getCookies();
  const authenticated = Boolean(cookiesStore.get(AUTH_COOKIE)?.value);

  if (authenticated) {
    // redirect to main page if authenticated
    return NextResponse.redirect(getMainAppUrl());
  }

  if (cookiesStore.get(REFRESH_COOKIE)) {
    const refreshRes = await fetch(`${getApiUrl()}/auth/refresh`, {
      headers: {
        Cookie: cookiesStore.toString(),
      },
      method: "POST",
    });
    const authCookies = getAuthCookie(refreshRes);
    if (authCookies?.accessToken) {
      const response = NextResponse.redirect(request.url);
      response.cookies.set(authCookies.accessToken as ResponseCookie);
      return response;
    }
  }

  if (
    !unauthenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )
  ) {
    console.log("web-auth middleware redirecting to sign-in");
    return Response.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
