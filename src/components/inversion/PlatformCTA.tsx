import { ExternalLink } from "lucide-react";

interface PlatformCTAProps {
  platformName: string;
  /**
   * Hoy: URL publica normal de la plataforma (sin tracking de afiliado).
   * Cuando se activen los enlaces de afiliado reales, sustituir por la URL
   * con tracking y descomentar el bloque de disclosure de abajo -- ver
   * tambien AmazonProductCard.tsx para el patron de `rel` ya usado en
   * /recomendados (sponsored nofollow noopener) una vez sea un enlace real
   * de afiliado.
   */
  affiliateUrl: string;
}

/**
 * CTA reutilizable hacia el sitio de cada plataforma de crowdfunding
 * inmobiliario. Preparado para enlaces de afiliado futuros sin activarlos
 * todavia: `rel` hoy es solo "noopener noreferrer" (enlace normal), no
 * "sponsored" -- séria inexacto marcarlo como patrocinado antes de que el
 * enlace de afiliado real este activo.
 */
export function PlatformCTA({ platformName, affiliateUrl }: PlatformCTAProps) {
  // Cuando el enlace de arriba sea un enlace de afiliado real, descomentar
  // este aviso (obligatorio por FTC/CNMC antes de activar afiliacion) y
  // anadir rel="sponsored nofollow noopener noreferrer" al <a> de abajo:
  //
  // <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
  //   Este articulo puede contener enlaces de afiliado. Si te registras a
  //   traves de ellos, TipoFijo puede recibir una comision, sin coste
  //   adicional para ti.
  // </p>

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Visitar {platformName}
        <ExternalLink size={14} />
      </a>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Enlace directo a la web oficial de {platformName}. Consulta siempre la documentacion del
        proyecto en la propia plataforma antes de invertir.
      </p>
    </div>
  );
}
