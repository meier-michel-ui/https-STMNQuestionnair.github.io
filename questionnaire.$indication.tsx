export const INDICATIONS = [
  "Mandibular Canine",
  "Mandibular Incisor",
  "Mandibular Molare",
  "Mandibular Premolare",
  "Maxilla Canine",
  "Maxilla Incisor",
  "Maxilla Molare",
  "Maxilla Premolare",
] as const;

export type Indication = (typeof INDICATIONS)[number];

export const SYSTEMS = ["BLX", "BLC", "TLX", "TLC"] as const;
export type SystemCode = (typeof SYSTEMS)[number];

export type Preference = "regular" | "occasional" | "not_preferred";

export const NEXT_PREFERENCE: Record<Preference | "none", Preference | "none"> = {
  none: "regular",
  regular: "occasional",
  occasional: "not_preferred",
  not_preferred: "none",
};

export function indicationSlug(i: string) {
  return i.toLowerCase().replace(/\s+/g, "-");
}
export function slugToIndication(slug: string): Indication | undefined {
  return INDICATIONS.find((i) => indicationSlug(i) === slug);
}
