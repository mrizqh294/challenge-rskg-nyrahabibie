import { NextResponse } from "next/server";
import * as z from "zod"; 
import { prisma } from "./../../../../lib/prisma"
import { getCurrentUser } from "./../../../../lib/auth";

const visitSchema = z.object({
    patientId: z.number().int().positive(),
    doctorId: z.number().int().positive(),
    visitDate: z.string().datetime(),
    status: z.enum(["WAITING", "IN_PROGRESS", "COMPLETED"]),
});

export async function GET() {
  try {
    const visits = await prisma.visits.findMany();
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

export async function POST(request) {
  try {

    const currentUser = await getCurrentUser();
    
    if (currentUser.role !== "ADMIN" && currentUser.role !== "PENDAFTARAN") {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk melakukan tindakan ini",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const { patientId, doctorId, visitDate, status } = body;

    const parsedData = visitSchema.safeParse({ patientId, doctorId, visitDate, status });

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

    if (!patientId || !doctorId || !visitDate || !status) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }


    const visit = await prisma.visits.create({
      data: {
        patientId,
        doctorId,
        recepsionistId: currentUser.id,
        visitDate,
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Jadwal kunjungan berhasil dibuat",
        visit: {
          id: visit.id,
          patientId: visit.patientId,
          doctorId: visit.doctorId,
          recepsionistId: visit.recepsionistId,
          visitDate: visit.visitDate,
          status: visit.status,
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
          
      