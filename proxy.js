import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = payload.role;

  switch (role) {
    case "ADMIN":
      if (!pathname.startsWith("/dashboard/admin")) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      break;

    case "PENDAFTARAN":
      if (!pathname.startsWith("/dashboard/pendaftaran")) {
        return NextResponse.redirect(new URL("/dashboard/pendaftaran", request.url));
      }
      break;

    case "DOKTER":
      if (!pathname.startsWith("/dashboard/dokter")) {
        return NextResponse.redirect(new URL("/dashboard/dokter", request.url));
      }
      break;

    default:
      if (!pathname.startsWith("/dashboard/admin")) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      break;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ]
};