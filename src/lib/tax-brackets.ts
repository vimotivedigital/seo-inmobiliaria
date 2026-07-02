import type { ItpBracket } from "@/types/data";

/**
 * Calcula la cuota de un impuesto con escala progresiva por tramos (ITP en
 * las CCAA que no aplican un tipo fijo). Cada tramo tributa solo por la
 * parte de `baseValue` que cae dentro de ese tramo (calculo marginal, igual
 * que el IRPF), no por el total al tipo del tramo superior.
 *
 * `tramos` debe venir ordenado de menor a mayor `hasta` y el ultimo tramo
 * debe tener `hasta: null` (sin limite superior).
 */
export function computeProgressiveTaxAmount(baseValue: number, tramos: ItpBracket[]): number {
  let remaining = baseValue;
  let previousThreshold = 0;
  let total = 0;

  for (const tramo of tramos) {
    if (remaining <= 0) break;
    const bracketWidth = tramo.hasta === null ? remaining : Math.max(0, tramo.hasta - previousThreshold);
    const taxableInBracket = Math.min(remaining, bracketWidth);
    total += taxableInBracket * (tramo.porcentaje / 100);
    remaining -= taxableInBracket;
    previousThreshold = tramo.hasta ?? previousThreshold;
  }

  return total;
}

/** Tipo efectivo medio (%) resultante de aplicar la escala a `baseValue`. */
export function computeEffectiveRate(baseValue: number, tramos: ItpBracket[]): number {
  if (baseValue <= 0) return 0;
  return (computeProgressiveTaxAmount(baseValue, tramos) / baseValue) * 100;
}

/** El tipo marginal (%) que aplicaria al ultimo euro de `baseValue`. */
export function computeMarginalRate(baseValue: number, tramos: ItpBracket[]): number {
  for (const tramo of tramos) {
    if (tramo.hasta === null || baseValue <= tramo.hasta) {
      return tramo.porcentaje;
    }
  }
  return tramos[tramos.length - 1]?.porcentaje ?? 0;
}
