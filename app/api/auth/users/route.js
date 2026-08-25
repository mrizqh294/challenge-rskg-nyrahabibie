import { NextResponse } from "next/server";
import { prisma } from "./../../../../lib/prisma";
import { getCurrentUser } from "./../../../../lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk melakukan tindakan ini",
        },
        {
          status: 403,
        }
      );
    }

    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
      },
      {
        status: 500,
      }
    );
  }
}