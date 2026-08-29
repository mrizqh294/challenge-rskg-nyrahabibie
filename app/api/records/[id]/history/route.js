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
          status: 401,
        }
      );
    }
   
   const { id } = await params;
9
   const medicalRecords = await prisma.medicalRecord.findMany({
    where: {
      visit: {
        patientId: Number(id),
      }
    },
  });

  return NextResponse.json(medicalRecords);
}