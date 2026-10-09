/// Школьная шкала оценок за начисление. Баллы = самой оценке.
export const SCALE = [
  { value: 1, label: "Отвратительно" },
  { value: 2, label: "Ужасно" },
  { value: 3, label: "Сойдёт" },
  { value: 4, label: "Хорошо" },
  { value: 5, label: "Великолепно" },
] as const;

export const SCALE_VALUES = SCALE.map((s) => s.value);

export function scaleLabel(value: number) {
  return SCALE.find((s) => s.value === value)?.label ?? "—";
}
