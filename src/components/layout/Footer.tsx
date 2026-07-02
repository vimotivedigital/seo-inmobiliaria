import Link from "next/link";
import { Info, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 dark:text-slate-400">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-700 mb-2 dark:text-slate-200">Sitio</p>
            <ul className="space-y-1">
              <li><Link href="/sobre-nosotros" className="hover:text-brand-700 dark:hover:text-brand-400">Sobre nosotros</Link></li>
              <li><Link href="/metodologia" className="hover:text-brand-700 dark:hover:text-brand-400">Metodologia</Link></li>
              <li><Link href="/politica-cookies" className="hover:text-brand-700 dark:hover:text-brand-400">Cookies</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-brand-700 dark:hover:text-brand-400">Aviso legal</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-2 dark:text-slate-200">Herramientas</p>
            <ul className="space-y-1">
              <li><Link href="/hipoteca-calculadora" className="hover:text-brand-700 dark:hover:text-brand-400">Calculadora de hipoteca</Link></li>
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-semibold text-slate-700 mb-2 dark:text-slate-200">
              <ShieldAlert size={15} className="text-warning-600 dark:text-warning-500" />
              Aviso
            </p>
            <p>
              La informacion de este sitio es orientativa y no sustituye el asesoramiento
              profesional financiero, fiscal o legal.
            </p>
          </div>
        </div>
        <p className="mt-8 flex items-center gap-1.5 text-xs">
          <Info size={13} />© {new Date().getFullYear()} Guia de Vivienda.
        </p>
      </div>
    </footer>
  );
}
