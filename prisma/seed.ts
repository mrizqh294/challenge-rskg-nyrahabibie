import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  PrismaClient,
  Role,
} from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // ADMIN
  await prisma.user.upsert({
    where: {
      email: "admin1@gmail.com",
    },
    update: {},
    create: {
      name: "Admin 1",
      email: "admin1@gmail.com",
      password,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admin2@gmail.com",
    },
    update: {},
    create: {
      name: "Admin 2",
      email: "admin2@gmail.com",
      password,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admin3@gmail.com",
    },
    update: {},
    create: {
      name: "Admin 3",
      email: "admin3@gmail.com",
      password,
      role: Role.ADMIN,
    },
  });

  // DOKTER
  await prisma.user.upsert({
    where: {
      email: "dokter1@gmail.com",
    },
    update: {},
    create: {
      name: "Dokter 1",
      email: "dokter1@gmail.com",
      password,
      role: Role.DOKTER,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "dokter2@gmail.com",
    },
    update: {},
    create: {
      name: "Dokter 2",
      email: "dokter2@gmail.com",
      password,
      role: Role.DOKTER,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "dokter3@gmail.com",
    },
    update: {},
    create: {
      name: "Dokter 3",
      email: "dokter3@gmail.com",
      password,
      role: Role.DOKTER,
    },
  });

  // PERAWAT
  await prisma.user.upsert({
    where: {
      email: "perawat1@gmail.com",
    },
    update: {},
    create: {
      name: "Perawat 1",
      email: "perawat1@gmail.com",
      password,
      role: Role.PENDAFTARAN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "perawat2@gmail.com",
    },
    update: {},
    create: {
      name: "Perawat 2",
      email: "perawat2@gmail.com",
      password,
      role: Role.PENDAFTARAN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "perawat3@gmail.com",
    },
    update: {},
    create: {
      name: "Perawat 3",
      email: "perawat3@gmail.com",
      password,
      role: Role.PENDAFTARAN,
    },
  });

  console.log("Seeder berhasil: 9 user dibuat.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });