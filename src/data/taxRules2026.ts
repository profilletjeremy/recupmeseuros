/**
 * Règles fiscales — Déclaration 2026 (revenus 2025)
 *
 * Sources :
 * - impots.gouv.fr
 * - service-public.fr
 * - economie.gouv.fr
 * - BOFiP
 *
 * Ce fichier est le seul à modifier chaque année.
 * Dupliquer en taxRules2027.ts, taxRules2028.ts, etc.
 */

export const YEAR = 2025; // Année des revenus
export const DECLARATION_YEAR = 2026;

// ─── Barème kilométrique 2025 (voitures thermiques) ───
// Barème officiel impots.gouv.fr
export const BAREME_KM_THERMIQUE: Record<number, { coef: number; add: number }[]> = {
  // [seuil km max, coefficient, ajout fixe]
  3: [
    { coef: 0.529, add: 0 },      // <= 5000 km
    { coef: 0.316, add: 1065 },   // 5001-20000 km
    { coef: 0.370, add: 0 },      // > 20000 km
  ],
  4: [
    { coef: 0.606, add: 0 },
    { coef: 0.340, add: 1330 },
    { coef: 0.407, add: 0 },
  ],
  5: [
    { coef: 0.636, add: 0 },
    { coef: 0.357, add: 1395 },
    { coef: 0.427, add: 0 },
  ],
  6: [
    { coef: 0.665, add: 0 },
    { coef: 0.374, add: 1457 },
    { coef: 0.447, add: 0 },
  ],
  7: [
    { coef: 0.697, add: 0 },
    { coef: 0.394, add: 1515 },
    { coef: 0.470, add: 0 },
  ],
};

// Majoration véhicule électrique : +20%
export const MAJORATION_ELECTRIQUE = 0.20;

// ─── Seuils kilométriques ───
export const SEUIL_KM_1 = 5000;
export const SEUIL_KM_2 = 20000;

// ─── Emploi à domicile ───
export const EMPLOI_DOMICILE_TAUX = 0.50; // 50% crédit d'impôt
export const EMPLOI_DOMICILE_PLAFOND = 12000; // Plafond de base
export const EMPLOI_DOMICILE_PLAFOND_MAX = 15000; // Avec majorations
export const EMPLOI_DOMICILE_PLAFOND_BRICOLAGE = 500;
export const EMPLOI_DOMICILE_PLAFOND_JARDINAGE = 5000;
export const EMPLOI_DOMICILE_PLAFOND_INFORMATIQUE = 3000;

// ─── Garde d'enfants hors domicile ───
export const GARDE_ENFANT_TAUX = 0.50;
export const GARDE_ENFANT_PLAFOND = 3500; // Par enfant (revalorisé)

// ─── Dons ───
export const DON_CLASSIQUE_TAUX = 0.66;
export const DON_CLASSIQUE_PLAFOND_REVENU = 0.20; // 20% du revenu imposable
export const DON_AIDE_TAUX = 0.75;
export const DON_AIDE_PLAFOND = 2000; // Plafond dons aide aux personnes en difficulté (relevé à 2000€ depuis oct 2025)

// ─── Cotisation syndicale ───
export const SYNDICAT_TAUX = 0.66;
export const SYNDICAT_PLAFOND_REVENU = 0.01; // 1% du revenu

// ─── Frais repas ───
export const REPAS_FORFAIT_PAR_JOUR = 5.35; // Valeur forfaitaire repas domicile
export const REPAS_PLAFOND_PAR_JOUR = 20.70; // Plafond déductible
export const REPAS_DEDUCTION_PAR_JOUR = REPAS_PLAFOND_PAR_JOUR - REPAS_FORFAIT_PAR_JOUR;

// ─── Télétravail ───
export const TELETRAVAIL_FORFAIT_JOUR = 2.70; // Allocation forfaitaire par jour
export const TELETRAVAIL_PLAFOND_ANNUEL = 620;

// ─── Pension alimentaire ───
export const PENSION_ENFANT_MAJEUR_PLAFOND = 6674; // Par enfant
export const PENSION_ASCENDANT_FORFAIT_HEBERGEMENT = 3968;

// ─── EHPAD / Dépendance ───
export const EHPAD_TAUX = 0.25;
export const EHPAD_PLAFOND = 10000;

// ─── Adaptation logement handicap ───
export const ADAPTATION_TAUX = 0.25;
export const ADAPTATION_PLAFOND_SEUL = 5000;
export const ADAPTATION_PLAFOND_COUPLE = 10000;

// ─── Borne de recharge ───
export const BORNE_TAUX = 0.75; // Crédit d'impôt 75%
export const BORNE_PLAFOND = 500; // Par borne (plafonné)

// ─── Abattement forfaitaire salarié ───
export const ABATTEMENT_10_TAUX = 0.10;
export const ABATTEMENT_10_MIN = 504;
export const ABATTEMENT_10_MAX = 14426;

// ─── Frais de scolarité enfants ───
export const SCOLARITE_COLLEGE = 61;
export const SCOLARITE_LYCEE = 153;
export const SCOLARITE_SUPERIEUR = 183;

// ─── PER (Plan Épargne Retraite) ───
export const PER_PLAFOND_SALARIE = 0.10; // 10% des revenus nets
export const PER_PLAFOND_MIN = 4399; // Plancher
export const PER_PLAFOND_MAX = 35194; // Plafond (10% de 8 PASS)

// ─── Investissement PME (IR-PME / Madelin) ───
export const PME_TAUX = 0.25; // 25% depuis sept 2025
export const PME_PLAFOND_SEUL = 50000;
export const PME_PLAFOND_COUPLE = 100000;

// ─── Abattement spécial seniors/invalides ───
export const ABATTEMENT_SENIOR_SEUIL_1 = 17670;
export const ABATTEMENT_SENIOR_MONTANT_1 = 2822;
export const ABATTEMENT_SENIOR_SEUIL_2 = 28480;
export const ABATTEMENT_SENIOR_MONTANT_2 = 1411;

// ─── Micro-entrepreneur ───
export const MICRO_ABATTEMENT = {
  vente: 0.71,       // Micro-BIC vente : 71%
  service_bic: 0.50, // Micro-BIC services : 50%
  service_bnc: 0.34, // Micro-BNC : 34%
};
export const MICRO_SEUIL = {
  vente: 188700,
  service_bic: 77700,
  service_bnc: 77700,
};

// ─── Calendrier fiscal 2026 ───
export const CALENDRIER_FISCAL = [
  { date: "2026-04-10", label: "Ouverture du service de déclaration en ligne" },
  { date: "2026-05-22", label: "Date limite départements 01 à 19 et non-résidents" },
  { date: "2026-05-29", label: "Date limite départements 20 à 54" },
  { date: "2026-06-05", label: "Date limite départements 55 à 976" },
  { date: "2026-06-05", label: "Date limite déclaration papier" },
  { date: "2026-07-25", label: "Réception des avis d'imposition (estimé)" },
  { date: "2026-09-01", label: "Début du prélèvement du solde d'impôt" },
];

// ─── Erreurs fréquentes ───
export const ERREURS_FREQUENTES = [
  {
    id: "vinted",
    title: "Revenus Vinted / Leboncoin / Airbnb",
    description:
      "Depuis 2024, les plateformes déclarent automatiquement vos revenus au fisc si vous dépassez 30 transactions ou 2 000 € de ventes. Vérifiez si vos revenus doivent être déclarés.",
    link: "https://www.impots.gouv.fr/particulier/questions/je-vends-des-biens-sur-internet-dois-je-declarer-les-revenus",
  },
  {
    id: "rattachement",
    title: "Rattachement enfant majeur",
    description:
      "Un enfant majeur peut être rattaché à votre foyer fiscal (augmente le quotient familial) OU déduire une pension alimentaire. Il faut comparer les deux options.",
    link: "https://www.service-public.fr/particuliers/vosdroits/F2633",
  },
  {
    id: "prelevement_source",
    title: "Trop-perçu de prélèvement à la source",
    description:
      "Si votre situation a changé (chômage, congé parental, temps partiel), vous avez peut-être trop payé. La régularisation se fait via la déclaration.",
    link: "https://www.impots.gouv.fr/particulier/le-prelevement-la-source",
  },
  {
    id: "pension_invalidite",
    title: "Pension d'invalidité mal déclarée",
    description:
      "Les pensions d'invalidité sont imposables mais bénéficient d'un abattement de 10%. Vérifiez que le montant pré-rempli est correct.",
    link: "https://www.impots.gouv.fr/particulier/questions/ma-pension-dinvalidite-est-elle-imposable",
  },
  {
    id: "heures_sup",
    title: "Exonération heures supplémentaires",
    description:
      "Les heures supplémentaires sont exonérées d'impôt jusqu'à 7 500 € par an. Vérifiez que le montant est bien pré-rempli dans la bonne case.",
    link: "https://www.service-public.fr/particuliers/vosdroits/F390",
  },
];

// ─── Formulaires et cases ───
export const CASES = {
  emploi_domicile: { form: "2042-RICI", boxes: ["7DB", "7DL", "7DQ"] },
  garde_enfant: { form: "2042-RICI", boxes: ["7GA", "7GB", "7GC"] },
  don_classique: { form: "2042-RICI", boxes: ["7UF"] },
  don_aide: { form: "2042-RICI", boxes: ["7UD"] },
  don_culte: { form: "2042-RICI", boxes: ["7UF"] },
  don_politique: { form: "2042-RICI", boxes: ["7UH"] },
  syndicat: { form: "2042-RICI", boxes: ["7AC", "7AE"] },
  frais_reels: { form: "2042", boxes: ["1AK", "1BK"] },
  pension_enfant: { form: "2042", boxes: ["6EL", "6EM"] },
  pension_ascendant: { form: "2042", boxes: ["6GP", "6GU"] },
  ehpad: { form: "2042-RICI", boxes: ["7CD", "7CE"] },
  adaptation_logement: { form: "2042-RICI", boxes: ["7WJ", "7WI"] },
  borne_recharge: { form: "2042-RICI", boxes: ["7ZQ", "7ZR"] },
  teletravail: { form: "2042", boxes: ["1AK", "1BK"] },
  scolarite_college: { form: "2042-RICI", boxes: ["7EA", "7EB"] },
  scolarite_lycee: { form: "2042-RICI", boxes: ["7EC", "7ED"] },
  scolarite_superieur: { form: "2042-RICI", boxes: ["7EF", "7EG"] },
  per: { form: "2042", boxes: ["6NS", "6NT", "6NU"] },
  investissement_pme: { form: "2042-RICI", boxes: ["7CF"] },
};
