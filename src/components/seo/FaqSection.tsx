import { HelpCircle, ChevronDown } from "lucide-react";
import { buildFaqJsonLd, type FaqItem } from "@/lib/jsonld";

interface FaqSectionProps {
  items: FaqItem[];
  heading?: string;
}

/** Bloque de FAQ con JSON-LD embebido. Las respuestas deben ser especificas
 * de la entidad de la pagina (ver comentario en lib/jsonld.ts). */
export function FaqSection({ items, heading = "Preguntas frecuentes" }: FaqSectionProps) {
  const jsonLd = buildFaqJsonLd(items);
  return (
    <section className="my-10">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4 dark:text-white">
        <HelpCircle size={20} className="text-brand-600 dark:text-brand-400" />
        {heading}
      </h2>
      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {items.map((item) => (
          <details key={item.question} className="group p-4">
            <summary className="cursor-pointer list-none font-medium text-slate-900 flex justify-between items-center dark:text-slate-100">
              {item.question}
              <ChevronDown size={18} className="ml-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 dark:text-slate-500" />
            </summary>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
