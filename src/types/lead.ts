/**
 * Modelo del lead de "vender vivienda". A diferencia del resto del sitio
 * (100% estatico/informativo), esto es el unico flujo que recoge datos
 * personales reales para cederlos a un tercero (la agencia colaboradora),
 * asi que el modelo separa explicitamente los dos consentimientos: nunca se
 * combinan en un solo booleano, porque son dos finalidades distintas (que
 * TipoFijo contacte al usuario / que sus datos se cedan a la agencia).
 */
export interface SellLeadInput {
  nombre: string;
  email: string;
  telefono: string;
  /** Localidad de la vivienda que se quiere vender (slug conocido o texto libre). */
  localidad: string;
  mensaje?: string;
}

export interface SellLeadConsent {
  /** Casilla 1: tratamiento de datos por TipoFijo para contactar al usuario. */
  consentPrivacidad: boolean;
  /** Casilla 2: cesion de datos a la agencia colaboradora nombrada en el formulario. */
  consentAgencia: boolean;
}

/** Registro completo persistido para auditoria (quien consintio, que y cuando). */
export interface SellLeadRecord extends SellLeadInput, SellLeadConsent {
  id: string;
  submittedAt: string; // ISO
  /** Nombre de la agencia colaboradora en el momento del consentimiento
   * (se guarda como snapshot, no como referencia, por si cambia en el futuro). */
  partnerAgencyName: string;
  sourcePath: string;
  ip?: string;
  userAgent?: string;
}
