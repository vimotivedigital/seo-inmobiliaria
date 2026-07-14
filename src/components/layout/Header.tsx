import Link from "next/link";
import Image from "next/image";
import { Home, Landmark, KeyRound, Hammer, Receipt, Calculator, Banknote, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_ITEMS = [
  { href: "/hipotecas", label: "Hipotecas", icon: Landmark },
  { href: "/comprar-vivienda", label: "Comprar", icon: Home },
  { href: "/alquiler", label: "Alquiler", icon: KeyRound },
  { href: "/reformas", label: "Reformas", icon: Hammer },
  { href: "/gastos-vivienda", label: "Gastos", icon: Receipt },
  { href: "/vender-vivienda", label: "Vender", icon: Banknote },
  { href: "/inversion-inmobiliaria", label: "Inversion", icon: TrendingUp },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Image src="/images/logo-icon.png" alt="" width={36} height={36} priority className="h-9 w-9" />
          <span>
            <span className="text-brand-600 dark:text-brand-400">tipo</span>
            fijo
            <span className="text-brand-600 dark:text-brand-400">.com</span>
          </span>
        </Link>
        <nav className="hidden min-w-0 gap-4 text-sm font-medium text-slate-600 lg:flex dark:text-slate-300">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-brand-700 dark:hover:text-brand-400"
            >
              <item.icon size={16} className="text-slate-400 dark:text-slate-500" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/hipoteca-calculadora"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Calculator size={16} />
            Calculadoras
          </Link>
        </div>
      </div>
    </header>
  );
}
