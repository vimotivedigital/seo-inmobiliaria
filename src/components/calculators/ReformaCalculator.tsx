"use client";

import { useMemo, useState } from "react";
import { Hammer } from "lucide-react";
import { formatEur } from "@/lib/seo";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import type { ReformaCost } from "@/types/data";

interface Props {
  cityName: string;
  cost: ReformaCost;
}

const TIER_LABELS = { low: "Basica", medium: "Media", high: "Integral" } as const;

/** Calculadora de coste de reforma por m2, con rango bajo/medio/alto y fuente visible. */
export function ReformaCalculator({ cityName, cost }: Props) {
  const [sqm, setSqm] = useState(80);
  const [tier, setTier] = useState<"low" | "medium" | "high">("medium");

  const perSqm = cost[tier].value;
  const total = useMemo(() => perSqm * sqm, [perSqm, sqm]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Superficie a reformar (m2)</span>
          <input
            type="number"
            min={10}
            value={sqm}
            onChange={(e) => setSqm(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <div className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Nivel de reforma</span>
          <div className="mt-1 flex gap-2">
            {(["low", "medium", "high"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs ${tier === t ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
              >
                {TIER_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Hammer size={13} /> Coste estimado en {cityName}
        </p>
        <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{formatEur(total, 0)}</p>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          ({formatEur(perSqm, 0)}/m2 · {sqm} m2)
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Comparativa por nivel de reforma ({sqm} m2)
        </p>
        <StackedBarChart
          labels={(["low", "medium", "high"] as const).map((t) => TIER_LABELS[t])}
          segments={[
            {
              name: "Coste total",
              colorClassName: "fill-brand-500",
              values: (["low", "medium", "high"] as const).map((t) => cost[t].value * sqm),
            },
          ]}
          formatValue={(v) => formatEur(v, 0)}
          height={180}
        />
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Fuente: {cost[tier].source} · actualizado el{" "}
        {new Date(cost[tier].last_updated).toLocaleDateString("es-ES")}.
      </p>
    </div>
  );
}
