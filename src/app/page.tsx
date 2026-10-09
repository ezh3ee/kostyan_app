import { Calendar, type PlainEntry } from "@/components/calendar";
import { currentMonth, getEvents, getMonthEntries } from "@/lib/queries";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const params = await searchParams;
  const month =
    params.m && /^\d{4}-\d{2}$/.test(params.m) ? params.m : currentMonth();

  const [entries, events, admin] = await Promise.all([
    getMonthEntries(month),
    getEvents(),
    isAdmin(),
  ]);

  const plain: PlainEntry[] = entries.map((entry) => ({
    id: entry.id,
    date: entry.date.toISOString().slice(0, 10),
    type: entry.type,
    points: entry.points,
    reason: entry.reason,
    eventTitle: entry.event?.title ?? null,
  }));

  return (
    <Calendar
      month={month}
      entries={plain}
      events={events}
      isAdmin={admin}
      serverToday={new Date().toISOString().slice(0, 10)}
    />
  );
}
