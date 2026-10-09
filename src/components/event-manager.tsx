"use client";

import { useActionState } from "react";

import { addEvent, deleteEvent, type FormState } from "@/app/actions";

export function EventManager({
  events,
}: {
  events: { id: string; title: string; count: number }[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addEvent,
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Новый ивент, например Тренировка"
          required
          className="flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Добавить
        </button>
      </form>

      {state?.error ? (
        <p className="-mt-4 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      {events.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          Ивентов пока нет. Без них нельзя начислять баллы.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {events.map((event) => (
            <li key={event.id} className="flex items-center gap-3 py-3">
              <span className="flex-1 text-sm">{event.title}</span>
              <span className="text-xs text-black/40 dark:text-white/40">
                {event.count} записей
              </span>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={event.id} />
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Удалить
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
