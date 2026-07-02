"use client";

import { useMemo, useState } from "react";
import { Building2, Receipt } from "lucide-react";
import { formatEur, formatPercent } from "@/lib/seo";
import { computeEffectiveRate, computeProgressiveTaxAmount } from "@/lib/tax-brackets";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { ChartLegend } from "@/components/charts/ChartLegend";
import type { CcaaPurchaseCost, SourcedValue } from "@/types/data";

interface Props {
  ccaaName: string;
  costs: CcaaPurchaseCost;
  /** IVA nacional para obra nueva (tipo unico, no varia por CCAA). */
  iva: SourcedValue;
}

const NOTARY_PCT_ESTIMATE = 0.4; // notaria, estimacion sobre precio
const REGISTRY_PCT_ESTIMATE = 0.25; // registro de la propiedad
const GESTORIA_FLAT_ESTIMATE = 300; // gestoria, importe fijo tipico

/** Desglose de gastos de compra: impuestos (ITP por tramos o IVA+AJD segun CCAA), notaria, registro, gestoria. */
export function PurchaseCostsCalculator({ ccaaName, costs, iva }: Props) {
  const [price, setPrice] = useState(250000);
  const [isNewBuild, setIsNewBuild] = useState(false);

  const breakdown = useMemo(() => {
    const taxAmount = isNewBuild
      ? price * ((iva.value + costs.ajd_general) / 100)
      : computeProgressiveTaxAmount(price, costs.tramos);
    const effectiveTaxRate = isNewBuild ? iva.value + costs.ajd_general : computeEffectiveRate(price, costs.tramos);
    const notary = price * (NOTARY_PCT_ESTIMATE / 100);
    const registry = price * (REGISTRY_PCT_ESTIMATE / 100);
    const gestoria = GESTORIA_FLAT_ESTIMATE;
    const total = taxAmount + notary + registry + gestoria;
    return { taxAmount, effectiveTaxRate, notary, registry, gestoria, total };
  }, [price, isNewBuild, costs, iva]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Precio de la vivienda</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <div className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Tipo de vivienda</span>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewBuild(false)}
              className={`flex-1 rounded-md border px-3 py-2 text-xs ${!isNewBuild ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
            >
              Segunda mano (ITP)
            </button>
            <button
              type="button"
              onClick={() => setIsNewBuild(true)}
              className={`flex-1 rounded-md border px-3 py-2 text-xs ${isNewBuild ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
            >
              Obra nueva (IVA+AJD)
            </button>
          </div>
        </div>
      </div>

      {!isNewBuild && costs.tipo === "progresivo" && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {ccaaName} aplica una escala progresiva por tramos de valor, no un tipo unico: el porcentaje
          efectivo mostrado abajo es la media resultante de aplicar cada tramo a la parte del precio que le
          corresponde (como el IRPF), no el tipo del ultimo tramo aplicado a todo el importe.
        </p>
      )}

      <div className="mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800/60 dark:text-slate-200">
        <div className="flex justify-between">
          <span className="flex items-center gap-1.5">
            <Receipt size={14} className="text-brand-500" />
            {isNewBuild ? "IVA + AJD" : "ITP"} ({formatPercent(breakdown.effectiveTaxRate)}
            {!isNewBuild && costs.tipo === "progresivo" ? " efectivo" : ""}) en {ccaaName}
          </span>
          <span className="font-medium">{formatEur(breakdown.taxAmount, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Notaria (estimado)</span>
          <span className="font-medium">{formatEur(breakdown.notary, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Registro de la propiedad (estimado)</span>
          <span className="font-medium">{formatEur(breakdown.registry, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Gestoria (estimado)</span>
          <span className="font-medium">{formatEur(breakdown.gestoria, 0)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold text-brand-700 dark:border-slate-600 dark:text-brand-400">
          <span className="flex items-center gap-1.5">
            <Building2 size={15} />
            Total gastos de compra
          </span>
          <span>{formatEur(breakdown.total, 0)}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Desglose visual</p>
        <StackedBarChart
          labels={["Gastos"]}
          segments={[
            { name: isNewBuild ? "IVA+AJD" : "ITP", colorClassName: "fill-brand-500", values: [breakdown.taxAmount] },
            { name: "Notaria", colorClassName: "fill-accent-500", values: [breakdown.notary] },
            { name: "Registro", colorClassName: "fill-success-500", values: [breakdown.registry] },
            { name: "Gestoria", colorClassName: "fill-warning-500", values: [breakdown.gestoria] },
          ]}
          formatValue={(v) => formatEur(v, 0)}
          height={180}
        />
        <ChartLegend
          items={[
            { name: isNewBuild ? "IVA + AJD" : "ITP", colorClassName: "bg-brand-500" },
            { name: "Notaria", colorClassName: "bg-accent-500" },
            { name: "Registro", colorClassName: "bg-success-500" },
            { name: "Gestoria", colorClassName: "bg-warning-500" },
          ]}
        />
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        {isNewBuild ? "IVA" : "ITP"} fuente: {isNewBuild ? iva.source : costs.source} · actualizado el{" "}
        {new Date(isNewBuild ? iva.last_updated : costs.last_updated).toLocaleDateString("es-ES")}.
        {costs.notes && ` ${costs.notes}`} Notaria, registro y gestoria son estimaciones orientativas sobre
        aranceles medios; el importe real depende del inmueble y la operacion concreta. Consulta si
        cumples los requisitos de algun tipo reducido antes de dar por bueno el tipo general.
      </p>
    </div>
  );
}
