import { redirect } from "next/navigation";

import { EventManager } from "@/components/event-manager";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect("/login");

  const events = await prisma.event.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { transactions: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium">Ивенты</h1>
      <EventManager
        events={events.map((event) => ({
          id: event.id,
          title: event.title,
          count: event._count.transactions,
        }))}
      />
    </div>
  );
}
