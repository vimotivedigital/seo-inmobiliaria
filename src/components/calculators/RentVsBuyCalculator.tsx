"use client";

import { useMemo, useState } from "react";
import { Home, KeyRound, TrendingUp } from "lucide-react";
import { formatEur } from "@/lib/seo";
import { LineChart } from "@/components/charts/LineChart";
import { ChartLegend } from "@/components/charts/ChartLegend";

interface Props {
  defaultPrice: number;
  defaultRentMonthly: number;
  mortgageRatePct: number;
  purchaseCostsPct: number; // ITP/IVA + notaria + registro + gestoria, ya sumado
}

interface YearRow {
  year: number;
  buyerCumulativeCost: number;
  renterCumulativeCost: number;
}

function computeMonthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

/**
 * Calculadora comprar vs alquilar: punto de equilibrio temporal.
 *
 * Modelo simplificado (con fines informativos, ver Disclaimer): compara el
 * "coste hundido" de cada opcion, es decir, dinero que no vuelve.
 *  - Comprador: impuestos y gastos de compra + intereses pagados + mantenimiento.
 *    (El capital amortizado NO cuenta como coste: se convierte en patrimonio).
 *  - Inquilino: alquiler pagado, menos la rentabilidad obtenida al invertir
 *    la entrada + gastos de compra que el comprador si ha desembolsado.
 * El punto de equilibrio es el primer año en que el coste acumulado del
 * comprador queda por debajo del coste acumulado del inquilino.
 */
export function RentVsBuyCalculator({ defaultPrice, defaultRentMonthly, mortgageRatePct, purchaseCostsPct }: Props) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rentMonthly, setRentMonthly] = useState(defaultRentMonthly);
  const [maintenancePct, setMaintenancePct] = useState(1.2); // % anual del valor del inmueble
  const [opportunityReturnPct, setOpportunityReturnPct] = useState(4); // rentabilidad alternativa de inversion
  const [rentAnnualIncreasePct, setRentAnnualIncreasePct] = useState(3);
  const [horizonYears, setHorizonYears] = useState(15);

  const rows = useMemo<YearRow[]>(() => {
    const downPayment = price * (downPaymentPct / 100);
    const purchaseCosts = price * (purchaseCostsPct / 100);
    const principal = price - downPayment;
    const monthlyPayment = computeMonthlyPayment(principal, mortgageRatePct, 30);
    const monthlyRate = mortgageRatePct / 100 / 12;

    let balance = principal;
    let buyerInterestCum = 0;
    let buyerMaintenanceCum = 0;
    let rent = rentMonthly;
    let renterCumulativeRent = 0;
    const investedCapital = downPayment + purchaseCosts;

    const result: YearRow[] = [];

    for (let year = 1; year <= horizonYears; year++) {
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        balance = Math.max(0, balance - principalPaid);
        buyerInterestCum += interest;
      }
      buyerMaintenanceCum += price * (maintenancePct / 100);
      renterCumulativeRent += rent * 12;
      rent *= 1 + rentAnnualIncreasePct / 100;

      const buyerCumulativeCost = purchaseCosts + buyerInterestCum + buyerMaintenanceCum;
      const investmentValue = investedCapital * Math.pow(1 + opportunityReturnPct / 100, year);
      const investmentGains = investmentValue - investedCapital;
      const renterCumulativeCost = renterCumulativeRent - investmentGains;

      result.push({ year, buyerCumulativeCost, renterCumulativeCost });
    }
    return result;
  }, [price, downPaymentPct, rentMonthly, maintenancePct, opportunityReturnPct, rentAnnualIncreasePct, horizonYears, mortgageRatePct, purchaseCostsPct]);

  const breakevenIndex = rows.findIndex((r) => r.buyerCumulativeCost <= r.renterCumulativeCost);
  const breakevenRow = breakevenIndex >= 0 ? rows[breakevenIndex] : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Precio vivienda</span>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Entrada (%)</span>
          <input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Alquiler equivalente/mes</span>
          <input type="number" value={rentMonthly} onChange={(e) => setRentMonthly(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Mantenimiento anual (%)</span>
          <input type="number" step={0.1} value={maintenancePct} onChange={(e) => setMaintenancePct(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Rentabilidad alternativa (%)</span>
          <input type="number" step={0.1} value={opportunityReturnPct} onChange={(e) => setOpportunityReturnPct(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Subida anual alquiler (%)</span>
          <input type="number" step={0.1} value={rentAnnualIncreasePct} onChange={(e) => setRentAnnualIncreasePct(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        {breakevenRow ? (
          <p className="flex items-center gap-2 text-lg text-slate-800 dark:text-slate-100">
            <TrendingUp size={20} className="text-brand-600 dark:text-brand-400" />
            Con estos parametros, comprar sale a cuenta a partir del{" "}
            <strong className="text-brand-700 dark:text-brand-400">año {breakevenRow.year}</strong>.
          </p>
        ) : (
          <p className="text-lg text-slate-800 dark:text-slate-100">
            En un horizonte de {horizonYears} años, alquilar + invertir la diferencia sale mas a
            cuenta con estos parametros.
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Comparativa de coste acumulado no recuperable (impuestos de compra, intereses,
          mantenimiento) frente a alquiler pagado menos rentabilidad de invertir la entrada.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Home size={15} className="text-brand-500" /> Comprar vs <KeyRound size={15} className="text-accent-500" /> Alquilar: coste acumulado
        </p>
        <LineChart
          labels={rows.map((r) => r.year)}
          series={[
            { name: "Comprar", color: "stroke-brand-500", points: rows.map((r) => r.buyerCumulativeCost) },
            { name: "Alquilar", color: "stroke-accent-500", points: rows.map((r) => r.renterCumulativeCost) },
          ]}
          highlightIndex={breakevenIndex >= 0 ? breakevenIndex : undefined}
          highlightLabel={breakevenRow ? `Año ${breakevenRow.year}` : undefined}
          formatValue={(v) => formatEur(v, 0)}
        />
        <ChartLegend
          items={[
            { name: "Comprar (coste acumulado)", colorClassName: "bg-brand-500" },
            { name: "Alquilar (coste acumulado)", colorClassName: "bg-accent-500" },
          ]}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="py-2 pr-4">Año</th>
              <th className="py-2 pr-4">Coste acumulado comprar</th>
              <th className="py-2">Coste acumulado alquilar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year} className={`border-b border-slate-100 dark:border-slate-800 ${row === breakevenRow ? "bg-brand-50 font-medium dark:bg-brand-900/30" : ""}`}>
                <td className="py-1.5 pr-4">{row.year}</td>
                <td className="py-1.5 pr-4">{formatEur(row.buyerCumulativeCost, 0)}</td>
                <td className="py-1.5">{formatEur(row.renterCumulativeCost, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className="mt-4 block max-w-xs text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">Horizonte (años)</span>
        <input
          type="range"
          min={5}
          max={30}
          value={horizonYears}
          onChange={(e) => setHorizonYears(Number(e.target.value))}
          className="mt-1 w-full accent-brand-600"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">{horizonYears} años</span>
      </label>
    </div>
  );
}
