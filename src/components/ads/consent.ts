"use client";

export type ConsentState = {
  necessary: true; // siempre concedido, no es opcional
  analytics: boolean;
  ads: boolean;
};

const STORAGE_KEY = "consent-v1";

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  ads: false,
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Consent Mode v2. Se llama con denegacion por defecto en el layout
 * raiz ANTES de cargar cualquier script de Google (Analytics/AdSense), y se
 * actualiza cuando el usuario decide en el banner de cookies. Esto es
 * obligatorio para servir anuncios personalizados a usuarios en la UE.
 */
export function gtagConsentDefault() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer!.push(args); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

export function gtagConsentUpdate(consent: ConsentState) {
  window.gtag?.("consent", "update", {
    ad_storage: consent.ads ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: consent.ads ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });
}

export function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: ConsentState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  gtagConsentUpdate(consent);
  window.dispatchEvent(new CustomEvent("consent-changed", { detail: consent }));
}
