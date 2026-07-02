"use client";

import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEFAULT_CONSENT,
  loadConsent,
  saveConsent,
  gtagConsentDefault,
  type ConsentState,
} from "./consent";

/**
 * Banner de consentimiento (CMP minimo) conforme a GDPR/ePrivacy.
 * Se muestra ANTES de cargar cualquier anuncio o script de analitica.
 * No usa dark patterns: "Rechazar" tiene el mismo peso visual que "Aceptar".
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    gtagConsentDefault();
    const existing = loadConsent();
    if (!existing) setVisible(true);
  }, []);

  function acceptAll() {
    const consent: ConsentState = { necessary: true, analytics: true, ads: true };
    saveConsent(consent);
    setVisible(false);
  }

  function rejectAll() {
    const consent: ConsentState = { necessary: true, analytics: false, ads: false };
    saveConsent(consent);
    setVisible(false);
  }

  function saveCustom() {
    saveConsent(draft);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configuracion de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg sm:p-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-4xl">
        <p className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
          <Cookie size={18} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" />
          <span>
            Usamos cookies propias necesarias para el funcionamiento del sitio y,
            si nos das tu consentimiento, cookies de analitica y de publicidad
            personalizada (Google AdSense). Puedes cambiar tu decision en
            cualquier momento desde el enlace &quot;Cookies&quot; del pie de pagina.{" "}
            <a href="/politica-cookies" className="underline">
              Mas informacion
            </a>
            .
          </span>
        </p>

        {customizing && (
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked disabled />
              Necesarias (siempre activas)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.analytics}
                onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
              />
              Analitica (medicion de audiencia agregada)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.ads}
                onChange={(e) => setDraft((d) => ({ ...d, ads: e.target.checked }))}
              />
              Publicidad personalizada (Google AdSense)
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {!customizing ? (
            <>
              <button
                onClick={acceptAll}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Aceptar todas
              </button>
              <button
                onClick={rejectAll}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Rechazar todas
              </button>
              <button
                onClick={() => setCustomizing(true)}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 underline dark:text-slate-400"
              >
                Personalizar
              </button>
            </>
          ) : (
            <button
              onClick={saveCustom}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Guardar preferencias
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
