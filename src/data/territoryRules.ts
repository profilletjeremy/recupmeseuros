/**
 * Règles fiscales territoriales — Déclaration 2026 (revenus 2025)
 *
 * Sources :
 * - BOFiP-IR-LIQ-20-10-10 (abattements DOM)
 * - CGI art. 197 I-3 (barème DOM)
 * - service-public.fr — Zone tendue
 * - Conventions fiscales bilatérales
 *
 * Architecture : données statiques TypeScript (pas de DB).
 * Cohérent avec le pattern taxRules2026.ts.
 */

import type { TerritoryType, BorderCountry, AutonomousTerritory } from "./departments";

// ═══════════════════════════════════════════════
// ABATTEMENTS DOM (CGI art. 197 I-3)
// ═══════════════════════════════════════════════

export interface DomAbatement {
  territories: TerritoryType[];
  rate: number;       // Taux d'abattement
  maxAmount: number;  // Plafond en €
  description: string;
  boxes: string[];
  form: string;
  officialLink: string;
}

export const DOM_ABATEMENTS: DomAbatement[] = [
  {
    territories: ["martinique", "guadeloupe", "reunion"],
    rate: 0.30,
    maxAmount: 2450,
    description: "Abattement de 30% sur l'impôt sur le revenu pour les contribuables domiciliés en Martinique, Guadeloupe ou La Réunion, plafonné à 2 450 €.",
    boxes: [],
    form: "2042 (automatique)",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31410",
  },
  {
    territories: ["guyane", "mayotte"],
    rate: 0.40,
    maxAmount: 4050,
    description: "Abattement de 40% sur l'impôt sur le revenu pour les contribuables domiciliés en Guyane ou Mayotte, plafonné à 4 050 €.",
    boxes: [],
    form: "2042 (automatique)",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31410",
  },
];

/** Retourne l'abattement DOM applicable pour un territoire */
export function getDomAbatement(territory: TerritoryType): DomAbatement | null {
  return DOM_ABATEMENTS.find((a) => a.territories.includes(territory)) || null;
}

// ═══════════════════════════════════════════════
// TERRITOIRES AUTONOMES (hors IR métropole)
// ═══════════════════════════════════════════════

export interface AutonomousTerritoryInfo {
  id: AutonomousTerritory;
  name: string;
  fiscalRegime: string;
  description: string;
  officialLink: string;
}

export const AUTONOMOUS_TERRITORIES: AutonomousTerritoryInfo[] = [
  {
    id: "polynesie",
    name: "Polynésie française",
    fiscalRegime: "Impôt territorial (CST)",
    description: "La Polynésie française dispose de son propre système fiscal. L'impôt sur le revenu métropolitain ne s'applique pas. Vous relevez de la Contribution de Solidarité Territoriale (CST) et de l'impôt sur les transactions.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
  {
    id: "nouvelle_caledonie",
    name: "Nouvelle-Calédonie",
    fiscalRegime: "Impôt territorial",
    description: "La Nouvelle-Calédonie dispose d'une autonomie fiscale complète. L'IR métropolitain ne s'applique pas. Vous relevez du code des impôts de Nouvelle-Calédonie.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
  {
    id: "saint_barthelemy",
    name: "Saint-Barthélemy",
    fiscalRegime: "Collectivité autonome",
    description: "Saint-Barthélemy a sa propre fiscalité depuis 2008. Les résidents ne sont pas soumis à l'IR français mais à un impôt forfaitaire local.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
  {
    id: "saint_martin",
    name: "Saint-Martin",
    fiscalRegime: "Collectivité d'outre-mer",
    description: "Saint-Martin dispose de sa propre fiscalité. Les résidents de plus de 5 ans relèvent du code fiscal local. Les résidents récents peuvent rester sous IR français.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
  {
    id: "wallis_futuna",
    name: "Wallis-et-Futuna",
    fiscalRegime: "Pas d'IR",
    description: "Il n'existe pas d'impôt sur le revenu à Wallis-et-Futuna. Les résidents permanents ne sont pas soumis à l'IR français.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
  {
    id: "saint_pierre_miquelon",
    name: "Saint-Pierre-et-Miquelon",
    fiscalRegime: "Impôt territorial similaire IR",
    description: "Saint-Pierre-et-Miquelon a son propre code des impôts. Le barème est similaire à celui de la métropole mais avec des aménagements locaux.",
    officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
  },
];

// ═══════════════════════════════════════════════
// ALSACE-MOSELLE (régime local)
// ═══════════════════════════════════════════════

export const ALSACE_MOSELLE = {
  departments: ["57", "67", "68"],
  title: "Régime local Alsace-Moselle",
  impacts: [
    {
      title: "Cotisations sociales spécifiques",
      description: "Les salariés cotisent une contribution complémentaire maladie de 1,30% sur le salaire brut, en plus du régime général. Vérifiez votre bulletin de paie.",
    },
    {
      title: "Remboursement maladie amélioré",
      description: "Le régime local rembourse mieux : 90% des frais médicaux au lieu de 70%. Cela peut réduire vos dépenses de complémentaire santé.",
    },
    {
      title: "Jours fériés supplémentaires",
      description: "Le Vendredi Saint et le 26 décembre sont fériés en Alsace-Moselle. Impact sur le calcul des jours travaillés pour les frais réels.",
    },
    {
      title: "Associations et dons",
      description: "Certaines associations de droit local ont un statut fiscal particulier. Vérifiez l'éligibilité à la réduction d'impôt.",
    },
  ],
  officialLink: "https://www.service-public.fr/particuliers/vosdroits/F34125",
};

// ═══════════════════════════════════════════════
// CORSE — spécificités
// ═══════════════════════════════════════════════

export const CORSE_RULES = {
  departments: ["2A", "2B"],
  title: "Spécificités fiscales Corse",
  impacts: [
    {
      title: "Patrimoine immobilier",
      description: "La Corse bénéficiait historiquement d'exonérations successorales spécifiques. Les indivisions foncières anciennes (« biens de famille ») ont un régime particulier.",
    },
    {
      title: "Investissement locatif",
      description: "Certains dispositifs d'investissement (Pinel, Denormandie) comportent des spécificités pour la Corse en termes de plafonds de loyers et de ressources.",
    },
    {
      title: "Crédit d'impôt investissement productif",
      description: "Les investissements productifs en Corse peuvent ouvrir droit à un crédit d'impôt spécifique (art. 244 quater E du CGI), distinct du dispositif DOM.",
    },
  ],
  officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31921",
};

// ═══════════════════════════════════════════════
// ZONES TENDUES
// Communes ayant voté la majoration de taxe
// d'habitation sur résidences secondaires
// ═══════════════════════════════════════════════

/**
 * Départements contenant des communes en zone tendue.
 * Pour une détection fine on utiliserait la liste INSEE complète (~1 149 communes).
 * Ici on cible les principales villes ayant voté la surtaxe résidence secondaire.
 */
export const ZONE_TENDUE_CITIES: Record<string, string[]> = {
  // Département → communes principales
  "75": ["Paris"],
  "13": ["Marseille", "Aix-en-Provence"],
  "69": ["Lyon", "Villeurbanne"],
  "33": ["Bordeaux"],
  "31": ["Toulouse"],
  "34": ["Montpellier"],
  "06": ["Nice", "Antibes", "Cannes"],
  "44": ["Nantes"],
  "67": ["Strasbourg"],
  "59": ["Lille"],
  "35": ["Rennes"],
  "38": ["Grenoble"],
  "76": ["Rouen"],
  "37": ["Tours"],
  "21": ["Dijon"],
  "63": ["Clermont-Ferrand"],
  "49": ["Angers"],
  "56": ["Vannes"],
  "29": ["Brest"],
  "64": ["Bayonne", "Biarritz"],
  "74": ["Annecy", "Thonon-les-Bains"],
  "73": ["Chambéry"],
  "83": ["Toulon", "Saint-Tropez"],
  "84": ["Avignon"],
  "30": ["Nîmes"],
  "66": ["Perpignan"],
  "17": ["La Rochelle"],
  "85": ["Les Sables-d'Olonne"],
  "2A": ["Ajaccio"],
  "2B": ["Bastia"],
  // Île-de-France (toute la zone est tendue)
  "77": ["Meaux", "Melun", "Fontainebleau"],
  "78": ["Versailles", "Saint-Germain-en-Laye"],
  "91": ["Évry", "Massy"],
  "92": ["Boulogne-Billancourt", "Neuilly-sur-Seine", "Nanterre"],
  "93": ["Saint-Denis", "Montreuil", "Bobigny"],
  "94": ["Créteil", "Vincennes", "Ivry-sur-Seine"],
  "95": ["Cergy", "Argenteuil"],
};

/** IDF est entièrement zone tendue */
export const IDF_DEPARTMENTS = ["75", "77", "78", "91", "92", "93", "94", "95"];

export interface ZoneTendueAlerts {
  surtaxeResidenceSecondaire: boolean;
  taxeLogementVacant: boolean;
  encadrementLoyers: boolean;
  locationCourteRegulmentee: boolean;
}

/** Détecte si un département est en zone tendue probable */
export function isZoneTendue(departmentCode: string): boolean {
  return departmentCode in ZONE_TENDUE_CITIES || IDF_DEPARTMENTS.includes(departmentCode);
}

/** Villes avec encadrement des loyers (2025) */
export const ENCADREMENT_LOYERS_CITIES = [
  "Paris", "Lyon", "Villeurbanne", "Lille", "Hellemmes", "Lomme",
  "Montpellier", "Bordeaux", "Grenoble", "Strasbourg",
];

// ═══════════════════════════════════════════════
// CONVENTIONS FISCALES FRONTALIÈRES
// ═══════════════════════════════════════════════

export interface FrontalierConvention {
  country: BorderCountry;
  countryLabel: string;
  /** Départements éligibles (les plus fréquents) */
  typicalDepartments: string[];
  rules: FrontalierRule[];
  boxes: string[];
  form: string;
  officialLink: string;
}

export interface FrontalierRule {
  title: string;
  description: string;
  condition?: string;
}

export const FRONTALIER_CONVENTIONS: FrontalierConvention[] = [
  {
    country: "suisse",
    countryLabel: "Suisse",
    typicalDepartments: ["01", "25", "39", "68", "74", "90"],
    rules: [
      {
        title: "Canton de Genève — Imposition en France",
        description: "Les frontaliers travaillant dans le canton de Genève sont imposés en France (accord du 11 avril 1983). Le salaire est déclaré en France, et Genève reverse une compensation fiscale.",
        condition: "Résidence dans les départements 01 ou 74, emploi à Genève",
      },
      {
        title: "Autres cantons — Imposition en Suisse",
        description: "Les frontaliers travaillant dans les autres cantons sont imposés en Suisse (retenue à la source). Le revenu est déclaré en France avec un crédit d'impôt égal à l'impôt français correspondant (méthode de l'exemption avec taux effectif).",
        condition: "Emploi hors canton de Genève",
      },
      {
        title: "Télétravail — Règle des 40%",
        description: "Depuis l'accord amiable de 2023, jusqu'à 40% de télétravail (soit environ 96 jours/an) est toléré sans remettre en cause le statut frontalier. Au-delà, le régime d'imposition change.",
      },
    ],
    boxes: ["1AF", "1BF", "8TK"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-en-suisse",
  },
  {
    country: "luxembourg",
    countryLabel: "Luxembourg",
    typicalDepartments: ["54", "55", "57"],
    rules: [
      {
        title: "Imposition au Luxembourg",
        description: "Les salaires des frontaliers sont imposés au Luxembourg (retenue à la source). En France, ces revenus sont déclarés et exonérés, mais pris en compte pour le calcul du taux effectif d'imposition (méthode de l'exemption).",
      },
      {
        title: "Télétravail — Règle des 34 jours",
        description: "L'accord fiscal permet jusqu'à 34 jours de télétravail par an sans remettre en cause l'imposition au Luxembourg. Au-delà, les jours télétravaillés en France sont imposables en France.",
      },
      {
        title: "Déclaration double",
        description: "Vous devez déposer une déclaration au Luxembourg ET en France. En France, utilisez le formulaire 2047 pour déclarer les revenus étrangers et le crédit d'impôt.",
      },
    ],
    boxes: ["1AF", "1BF", "8TK", "8TI"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-au-luxembourg",
  },
  {
    country: "belgique",
    countryLabel: "Belgique",
    typicalDepartments: ["02", "08", "54", "55", "57", "59", "62"],
    rules: [
      {
        title: "Imposition dans le pays d'activité",
        description: "Depuis la convention de 2021, les salaires sont imposés dans le pays d'exercice de l'activité. Le salarié frontalier travaillant en Belgique est imposé en Belgique.",
      },
      {
        title: "Télétravail",
        description: "Un accord spécifique permet un certain nombre de jours de télétravail. Au-delà du seuil, les jours en France sont imposables en France.",
      },
    ],
    boxes: ["1AF", "8TK"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-en-belgique",
  },
  {
    country: "allemagne",
    countryLabel: "Allemagne",
    typicalDepartments: ["57", "67", "68"],
    rules: [
      {
        title: "Zone frontalière de 30 km",
        description: "Les frontaliers résidant dans la zone des 30 km et travaillant en Allemagne sont imposés en France. L'employeur allemand ne pratique pas de retenue à la source.",
        condition: "Résidence à moins de 30 km de la frontière",
      },
      {
        title: "Hors zone 30 km",
        description: "Si vous résidez au-delà de la zone des 30 km, les salaires sont imposés en Allemagne. Déclaration en France avec crédit d'impôt.",
      },
      {
        title: "Télétravail — 34 jours",
        description: "L'avenant de 2023 tolère jusqu'à 34 jours de télétravail par an sans changement de régime d'imposition.",
      },
    ],
    boxes: ["1AF", "1BF", "8TK"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-en-allemagne",
  },
  {
    country: "espagne",
    countryLabel: "Espagne",
    typicalDepartments: ["09", "11", "31", "64", "65", "66"],
    rules: [
      {
        title: "Imposition dans le pays d'exercice",
        description: "Les salaires sont imposés dans le pays où l'activité est exercée. Si vous travaillez en Espagne, vous êtes imposé en Espagne avec un crédit d'impôt en France.",
      },
    ],
    boxes: ["1AF", "8TK"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier",
  },
  {
    country: "italie",
    countryLabel: "Italie",
    typicalDepartments: ["04", "05", "06", "73", "74"],
    rules: [
      {
        title: "Imposition dans le pays d'exercice",
        description: "Les salaires sont imposés dans le pays d'exercice de l'activité. Déclaration en France avec crédit d'impôt pour éviter la double imposition.",
      },
    ],
    boxes: ["1AF", "8TK"],
    form: "2042 + 2047",
    officialLink: "https://www.impots.gouv.fr/international-particulier",
  },
  {
    country: "monaco",
    countryLabel: "Monaco",
    typicalDepartments: ["06"],
    rules: [
      {
        title: "Résidents français travaillant à Monaco",
        description: "Les résidents français travaillant à Monaco sont imposés normalement en France, comme s'ils travaillaient en France. Pas de régime frontalier spécifique.",
      },
      {
        title: "Résidents monégasques de nationalité française",
        description: "Les Français résidant à Monaco restent soumis à l'IR français (convention de 1963). Seuls les non-Français résidents à Monaco sont exonérés.",
      },
    ],
    boxes: [],
    form: "2042",
    officialLink: "https://www.impots.gouv.fr/international-particulier/questions/je-reside-monaco",
  },
];

/** Retourne les conventions frontalières pour un pays */
export function getFrontalierConvention(country: BorderCountry): FrontalierConvention | undefined {
  return FRONTALIER_CONVENTIONS.find((c) => c.country === country);
}

/** Retourne les pays frontaliers possibles pour un département */
export function getPossibleBorderCountries(departmentCode: string): BorderCountry[] {
  const dept = FRONTALIER_CONVENTIONS.filter((c) =>
    c.typicalDepartments.includes(departmentCode)
  );
  return dept.map((c) => c.country);
}

// ═══════════════════════════════════════════════
// CHANGEMENT DE RÉSIDENCE EN COURS D'ANNÉE
// ═══════════════════════════════════════════════

export const DEMENAGEMENT_FISCAL = {
  title: "Déménagement en cours d'année fiscale",
  rules: [
    {
      title: "Résidence fiscale au 31 décembre",
      description: "Votre résidence fiscale est celle au 31 décembre de l'année d'imposition. C'est cette adresse qui détermine votre centre des impôts et vos dates limites de déclaration.",
    },
    {
      title: "Changement métropole ↔ DOM",
      description: "Si vous avez déménagé de métropole vers un DOM (ou inversement) en cours d'année, c'est votre situation au 31 décembre qui détermine si vous bénéficiez de l'abattement DOM.",
    },
    {
      title: "Changement France ↔ étranger",
      description: "Si vous êtes arrivé ou parti de France en cours d'année, vous devez déposer une déclaration pour la période de résidence en France. Les revenus perçus hors de France ne sont pas imposables (sauf cas particuliers).",
    },
  ],
  officialLink: "https://www.impots.gouv.fr/particulier/questions/jai-demenage-en-cours-dannee-comment-faire-ma-declaration",
};

// ═══════════════════════════════════════════════
// LABELS pour l'UI
// ═══════════════════════════════════════════════

export const TERRITORY_LABELS: Record<string, string> = {
  metropole: "France métropolitaine",
  martinique: "Martinique (972)",
  guadeloupe: "Guadeloupe (971)",
  guyane: "Guyane (973)",
  reunion: "La Réunion (974)",
  mayotte: "Mayotte (976)",
  corse: "Corse",
  polynesie: "Polynésie française",
  nouvelle_caledonie: "Nouvelle-Calédonie",
  saint_martin: "Saint-Martin",
  saint_barthelemy: "Saint-Barthélemy",
  wallis_futuna: "Wallis-et-Futuna",
  saint_pierre_miquelon: "Saint-Pierre-et-Miquelon",
  etranger: "Étranger (non-résident)",
};

export const BORDER_COUNTRY_LABELS: Record<BorderCountry, string> = {
  suisse: "Suisse",
  luxembourg: "Luxembourg",
  belgique: "Belgique",
  allemagne: "Allemagne",
  espagne: "Espagne",
  italie: "Italie",
  monaco: "Monaco",
};
