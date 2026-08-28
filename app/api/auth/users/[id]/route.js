import { NextResponse } from "next/server";
import * as z from "zod";
import { prisma } from "./../../../../../lib/prisma";
import { getCurrentUser } from "./../../../../../lib/auth";

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

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ user });

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
    
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ user });
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
    const userSchema = z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        role: z.enum(["ADMIN", "DOKTER", "PENDAFTARAN"]),
    });

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

        const body = await request.json();

        const { name, email, role } = body;

        const parsedData = userSchema.safeParse({ name, email, role });
        
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

        const user = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            name,
            email,
            role,
        },
        });
        return NextResponse.json({
          message: "Data user berhasil diubah",
          user: user,
        },
        {
          status: 201,
        });
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
