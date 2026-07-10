import { Info } from "lucide-react";

/**
 * Divulgacion obligatoria del Programa de Afiliados de Amazon. El texto es
 * el exigido por el "Operating Agreement" de Amazon Associates y debe
 * aparecer en cualquier pagina que contenga enlaces de afiliado, cerca de
 * los propios enlaces (no basta con enlazarlo desde otra pagina).
 */
export function AmazonDisclosure() {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 my-6 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
      <Info size={18} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
      <p>
        Como Asociado de Amazon, obtengo ingresos por las compras adscritas que cumplen los
        requisitos aplicables. Los precios y la disponibilidad mostrados en Amazon pueden variar
        respecto al momento de publicacion de esta pagina. Los productos se seleccionan por su
        relevancia para el contenido, no por acuerdos comerciales distintos del programa de
        afiliados.
      </p>
    </div>
  );
}
