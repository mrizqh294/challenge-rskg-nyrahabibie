import { NextResponse } from "next/server";
import * as z from "zod";
import { prisma } from "./../../../../lib/prisma";
import { getCurrentUser } from "./../../../../lib/auth";

export async function GET(request, { params }) {
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

    const { id } = await params;

    const patient = await prisma.patients.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ patient });

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

export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser(); 

    if (currentUser.role !== "ADMIN") {
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
    
    const patient = await prisma.patients.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ patient });
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

export async function PATCH(request, { params }) {
    const patientSchema = z.object({
        name: z.string().min(2).max(100),
        age: z.number().min(1).max(150),
        gender: z.enum(["L", "P"]),
    });

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

        const { name, age, gender } = body;

        const parsedData = patientSchema.safeParse({ name, age, gender });
        
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

        const { id } = await params;

        const patient = await prisma.patients.update({
        where: {
            id: Number(id),
        },
        data: {
            name,
            age,
            gender
        },
        });
        return NextResponse.json({
            message: "Data pasien berhasil diubah",
            patient: patient ,
          },
          {
            status: 201,
        });
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
