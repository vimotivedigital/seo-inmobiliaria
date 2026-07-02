import { ShieldAlert } from "lucide-react";

/**
 * Disclaimer legal obligatorio en toda pagina con calculadora o cifras de
 * coste. Nicho YMYL: las cifras son estimaciones informativas, no
 * asesoramiento financiero, fiscal ni legal.
 */
export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-lg border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900 my-6 dark:border-warning-700/40 dark:bg-warning-500/10 dark:text-warning-200">
      <ShieldAlert size={18} className="mt-0.5 shrink-0 text-warning-600 dark:text-warning-500" />
      <p>
        <strong>Aviso legal:</strong> las cifras mostradas en esta pagina son
        estimaciones informativas basadas en datos publicos y medias de mercado.
        No constituyen asesoramiento financiero, fiscal ni legal, ni una oferta
        vinculante de ningun producto. Antes de tomar una decision de compra,
        alquiler o financiacion, consulta con un profesional (agente
        inmobiliario, gestor, notario o entidad bancaria) y verifica las
        condiciones especificas de tu caso.
      </p>
    </div>
  );
}
