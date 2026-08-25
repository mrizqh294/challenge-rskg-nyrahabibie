import { NextResponse } from "next/server";
import * as z from "zod"; 
import { prisma} from "./../../../lib/prisma";
import { getCurrentUser } from "./../../../lib/auth";

const patientSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().min(1).max(150),
  gender: z.enum(["L", "P"]),
  record: z.string().min(2).max(16),
});

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.role !== "PENDAFTARAN" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk melakukan tindakan ini",
        },
        {
          status: 403,
        }
      );
    }

    const patients = await prisma.patients.findMany();
    return NextResponse.json({ patients });
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

    if (currentUser.role !== "PENDAFTARAN" && currentUser.role !== "ADMIN") {
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

    const { name, age, gender, record } = body;

    const parsedData = patientSchema.safeParse({ name, age, gender, record});

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

    if (!name || !age || !gender || !record) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const patient = await prisma.patients.create({
      data: {
        name,
        age,
        gender,
        recordNumber:record,
      },
    });

    return NextResponse.json(
      {
        message: "Pasien berhasil dibuat",
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          recordNumber: patient.recordNumber,
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
      