import localidadesJson from "@data/vender-vivienda-localidades.json";
import type { VenderViviendaLocalidad } from "@/types/vender-vivienda";

const localidades = localidadesJson as VenderViviendaLocalidad[];

export function getAllVenderViviendaLocalidades(): VenderViviendaLocalidad[] {
  return localidades;
}

export function getVenderViviendaLocalidadBySlug(slug: string): VenderViviendaLocalidad | undefined {
  return localidades.find((l) => l.slug === slug);
}
