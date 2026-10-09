import { prisma } from "./prisma";

/** Границы месяца в UTC по строке "YYYY-MM". */
export function monthRange(month: string) {
  const [year, m] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, m - 1, 1)),
    end: new Date(Date.UTC(year, m, 1)),
  };
}

export function currentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getMonthEntries(month: string) {
  const { start, end } = monthRange(month);
  return prisma.transaction.findMany({
    where: { date: { gte: start, lt: end } },
    include: { event: true },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });
}

export async function getEvents() {
  return prisma.event.findMany({ orderBy: { title: "asc" } });
}

export async function getTotals() {
  const grouped = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { points: true },
  });

  const sum = (type: "EARN" | "PENALTY" | "SPEND") =>
    grouped.find((g) => g.type === type)?._sum.points ?? 0;

  const earned = sum("EARN");
  const penalty = sum("PENALTY");
  const spent = sum("SPEND");

  return { earned, penalty, spent, balance: earned - penalty - spent };
}

export type MonthEntry = Awaited<ReturnType<typeof getMonthEntries>>[number];
