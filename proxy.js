import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/nurse/:path*",
    "/doctor/:path*",
  ]
};