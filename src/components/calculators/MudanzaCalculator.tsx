"use client";

import { useMemo, useState } from "react";
import { Truck, MapPin } from "lucide-react";
import { formatEur } from "@/lib/seo";
import type { MudanzaRoute } from "@/types/data";

interface Props {
  route: MudanzaRoute;
  originName: string;
  destinationName: string;
}

/** Calculadora de coste de mudanza por distancia (ruta fija) y volumen de piso. */
export function MudanzaCalculator({ route, originName, destinationName }: Props) {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [floorNoElevator, setFloorNoElevator] = useState(false);

  const base = useMemo(() => {
    const key = size === "small" ? route.cost_small : size === "medium" ? route.cost_medium : route.cost_large;
    return key.value;
  }, [size, route]);

  const surcharge = floorNoElevator ? base * 0.15 : 0;
  const total = base + surcharge;

  const sourceRef = size === "small" ? route.cost_small : size === "medium" ? route.cost_medium : route.cost_large;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-4 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
        <MapPin size={15} className="text-brand-500" />
        Ruta {originName} → {destinationName} · {route.distance_km} km
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Tamano del piso</span>
          <div className="mt-1 flex gap-2">
            {(["small", "medium", "large"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs ${size === s ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 dark:border-slate-600 dark:text-slate-300"}`}
              >
                {s === "small" ? "Estudio" : s === "medium" ? "60-100m2" : ">100m2"}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm text-slate-700 sm:mt-7 dark:text-slate-200">
          <input type="checkbox" checked={floorNoElevator} onChange={(e) => setFloorNoElevator(e.target.checked)} className="accent-brand-600" />
          Piso sin ascensor (recargo +15%)
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Truck size={13} /> Coste estimado
        </p>
        <p className="text-2xl font-bold text-brand-700 dark:text-brand-400">{formatEur(total, 0)}</p>
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Fuente: {sourceRef.source} · actualizado el{" "}
        {new Date(sourceRef.last_updated).toLocaleDateString("es-ES")}.
      </p>
    </div>
  );
}
