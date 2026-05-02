import type {
  QuestionnaireAnswers,
  TaxOpportunity,
  TaxResult,
  ScoreLevel,
} from "@/data/types";
import * as rules from "@/data/taxRules2026";
import {
  getDomAbatement,
  AUTONOMOUS_TERRITORIES,
  ALSACE_MOSELLE,
  CORSE_RULES,
  isZoneTendue,
  ENCADREMENT_LOYERS_CITIES,
  getFrontalierConvention,
  DEMENAGEMENT_FISCAL,
  BORDER_COUNTRY_LABELS,
} from "@/data/territoryRules";
import { getDepartment, departmentFromPostalCode } from "@/data/departments";
import type { BorderCountry } from "@/data/departments";

/**
 * Calcule les frais kilométriques selon le barème officiel.
 */
export function calculateFraisKm(
  kmAnnuel: number,
  puissance: number,
  electrique: boolean
): number {
  const cv = Math.min(Math.max(puissance, 3), 7);
  const bareme = rules.BAREME_KM_THERMIQUE[cv];
  if (!bareme) return 0;

  let montant: number;
  if (kmAnnuel <= rules.SEUIL_KM_1) {
    montant = kmAnnuel * bareme[0].coef + bareme[0].add;
  } else if (kmAnnuel <= rules.SEUIL_KM_2) {
    montant = kmAnnuel * bareme[1].coef + bareme[1].add;
  } else {
    montant = kmAnnuel * bareme[2].coef + bareme[2].add;
  }

  if (electrique) {
    montant *= 1 + rules.MAJORATION_ELECTRIQUE;
  }

  return Math.round(montant);
}

/**
 * Calcule l'abattement forfaitaire de 10%.
 */
export function calculateAbattement10(salaireNet: number): number {
  const abattement = salaireNet * rules.ABATTEMENT_10_TAUX;
  return Math.round(
    Math.min(Math.max(abattement, rules.ABATTEMENT_10_MIN), rules.ABATTEMENT_10_MAX)
  );
}

/**
 * Moteur principal d'évaluation des opportunités fiscales.
 */
export function evaluateTaxOpportunities(
  answers: QuestionnaireAnswers
): TaxResult {
  const opportunities: TaxOpportunity[] = [];
  const warnings: string[] = [];

  // ─── A. Emploi à domicile ───
  const hasEmploiDomicile =
    answers.emploi_menage ||
    answers.emploi_jardinage ||
    answers.emploi_garde_domicile ||
    answers.emploi_soutien_scolaire ||
    answers.emploi_informatique ||
    answers.emploi_bricolage ||
    answers.emploi_aide_personne;

  if (hasEmploiDomicile) {
    const montant = answers.emploi_domicile_montant || 0;
    const plafond = rules.EMPLOI_DOMICILE_PLAFOND;
    const depenseRetenue = Math.min(montant, plafond);
    const credit = Math.round(depenseRetenue * rules.EMPLOI_DOMICILE_TAUX);

    const services: string[] = [];
    if (answers.emploi_menage) services.push("ménage");
    if (answers.emploi_jardinage) services.push("jardinage");
    if (answers.emploi_garde_domicile) services.push("garde d'enfant à domicile");
    if (answers.emploi_soutien_scolaire) services.push("soutien scolaire");
    if (answers.emploi_informatique) services.push("assistance informatique");
    if (answers.emploi_bricolage) services.push("petit bricolage");
    if (answers.emploi_aide_personne) services.push("aide à personne dépendante");

    opportunities.push({
      id: "emploi_domicile",
      title: "Crédit d'impôt emploi à domicile",
      description: `Vous avez déclaré des dépenses d'emploi à domicile (${services.join(", ")}). Vous pouvez bénéficier d'un crédit d'impôt de 50% des sommes versées, dans la limite de ${plafond.toLocaleString("fr-FR")} € par an. Certains services ont des plafonds spécifiques (jardinage : ${rules.EMPLOI_DOMICILE_PLAFOND_JARDINAGE} €, informatique : ${rules.EMPLOI_DOMICILE_PLAFOND_INFORMATIQUE} €, bricolage : ${rules.EMPLOI_DOMICILE_PLAFOND_BRICOLAGE} €).`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.emploi_domicile.boxes,
      form: rules.CASES.emploi_domicile.form,
      justificatifs: [
        "Attestation annuelle de l'organisme ou du salarié (CESU, URSSAF)",
        "Factures de l'organisme de services à la personne",
      ],
      officialLink:
        "https://www.impots.gouv.fr/particulier/emploi-domicile",
      guideLink: "/guides/emploi-a-domicile",
    });
  }

  // ─── B. Garde d'enfants hors domicile ───
  const hasGarde =
    answers.garde_creche ||
    answers.garde_assistante_maternelle ||
    answers.garde_garderie ||
    answers.garde_centre_loisirs;

  if (hasGarde && answers.garde_enfant_moins_6 !== false) {
    const montant = answers.garde_montant || 0;
    const plafond = rules.GARDE_ENFANT_PLAFOND;
    const depenseRetenue = Math.min(montant, plafond);
    const credit = Math.round(depenseRetenue * rules.GARDE_ENFANT_TAUX);

    opportunities.push({
      id: "garde_enfant",
      title: "Crédit d'impôt frais de garde",
      description: `Les frais de garde hors domicile pour enfants de moins de 6 ans ouvrent droit à un crédit d'impôt de 50%, plafonné à ${plafond.toLocaleString("fr-FR")} € par enfant. Ce plafond a été revalorisé récemment.`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.garde_enfant.boxes,
      form: rules.CASES.garde_enfant.form,
      justificatifs: [
        "Attestation fiscale de la crèche ou de l'assistante maternelle",
        "Relevé de la CAF (aide PAJE perçue à déduire)",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F8",
      guideLink: "/guides/garde-enfant",
    });

    if (answers.garde_enfant_moins_6 === undefined) {
      warnings.push(
        "Le crédit d'impôt garde d'enfants concerne uniquement les enfants de moins de 6 ans au 1er janvier 2025. Vérifiez que votre enfant remplit cette condition."
      );
    }
  }

  // ─── C. Dons ───
  if (answers.don_association || answers.don_culte) {
    const montant = answers.don_montant_classique || 0;
    const reduction = Math.round(montant * rules.DON_CLASSIQUE_TAUX);

    opportunities.push({
      id: "don_classique",
      title: "Réduction d'impôt pour dons",
      description: `Les dons aux associations d'intérêt général ouvrent droit à une réduction d'impôt de ${rules.DON_CLASSIQUE_TAUX * 100}% du montant versé, dans la limite de 20% de votre revenu imposable. L'excédent est reportable sur 5 ans.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.don_classique.boxes,
      form: rules.CASES.don_classique.form,
      justificatifs: ["Reçus fiscaux des associations"],
      officialLink:
        "https://www.impots.gouv.fr/particulier/questions/jai-fait-des-dons-une-association-que-puis-je-deduire",
      guideLink: "/guides/dons",
    });
  }

  if (answers.don_aide_personnes) {
    const montant = answers.don_montant_aide || 0;
    const plafond = rules.DON_AIDE_PLAFOND;
    const retenu = Math.min(montant, plafond);
    const reduction = Math.round(retenu * rules.DON_AIDE_TAUX);

    opportunities.push({
      id: "don_aide",
      title: "Réduction majorée — Dons aide aux personnes en difficulté",
      description: `Les dons aux organismes d'aide aux personnes en difficulté (Restos du Cœur, Secours populaire, etc.) bénéficient d'une réduction majorée à ${rules.DON_AIDE_TAUX * 100}%, dans la limite de ${plafond.toLocaleString("fr-FR")} €.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.don_aide.boxes,
      form: rules.CASES.don_aide.form,
      justificatifs: ["Reçus fiscaux des organismes"],
      officialLink:
        "https://www.impots.gouv.fr/particulier/questions/jai-fait-des-dons-une-association-que-puis-je-deduire",
      guideLink: "/guides/dons",
    });
  }

  if (answers.don_parti_politique) {
    opportunities.push({
      id: "don_politique",
      title: "Réduction d'impôt — Dons aux partis politiques",
      description:
        "Les dons aux partis politiques ouvrent droit à une réduction de 66%, plafonnée à 15 000 € de dons par an par foyer.",
      type: "reduction",
      estimatedSaving: null,
      confidence: "moyenne",
      boxes: rules.CASES.don_politique.boxes,
      form: rules.CASES.don_politique.form,
      justificatifs: ["Reçu du mandataire financier du parti"],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F427",
    });
  }

  // ─── D. Cotisation syndicale ───
  if (answers.cotisation_syndicale) {
    const montant = answers.cotisation_syndicale_montant || 0;
    const credit = Math.round(montant * rules.SYNDICAT_TAUX);

    opportunities.push({
      id: "syndicat",
      title: "Crédit d'impôt cotisation syndicale",
      description: `Les cotisations versées à un syndicat ouvrent droit à un crédit d'impôt de ${rules.SYNDICAT_TAUX * 100}% du montant, dans la limite de 1% de vos revenus.`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.syndicat.boxes,
      form: rules.CASES.syndicat.form,
      justificatifs: ["Reçu du syndicat"],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F453",
    });
  }

  // ─── E. Frais réels vs abattement 10% ───
  if (answers.profiles.includes("salarie")) {
    const km = answers.frais_reels_km_aller_retour || 0;
    const jours = answers.frais_reels_jours_travailles || 220;
    const cv = answers.frais_reels_puissance_fiscale || 5;
    const electrique = answers.frais_reels_electrique || false;
    const salaire = answers.salaire_net_imposable || 0;

    if (km > 0 || answers.frais_reels_repas || answers.frais_reels_teletravail) {
      let totalFraisReels = 0;
      const details: string[] = [];

      // Frais km
      if (km > 0) {
        const kmAnnuel = km * jours;
        const fraisKm = calculateFraisKm(kmAnnuel, cv, electrique);
        totalFraisReels += fraisKm;
        details.push(`Frais kilométriques : ${fraisKm.toLocaleString("fr-FR")} € (${kmAnnuel.toLocaleString("fr-FR")} km/an)`);
      }

      // Repas
      if (answers.frais_reels_repas) {
        const fraisRepas = Math.round(rules.REPAS_DEDUCTION_PAR_JOUR * jours);
        totalFraisReels += fraisRepas;
        details.push(`Frais de repas : ${fraisRepas.toLocaleString("fr-FR")} €`);
      }

      // Télétravail
      if (answers.frais_reels_teletravail) {
        const joursTT = answers.frais_reels_teletravail_jours || 100;
        const fraisTT = Math.min(
          Math.round(joursTT * rules.TELETRAVAIL_FORFAIT_JOUR),
          rules.TELETRAVAIL_PLAFOND_ANNUEL
        );
        totalFraisReels += fraisTT;
        details.push(`Télétravail : ${fraisTT.toLocaleString("fr-FR")} €`);
      }

      // Double résidence
      if (answers.frais_reels_double_residence) {
        details.push("Double résidence : montant à calculer selon votre situation");
        warnings.push(
          "La double résidence nécessite de justifier que votre conjoint travaille dans une autre ville. Conservez tous les justificatifs de loyer, charges, et trajets."
        );
      }

      const abattement10 = salaire > 0 ? calculateAbattement10(salaire) : 0;

      const isWorth = totalFraisReels > abattement10;

      opportunities.push({
        id: "frais_reels",
        title: isWorth
          ? "Frais réels : plus avantageux que l'abattement 10%"
          : "Frais réels : comparez avec l'abattement 10%",
        description: `${details.join(". ")}. Total frais réels estimé : ${totalFraisReels.toLocaleString("fr-FR")} €.${salaire > 0 ? ` Abattement forfaitaire 10% : ${abattement10.toLocaleString("fr-FR")} €.` : ""} ${isWorth ? "Les frais réels semblent plus avantageux dans votre cas." : salaire > 0 ? "L'abattement forfaitaire semble plus avantageux, mais vérifiez avec les montants exacts." : "Indiquez votre salaire net imposable pour comparer."}`,
        type: "deduction",
        estimatedSaving:
          isWorth && salaire > 0
            ? {
                min: Math.round((totalFraisReels - abattement10) * 0.11),
                max: Math.round((totalFraisReels - abattement10) * 0.30),
              }
            : null,
        confidence: salaire > 0 ? "haute" : "faible",
        boxes: rules.CASES.frais_reels.boxes,
        form: rules.CASES.frais_reels.form,
        justificatifs: [
          "Carte grise du véhicule",
          "Justificatif de distance domicile-travail",
          "Tickets de péage, parking",
          ...(answers.frais_reels_repas
            ? ["Justificatifs de frais de repas"]
            : []),
          ...(answers.frais_reels_teletravail
            ? ["Attestation employeur télétravail"]
            : []),
        ],
        officialLink:
          "https://www.impots.gouv.fr/particulier/frais-professionnels",
        guideLink: "/guides/frais-reels",
      });
    }
  }

  // ─── F. Pension alimentaire ───
  if (answers.pension_enfant_majeur) {
    const montant = answers.pension_montant || 0;
    const plafond = rules.PENSION_ENFANT_MAJEUR_PLAFOND;
    const retenu = Math.min(montant, plafond);
    // Gain = réduction de la base imposable × TMI estimé
    const gainMin = Math.round(retenu * 0.11);
    const gainMax = Math.round(retenu * 0.30);

    opportunities.push({
      id: "pension_enfant",
      title: "Déduction pension alimentaire — Enfant majeur",
      description: `L'aide versée à un enfant majeur non rattaché est déductible dans la limite de ${plafond.toLocaleString("fr-FR")} € par enfant. L'enfant doit déclarer cette somme de son côté. Comparez avec le rattachement fiscal.`,
      type: "deduction",
      estimatedSaving: montant > 0 ? { min: gainMin, max: gainMax } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.pension_enfant.boxes,
      form: rules.CASES.pension_enfant.form,
      justificatifs: [
        "Justificatifs des versements (virements, chèques)",
        "Justificatifs de charges de l'enfant (loyer, scolarité)",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F2633",
      guideLink: "/guides/pension-alimentaire",
    });
  }

  if (answers.pension_ascendant) {
    opportunities.push({
      id: "pension_ascendant",
      title: "Déduction pension alimentaire — Ascendant",
      description: `L'aide versée à un parent dans le besoin est déductible sans plafond fixe, mais doit correspondre aux besoins réels. Si vous hébergez un ascendant, un forfait de ${rules.PENSION_ASCENDANT_FORFAIT_HEBERGEMENT.toLocaleString("fr-FR")} € est déductible sans justificatif.`,
      type: "deduction",
      estimatedSaving: null,
      confidence: "moyenne",
      boxes: rules.CASES.pension_ascendant.boxes,
      form: rules.CASES.pension_ascendant.form,
      justificatifs: [
        "Justificatifs des versements",
        "Justificatifs des revenus de l'ascendant (avis d'imposition)",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F444",
      guideLink: "/guides/pension-alimentaire",
    });
  }

  // ─── G. EHPAD / Dépendance ───
  if (answers.frais_ehpad) {
    const montant = answers.frais_ehpad_montant || 0;
    const retenu = Math.min(montant, rules.EHPAD_PLAFOND);
    const reduction = Math.round(retenu * rules.EHPAD_TAUX);

    opportunities.push({
      id: "ehpad",
      title: "Réduction d'impôt — Frais de dépendance / EHPAD",
      description: `Les frais liés à la dépendance en EHPAD ouvrent droit à une réduction de ${rules.EHPAD_TAUX * 100}%, plafonnée à ${rules.EHPAD_PLAFOND.toLocaleString("fr-FR")} € de dépenses. Seules les dépenses de dépendance sont éligibles (pas l'hébergement).`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.ehpad.boxes,
      form: rules.CASES.ehpad.form,
      justificatifs: [
        "Attestation de l'EHPAD détaillant les frais de dépendance",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F33",
    });
  }

  // ─── H. Adaptation logement ───
  const hasAdaptation =
    answers.adaptation_douche ||
    answers.adaptation_wc ||
    answers.adaptation_monte_escalier ||
    answers.adaptation_barre_appui ||
    answers.adaptation_autre;

  if (hasAdaptation) {
    const montant = answers.adaptation_montant || 0;
    const plafond = rules.ADAPTATION_PLAFOND_SEUL;
    const retenu = Math.min(montant, plafond);
    const credit = Math.round(retenu * rules.ADAPTATION_TAUX);

    opportunities.push({
      id: "adaptation_logement",
      title: "Crédit d'impôt adaptation du logement",
      description: `Les travaux d'adaptation du logement pour perte d'autonomie ou handicap ouvrent droit à un crédit de ${rules.ADAPTATION_TAUX * 100}%, plafonné à ${plafond.toLocaleString("fr-FR")} € (${rules.ADAPTATION_PLAFOND_COUPLE.toLocaleString("fr-FR")} € pour un couple).`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.adaptation_logement.boxes,
      form: rules.CASES.adaptation_logement.form,
      justificatifs: [
        "Factures des travaux (TVA, main d'œuvre, équipements)",
        "Attestation d'éligibilité si demandée",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F10752",
    });
  }

  // ─── I. Borne de recharge ───
  if (answers.borne_recharge) {
    const montant = answers.borne_recharge_montant || 0;
    const credit = Math.min(
      Math.round(montant * rules.BORNE_TAUX),
      rules.BORNE_PLAFOND
    );

    opportunities.push({
      id: "borne_recharge",
      title: "Crédit d'impôt borne de recharge électrique",
      description: `L'installation d'une borne de recharge pour véhicule électrique ouvre droit à un crédit d'impôt de 75% des dépenses, plafonné à ${rules.BORNE_PLAFOND} € par borne. Une borne par emplacement de stationnement.`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.borne_recharge.boxes,
      form: rules.CASES.borne_recharge.form,
      justificatifs: [
        "Facture de l'installateur (certifié IRVE)",
        "Attestation de conformité",
      ],
      officialLink:
        "https://www.service-public.fr/particuliers/vosdroits/F36828",
    });
  }

  // ─── J. Propriétaire bailleur ───
  const hasBailleur =
    answers.bailleur_location_vide ||
    answers.bailleur_location_meublee ||
    answers.bailleur_lmnp;

  if (hasBailleur) {
    const deductions: string[] = [];
    if (answers.bailleur_interets_emprunt)
      deductions.push("intérêts d'emprunt");
    if (answers.bailleur_travaux) deductions.push("travaux");
    if (answers.bailleur_charges_copro)
      deductions.push("charges de copropriété");
    if (answers.bailleur_assurance_pno) deductions.push("assurance PNO");

    opportunities.push({
      id: "bailleur",
      title: "Optimisation revenus fonciers / LMNP",
      description: `En tant que propriétaire bailleur, vous pouvez potentiellement déduire : ${deductions.length > 0 ? deductions.join(", ") : "certaines charges"}. ${answers.bailleur_location_vide ? "Location vide : régime micro-foncier (30%) ou réel." : ""} ${answers.bailleur_lmnp ? "LMNP : régime micro-BIC (50%) ou réel avec amortissements." : ""} Ce sujet étant complexe, nous recommandons de consulter un comptable spécialisé.`,
      type: "deduction",
      estimatedSaving: null,
      confidence: "faible",
      boxes: ["2044", "2042-C-PRO"],
      form: answers.bailleur_location_vide ? "2044" : "2042-C-PRO",
      justificatifs: [
        "Relevé des loyers perçus",
        "Tableau d'amortissement du prêt",
        "Factures de travaux",
        "Appels de charges de copropriété",
        "Attestation assurance PNO",
      ],
      officialLink:
        "https://www.impots.gouv.fr/particulier/les-revenus-fonciers",
    });
  }

  // ─── K. Micro-entrepreneur ───
  if (
    answers.profiles.includes("micro_entrepreneur") &&
    answers.micro_ca_annuel &&
    answers.micro_type_activite
  ) {
    const ca = answers.micro_ca_annuel;
    const type = answers.micro_type_activite;
    const abattement = rules.MICRO_ABATTEMENT[type];
    const seuil = rules.MICRO_SEUIL[type];
    const baseImposable = Math.round(ca * (1 - abattement));

    opportunities.push({
      id: "micro_entrepreneur",
      title: "Régime micro-entrepreneur : vérifiez votre déclaration",
      description: `CA déclaré : ${ca.toLocaleString("fr-FR")} €. Abattement forfaitaire de ${abattement * 100}% = base imposable estimée de ${baseImposable.toLocaleString("fr-FR")} €. ${ca > seuil * 0.8 ? "Attention : vous approchez du seuil de " + seuil.toLocaleString("fr-FR") + " €." : ""} Comparez avec le régime réel si vos charges réelles dépassent l'abattement.`,
      type: "info",
      estimatedSaving: null,
      confidence: "haute",
      boxes: ["5KO", "5KP"],
      form: "2042-C-PRO",
      justificatifs: [
        "Livre des recettes",
        "Registre des achats (si vente)",
      ],
      officialLink:
        "https://www.impots.gouv.fr/professionnel/micro-entrepreneur",
    });
  }

  // ─── L. Frais de scolarité ───
  const nbCollege = answers.scolarite_college || 0;
  const nbLycee = answers.scolarite_lycee || 0;
  const nbSup = answers.scolarite_superieur || 0;
  const totalScolarite =
    nbCollege * rules.SCOLARITE_COLLEGE +
    nbLycee * rules.SCOLARITE_LYCEE +
    nbSup * rules.SCOLARITE_SUPERIEUR;

  if (totalScolarite > 0) {
    const details: string[] = [];
    if (nbCollege > 0) details.push(`${nbCollege} collégien(s) × ${rules.SCOLARITE_COLLEGE} €`);
    if (nbLycee > 0) details.push(`${nbLycee} lycéen(s) × ${rules.SCOLARITE_LYCEE} €`);
    if (nbSup > 0) details.push(`${nbSup} étudiant(s) × ${rules.SCOLARITE_SUPERIEUR} €`);

    opportunities.push({
      id: "scolarite",
      title: "Réduction d'impôt — Frais de scolarité",
      description: `Réduction forfaitaire pour enfants scolarisés à votre charge : ${details.join(", ")}. Total : ${totalScolarite} €. Cette réduction s'applique même en école publique, sans justificatif de dépenses.`,
      type: "reduction",
      estimatedSaving: { min: totalScolarite, max: totalScolarite },
      confidence: "haute",
      boxes: [
        ...(nbCollege > 0 ? rules.CASES.scolarite_college.boxes : []),
        ...(nbLycee > 0 ? rules.CASES.scolarite_lycee.boxes : []),
        ...(nbSup > 0 ? rules.CASES.scolarite_superieur.boxes : []),
      ],
      form: "2042-RICI",
      justificatifs: [
        "Certificat de scolarité de l'enfant",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F9",
    });
  }

  // ─── M. PER (Plan Épargne Retraite) ───
  if (answers.per_versements) {
    const montant = answers.per_montant || 0;
    const plafond = rules.PER_PLAFOND_MAX;
    const retenu = Math.min(montant, plafond);
    const gainMin = Math.round(retenu * 0.11);
    const gainMax = Math.round(retenu * 0.30);

    opportunities.push({
      id: "per",
      title: "Déduction PER — Plan Épargne Retraite",
      description: `Les versements volontaires sur un PER sont déductibles de votre revenu imposable, dans la limite de 10% de vos revenus nets (plafond ${plafond.toLocaleString("fr-FR")} €). Votre plafond disponible est indiqué sur votre dernier avis d'imposition. L'économie réelle dépend de votre TMI.`,
      type: "deduction",
      estimatedSaving: montant > 0 ? { min: gainMin, max: gainMax } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.per.boxes,
      form: rules.CASES.per.form,
      justificatifs: [
        "Attestation fiscale de l'organisme gestionnaire du PER",
        "Dernier avis d'imposition (plafond épargne retraite)",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F34982",
    });
  }

  // ─── N. Investissement PME ───
  if (answers.investissement_pme) {
    const montant = answers.investissement_pme_montant || 0;
    const plafond = rules.PME_PLAFOND_SEUL;
    const retenu = Math.min(montant, plafond);
    const reduction = Math.round(retenu * rules.PME_TAUX);

    opportunities.push({
      id: "investissement_pme",
      title: "Réduction d'impôt — Investissement PME (IR-PME)",
      description: `La souscription au capital de PME ouvre droit à une réduction de ${rules.PME_TAUX * 100}%, plafonnée à ${plafond.toLocaleString("fr-FR")} € de versements (${rules.PME_PLAFOND_COUPLE.toLocaleString("fr-FR")} € pour un couple). L'excédent est reportable sur 4 ans. Inclut les souscriptions directes et via FCPI/FIP.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.investissement_pme.boxes,
      form: rules.CASES.investissement_pme.form,
      justificatifs: [
        "Attestation de souscription au capital de la PME",
        "Relevé du fonds FCPI/FIP si applicable",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35549",
    });
  }

  // ─── O. Abattement spécial seniors ───
  if (answers.senior_plus_65 && answers.senior_revenu_net !== undefined) {
    const revenu = answers.senior_revenu_net;
    let abattement = 0;
    if (revenu <= rules.ABATTEMENT_SENIOR_SEUIL_1) {
      abattement = rules.ABATTEMENT_SENIOR_MONTANT_1;
    } else if (revenu <= rules.ABATTEMENT_SENIOR_SEUIL_2) {
      abattement = rules.ABATTEMENT_SENIOR_MONTANT_2;
    }

    if (abattement > 0) {
      const gainMin = Math.round(abattement * 0.11);
      const gainMax = Math.round(abattement * 0.30);

      opportunities.push({
        id: "abattement_senior",
        title: "Abattement spécial personnes âgées de 65 ans et plus",
        description: `En tant que personne de 65 ans ou plus avec un revenu net de ${revenu.toLocaleString("fr-FR")} €, vous bénéficiez d'un abattement supplémentaire de ${abattement.toLocaleString("fr-FR")} € sur votre revenu imposable. Cet abattement est normalement appliqué automatiquement, mais vérifiez qu'il apparaît bien sur votre avis.`,
        type: "deduction",
        estimatedSaving: { min: gainMin, max: gainMax },
        confidence: "haute",
        boxes: [],
        form: "2042 (automatique)",
        justificatifs: [
          "Aucun justificatif requis — abattement automatique",
        ],
        officialLink: "https://www.service-public.fr/particuliers/vosdroits/F2329",
      });
    }
  }

  // ─── P. Abattement DOM ───
  const territory = answers.territory;
  if (territory) {
    const domAbat = getDomAbatement(territory as import("@/data/departments").TerritoryType);
    if (domAbat) {
      opportunities.push({
        id: "abattement_dom",
        title: `Abattement DOM ${Math.round(domAbat.rate * 100)}%`,
        description: domAbat.description,
        type: "reduction",
        estimatedSaving: { min: Math.round(domAbat.maxAmount * 0.3), max: domAbat.maxAmount },
        confidence: "haute",
        boxes: domAbat.boxes,
        form: domAbat.form,
        justificatifs: [
          "Justificatif de domicile au 31 décembre 2025 dans le DOM",
        ],
        officialLink: domAbat.officialLink,
      });
    }

    // Territoire autonome — avertissement
    const autonome = AUTONOMOUS_TERRITORIES.find((t) =>
      t.id === territory
    );
    if (autonome) {
      warnings.push(
        `${autonome.name} : ${autonome.fiscalRegime}. ${autonome.description}`
      );
    }
  }

  // ─── Q. Alsace-Moselle ───
  const deptCode = answers.department_code || (answers.code_postal ? departmentFromPostalCode(String(answers.code_postal)) : "");
  if (deptCode && ALSACE_MOSELLE.departments.includes(deptCode)) {
    const dept = getDepartment(deptCode);
    opportunities.push({
      id: "alsace_moselle",
      title: "Régime local Alsace-Moselle",
      description: `Vous résidez en ${dept?.name || "Alsace-Moselle"}, département soumis au régime local. Cela impacte vos cotisations sociales (contribution maladie de 1,30%), vos remboursements santé (90% au lieu de 70%), et le calcul de vos jours travaillés (2 jours fériés supplémentaires).`,
      type: "info",
      estimatedSaving: null,
      confidence: "haute",
      boxes: [],
      form: "2042",
      justificatifs: [],
      officialLink: ALSACE_MOSELLE.officialLink,
    });
  }

  // ─── R. Corse — spécificités patrimoniales ───
  if (deptCode && CORSE_RULES.departments.includes(deptCode)) {
    if (hasBailleur || answers.residence_secondaire_zone_tendue) {
      opportunities.push({
        id: "corse_patrimoine",
        title: "Spécificités fiscales Corse",
        description: "La Corse bénéficie de régimes patrimoniaux et immobiliers spécifiques : exonérations successorales historiques, plafonds Pinel adaptés, crédit d'impôt investissement productif (art. 244 quater E). Consultez un notaire ou fiscaliste local.",
        type: "info",
        estimatedSaving: null,
        confidence: "moyenne",
        boxes: [],
        form: "Selon situation",
        justificatifs: [],
        officialLink: CORSE_RULES.officialLink,
      });
    }
  }

  // ─── S. Zones tendues ───
  if (deptCode && isZoneTendue(deptCode)) {
    if (answers.residence_secondaire_zone_tendue) {
      warnings.push(
        "Votre résidence secondaire est potentiellement en zone tendue. Certaines communes appliquent une surtaxe de 5% à 60% sur la taxe d'habitation des résidences secondaires. Vérifiez auprès de votre commune."
      );
    }
    if (answers.investissement_locatif_zone_tendue) {
      const hasEncadrement = ENCADREMENT_LOYERS_CITIES.some((c) =>
        answers.commune?.toLowerCase().includes(c.toLowerCase())
      );
      if (hasEncadrement) {
        warnings.push(
          `Votre bien locatif est dans une ville avec encadrement des loyers (${answers.commune}). Les loyers sont plafonnés. Vérifiez la conformité sur l'observatoire des loyers de votre ville.`
        );
      }
      warnings.push(
        "En zone tendue, la location courte durée (Airbnb) est souvent soumise à autorisation municipale et peut nécessiter un changement d'usage. Vérifiez les règles de votre commune."
      );
    }
  }

  // ─── T. Frontalier ───
  if (answers.travail_etranger && answers.pays_employeur && answers.pays_employeur !== "autre") {
    const convention = getFrontalierConvention(answers.pays_employeur as BorderCountry);
    if (convention) {
      const countryLabel = BORDER_COUNTRY_LABELS[answers.pays_employeur as BorderCountry];
      const rulesDesc = convention.rules.map((r) => `${r.title} : ${r.description}`).join("\n\n");

      opportunities.push({
        id: `frontalier_${answers.pays_employeur}`,
        title: `Convention fiscale frontalière — ${countryLabel}`,
        description: `En tant que frontalier travaillant en ${countryLabel}, des règles spécifiques s'appliquent à votre déclaration. ${convention.rules[0].description}`,
        type: "info",
        estimatedSaving: null,
        confidence: "haute",
        boxes: convention.boxes,
        form: convention.form,
        justificatifs: [
          "Attestation de résidence fiscale (formulaire 5000)",
          "Bulletins de salaire de l'employeur étranger",
          "Justificatif de jours travaillés dans chaque pays",
          "Formulaire 2047 (revenus encaissés à l'étranger)",
        ],
        officialLink: convention.officialLink,
      });

      // Alerte télétravail
      const ttJours = answers.teletravail_frontalier_jours || 0;
      if (ttJours > 0) {
        const limits: Record<string, number> = {
          suisse: 96, luxembourg: 34, belgique: 34, allemagne: 34,
        };
        const limit = limits[answers.pays_employeur];
        if (limit && ttJours > limit) {
          warnings.push(
            `Attention : vous avez télétravaillé ${ttJours} jours depuis la France. La convention ${countryLabel} tolère ${limit} jours maximum. Au-delà, les jours supplémentaires sont imposables en France. Consultez votre centre des impôts.`
          );
        }
      }
    }
  }

  // ─── U. Déménagement en cours d'année ───
  if (answers.demenagement_annee) {
    warnings.push(
      `${DEMENAGEMENT_FISCAL.rules[0].title} : ${DEMENAGEMENT_FISCAL.rules[0].description}`
    );
    // DOM ↔ métropole
    if (territory && territory !== "metropole" && territory !== "corse") {
      warnings.push(
        "Changement métropole ↔ DOM : c'est votre résidence au 31 décembre 2025 qui détermine si vous bénéficiez de l'abattement DOM. Assurez-vous que votre adresse fiscale est correcte."
      );
    }
  }

  // ─── Erreurs fréquentes ───
  if (answers.revenus_vinted_leboncoin) {
    warnings.push(
      "Vous avez indiqué des revenus de plateformes en ligne (Vinted, Leboncoin, etc.). Ces revenus peuvent être imposables si vous dépassez 30 transactions ou 2 000 € de ventes annuelles. Vérifiez sur impots.gouv.fr."
    );
  }

  if (answers.enfant_majeur_rattachement) {
    warnings.push(
      "N'oubliez pas de comparer : rattachement de l'enfant majeur (demi-part supplémentaire) vs déduction d'une pension alimentaire. Le meilleur choix dépend de vos revenus."
    );
  }

  // ─── Calcul du score ───
  const totalMin = opportunities.reduce(
    (sum, o) => sum + (o.estimatedSaving?.min || 0),
    0
  );
  const totalMax = opportunities.reduce(
    (sum, o) => sum + (o.estimatedSaving?.max || 0),
    0
  );

  let score: ScoreLevel = "faible";
  if (opportunities.length >= 4 || totalMax >= 2000) {
    score = "eleve";
  } else if (opportunities.length >= 2 || totalMax >= 500) {
    score = "moyen";
  }

  // ─── Calendrier ───
  const calendarReminders = rules.CALENDRIER_FISCAL.map((c) => ({
    date: c.date,
    label: c.label,
  }));

  return {
    score,
    totalEstimatedMin: totalMin,
    totalEstimatedMax: totalMax,
    opportunities,
    warnings,
    calendarReminders,
  };
}
