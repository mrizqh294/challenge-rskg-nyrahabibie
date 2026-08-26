import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Role } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const prisma = new PrismaClient({ adapter });

const users = [
  { name: "Admin 1", email: "admin1@gmail.com", role: Role.ADMIN },
  { name: "Admin 2", email: "admin2@gmail.com", role: Role.ADMIN },
  { name: "Admin 3", email: "admin3@gmail.com", role: Role.ADMIN },
  { name: "Dokter 1", email: "dokter1@gmail.com", role: Role.DOKTER },
  { name: "Dokter 2", email: "dokter2@gmail.com", role: Role.DOKTER },
  { name: "Dokter 3", email: "dokter3@gmail.com", role: Role.DOKTER },
  { name: "Perawat 1", email: "perawat1@gmail.com", role: Role.PENDAFTARAN },
  { name: "Perawat 2", email: "perawat2@gmail.com", role: Role.PENDAFTARAN },
  { name: "Perawat 3", email: "perawat3@gmail.com", role: Role.PENDAFTARAN },
];

const main = async () => {
  const password = await bcrypt.hash("password123", 10);

  for (const { name, email, role } of users) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password, role },
    });
  }

  console.log(`Seeder berhasil: ${users.length} user dibuat.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });