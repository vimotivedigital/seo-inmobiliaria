import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export interface InternalLinkItem {
  href: string;
  label: string;
}

/**
 * Enlazado interno automatico entre paginas relacionadas del mismo silo.
 * Cada plantilla programatica pasa aqui los enlaces relevantes (misma
 * ciudad en otros silos, ciudades vecinas del mismo silo, hub padre).
 */
export function InternalLinks({ heading = "Sigue explorando", items }: { heading?: string; items: InternalLinkItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="my-10" aria-label={heading}>
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4 dark:text-white">
        <Compass size={20} className="text-brand-600 dark:text-brand-400" />
        {heading}
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm text-brand-700 hover:border-brand-500 hover:bg-brand-50 transition-colors dark:border-slate-700 dark:text-brand-400 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
            >
              {item.label}
              <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
