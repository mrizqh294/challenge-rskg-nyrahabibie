import { NextResponse } from "next/server";
import * as z from "zod"; 
import { prisma} from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/auth";

const medicalRecordSchema = z.object({
    visitId: z.number().int().positive(),
    diagnosis: z.string().min(2).max(1000),
    actionPlan: z.string().min(2).max(1000),
    receipt : z.string().min(2).max(1000),
});

export async function POST(request) {
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
          status: 401,
        }
      );
    }

    const body = await request.json();

    const {visitId, diagnosis, actionPlan, receipt } = body;

    const parsedData = medicalRecordSchema.safeParse({ visitId, diagnosis, actionPlan, receipt });

    if (!parsedData.success) {
      return NextResponse.json(
        {
          message: "Data tidak valid",
          errors: parsedData.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    if (!visitId || !diagnosis || !actionPlan || !receipt) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const doctorId = currentUser.userId;

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        doctorId,
        visitId,
        diagnosis,
        actionPlan,
        receipt,
      },
    });

    await prisma.visits.update({
      where: {
        id: Number(visitId),
      },
      data: {
        status: "COMPLETED",
      },
    });

    return NextResponse.json(
      {
        message: "Catatan medis berhasil dibuat",
        medicalRecord: {
          id: medicalRecord.id,
          doctorId: medicalRecord.doctorId,
          visitId: medicalRecord.visitId,
          diagnosis: medicalRecord.diagnosis,
          actionPlan: medicalRecord.actionPlan,
          receipt: medicalRecord.receipt,
        },
      },
      {
        status: 201,
      }
    );
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