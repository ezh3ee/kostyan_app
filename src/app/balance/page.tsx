import { getTotals } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BalancePage() {
  const { earned, penalty, spent, balance } = await getTotals();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-black/10 p-6 text-center dark:border-white/15">
        <div className="text-sm text-black/50 dark:text-white/50">Баланс</div>
        <div
          className={`text-4xl font-semibold ${
            balance < 0 ? "text-red-600 dark:text-red-400" : ""
          }`}
        >
          {balance}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
          <div className="text-xs text-black/50 dark:text-white/50">
            Начислено
          </div>
          <div className="text-lg font-medium text-green-700 dark:text-green-400">
            +{earned}
          </div>
        </div>
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
          <div className="text-xs text-black/50 dark:text-white/50">Штрафы</div>
          <div className="text-lg font-medium text-red-600 dark:text-red-400">
            −{penalty}
          </div>
        </div>
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
          <div className="text-xs text-black/50 dark:text-white/50">
            Списано
          </div>
          <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
            −{spent}
          </div>
        </div>
      </div>
    </div>
  );
}
