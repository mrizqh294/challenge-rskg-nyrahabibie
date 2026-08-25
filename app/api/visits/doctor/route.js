import { NextResponse } from "next/server";
import { prisma } from "./../../../../lib/prisma"
import { getCurrentUser } from "./../../../../lib/auth";
    
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser.role !== "DOKTER") {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk melakukan tindakan ini",
        },
        {
          status: 403,
        }
      );
    }

    const visits = await prisma.visits.findMany({
      where: {
        doctorId: currentUser.id
      }
    });
    return NextResponse.json({ visits });

  } catch (error) {
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