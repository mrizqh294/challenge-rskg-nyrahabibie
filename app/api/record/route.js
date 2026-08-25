import { NextResponse } from "next/server";
import * as z from "zod"; 
import { prisma } from "./../../../../lib/prisma";

const medicalRecordSchema = z.object({
    doctorId: z.number().int().positive(),
    visitId: z.number().int().positive(),
    diagnosis: z.string().min(2).max(1000),
    actionPlan: z.string().min(2).max(1000),
    receipt : z.string().min(2).max(1000),
});

export async function GET() {
  try {
    const medicalRecords = await prisma.medicalRecords.findMany();
    return NextResponse.json({ medicalRecords });
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

export async function POST(request) {
  try {
    const body = await request.json();

    const { doctorId, visitId, diagnosis, actionPlan, receipt } = body;

    const parsedData = medicalRecordSchema.safeParse({ doctorId, visitId, diagnosis, actionPlan, receipt });

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

    if (!doctorId || !visitId || !diagnosis || !actionPlan || !receipt) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }


    const medicalRecord = await prisma.medicalRecords.create({
      data: {
        doctorId,
        visitId,
        diagnosis,
        actionPlan,
        receipt,
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