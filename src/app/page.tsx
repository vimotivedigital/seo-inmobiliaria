import Link from "next/link";
import type { Metadata } from "next";
import { Landmark, Home, KeyRound, Hammer, Receipt, Calculator, MapPin } from "lucide-react";
import { getAllCities } from "@/lib/data";
import { filterIndexableEntities } from "@/lib/quality-control";
import { buildEditorialMetadata } from "@/lib/seo";
import { HeroIllustration } from "@/components/home/HeroIllustration";

export const metadata: Metadata = buildEditorialMetadata(
  "Calculadoras y guias de vivienda en Espana",
  "Hipotecas, comprar vs alquilar, coste de reforma, gastos de compra y mudanzas. Datos con fuente y fecha de actualizacion.",
  "/"
);

const HUBS = [
  { href: "/hipotecas", title: "Hipotecas", desc: "Tipos de interes, requisitos y como elegir la mejor opcion.", icon: Landmark },
  { href: "/comprar-vivienda", title: "Comprar vivienda", desc: "Proceso de compra, impuestos y gastos paso a paso.", icon: Home },
  { href: "/alquiler", title: "Alquiler", desc: "Derechos, fianzas y como calcular si te compensa alquilar.", icon: KeyRound },
  { href: "/reformas", title: "Reformas", desc: "Costes por m2 y por tipo de reforma en las principales ciudades.", icon: Hammer },
  { href: "/gastos-vivienda", title: "Gastos de vivienda", desc: "IBI, comunidad, suministros y mantenimiento anual.", icon: Receipt },
];

export default function HomePage() {
  const indexableCities = filterIndexableEntities(getAllCities());

  return (
    <div>
      <section className="text-center mb-10">
        <HeroIllustration />
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Decisiones de vivienda con datos, no con suposiciones
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
          Calculadoras interactivas y guias sobre hipotecas, compra, alquiler y reformas en
          Espana. Cada cifra que publicamos indica su fuente y fecha de actualizacion.
        </p>
        <Link
          href="/hipoteca-calculadora"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-white font-medium hover:bg-brand-700"
        >
          <Calculator size={18} />
          Probar la calculadora de hipoteca
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 mb-16">
        {HUBS.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className="group rounded-lg border border-slate-200 p-5 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-400">
                <hub.icon size={20} />
              </span>
              <h2 className="font-semibold text-slate-900 dark:text-white">{hub.title}</h2>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{hub.desc}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <MapPin size={20} className="text-brand-600 dark:text-brand-400" />
          Guias por ciudad (fase 1 — nucleo validado)
        </h2>
        <p className="text-sm text-slate-600 mb-4 dark:text-slate-400">
          Publicamos guias detalladas solo para ciudades con volumen de busqueda confirmado.
          El resto de ciudades se anadira progresivamente segun se valide su demanda en Search
          Console (ver <Link href="/metodologia" className="underline">metodologia</Link>).
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {indexableCities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/comprar-vs-alquilar/${city.slug}`}
                className="block rounded-md border border-slate-200 px-4 py-2 text-sm text-brand-700 hover:border-brand-500 dark:border-slate-700 dark:text-brand-400 dark:hover:border-brand-500"
              >
                {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
