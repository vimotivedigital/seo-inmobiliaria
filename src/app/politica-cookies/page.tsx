import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildEditorialMetadata } from "@/lib/seo";

export const metadata: Metadata = buildEditorialMetadata(
  "Politica de cookies",
  "Que cookies usa TipoFijo, con que finalidad y como puedes gestionar tu consentimiento.",
  "/politica-cookies"
);

export default function PoliticaCookiesPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Cookies", href: "/politica-cookies" }]} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Politica de cookies</h1>

      <h2>Cookies necesarias</h2>
      <p>
        Imprescindibles para el funcionamiento del sitio (por ejemplo, para recordar tu
        preferencia de consentimiento). Se activan siempre y no requieren autorizacion segun la
        normativa de ePrivacy.
      </p>

      <h2>Cookies de analitica</h2>
      <p>
        Nos permiten medir de forma agregada como se usa el sitio para mejorarlo. Solo se activan
        si das tu consentimiento explicito.
      </p>

      <h2>Cookies de publicidad (Google AdSense)</h2>
      <p>
        Usadas para mostrar anuncios, en su caso personalizados, a traves de Google AdSense. Solo
        se activan si das tu consentimiento explicito para publicidad personalizada. Puedes
        obtener mas informacion sobre como Google usa estos datos en su politica de privacidad.
      </p>

      <h2>Como cambiar tu consentimiento</h2>
      <p>
        Puedes aceptar, rechazar o personalizar tu consentimiento en cualquier momento volviendo
        a abrir el banner de cookies (borrando los datos de navegacion de este sitio en tu
        navegador) o desde el enlace de preferencias de cookies del pie de pagina.
      </p>
    </article>
  );
}
