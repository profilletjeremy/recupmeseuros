import type { ProfileType } from "./types";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: string;
  sectionIcon: string;
  text: string;
  subtext?: string;
  type: "boolean" | "number" | "select" | "multi_boolean";
  field: string;
  fields?: { field: string; label: string }[];
  options?: QuestionOption[];
  placeholder?: string;
  suffix?: string;
  showIf?: (answers: Record<string, unknown>, profiles: ProfileType[]) => boolean;
  tooltip?: string;
}

export const QUESTIONS: Question[] = [
  // ─── Emploi à domicile ───
  {
    id: "emploi_domicile",
    section: "Emploi à domicile",
    sectionIcon: "🏠",
    text: "Avez-vous payé quelqu'un pour un service à domicile en 2025 ?",
    subtext: "Ménage, jardinage, garde d'enfant, soutien scolaire, bricolage, aide aux personnes...",
    type: "multi_boolean",
    field: "emploi_domicile_group",
    fields: [
      { field: "emploi_menage", label: "Femme de ménage / aide ménagère" },
      { field: "emploi_jardinage", label: "Jardinier / entretien jardin" },
      { field: "emploi_garde_domicile", label: "Garde d'enfant à domicile" },
      { field: "emploi_soutien_scolaire", label: "Soutien scolaire / cours particuliers" },
      { field: "emploi_informatique", label: "Assistance informatique" },
      { field: "emploi_bricolage", label: "Petit bricolage" },
      { field: "emploi_aide_personne", label: "Aide à une personne âgée ou handicapée" },
    ],
    tooltip: "Crédit d'impôt = 50% des sommes versées. S'applique que vous soyez actif, chômeur ou retraité.",
  },
  {
    id: "emploi_domicile_montant",
    section: "Emploi à domicile",
    sectionIcon: "🏠",
    text: "Quel montant total avez-vous dépensé en 2025 pour ces services ?",
    subtext: "Montant TTC payé, avant tout crédit d'impôt instantané éventuel.",
    type: "number",
    field: "emploi_domicile_montant",
    placeholder: "Ex : 2400",
    suffix: "€",
    showIf: (a) =>
      !!(a.emploi_menage || a.emploi_jardinage || a.emploi_garde_domicile ||
        a.emploi_soutien_scolaire || a.emploi_informatique || a.emploi_bricolage ||
        a.emploi_aide_personne),
  },

  // ─── Garde enfants ───
  {
    id: "garde_enfant",
    section: "Garde d'enfants",
    sectionIcon: "👶",
    text: "Avez-vous des enfants de moins de 6 ans gardés hors domicile ?",
    subtext: "Crèche, assistante maternelle, garderie, centre de loisirs.",
    type: "multi_boolean",
    field: "garde_group",
    fields: [
      { field: "garde_creche", label: "Crèche / micro-crèche" },
      { field: "garde_assistante_maternelle", label: "Assistante maternelle agréée" },
      { field: "garde_garderie", label: "Garderie périscolaire" },
      { field: "garde_centre_loisirs", label: "Centre de loisirs" },
    ],
    showIf: (_a, profiles) => profiles.includes("parent"),
    tooltip: "L'enfant doit avoir moins de 6 ans au 1er janvier 2025 (né après le 01/01/2019).",
  },
  {
    id: "garde_enfant_moins_6",
    section: "Garde d'enfants",
    sectionIcon: "👶",
    text: "Votre enfant avait-il moins de 6 ans au 1er janvier 2025 ?",
    subtext: "C'est-à-dire né après le 1er janvier 2019.",
    type: "boolean",
    field: "garde_enfant_moins_6",
    showIf: (a) => !!(a.garde_creche || a.garde_assistante_maternelle || a.garde_garderie || a.garde_centre_loisirs),
  },
  {
    id: "garde_montant",
    section: "Garde d'enfants",
    sectionIcon: "👶",
    text: "Quel montant total de frais de garde avez-vous payé en 2025 ?",
    subtext: "Après déduction de l'aide de la CAF (PAJE).",
    type: "number",
    field: "garde_montant",
    placeholder: "Ex : 3000",
    suffix: "€",
    showIf: (a) => a.garde_enfant_moins_6 === true,
  },

  // ─── Dons ───
  {
    id: "dons",
    section: "Dons et mécénat",
    sectionIcon: "❤️",
    text: "Avez-vous fait des dons en 2025 ?",
    type: "multi_boolean",
    field: "dons_group",
    fields: [
      { field: "don_association", label: "Association ou fondation d'intérêt général" },
      { field: "don_aide_personnes", label: "Organisme d'aide aux personnes en difficulté (Restos du Cœur, Secours populaire...)" },
      { field: "don_culte", label: "Culte ou patrimoine religieux" },
      { field: "don_parti_politique", label: "Parti politique" },
    ],
  },
  {
    id: "don_montant_classique",
    section: "Dons et mécénat",
    sectionIcon: "❤️",
    text: "Montant total des dons aux associations d'intérêt général ?",
    subtext: "Hors dons aux organismes d'aide aux personnes en difficulté.",
    type: "number",
    field: "don_montant_classique",
    placeholder: "Ex : 500",
    suffix: "€",
    showIf: (a) => !!(a.don_association || a.don_culte),
  },
  {
    id: "don_montant_aide",
    section: "Dons et mécénat",
    sectionIcon: "❤️",
    text: "Montant total des dons aux organismes d'aide aux personnes en difficulté ?",
    subtext: "Restos du Cœur, Secours populaire, Secours catholique, etc.",
    type: "number",
    field: "don_montant_aide",
    placeholder: "Ex : 200",
    suffix: "€",
    showIf: (a) => !!a.don_aide_personnes,
  },

  // ─── Syndicat ───
  {
    id: "syndicat",
    section: "Cotisation syndicale",
    sectionIcon: "✊",
    text: "Avez-vous payé une cotisation syndicale en 2025 ?",
    type: "boolean",
    field: "cotisation_syndicale",
    showIf: (_a, profiles) => profiles.includes("salarie") || profiles.includes("retraite"),
  },
  {
    id: "syndicat_montant",
    section: "Cotisation syndicale",
    sectionIcon: "✊",
    text: "Quel montant de cotisation syndicale avez-vous versé ?",
    type: "number",
    field: "cotisation_syndicale_montant",
    placeholder: "Ex : 180",
    suffix: "€",
    showIf: (a) => a.cotisation_syndicale === true,
  },

  // ─── Frais réels ───
  {
    id: "frais_km",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Combien de kilomètres faites-vous par jour (aller-retour) pour aller travailler ?",
    subtext: "Distance domicile-travail × 2. Laissez 0 si vous ne prenez pas la voiture.",
    type: "number",
    field: "frais_reels_km_aller_retour",
    placeholder: "Ex : 40",
    suffix: "km",
    showIf: (_a, profiles) => profiles.includes("salarie"),
  },
  {
    id: "frais_jours",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Combien de jours avez-vous travaillé sur site en 2025 ?",
    subtext: "Nombre de jours où vous vous êtes effectivement déplacé.",
    type: "number",
    field: "frais_reels_jours_travailles",
    placeholder: "220",
    suffix: "jours",
    showIf: (a) => (a.frais_reels_km_aller_retour as number) > 0,
  },
  {
    id: "frais_cv",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Quelle est la puissance fiscale de votre véhicule ?",
    subtext: "Indiquée sur la carte grise (rubrique P.6).",
    type: "number",
    field: "frais_reels_puissance_fiscale",
    placeholder: "Ex : 5",
    suffix: "CV",
    showIf: (a) => (a.frais_reels_km_aller_retour as number) > 0,
  },
  {
    id: "frais_electrique",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Votre véhicule est-il 100% électrique ?",
    subtext: "Les véhicules électriques bénéficient d'une majoration de 20% du barème kilométrique.",
    type: "boolean",
    field: "frais_reels_electrique",
    showIf: (a) => (a.frais_reels_km_aller_retour as number) > 0,
  },
  {
    id: "frais_repas",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Prenez-vous vos repas hors de votre domicile ?",
    subtext: "Si la distance ou vos horaires ne vous permettent pas de rentrer déjeuner.",
    type: "boolean",
    field: "frais_reels_repas",
    showIf: (_a, profiles) => profiles.includes("salarie"),
  },
  {
    id: "frais_teletravail",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Avez-vous télétravaillé en 2025 ?",
    type: "boolean",
    field: "frais_reels_teletravail",
    showIf: (_a, profiles) => profiles.includes("salarie"),
  },
  {
    id: "frais_teletravail_jours",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Combien de jours avez-vous télétravaillé en 2025 ?",
    type: "number",
    field: "frais_reels_teletravail_jours",
    placeholder: "Ex : 100",
    suffix: "jours",
    showIf: (a) => a.frais_reels_teletravail === true,
  },
  {
    id: "frais_double_residence",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Êtes-vous en situation de double résidence ?",
    subtext: "Vous et votre conjoint travaillez dans deux villes différentes et maintenez deux logements.",
    type: "boolean",
    field: "frais_reels_double_residence",
    showIf: (_a, profiles) => profiles.includes("salarie"),
  },
  {
    id: "salaire",
    section: "Frais professionnels",
    sectionIcon: "🚗",
    text: "Quel est votre salaire net imposable annuel ?",
    subtext: "Indiqué sur votre fiche de paie de décembre ou votre attestation fiscale employeur.",
    type: "number",
    field: "salaire_net_imposable",
    placeholder: "Ex : 28000",
    suffix: "€",
    showIf: (a, profiles) =>
      profiles.includes("salarie") &&
      !!((a.frais_reels_km_aller_retour as number) > 0 || a.frais_reels_repas || a.frais_reels_teletravail),
  },

  // ─── Pension alimentaire ───
  {
    id: "pension_enfant",
    section: "Pension alimentaire",
    sectionIcon: "👨‍👩‍👧",
    text: "Aidez-vous financièrement un enfant majeur non rattaché à votre foyer fiscal ?",
    subtext: "Versement régulier pour loyer, nourriture, études...",
    type: "boolean",
    field: "pension_enfant_majeur",
  },
  {
    id: "pension_ascendant",
    section: "Pension alimentaire",
    sectionIcon: "👨‍👩‍👧",
    text: "Aidez-vous financièrement un parent ou ascendant dans le besoin ?",
    subtext: "Aide financière directe ou hébergement à domicile.",
    type: "boolean",
    field: "pension_ascendant",
  },
  {
    id: "pension_montant",
    section: "Pension alimentaire",
    sectionIcon: "👨‍👩‍👧",
    text: "Quel montant total avez-vous versé en pension alimentaire en 2025 ?",
    type: "number",
    field: "pension_montant",
    placeholder: "Ex : 5000",
    suffix: "€",
    showIf: (a) => !!(a.pension_enfant_majeur || a.pension_ascendant),
  },

  // ─── EHPAD ───
  {
    id: "ehpad",
    section: "Dépendance / EHPAD",
    sectionIcon: "🏥",
    text: "Avez-vous payé des frais d'EHPAD ou d'établissement pour personne dépendante ?",
    type: "boolean",
    field: "frais_ehpad",
    showIf: (_a, profiles) => profiles.includes("aidant_familial") || profiles.includes("retraite") || profiles.includes("handicap"),
  },
  {
    id: "ehpad_montant",
    section: "Dépendance / EHPAD",
    sectionIcon: "🏥",
    text: "Quel montant de frais liés à la dépendance avez-vous payé ?",
    subtext: "Uniquement la part dépendance, pas l'hébergement.",
    type: "number",
    field: "frais_ehpad_montant",
    placeholder: "Ex : 8000",
    suffix: "€",
    showIf: (a) => a.frais_ehpad === true,
  },

  // ─── Adaptation logement ───
  {
    id: "adaptation",
    section: "Adaptation du logement",
    sectionIcon: "♿",
    text: "Avez-vous réalisé des travaux d'adaptation de votre logement en 2025 ?",
    subtext: "Pour perte d'autonomie ou handicap.",
    type: "multi_boolean",
    field: "adaptation_group",
    fields: [
      { field: "adaptation_douche", label: "Douche adaptée / remplacement baignoire" },
      { field: "adaptation_wc", label: "WC surélevé / adapté" },
      { field: "adaptation_monte_escalier", label: "Monte-escalier / élévateur" },
      { field: "adaptation_barre_appui", label: "Barres d'appui / rampes" },
      { field: "adaptation_autre", label: "Autre équipement d'accessibilité" },
    ],
    showIf: (_a, profiles) => profiles.includes("handicap") || profiles.includes("aidant_familial") || profiles.includes("retraite"),
  },
  {
    id: "adaptation_montant",
    section: "Adaptation du logement",
    sectionIcon: "♿",
    text: "Montant total des travaux d'adaptation ?",
    type: "number",
    field: "adaptation_montant",
    placeholder: "Ex : 4000",
    suffix: "€",
    showIf: (a) => !!(a.adaptation_douche || a.adaptation_wc || a.adaptation_monte_escalier || a.adaptation_barre_appui || a.adaptation_autre),
  },

  // ─── Borne de recharge ───
  {
    id: "borne",
    section: "Borne de recharge",
    sectionIcon: "⚡",
    text: "Avez-vous fait installer une borne de recharge pour véhicule électrique en 2025 ?",
    type: "boolean",
    field: "borne_recharge",
  },
  {
    id: "borne_montant",
    section: "Borne de recharge",
    sectionIcon: "⚡",
    text: "Montant de l'installation de la borne ?",
    type: "number",
    field: "borne_recharge_montant",
    placeholder: "Ex : 1200",
    suffix: "€",
    showIf: (a) => a.borne_recharge === true,
  },

  // ─── Propriétaire bailleur ───
  {
    id: "bailleur",
    section: "Revenus locatifs",
    sectionIcon: "🏢",
    text: "Quel type de location possédez-vous ?",
    type: "multi_boolean",
    field: "bailleur_group",
    fields: [
      { field: "bailleur_location_vide", label: "Location vide (revenus fonciers)" },
      { field: "bailleur_location_meublee", label: "Location meublée" },
      { field: "bailleur_lmnp", label: "LMNP (Loueur Meublé Non Professionnel)" },
    ],
    showIf: (_a, profiles) => profiles.includes("proprietaire_bailleur"),
  },
  {
    id: "bailleur_charges",
    section: "Revenus locatifs",
    sectionIcon: "🏢",
    text: "Quelles charges avez-vous payées pour votre bien locatif ?",
    type: "multi_boolean",
    field: "bailleur_charges_group",
    fields: [
      { field: "bailleur_interets_emprunt", label: "Intérêts d'emprunt" },
      { field: "bailleur_travaux", label: "Travaux de rénovation / réparation" },
      { field: "bailleur_charges_copro", label: "Charges de copropriété" },
      { field: "bailleur_assurance_pno", label: "Assurance propriétaire non-occupant (PNO)" },
    ],
    showIf: (a) => !!(a.bailleur_location_vide || a.bailleur_location_meublee || a.bailleur_lmnp),
  },

  // ─── Micro-entrepreneur ───
  {
    id: "micro_type",
    section: "Micro-entreprise",
    sectionIcon: "💼",
    text: "Quel type d'activité exercez-vous ?",
    type: "select",
    field: "micro_type_activite",
    options: [
      { value: "vente", label: "Vente de marchandises (BIC — abattement 71%)" },
      { value: "service_bic", label: "Prestations de services BIC (abattement 50%)" },
      { value: "service_bnc", label: "Professions libérales BNC (abattement 34%)" },
    ],
    showIf: (_a, profiles) => profiles.includes("micro_entrepreneur"),
  },
  {
    id: "micro_ca",
    section: "Micro-entreprise",
    sectionIcon: "💼",
    text: "Quel a été votre chiffre d'affaires en 2025 ?",
    type: "number",
    field: "micro_ca_annuel",
    placeholder: "Ex : 25000",
    suffix: "€",
    showIf: (_a, profiles) => profiles.includes("micro_entrepreneur"),
  },

  // ─── Frais de scolarité ───
  {
    id: "scolarite",
    section: "Frais de scolarité",
    sectionIcon: "🎓",
    text: "Avez-vous des enfants scolarisés à votre charge ?",
    subtext: "Une réduction forfaitaire s'applique automatiquement par enfant, même en école publique.",
    type: "multi_boolean",
    field: "scolarite_group",
    fields: [
      { field: "scolarite_college_flag", label: "Au collège" },
      { field: "scolarite_lycee_flag", label: "Au lycée" },
      { field: "scolarite_superieur_flag", label: "En études supérieures" },
    ],
    showIf: (_a, profiles) => profiles.includes("parent"),
    tooltip: "Réduction d'impôt forfaitaire : 61 € par collégien, 153 € par lycéen, 183 € par étudiant.",
  },
  {
    id: "scolarite_college_nb",
    section: "Frais de scolarité",
    sectionIcon: "🎓",
    text: "Combien d'enfants au collège ?",
    type: "number",
    field: "scolarite_college",
    placeholder: "Ex : 1",
    showIf: (a) => !!a.scolarite_college_flag,
  },
  {
    id: "scolarite_lycee_nb",
    section: "Frais de scolarité",
    sectionIcon: "🎓",
    text: "Combien d'enfants au lycée ?",
    type: "number",
    field: "scolarite_lycee",
    placeholder: "Ex : 1",
    showIf: (a) => !!a.scolarite_lycee_flag,
  },
  {
    id: "scolarite_superieur_nb",
    section: "Frais de scolarité",
    sectionIcon: "🎓",
    text: "Combien d'enfants en études supérieures ?",
    type: "number",
    field: "scolarite_superieur",
    placeholder: "Ex : 1",
    showIf: (a) => !!a.scolarite_superieur_flag,
  },

  // ─── PER ───
  {
    id: "per",
    section: "Épargne retraite (PER)",
    sectionIcon: "🏦",
    text: "Avez-vous versé sur un Plan Épargne Retraite (PER) en 2025 ?",
    subtext: "Les versements volontaires sont déductibles de votre revenu imposable.",
    type: "boolean",
    field: "per_versements",
    tooltip: "Le PER permet de déduire jusqu'à 10% de vos revenus nets (plafond ~35 000 €). L'économie dépend de votre TMI.",
  },
  {
    id: "per_montant",
    section: "Épargne retraite (PER)",
    sectionIcon: "🏦",
    text: "Quel montant total avez-vous versé sur votre PER en 2025 ?",
    subtext: "Versements volontaires uniquement (pas les versements obligatoires employeur).",
    type: "number",
    field: "per_montant",
    placeholder: "Ex : 5000",
    suffix: "€",
    showIf: (a) => a.per_versements === true,
  },

  // ─── Investissement PME ───
  {
    id: "pme",
    section: "Investissement PME",
    sectionIcon: "📈",
    text: "Avez-vous investi au capital d'une PME en 2025 ?",
    subtext: "Souscription directe ou via un fonds (FCPI, FIP).",
    type: "boolean",
    field: "investissement_pme",
  },
  {
    id: "pme_montant",
    section: "Investissement PME",
    sectionIcon: "📈",
    text: "Montant total investi au capital de PME ?",
    type: "number",
    field: "investissement_pme_montant",
    placeholder: "Ex : 10000",
    suffix: "€",
    showIf: (a) => a.investissement_pme === true,
  },

  // ─── Seniors ───
  {
    id: "senior_65",
    section: "Abattement seniors",
    sectionIcon: "👴",
    text: "Aviez-vous 65 ans ou plus au 31 décembre 2025 ?",
    subtext: "Un abattement spécial s'ajoute à l'abattement de 10% sur les pensions.",
    type: "boolean",
    field: "senior_plus_65",
    showIf: (_a, profiles) => profiles.includes("retraite"),
    tooltip: "Abattement de 2 822 € si revenu net < 17 670 €, ou 1 411 € si revenu entre 17 670 € et 28 480 €.",
  },
  {
    id: "senior_revenu",
    section: "Abattement seniors",
    sectionIcon: "👴",
    text: "Quel est votre revenu net global estimé ?",
    subtext: "Pour déterminer si vous bénéficiez de l'abattement spécial seniors.",
    type: "number",
    field: "senior_revenu_net",
    placeholder: "Ex : 15000",
    suffix: "€",
    showIf: (a) => a.senior_plus_65 === true,
  },

  // ─── Erreurs fréquentes ───
  {
    id: "vinted",
    section: "Vérifications complémentaires",
    sectionIcon: "⚠️",
    text: "Avez-vous vendu des biens sur Vinted, Leboncoin, ou loué sur Airbnb en 2025 ?",
    subtext: "Les plateformes transmettent automatiquement vos revenus au fisc.",
    type: "boolean",
    field: "revenus_vinted_leboncoin",
  },
  {
    id: "rattachement",
    section: "Vérifications complémentaires",
    sectionIcon: "⚠️",
    text: "Hésitez-vous entre rattacher un enfant majeur ou déduire une pension ?",
    subtext: "Le meilleur choix dépend de vos revenus et de la situation de l'enfant.",
    type: "boolean",
    field: "enfant_majeur_rattachement",
  },
];
