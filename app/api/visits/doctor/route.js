import { NextResponse } from "next/server";
import { prisma } from "./../../../../lib/prisma"
import { getCurrentUser } from "./../../../../lib/auth";
    
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser){
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk melakukan tindakan ini",
        },
        {
          status: 403,
        }
      );
    }

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
      select: {
        visitDate: true,
        status: true,
        patient: {
            select: {
                name: true
            }
        }
      },
      where: {
        doctorId: currentUser.userId
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