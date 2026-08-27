import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";

export async function GET(request, { params }) {

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
   
   const { id } = await params;

   const medicalRecords = await prisma.medicalRecord.findMany({
    where: {
      visit: {
        patientId: Number(id),
      }
    },
  });

  // if (!medicalRecords || medicalRecords.length === 0) {
  //   return NextResponse.json(
  //     { message: "Tidak ada riwayat medis yang ditemukan" },
  //     { status: 404 }
  //   );
  // }

  return NextResponse.json(medicalRecords);
}