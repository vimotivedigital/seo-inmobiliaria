import Link from "next/link";
import { Home, Landmark, KeyRound, Hammer, Receipt, Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_ITEMS = [
  { href: "/hipotecas", label: "Hipotecas", icon: Landmark },
  { href: "/comprar-vivienda", label: "Comprar vivienda", icon: Home },
  { href: "/alquiler", label: "Alquiler", icon: KeyRound },
  { href: "/reformas", label: "Reformas", icon: Hammer },
  { href: "/gastos-vivienda", label: "Gastos de vivienda", icon: Receipt },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Home size={18} />
          </span>
          Guia de Vivienda
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 hover:text-brand-700 dark:hover:text-brand-400"
            >
              <item.icon size={16} className="text-slate-400 dark:text-slate-500" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/hipoteca-calculadora"
            className="flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Calculator size={16} />
            Calculadoras
          </Link>
        </div>
      </div>
    </header>
  );
}
