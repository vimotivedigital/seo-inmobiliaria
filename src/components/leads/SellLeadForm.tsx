"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { PARTNER_AGENCY_NAME } from "@/lib/partner-agency";

interface Props {
  /** Localidad prerellenada (paginas de localidad) o vacia (hub general). */
  defaultLocalidad?: string;
  /** Si es fijo (pagina de localidad), se oculta el campo y se envia tal cual. */
  fixedLocalidad?: boolean;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Formulario de captacion de leads para vender vivienda. Los dos
 * consentimientos son casillas independientes, sin premarcar, con texto
 * explicito sobre su finalidad -- nunca se combinan en una sola casilla
 * generica de "acepto terminos". El envio esta deshabilitado hasta que
 * ambas esten marcadas, y se revalida en el servidor de todos modos (ver
 * src/lib/leads.ts) por si alguien salta la validacion de cliente.
 */
export function SellLeadForm({ defaultLocalidad = "", fixedLocalidad = false }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [localidad, setLocalidad] = useState(defaultLocalidad);
  const [mensaje, setMensaje] = useState("");
  const [consentPrivacidad, setConsentPrivacidad] = useState(false);
  const [consentAgencia, setConsentAgencia] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot: un usuario real nunca rellena esto
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = consentPrivacidad && consentAgencia && state !== "submitting";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Doble comprobacion: aunque el boton este disabled, nunca se envia sin
    // las dos casillas marcadas, ni siquiera si alguien fuerza el submit.
    if (!consentPrivacidad || !consentAgencia) return;

    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads/vender-vivienda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          localidad,
          mensaje: mensaje || undefined,
          consentPrivacidad,
          consentAgencia,
          website,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMessage(data.error ?? "No se pudo enviar tu solicitud. Intentalo de nuevo.");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMessage("No se pudo enviar tu solicitud. Comprueba tu conexion e intentalo de nuevo.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-success-200 bg-success-50 p-6 text-sm text-success-800 dark:border-success-800 dark:bg-success-900/20 dark:text-success-300">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 size={18} />
          Solicitud recibida
        </p>
        <p className="mt-2">
          Gracias, {nombre.split(" ")[0] || ""}. Hemos recibido tu solicitud de valoracion y{" "}
          {PARTNER_AGENCY_NAME} se pondra en contacto contigo en breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="mb-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" />
        Pide una valoracion gratuita y sin compromiso. Tus datos se comparten con{" "}
        <strong className="font-semibold text-slate-800 dark:text-slate-100">{PARTNER_AGENCY_NAME}</strong>,
        la agencia colaboradora que gestiona la venta en tu zona.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Nombre</span>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            autoComplete="name"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            autoComplete="email"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Telefono</span>
          <input
            type="tel"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="600 000 000"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            autoComplete="tel"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Localidad de la vivienda</span>
          <input
            type="text"
            required
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            readOnly={fixedLocalidad}
            className={`mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${fixedLocalidad ? "bg-slate-50 dark:bg-slate-800/60" : ""}`}
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">Mensaje (opcional)</span>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Tipo de vivienda, superficie aproximada, algun detalle que quieras adelantar..."
        />
      </label>

      {/* Honeypot: oculto para personas, visible para bots que rellenan
          todos los campos de un formulario automaticamente. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={consentPrivacidad}
            onChange={(e) => setConsentPrivacidad(e.target.checked)}
            className="mt-0.5 accent-brand-600"
            required
          />
          <span>
            Acepto la{" "}
            <a href="/politica-privacidad" className="underline hover:text-brand-700 dark:hover:text-brand-400" target="_blank" rel="noopener noreferrer">
              politica de privacidad
            </a>{" "}
            de TipoFijo para que procese mis datos y me contacte en relacion con esta solicitud.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={consentAgencia}
            onChange={(e) => setConsentAgencia(e.target.checked)}
            className="mt-0.5 accent-brand-600"
            required
          />
          <span>
            Acepto que mis datos sean compartidos con <strong>{PARTNER_AGENCY_NAME}</strong> para
            que pueda contactarme con una valoracion de mi vivienda.
          </span>
        </label>
      </div>

      {state === "error" && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-5 flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "submitting" && <Loader2 size={15} className="animate-spin" />}
        Solicitar valoracion gratuita
      </button>
    </form>
  );
}
