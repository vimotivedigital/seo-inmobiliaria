"use client";

import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { formatEur } from "@/lib/seo";

/** kWh/m2/año de consumo tipico por etiqueta energetica (vivienda plurifamiliar). */
const CONSUMPTION_BY_LABEL: Record<string, number> = {
  A: 25,
  B: 45,
  C: 65,
  D: 90,
  E: 120,
  F: 150,
  G: 190,
};

/** Colores oficiales de la escala de certificacion energetica de la UE. */
const LABEL_COLORS: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-green-500",
  C: "bg-lime-500",
  D: "bg-yellow-400",
  E: "bg-orange-400",
  F: "bg-orange-600",
  G: "bg-red-600",
};

const AVG_ELECTRICITY_PRICE_EUR_KWH = 0.16; // fuente citada abajo

/** Estimador de gasto energetico anual segun etiqueta del certificado energetico. */
export function EnergyLabelEstimator() {
  const [label, setLabel] = useState("D");
  const [sqm, setSqm] = useState(80);

  const annualCost = useMemo(() => {
    const kwhPerSqm = CONSUMPTION_BY_LABEL[label] ?? CONSUMPTION_BY_LABEL.D!;
    return kwhPerSqm * sqm * AVG_ELECTRICITY_PRICE_EUR_KWH;
  }, [label, sqm]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Superficie (m2)</span>
          <input
            type="number"
            value={sqm}
            onChange={(e) => setSqm(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Etiqueta energetica</span>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {Object.keys(CONSUMPTION_BY_LABEL).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex gap-1">
        {Object.keys(LABEL_COLORS).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLabel(l)}
            className={`flex h-9 flex-1 items-center justify-center rounded text-sm font-bold text-white transition-opacity ${LABEL_COLORS[l]} ${label === l ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900" : "opacity-50 hover:opacity-80"}`}
            aria-label={`Etiqueta ${l}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Zap size={13} /> Gasto energetico anual estimado (calefaccion, ACS, refrigeracion)
        </p>
        <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{formatEur(annualCost, 0)}</p>
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Consumo de referencia por etiqueta: IDAE - Instituto para la Diversificacion y Ahorro de
        la Energia (rangos orientativos por calificacion). Precio de la electricidad: media OMIE
        del ultimo trimestre (0,16 €/kWh) · actualizado 01/04/2026. El consumo real depende de la
        orientacion, aislamiento y habitos de uso de cada vivienda concreta.
      </p>
    </div>
  );
}
