import { z } from "zod/v4";

// ─── Profils utilisateur ───
export const ProfileType = z.enum([
  "salarie",
  "retraite",
  "parent",
  "proprietaire_occupant",
  "locataire",
  "proprietaire_bailleur",
  "aidant_familial",
  "handicap",
  "micro_entrepreneur",
  "premiere_declaration",
]);
export type ProfileType = z.infer<typeof ProfileType>;

export const PROFILE_LABELS: Record<ProfileType, string> = {
  salarie: "Salarié(e)",
  retraite: "Retraité(e)",
  parent: "Parent",
  proprietaire_occupant: "Propriétaire occupant",
  locataire: "Locataire",
  proprietaire_bailleur: "Propriétaire bailleur",
  aidant_familial: "Aidant familial",
  handicap: "Personne handicapée ou perte d'autonomie",
  micro_entrepreneur: "Micro-entrepreneur / Indépendant",
  premiere_declaration: "Première déclaration (18-25 ans)",
};

// ─── Réponses questionnaire ───
export const QuestionnaireAnswers = z.object({
  profiles: z.array(ProfileType),

  // ─── Découverte (remplace la sélection manuelle de profils) ───
  est_salarie: z.boolean().optional(),
  est_retraite: z.boolean().optional(),
  est_micro_entrepreneur_flag: z.boolean().optional(),
  est_bailleur: z.boolean().optional(),
  a_revenus_financiers: z.boolean().optional(),
  a_enfants: z.boolean().optional(),
  est_premiere_declaration_flag: z.boolean().optional(),
  est_proprietaire: z.boolean().optional(),
  est_locataire_flag: z.boolean().optional(),
  est_aidant: z.boolean().optional(),
  est_handicap: z.boolean().optional(),

  // Localisation fiscale
  residence_country: z.enum(["france", "etranger"]).optional(),
  territory: z.enum([
    "metropole", "martinique", "guadeloupe", "guyane", "reunion",
    "mayotte", "corse", "polynesie", "nouvelle_caledonie",
    "saint_martin", "saint_barthelemy", "wallis_futuna",
    "saint_pierre_miquelon", "etranger",
  ]).optional(),
  department_code: z.string().optional(),
  commune: z.string().optional(),
  code_postal: z.union([z.string(), z.number()]).optional(),
  demenagement_annee: z.boolean().optional(),
  travail_etranger: z.boolean().optional(),
  pays_employeur: z.enum([
    "suisse", "luxembourg", "belgique", "allemagne",
    "espagne", "italie", "monaco", "autre",
  ]).optional(),
  jours_travailles_etranger: z.number().min(0).max(365).optional(),
  teletravail_frontalier_jours: z.number().min(0).max(365).optional(),
  residence_secondaire_zone_tendue: z.boolean().optional(),
  investissement_locatif_zone_tendue: z.boolean().optional(),

  // Emploi à domicile
  emploi_menage: z.boolean().optional(),
  emploi_jardinage: z.boolean().optional(),
  emploi_garde_domicile: z.boolean().optional(),
  emploi_soutien_scolaire: z.boolean().optional(),
  emploi_informatique: z.boolean().optional(),
  emploi_bricolage: z.boolean().optional(),
  emploi_aide_personne: z.boolean().optional(),
  emploi_domicile_montant: z.number().min(0).optional(),

  // Garde enfants
  garde_creche: z.boolean().optional(),
  garde_assistante_maternelle: z.boolean().optional(),
  garde_garderie: z.boolean().optional(),
  garde_centre_loisirs: z.boolean().optional(),
  garde_enfant_moins_6: z.boolean().optional(),
  garde_montant: z.number().min(0).optional(),

  // Dons
  don_association: z.boolean().optional(),
  don_aide_personnes: z.boolean().optional(),
  don_culte: z.boolean().optional(),
  don_parti_politique: z.boolean().optional(),
  don_montant_classique: z.number().min(0).optional(),
  don_montant_aide: z.number().min(0).optional(),
  don_montant_politique: z.number().min(0).optional(),

  // Syndicat
  cotisation_syndicale: z.boolean().optional(),
  cotisation_syndicale_montant: z.number().min(0).optional(),

  // Frais réels
  frais_reels_km_aller_retour: z.number().min(0).optional(),
  frais_reels_jours_travailles: z.number().min(0).max(365).optional(),
  frais_reels_puissance_fiscale: z.number().min(1).max(20).optional(),
  frais_reels_electrique: z.boolean().optional(),
  frais_reels_repas: z.boolean().optional(),
  frais_reels_teletravail: z.boolean().optional(),
  frais_reels_teletravail_jours: z.number().min(0).max(365).optional(),
  frais_reels_double_residence: z.boolean().optional(),
  salaire_net_imposable: z.number().min(0).optional(),

  // Pension alimentaire
  pension_enfant_majeur: z.boolean().optional(),
  pension_ascendant: z.boolean().optional(),
  pension_montant: z.number().min(0).optional(),

  // Dépendance / EHPAD
  frais_ehpad: z.boolean().optional(),
  frais_ehpad_montant: z.number().min(0).optional(),

  // Handicap / Adaptation logement
  adaptation_douche: z.boolean().optional(),
  adaptation_wc: z.boolean().optional(),
  adaptation_monte_escalier: z.boolean().optional(),
  adaptation_barre_appui: z.boolean().optional(),
  adaptation_autre: z.boolean().optional(),
  adaptation_montant: z.number().min(0).optional(),

  // Borne de recharge
  borne_recharge: z.boolean().optional(),
  borne_recharge_montant: z.number().min(0).optional(),

  // Propriétaire bailleur
  bailleur_location_vide: z.boolean().optional(),
  bailleur_location_meublee: z.boolean().optional(),
  bailleur_lmnp: z.boolean().optional(),
  bailleur_interets_emprunt: z.boolean().optional(),
  bailleur_travaux: z.boolean().optional(),
  bailleur_charges_copro: z.boolean().optional(),
  bailleur_assurance_pno: z.boolean().optional(),

  // Micro-entrepreneur
  micro_ca_annuel: z.number().min(0).optional(),
  micro_type_activite: z.enum(["vente", "service_bic", "service_bnc"]).optional(),

  // Frais de scolarité
  scolarite_college_flag: z.boolean().optional(),
  scolarite_lycee_flag: z.boolean().optional(),
  scolarite_superieur_flag: z.boolean().optional(),
  scolarite_college: z.number().min(0).max(10).optional(),
  scolarite_lycee: z.number().min(0).max(10).optional(),
  scolarite_superieur: z.number().min(0).max(10).optional(),

  // PER (Plan Épargne Retraite)
  per_versements: z.boolean().optional(),
  per_montant: z.number().min(0).optional(),

  // Investissement PME
  investissement_pme: z.boolean().optional(),
  investissement_pme_montant: z.number().min(0).optional(),

  // Seniors / Retraités
  senior_plus_65: z.boolean().optional(),
  senior_revenu_net: z.number().min(0).optional(),

  // Heures supplémentaires exonérées
  heures_sup_exonerees: z.boolean().optional(),
  heures_sup_montant: z.number().min(0).optional(),

  // Revenus de capitaux mobiliers (PFU vs barème)
  revenus_capitaux: z.boolean().optional(),
  revenus_capitaux_montant: z.number().min(0).optional(),
  option_bareme_2op: z.boolean().optional(),

  // Parent isolé
  parent_isole: z.boolean().optional(),

  // Prime de partage de la valeur (PPV)
  prime_partage_valeur: z.boolean().optional(),
  prime_partage_montant: z.number().min(0).optional(),

  // Déficit foncier
  revenus_fonciers_bruts: z.number().min(0).optional(),
  charges_foncieres_total: z.number().min(0).optional(),

  // CSG déductible sur revenus du patrimoine
  csg_deductible_patrimoine: z.boolean().optional(),
  csg_deductible_montant: z.number().min(0).optional(),

  // Prestation compensatoire (divorce)
  prestation_compensatoire: z.boolean().optional(),
  prestation_compensatoire_montant: z.number().min(0).optional(),
  prestation_compensatoire_12mois: z.boolean().optional(),

  // Investissement Pinel / Pinel+
  investissement_pinel: z.boolean().optional(),
  pinel_montant: z.number().min(0).optional(),
  pinel_type: z.enum(["pinel_classique", "pinel_plus"]).optional(),
  pinel_duree: z.enum(["6", "9", "12"]).optional(),

  // Denormandie
  investissement_denormandie: z.boolean().optional(),
  denormandie_montant: z.number().min(0).optional(),
  denormandie_duree: z.enum(["6", "9", "12"]).optional(),

  // Loc'Avantages
  loc_avantages: z.boolean().optional(),
  loc_avantages_type: z.enum(["loc1", "loc2", "loc3"]).optional(),
  loc_avantages_revenus: z.number().min(0).optional(),

  // FIP / FCPI
  investissement_fip_fcpi: z.boolean().optional(),
  fip_fcpi_montant: z.number().min(0).optional(),
  fip_outremer_corse: z.boolean().optional(),

  // Plus-values crypto
  plus_value_crypto: z.boolean().optional(),
  pv_crypto_montant: z.number().min(0).optional(),

  // Location meublée tourisme (Airbnb)
  location_meuble_tourisme: z.boolean().optional(),
  airbnb_revenus: z.number().min(0).optional(),
  airbnb_classe: z.boolean().optional(),

  // Girardin industriel / logement social
  girardin_industriel: z.boolean().optional(),
  girardin_montant: z.number().min(0).optional(),

  // Assurance-vie rachat après 8 ans
  assurance_vie_rachat: z.boolean().optional(),
  av_rachat_montant: z.number().min(0).optional(),
  av_duree_8ans: z.boolean().optional(),

  // SOFICA
  investissement_sofica: z.boolean().optional(),
  sofica_montant: z.number().min(0).optional(),

  // Malraux
  investissement_malraux: z.boolean().optional(),
  malraux_montant: z.number().min(0).optional(),

  // Monuments Historiques
  monuments_historiques: z.boolean().optional(),
  mh_travaux_montant: z.number().min(0).optional(),

  // DEFI Forêt
  investissement_foret: z.boolean().optional(),
  foret_montant: z.number().min(0).optional(),

  // Professions spécifiques
  profession_journaliste: z.boolean().optional(),
  profession_assistant_maternel: z.boolean().optional(),
  assistant_maternel_revenus: z.number().min(0).optional(),

  // Plus-values mobilières avec abattements
  plus_value_mobiliere: z.boolean().optional(),
  pv_mobiliere_montant: z.number().min(0).optional(),
  pv_mobiliere_duree: z.enum(["moins_2", "2_8", "plus_8"]).optional(),

  // Crédit investissement Corse
  investissement_corse: z.boolean().optional(),
  invest_corse_montant: z.number().min(0).optional(),

  // Souscription ESUS
  investissement_esus: z.boolean().optional(),
  esus_montant: z.number().min(0).optional(),

  // Erreurs fréquentes
  revenus_vinted_leboncoin: z.boolean().optional(),
  enfant_majeur_rattachement: z.boolean().optional(),
});
export type QuestionnaireAnswers = z.infer<typeof QuestionnaireAnswers>;

// ─── Résultats ───
export type OpportunityLevel = "info" | "credit" | "reduction" | "deduction";
export type ConfidenceLevel = "haute" | "moyenne" | "faible";
export type ScoreLevel = "faible" | "moyen" | "eleve";

export interface TaxOpportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityLevel;
  estimatedSaving: { min: number; max: number } | null;
  confidence: ConfidenceLevel;
  boxes: string[];
  form: string;
  justificatifs: string[];
  officialLink: string;
  guideLink?: string;
}

export interface TaxResult {
  score: ScoreLevel;
  totalEstimatedMin: number;
  totalEstimatedMax: number;
  opportunities: TaxOpportunity[];
  warnings: string[];
  calendarReminders: CalendarReminder[];
}

export interface CalendarReminder {
  date: string;
  label: string;
}
