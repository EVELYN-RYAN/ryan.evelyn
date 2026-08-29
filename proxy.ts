import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "metrics_auth";

export function proxy(request: NextRequest) {
  const password = process.env.METRICS_PASSWORD;
  if (!password) return NextResponse.next();

  const keyParam = request.nextUrl.searchParams.get("key");
  if (keyParam === password) {
    const url = new URL(request.nextUrl);
    url.searchParams.delete("key");
    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, password, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  if (request.cookies.get(COOKIE_NAME)?.value === password) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized — append ?key=<METRICS_PASSWORD> to the URL.", {
    status: 401,
  });
}

export const config = {
  matcher: "/metrics/:path*",
};
