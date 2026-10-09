"use client";

import { useActionState, useState } from "react";

import { addEntry, type FormState } from "@/app/actions";
import { SCALE } from "@/lib/scale";

const TYPES = [
  { value: "EARN", label: "Начислить" },
  { value: "PENALTY", label: "Штраф" },
  { value: "SPEND", label: "Списание" },
] as const;

type EntryTypeValue = (typeof TYPES)[number]["value"];

export function AddEntryForm({
  date,
  events,
}: {
  date: string;
  events: { id: string; title: string }[];
}) {
  const [type, setType] = useState<EntryTypeValue>("EARN");
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addEntry,
    null,
  );

  const isEarn = type === "EARN";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <label
            key={t.value}
            className="flex-1 cursor-pointer rounded-lg border border-black/15 px-3 py-2 text-center text-sm has-checked:border-black has-checked:bg-black has-checked:text-white dark:border-white/20 dark:has-checked:border-white dark:has-checked:bg-white dark:has-checked:text-black"
          >
            <input
              type="radio"
              name="type"
              value={t.value}
              checked={type === t.value}
              onChange={() => setType(t.value)}
              className="sr-only"
            />
            {t.label}
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-black/60 dark:text-white/60">Дата</span>
        <input
          type="date"
          name="date"
          defaultValue={date}
          required
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>

      {isEarn ? (
        <>
          {events.length === 0 ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Ивентов нет — добавь их в админке, иначе начислять нечего.
            </p>
          ) : null}

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60 dark:text-white/60">
              Ивент — за что
            </span>
            <select
              name="eventId"
              required
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20 dark:bg-neutral-900"
            >
              <option value="">— выбери —</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60 dark:text-white/60">Оценка</span>
            <select
              name="points"
              defaultValue="5"
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20 dark:bg-neutral-900"
            >
              {SCALE.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value} — {s.label}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : (
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60 dark:text-white/60">
              {type === "PENALTY"
                ? "Баллы (сколько снять)"
                : "Баллы (сколько потрачено)"}
            </span>
            <input
              type="number"
              name="points"
              min={1}
              required
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60 dark:text-white/60">
              {type === "PENALTY" ? "За что штраф" : "На что потрачено"}
            </span>
            <input
              type="text"
              name="reason"
              required
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
            />
          </label>
        </>
      )}

      {state?.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-green-700 dark:text-green-400">Записано</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Сохраняю…" : "Добавить"}
      </button>
    </form>
  );
}
