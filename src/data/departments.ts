/**
 * Départements français — données de référence
 *
 * Utilisé pour l'autocomplete, la détection territoriale,
 * et le routage vers les règles spécifiques.
 */

export interface Department {
  code: string;
  name: string;
  region: string;
  territory: TerritoryType;
  /** Départements frontaliers avec pays */
  borderCountries?: BorderCountry[];
  /** Régime local (Alsace-Moselle) */
  regimeLocal?: boolean;
}

export type TerritoryType =
  | "metropole"
  | "martinique"
  | "guadeloupe"
  | "guyane"
  | "reunion"
  | "mayotte"
  | "corse";

export type BorderCountry =
  | "suisse"
  | "luxembourg"
  | "belgique"
  | "allemagne"
  | "espagne"
  | "italie"
  | "monaco";

export type AutonomousTerritory =
  | "polynesie"
  | "nouvelle_caledonie"
  | "saint_martin"
  | "saint_barthelemy"
  | "wallis_futuna"
  | "saint_pierre_miquelon";

export const DEPARTMENTS: Department[] = [
  { code: "01", name: "Ain", region: "Auvergne-Rhône-Alpes", territory: "metropole", borderCountries: ["suisse"] },
  { code: "02", name: "Aisne", region: "Hauts-de-France", territory: "metropole", borderCountries: ["belgique"] },
  { code: "03", name: "Allier", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "04", name: "Alpes-de-Haute-Provence", region: "Provence-Alpes-Côte d'Azur", territory: "metropole", borderCountries: ["italie"] },
  { code: "05", name: "Hautes-Alpes", region: "Provence-Alpes-Côte d'Azur", territory: "metropole", borderCountries: ["italie"] },
  { code: "06", name: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur", territory: "metropole", borderCountries: ["italie", "monaco"] },
  { code: "07", name: "Ardèche", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "08", name: "Ardennes", region: "Grand Est", territory: "metropole", borderCountries: ["belgique"] },
  { code: "09", name: "Ariège", region: "Occitanie", territory: "metropole", borderCountries: ["espagne"] },
  { code: "10", name: "Aube", region: "Grand Est", territory: "metropole" },
  { code: "11", name: "Aude", region: "Occitanie", territory: "metropole", borderCountries: ["espagne"] },
  { code: "12", name: "Aveyron", region: "Occitanie", territory: "metropole" },
  { code: "13", name: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur", territory: "metropole" },
  { code: "14", name: "Calvados", region: "Normandie", territory: "metropole" },
  { code: "15", name: "Cantal", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "16", name: "Charente", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "17", name: "Charente-Maritime", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "18", name: "Cher", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "19", name: "Corrèze", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "21", name: "Côte-d'Or", region: "Bourgogne-Franche-Comté", territory: "metropole" },
  { code: "22", name: "Côtes-d'Armor", region: "Bretagne", territory: "metropole" },
  { code: "23", name: "Creuse", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "24", name: "Dordogne", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "25", name: "Doubs", region: "Bourgogne-Franche-Comté", territory: "metropole", borderCountries: ["suisse"] },
  { code: "26", name: "Drôme", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "27", name: "Eure", region: "Normandie", territory: "metropole" },
  { code: "28", name: "Eure-et-Loir", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "29", name: "Finistère", region: "Bretagne", territory: "metropole" },
  { code: "2A", name: "Corse-du-Sud", region: "Corse", territory: "corse" },
  { code: "2B", name: "Haute-Corse", region: "Corse", territory: "corse" },
  { code: "30", name: "Gard", region: "Occitanie", territory: "metropole" },
  { code: "31", name: "Haute-Garonne", region: "Occitanie", territory: "metropole", borderCountries: ["espagne"] },
  { code: "32", name: "Gers", region: "Occitanie", territory: "metropole" },
  { code: "33", name: "Gironde", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "34", name: "Hérault", region: "Occitanie", territory: "metropole" },
  { code: "35", name: "Ille-et-Vilaine", region: "Bretagne", territory: "metropole" },
  { code: "36", name: "Indre", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "37", name: "Indre-et-Loire", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "38", name: "Isère", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "39", name: "Jura", region: "Bourgogne-Franche-Comté", territory: "metropole", borderCountries: ["suisse"] },
  { code: "40", name: "Landes", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "41", name: "Loir-et-Cher", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "42", name: "Loire", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "43", name: "Haute-Loire", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "44", name: "Loire-Atlantique", region: "Pays de la Loire", territory: "metropole" },
  { code: "45", name: "Loiret", region: "Centre-Val de Loire", territory: "metropole" },
  { code: "46", name: "Lot", region: "Occitanie", territory: "metropole" },
  { code: "47", name: "Lot-et-Garonne", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "48", name: "Lozère", region: "Occitanie", territory: "metropole" },
  { code: "49", name: "Maine-et-Loire", region: "Pays de la Loire", territory: "metropole" },
  { code: "50", name: "Manche", region: "Normandie", territory: "metropole" },
  { code: "51", name: "Marne", region: "Grand Est", territory: "metropole" },
  { code: "52", name: "Haute-Marne", region: "Grand Est", territory: "metropole" },
  { code: "53", name: "Mayenne", region: "Pays de la Loire", territory: "metropole" },
  { code: "54", name: "Meurthe-et-Moselle", region: "Grand Est", territory: "metropole", borderCountries: ["belgique", "luxembourg"] },
  { code: "55", name: "Meuse", region: "Grand Est", territory: "metropole", borderCountries: ["belgique", "luxembourg"] },
  { code: "56", name: "Morbihan", region: "Bretagne", territory: "metropole" },
  { code: "57", name: "Moselle", region: "Grand Est", territory: "metropole", borderCountries: ["allemagne", "luxembourg"], regimeLocal: true },
  { code: "58", name: "Nièvre", region: "Bourgogne-Franche-Comté", territory: "metropole" },
  { code: "59", name: "Nord", region: "Hauts-de-France", territory: "metropole", borderCountries: ["belgique"] },
  { code: "60", name: "Oise", region: "Hauts-de-France", territory: "metropole" },
  { code: "61", name: "Orne", region: "Normandie", territory: "metropole" },
  { code: "62", name: "Pas-de-Calais", region: "Hauts-de-France", territory: "metropole" },
  { code: "63", name: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "64", name: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine", territory: "metropole", borderCountries: ["espagne"] },
  { code: "65", name: "Hautes-Pyrénées", region: "Occitanie", territory: "metropole", borderCountries: ["espagne"] },
  { code: "66", name: "Pyrénées-Orientales", region: "Occitanie", territory: "metropole", borderCountries: ["espagne"] },
  { code: "67", name: "Bas-Rhin", region: "Grand Est", territory: "metropole", borderCountries: ["allemagne"], regimeLocal: true },
  { code: "68", name: "Haut-Rhin", region: "Grand Est", territory: "metropole", borderCountries: ["allemagne", "suisse"], regimeLocal: true },
  { code: "69", name: "Rhône", region: "Auvergne-Rhône-Alpes", territory: "metropole" },
  { code: "70", name: "Haute-Saône", region: "Bourgogne-Franche-Comté", territory: "metropole" },
  { code: "71", name: "Saône-et-Loire", region: "Bourgogne-Franche-Comté", territory: "metropole" },
  { code: "72", name: "Sarthe", region: "Pays de la Loire", territory: "metropole" },
  { code: "73", name: "Savoie", region: "Auvergne-Rhône-Alpes", territory: "metropole", borderCountries: ["italie"] },
  { code: "74", name: "Haute-Savoie", region: "Auvergne-Rhône-Alpes", territory: "metropole", borderCountries: ["suisse", "italie"] },
  { code: "75", name: "Paris", region: "Île-de-France", territory: "metropole" },
  { code: "76", name: "Seine-Maritime", region: "Normandie", territory: "metropole" },
  { code: "77", name: "Seine-et-Marne", region: "Île-de-France", territory: "metropole" },
  { code: "78", name: "Yvelines", region: "Île-de-France", territory: "metropole" },
  { code: "79", name: "Deux-Sèvres", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "80", name: "Somme", region: "Hauts-de-France", territory: "metropole" },
  { code: "81", name: "Tarn", region: "Occitanie", territory: "metropole" },
  { code: "82", name: "Tarn-et-Garonne", region: "Occitanie", territory: "metropole" },
  { code: "83", name: "Var", region: "Provence-Alpes-Côte d'Azur", territory: "metropole" },
  { code: "84", name: "Vaucluse", region: "Provence-Alpes-Côte d'Azur", territory: "metropole" },
  { code: "85", name: "Vendée", region: "Pays de la Loire", territory: "metropole" },
  { code: "86", name: "Vienne", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "87", name: "Haute-Vienne", region: "Nouvelle-Aquitaine", territory: "metropole" },
  { code: "88", name: "Vosges", region: "Grand Est", territory: "metropole" },
  { code: "89", name: "Yonne", region: "Bourgogne-Franche-Comté", territory: "metropole" },
  { code: "90", name: "Territoire de Belfort", region: "Bourgogne-Franche-Comté", territory: "metropole", borderCountries: ["suisse"] },
  { code: "91", name: "Essonne", region: "Île-de-France", territory: "metropole" },
  { code: "92", name: "Hauts-de-Seine", region: "Île-de-France", territory: "metropole" },
  { code: "93", name: "Seine-Saint-Denis", region: "Île-de-France", territory: "metropole" },
  { code: "94", name: "Val-de-Marne", region: "Île-de-France", territory: "metropole" },
  { code: "95", name: "Val-d'Oise", region: "Île-de-France", territory: "metropole" },
  // DOM
  { code: "971", name: "Guadeloupe", region: "Guadeloupe", territory: "guadeloupe" },
  { code: "972", name: "Martinique", region: "Martinique", territory: "martinique" },
  { code: "973", name: "Guyane", region: "Guyane", territory: "guyane" },
  { code: "974", name: "La Réunion", region: "La Réunion", territory: "reunion" },
  { code: "976", name: "Mayotte", region: "Mayotte", territory: "mayotte" },
];

/** Lookup département par code */
export function getDepartment(code: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.code === code);
}

/** Extraire le code département d'un code postal */
export function departmentFromPostalCode(postalCode: string): string {
  if (!postalCode || postalCode.length < 2) return "";
  // DOM: 971xx, 972xx, 973xx, 974xx, 976xx
  if (postalCode.startsWith("97")) return postalCode.slice(0, 3);
  // Corse: 20xxx → 2A ou 2B
  if (postalCode.startsWith("20")) {
    const num = parseInt(postalCode, 10);
    return num < 20200 ? "2A" : "2B";
  }
  return postalCode.slice(0, 2);
}
