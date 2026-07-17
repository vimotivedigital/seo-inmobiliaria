"use client";

import { useMemo, useState } from "react";
import { Landmark, Percent, Wallet, ChevronDown } from "lucide-react";
import { formatEur, formatPercent } from "@/lib/seo";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { ChartLegend } from "@/components/charts/ChartLegend";
import type { MortgageRateSnapshot } from "@/types/data";

interface Props {
  rates: MortgageRateSnapshot;
}

interface AmortizationRow {
  year: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
}

function computeMonthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

function buildAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  years: number
): AmortizationRow[] {
  const monthlyRate = annualRatePct / 100 / 12;
  const monthlyPayment = computeMonthlyPayment(principal, annualRatePct, years);
  let balance = principal;
  const rows: AmortizationRow[] = [];

  for (let year = 1; year <= years; year++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      balance = Math.max(0, balance - principalPaid);
      yearlyInterest += interest;
      yearlyPrincipal += principalPaid;
    }
    rows.push({
      year,
      interestPaid: yearlyInterest,
      principalPaid: yearlyPrincipal,
      remainingBalance: balance,
    });
  }
  return rows;
}

/**
 * Calculadora de hipoteca. Herramienta interactiva client-side: los
 * resultados NO generan una URL indexable por combinacion (evita el
 * patron /hipoteca/{pais}/{importe}/{interes}/{años} que penalizan las
 * Spam Updates). Vive en una unica pagina: /hipoteca-calculadora.
 */
export function MortgageCalculator({ rates }: Props) {
  const [principal, setPrincipal] = useState(200000);
  const [rateType, setRateType] = useState<"fixed" | "variable">("fixed");
  const [customRate, setCustomRate] = useState<number | null>(null);
  const [years, setYears] = useState(25);
  const [showSchedule, setShowSchedule] = useState(false);

  const rate =
    customRate ?? (rateType === "fixed" ? rates.avg_fixed_rate.value : rates.avg_variable_rate.value);

  const monthlyPayment = useMemo(() => computeMonthlyPayment(principal, rate, years), [principal, rate, years]);
  const schedule = useMemo(() => buildAmortizationSchedule(principal, rate, years), [principal, rate, years]);
  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - principal;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Capital a financiar</span>
          <input
            type="number"
            min={10000}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Plazo (años)</span>
          <input
            type="number"
            min={5}
            max={40}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <div className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tipo de interes</span>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => { setRateType("fixed"); setCustomRate(null); }}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${rateType === "fixed" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
            >
              Fijo ({formatPercent(rates.avg_fixed_rate.value)})
            </button>
            <button
              type="button"
              onClick={() => { setRateType("variable"); setCustomRate(null); }}
              className={`flex-1 rounded-md border px-3 py-2 text-sm ${rateType === "variable" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
            >
              Variable ({formatPercent(rates.avg_variable_rate.value)})
            </button>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">O introduce tu propio tipo (%)</span>
          <input
            type="number"
            step={0.05}
            value={customRate ?? ""}
            placeholder={`${rate}`}
            onChange={(e) => setCustomRate(e.target.value ? Number(e.target.value) : null)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        <div>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Wallet size={13} /> Cuota mensual
          </p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{formatEur(monthlyPayment, 0)}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Percent size={13} /> Total intereses
          </p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{formatEur(totalInterest, 0)}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Landmark size={13} /> Total pagado
          </p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{formatEur(totalPaid, 0)}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Intereses vs capital amortizado por año
        </p>
        <StackedBarChart
          labels={schedule.map((r) => r.year)}
          segments={[
            { name: "Intereses", colorClassName: "fill-warning-500", values: schedule.map((r) => r.interestPaid) },
            { name: "Capital", colorClassName: "fill-brand-500", values: schedule.map((r) => r.principalPaid) },
          ]}
          formatValue={(v) => formatEur(v, 0)}
        />
        <ChartLegend
          items={[
            { name: "Intereses", colorClassName: "bg-warning-500" },
            { name: "Capital amortizado", colorClassName: "bg-brand-500" },
          ]}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowSchedule((s) => !s)}
        className="mt-6 flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
      >
        <ChevronDown size={16} className={`transition-transform ${showSchedule ? "rotate-180" : ""}`} />
        {showSchedule ? "Ocultar" : "Ver"} tabla de amortizacion por años
      </button>

      {showSchedule && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="py-2 pr-4">Año</th>
                <th className="py-2 pr-4">Intereses pagados</th>
                <th className="py-2 pr-4">Capital amortizado</th>
                <th className="py-2">Capital pendiente</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-1.5 pr-4">{row.year}</td>
                  <td className="py-1.5 pr-4">{formatEur(row.interestPaid, 0)}</td>
                  <td className="py-1.5 pr-4">{formatEur(row.principalPaid, 0)}</td>
                  <td className="py-1.5">{formatEur(row.remainingBalance, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Tipos usados como referencia: fijo {formatPercent(rates.avg_fixed_rate.value)} y variable{" "}
        {formatPercent(rates.avg_variable_rate.value)} · fuente: {rates.avg_fixed_rate.source} ·
        actualizado el {new Date(rates.avg_fixed_rate.last_updated).toLocaleDateString("es-ES")}.
      </p>
    </div>
  );
}
