import { NextResponse } from "next/server";
import { auth } from "@/auth";

const publicPaths = ["/signin", "/api/auth"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublic) {
    if (pathname === "/signin" && req.auth) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    const signIn = new URL("/signin", req.nextUrl.origin);
    if (pathname !== "/") {
      signIn.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
