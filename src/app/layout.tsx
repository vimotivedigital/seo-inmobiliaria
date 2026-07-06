import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { CookieConsent } from "@/components/ads/CookieConsent";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — hipotecas, compra, alquiler y reformas`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Calculadoras y guias de vivienda en Espana: hipotecas, comprar vs alquilar, coste de reforma, gastos de compra y mudanzas, con datos y fuentes verificables.",
  verification: {
    google: "FRWNQFwnuUUCjWfLbE9wwXS596vCz5mcjbwRtySdY9k",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/*
          El script base de AdSense se carga SIEMPRE (sin esperar
          consentimiento) para que el crawler de verificacion de Google
          pueda encontrarlo -- si no, "no hemos podido verificar tu sitio".
          Esto no sirve anuncios por si solo: el consentimiento sigue
          controlando si se renderiza cada <ins class="adsbygoogle"> (ver
          AdSlot.tsx) y Google Consent Mode v2 controla la personalizacion.
        */}
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
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
