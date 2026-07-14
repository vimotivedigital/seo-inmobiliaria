import { BadgeCheck, ShieldQuestion, FileCheck2 } from "lucide-react";
import type { SourcedValue } from "@/types/data";

interface SourceBoxProps {
  title?: string;
  /** `data` acepta cualquier tipo de `value` (SourceBox nunca renderiza
   * `.value` -- solo source/source_url/fecha/confianza/nota/fuentes -- asi
   * que sirve igual para un SourcedValue<number> que para uno de texto,
   * como la rentabilidad declarada en /inversion-inmobiliaria). */
  items: { label: string; data: SourcedValue<unknown> }[];
  methodologyHref?: string;
}

/**
 * Caja de "sobre estos datos" obligatoria en cualquier pagina con cifras
 * financieras (E-E-A-T). Muestra fuente, fecha y nivel de confianza de cada
 * dato usado en la pagina. Si el dato tiene `source_url`, el nombre de la
 * fuente enlaza directamente a ella. Si es un dato sin fuente oficial unica
 * (`fuentes`/`nota` presentes), se listan las citas concretas consultadas
 * en vez de mostrar un origen generico.
 */
export function SourceBox({ title = "Sobre estos datos", items, methodologyHref = "/metodologia" }: SourceBoxProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 my-8 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-2 dark:text-white">
        <FileCheck2 size={16} className="text-brand-600 dark:text-brand-400" />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}:</span>
              <span>
                {item.data.source_url ? (
                  <a href={item.data.source_url} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-slate-900 dark:hover:text-white">
                    {item.data.source}
                  </a>
                ) : (
                  item.data.source
                )}{" "}
                · actualizado el{" "}
                {new Date(item.data.last_updated).toLocaleDateString("es-ES")} ·{" "}
                <span
                  className={
                    item.data.confidence === "real"
                      ? "inline-flex items-center gap-0.5 font-medium text-success-700 dark:text-success-500"
                      : "inline-flex items-center gap-0.5 font-medium text-warning-700 dark:text-warning-500"
                  }
                >
                  {item.data.confidence === "real" ? <BadgeCheck size={13} /> : <ShieldQuestion size={13} />}
                  {item.data.confidence === "real" ? "dato oficial" : "estimacion"}
                </span>
              </span>
            </div>

            {item.data.nota && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.data.nota}</p>
            )}

            {item.data.fuentes && item.data.fuentes.length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-xs text-slate-500 space-y-0.5 dark:text-slate-400">
                {item.data.fuentes.map((f) => (
                  <li key={f.source_url}>
                    <a href={f.source_url} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-slate-700 dark:hover:text-slate-200">
                      {f.nombre}
                    </a>{" "}
                    (consultado el {new Date(f.consultado).toLocaleDateString("es-ES")})
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Consulta nuestra{" "}
        <a href={methodologyHref} className="underline hover:text-slate-700 dark:hover:text-slate-200">
          metodologia de calculo
        </a>{" "}
        para saber como obtenemos y actualizamos estos datos.
      </p>
    </aside>
  );
}
