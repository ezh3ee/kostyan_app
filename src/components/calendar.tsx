"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AddEntryForm } from "@/components/add-entry-form";
import { scaleLabel } from "@/lib/scale";

export type PlainEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  type: "EARN" | "PENALTY" | "SPEND";
  points: number;
  reason: string | null;
  eventTitle: string | null;
};

const TYPE_STYLES: Record<PlainEntry["type"], string> = {
  EARN: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  PENALTY: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  SPEND: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

const TYPE_LABELS: Record<PlainEntry["type"], string> = {
  EARN: "Начисление",
  PENALTY: "Штраф",
  SPEND: "Списание",
};

function signed(entry: PlainEntry) {
  return entry.type === "EARN" ? entry.points : -entry.points;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

export function Calendar({
  month,
  entries,
  events,
  isAdmin,
  serverToday,
}: {
  month: string;
  entries: PlainEntry[];
  events: { id: string; title: string }[];
  isAdmin: boolean;
  serverToday: string;
}) {
  // Сервер считает «сегодня» по UTC. После монтирования берём дату браузера,
  // иначе вечером по MSK подсветится вчерашний день.
  const [today, setToday] = useState(serverToday);
  const [selected, setSelected] = useState<string>(
    serverToday.startsWith(month) ? serverToday : `${month}-01`,
  );

  useEffect(() => {
    const now = new Date();
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    setToday(local);
    setSelected((prev) => (prev === serverToday ? local : prev));
  }, [serverToday]);

  const byDay = useMemo(() => {
    const map = new Map<string, PlainEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, monthNum - 1, 1)).getUTCDay() + 6) % 7;

  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => `${month}-${pad(i + 1)}`,
    ),
  ];

  const monthTotal = entries.reduce((acc, e) => acc + signed(e), 0);
  const selectedEntries = byDay.get(selected) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/?m=${shiftMonth(month, -1)}`}
          className="rounded-lg px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          ←
        </Link>
        <div className="text-center">
          <div className="font-medium">
            {MONTHS[monthNum - 1]} {year}
          </div>
          <div
            className={`text-xs ${
              monthTotal < 0 ? "text-red-600" : "text-black/50 dark:text-white/50"
            }`}
          >
            за месяц: {monthTotal > 0 ? "+" : ""}
            {monthTotal}
          </div>
        </div>
        <Link
          href={`/?m=${shiftMonth(month, 1)}`}
          className="rounded-lg px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-black/40 dark:text-white/40">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dayEntries = byDay.get(day) ?? [];
          const total = dayEntries.reduce((acc, e) => acc + signed(e), 0);
          const isSelected = day === selected;
          const isToday = day === today;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelected(day)}
              className={`flex min-h-16 flex-col items-start gap-0.5 rounded-lg border p-1.5 text-left transition ${
                isSelected
                  ? "border-black dark:border-white"
                  : "border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`text-xs ${
                  isToday
                    ? "font-bold text-black dark:text-white"
                    : "text-black/50 dark:text-white/50"
                }`}
              >
                {Number(day.slice(-2))}
              </span>
              {dayEntries.length > 0 ? (
                <>
                  <span
                    className={`text-xs font-medium ${
                      total < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"
                    }`}
                  >
                    {total > 0 ? "+" : ""}
                    {total}
                  </span>
                  <span className="text-[10px] text-black/40 dark:text-white/40">
                    {dayEntries.length} зап.
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
        <h2 className="mb-3 font-medium">
          {selected.split("-").reverse().join(".")}
        </h2>

        {selectedEntries.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            За этот день записей нет
          </p>
        ) : (
          <ul className="mb-4 flex flex-col gap-2">
            {selectedEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={`rounded-md px-2 py-0.5 text-xs ${TYPE_STYLES[entry.type]}`}
                >
                  {TYPE_LABELS[entry.type]}
                </span>
                <span className="font-medium">
                  {entry.type === "EARN" ? "+" : "−"}
                  {entry.points}
                </span>
                <span className="text-black/60 dark:text-white/60">
                  {entry.type === "EARN"
                    ? `${entry.eventTitle ?? "—"} · ${scaleLabel(entry.points)}`
                    : entry.reason}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isAdmin ? (
          <AddEntryForm date={selected} events={events} />
        ) : (
          <p className="text-xs text-black/40 dark:text-white/40">
            Только просмотр
          </p>
        )}
      </div>
    </div>
  );
}
