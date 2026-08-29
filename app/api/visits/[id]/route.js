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
          status: 401,
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

    if (currentUser.role !== "ADMIN") {
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
    
    const visits = await prisma.visits.delete({
      where: {
        id: Number(id),
      },
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

export async function PATCH(request, { params }) {
    const patientSchema = z.object({
        patientId: z.number(),
        doctorId: z.number(),
        description: z.string(),
        status: z.enum(["WAITING", "COMPLETED", "CANCELED"]),
    });

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
                status: 401,
                }
            );
        }

        const body = await request.json();

        const { patientId, doctorId, description, status } = body;

        const parsedData = patientSchema.safeParse({ patientId, doctorId, description, status });
        
            if (!parsedData.success) {
              return NextResponse.json(
                {
                  message: `Data tidak valid ${parsedData.error.flatten().fieldErrors}`,
                  errors: parsedData.error.flatten().fieldErrors,
                },
                {
                  status: 400,
                }
              );
            }

        const { id } = await params;

        const visit = await prisma.visits.update({
        where: {
            id: Number(id),
        },
        data: {
            patientId,
            doctorId,
            description,
            status
        },
        });
        return NextResponse.json(
        {
            message: "Jadwal kunjungan berhasil diubah",
            visit: visit,
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
