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

    if (currentUser.role !== "PENDAFTARAN") {
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
        id: true,
        description: true,
        visitDate: true,
        status: true,
        patient: {
            select: {
                id: true,
                name: true,
                recordNumber: true,
                age: true,
                gender : true,
            }
        },
        recepsionist: {
            select: {
                name: true,
            }
        },
        doctor: {
          select:{
            name: true,
          }
        }
      },
      where: {
        recepsionistId: currentUser.userId
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