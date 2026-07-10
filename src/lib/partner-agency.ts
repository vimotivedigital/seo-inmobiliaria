/**
 * Datos de la agencia inmobiliaria colaboradora a la que se ceden los leads
 * de /vender-vivienda. Deliberadamente NO se hardcodea un nombre de agencia
 * real: hasta que se confirme el acuerdo de colaboracion (y su cesion de
 * datos, ver /politica-privacidad), estas variables deben rellenarse en
 * `.env.local`/Vercel. El placeholder es intencionalmente visible para que
 * nadie publique el formulario en produccion sin haberlo configurado.
 */
export const PARTNER_AGENCY_NAME =
  process.env.NEXT_PUBLIC_PARTNER_AGENCY_NAME?.trim() || "[agencia colaboradora pendiente de confirmar]";

export const PARTNER_AGENCY_CONTACT =
  process.env.NEXT_PUBLIC_PARTNER_AGENCY_CONTACT?.trim() || "[contacto de la agencia pendiente de confirmar]";

export const PARTNER_AGENCY_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_PARTNER_AGENCY_NAME?.trim());
