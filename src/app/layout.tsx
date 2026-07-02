import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { CookieConsent } from "@/components/ads/CookieConsent";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — hipotecas, compra, alquiler y reformas`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Calculadoras y guias de vivienda en Espana: hipotecas, comprar vs alquilar, coste de reforma, gastos de compra y mudanzas, con datos y fuentes verificables.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
