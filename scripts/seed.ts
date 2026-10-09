import { hashPassword } from "better-auth/crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
console.log('SEEDS RUN');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
console.log('ADAPTER INITIALIZED');
const DEFAULT_EVENTS = ["Тренировка", "Школа", "Поведение"];

async function seedEvents() {
  for (const title of DEFAULT_EVENTS) {
    await prisma.event.upsert({
      where: { title },
      update: {},
      create: { title },
    });
  }
  console.log(`Ивенты: ${DEFAULT_EVENTS.join(", ")}`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Админ";

  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD не заданы — админ не создаётся");
    return;
  }
  if (password.length < 8) {
    throw new Error("Пароль админа должен быть не короче 8 символов");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "admin" },
    });
    console.log(`Админ уже был, роль поднята: ${email}`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name,
      email,
      emailVerified: true,
      role: "admin",
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: await hashPassword(password),
    },
  });

  console.log(`Админ создан: ${email}`);
}

async function main() {
  console.log('RUN MAIN FUNC');
  await seedEvents();
  console.log('MAIN SEEDS EVENTS DONE');
  await seedAdmin();
  console.log('ADMIN DONE');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
