import { ShieldAlert } from "lucide-react";

/**
 * Aviso YMYL obligatorio en la parte SUPERIOR de toda pagina de la seccion
 * de inversion inmobiliaria (crowdfunding), antes de cualquier contenido
 * editorial. A diferencia de `Disclaimer.tsx` (generico, para estimaciones
 * de coste), este aviso es especifico de riesgo de inversion: perdida de
 * capital, iliquidez y ausencia de cobertura del Fondo de Garantia de
 * Depositos -- riesgos que no aplican al resto del sitio (calculadoras de
 * hipoteca, coste de reforma, etc).
 */
export function InvestmentDisclaimer() {
  return (
    <div className="flex gap-3 rounded-lg border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900 mb-8 dark:border-warning-700/40 dark:bg-warning-500/10 dark:text-warning-200">
      <ShieldAlert size={18} className="mt-0.5 shrink-0 text-warning-600 dark:text-warning-500" />
      <p>
        Este contenido tiene fines informativos y no constituye asesoramiento financiero ni
        recomendacion de inversion. Invertir en crowdfunding inmobiliario conlleva riesgo de
        perdida de capital, iliquidez y no esta cubierto por el Fondo de Garantia de Depositos.
        Antes de invertir, consulta la documentacion oficial de cada proyecto y, si lo necesitas,
        a un asesor financiero independiente.
      </p>
    </div>
  );
}
