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
  { name: "Adnan Jalil", email: "admin1@gmail.com", role: Role.ADMIN },
  { name: "Faizal Permana", email: "admin2@gmail.com", role: Role.ADMIN },
  { name: "Ronal Adrian", email: "admin3@gmail.com", role: Role.ADMIN },
  { name: "Dr. Muhammad Rizki Haikal", email: "dokter1@gmail.com", role: Role.DOKTER },
  { name: "Dr. Suci Indah Purnama", email: "dokter2@gmail.com", role: Role.DOKTER },
  { name: "Dr. Anjasmmara", email: "dokter3@gmail.com", role: Role.DOKTER },
  { name: "Tio Rahayu", email: "pendaftaran1@gmail.com", role: Role.PENDAFTARAN },
  { name: "Ali Chandra", email: "pendaftaran2@gmail.com", role: Role.PENDAFTARAN },
  { name: "Kunto Aji", email: "pendaftaran3@gmail.com", role: Role.PENDAFTARAN },
];

const main = async () => {
  const password = await bcrypt.hash("12345678", 10);

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