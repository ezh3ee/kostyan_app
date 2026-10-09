"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { SCALE_VALUES } from "@/lib/scale";
import { isAdmin } from "@/lib/session";

export type FormState = { error?: string; ok?: boolean } | null;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/balance");
  revalidatePath("/admin");
}

export async function addEntry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) return { error: "Нет доступа" };

  const type = String(formData.get("type") ?? "");
  const dateStr = String(formData.get("date") ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { error: "Укажи дату" };
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  if (type === "EARN") {
    const points = Number(formData.get("points"));
    const eventId = String(formData.get("eventId") ?? "");
    if (!SCALE_VALUES.includes(points as (typeof SCALE_VALUES)[number])) {
      return { error: "Выбери оценку от 1 до 5" };
    }
    if (!eventId) return { error: "Выбери ивент" };

    await prisma.transaction.create({
      data: { date, type: "EARN", points, eventId },
    });
  } else if (type === "PENALTY" || type === "SPEND") {
    const points = Number(formData.get("points"));
    const reason = String(formData.get("reason") ?? "").trim();

    if (!Number.isInteger(points) || points <= 0) {
      return { error: "Баллы — целое число больше нуля" };
    }
    if (!reason) return { error: "Причина обязательна" };

    await prisma.transaction.create({
      data: { date, type, points, reason },
    });
  } else {
    return { error: "Неизвестный тип записи" };
  }

  revalidateAll();
  return { ok: true };
}

export async function addEvent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) return { error: "Нет доступа" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Название обязательно" };

  const exists = await prisma.event.findUnique({ where: { title } });
  if (exists) return { error: "Такой ивент уже есть" };

  await prisma.event.create({ data: { title } });
  revalidateAll();
  return { ok: true };
}

export async function deleteEvent(formData: FormData) {
  if (!(await isAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.event.delete({ where: { id } });
  revalidateAll();
}
