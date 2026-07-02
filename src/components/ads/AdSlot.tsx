"use client";

import { useEffect, useRef, useState } from "react";
import { loadConsent } from "./consent";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  slotId: string;
  /** Usado solo para trazabilidad/QA de politica de colocacion, no cambia el render. */
  placement: "top" | "in-content" | "after-results";
  className?: string;
}

let scriptLoaded = false;

function loadAdSenseScript() {
  if (scriptLoaded || !ADSENSE_CLIENT_ID) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
  scriptLoaded = true;
}

/**
 * Anuncio de AdSense con:
 *  - carga diferida del script hasta que el usuario da consentimiento (ads),
 *  - render diferido (IntersectionObserver) si el slot esta fuera del
 *    viewport inicial, para no penalizar Core Web Vitals (LCP/CLS),
 *  - separacion visual clara del contenido (etiqueta "Publicidad"),
 *    conforme a la politica de colocacion de anuncios de AdSense.
 */
export function AdSlot({ slotId, placement, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(Boolean(loadConsent()?.ads));
    function onConsentChange(e: Event) {
      const detail = (e as CustomEvent).detail as { ads: boolean };
      setHasConsent(detail.ads);
    }
    window.addEventListener("consent-changed", onConsentChange);
    return () => window.removeEventListener("consent-changed", onConsentChange);
  }, []);

  useEffect(() => {
    if (!ref.current || placement === "top") {
      setShouldRender(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [placement]);

  useEffect(() => {
    if (shouldRender && hasConsent) {
      loadAdSenseScript();
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // El script puede no estar listo todavia en el primer render; se
        // reintenta en el siguiente efecto cuando cambie el consentimiento.
      }
    }
  }, [shouldRender, hasConsent]);

  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <div ref={ref} className={`my-6 ${className}`} data-ad-placement={placement}>
      <span className="block text-center text-[10px] uppercase tracking-wide text-slate-400 mb-1 dark:text-slate-600">
        Publicidad
      </span>
      {shouldRender && hasConsent && (
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
