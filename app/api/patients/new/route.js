import { NextResponse } from "next/server";
import * as z from "zod"; 
import { prisma } from "./../../../lib/prisma";
import { getCurrentUser } from "./../../../lib/auth";

const newPatientSchema = z.object({
    name: z.string().min(2).max(100),
    age: z.number().min(1).max(150),
    gender: z.enum(["L", "P"]),
    record: z.string().min(2).max(16),
    patientId: z.number().int().positive(),
    doctorId: z.number().int().positive(),
    visitDate: z.string().datetime(),
    status: z.enum(["WAITING", "IN_PROGRESS", "COMPLETED"]),
});
    

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();

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

    const body = await request.json();

    const { name, age, gender, record, patientId, doctorId, visitDate, status } = body;

    const parsedData = newPatientSchema.safeParse({
      name,
      age,
      gender,
      record,
      patientId,
      doctorId,
      visitDate,
      status
    });

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

    if (!name || !age || !gender || !record || !patientId || !doctorId || !visitDate || !status) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const newPatient = await prisma.patients.create({
      data: {
        name,
        age,
        gender,
        recordNumber:record,
        visits: {
          create: {
            patientId,
            doctorId,
            recepsionistId : currentUser.id,
            visitDate,
            status
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Pasien berhasil didaftarkan",
        patient: {
          id: newPatient.id,
          name: newPatient.name,
          age: newPatient.age,
          gender: newPatient.gender,
          recordNumber: newPatient.recordNumber,
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
      