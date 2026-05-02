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
  if (answers.profiles.includes("salarie") || answers.est_salarie) {
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
    (answers.profiles.includes("micro_entrepreneur") || answers.est_micro_entrepreneur_flag) &&
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

  // ─── V. Heures supplémentaires exonérées ───
  if (answers.heures_sup_exonerees) {
    const montant = answers.heures_sup_montant || 0;
    const plafond = rules.HEURES_SUP_PLAFOND;

    opportunities.push({
      id: "heures_sup",
      title: "Exonération des heures supplémentaires",
      description: `Les heures supplémentaires sont exonérées d'impôt sur le revenu jusqu'à ${plafond.toLocaleString("fr-FR")} € par an. ${montant > plafond ? `Attention : vous dépassez le plafond de ${plafond.toLocaleString("fr-FR")} €. L'excédent de ${(montant - plafond).toLocaleString("fr-FR")} € sera imposé normalement.` : "Vérifiez que le montant est bien pré-rempli en case 1GH/1HH."} Cette exonération est normalement automatique, mais des erreurs de pré-remplissage sont fréquentes.`,
      type: "deduction",
      estimatedSaving: montant > 0 ? { min: Math.round(Math.min(montant, plafond) * 0.11), max: Math.round(Math.min(montant, plafond) * 0.30) } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.heures_sup.boxes,
      form: rules.CASES.heures_sup.form,
      justificatifs: ["Bulletins de salaire mentionnant les heures supplémentaires"],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F390",
    });

    if (montant > plafond) {
      warnings.push(`Vos heures supplémentaires (${montant.toLocaleString("fr-FR")} €) dépassent le plafond d'exonération de ${plafond.toLocaleString("fr-FR")} €. L'excédent est imposable.`);
    }
  }

  // ─── W. PFU vs barème progressif (case 2OP) ───
  if (answers.revenus_capitaux) {
    const montant = answers.revenus_capitaux_montant || 0;
    const impotPFU = Math.round(montant * rules.PFU_IR_TAUX);

    if (answers.option_bareme_2op) {
      opportunities.push({
        id: "option_2op",
        title: "Option barème progressif (case 2OP) — Revenus de capitaux",
        description: `Vous optez pour le barème progressif au lieu du PFU (flat tax 30%). Avec le PFU, l'impôt IR serait de ${impotPFU.toLocaleString("fr-FR")} € (12.8%). Si votre TMI est de 0% ou 11%, le barème est plus avantageux. Attention : l'option 2OP s'applique à TOUS vos revenus de capitaux. Vous bénéficiez aussi de l'abattement de 40% sur les dividendes au barème.`,
        type: "info",
        estimatedSaving: montant > 0 ? { min: Math.round(montant * 0.018), max: impotPFU } : null,
        confidence: "moyenne",
        boxes: [...rules.CASES.revenus_capitaux.boxes, ...rules.CASES.option_2op.boxes],
        form: rules.CASES.option_2op.form,
        justificatifs: ["IFU (Imprimé Fiscal Unique) de votre banque/courtier"],
        officialLink: "https://www.impots.gouv.fr/particulier/revenus-de-capitaux-mobiliers",
      });
    } else {
      opportunities.push({
        id: "revenus_capitaux_pfu",
        title: "Revenus de capitaux — Vérifiez PFU vs barème",
        description: `Vos revenus de capitaux (${montant.toLocaleString("fr-FR")} €) sont soumis par défaut au PFU (30% = 12.8% IR + 17.2% PS). Si votre TMI est inférieure à 12.8%, cocher la case 2OP (barème progressif) pourrait vous faire économiser. Simulez les deux options avant de déclarer.`,
        type: "info",
        estimatedSaving: null,
        confidence: "moyenne",
        boxes: rules.CASES.revenus_capitaux.boxes,
        form: rules.CASES.revenus_capitaux.form,
        justificatifs: ["IFU (Imprimé Fiscal Unique) de votre banque/courtier"],
        officialLink: "https://www.impots.gouv.fr/particulier/revenus-de-capitaux-mobiliers",
      });
    }
  }

  // ─── X. Parent isolé (case T/L) ───
  if (answers.parent_isole && (answers.profiles.includes("parent") || answers.a_enfants)) {
    opportunities.push({
      id: "parent_isole",
      title: "Demi-part supplémentaire — Parent isolé",
      description: `En tant que parent élevant seul(e) vos enfants, vous bénéficiez d'une demi-part supplémentaire de quotient familial. Cochez la case T (vous vivez seul) ou la case L (vous avez élevé seul un enfant pendant au moins 5 ans). Cette demi-part peut représenter une économie significative.`,
      type: "reduction",
      estimatedSaving: { min: 400, max: 4150 },
      confidence: "haute",
      boxes: rules.CASES.parent_isole.boxes,
      form: rules.CASES.parent_isole.form,
      justificatifs: ["Pas de justificatif à fournir — déclaration sur l'honneur"],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F2702",
    });
  }

  // ─── Y. Prime de Partage de la Valeur (PPV) ───
  if (answers.prime_partage_valeur) {
    const montant = answers.prime_partage_montant || 0;
    const plafond = rules.PPV_PLAFOND_EXONERE;

    opportunities.push({
      id: "ppv",
      title: "Prime de Partage de la Valeur — Exonération",
      description: `La PPV est exonérée d'impôt jusqu'à ${plafond.toLocaleString("fr-FR")} € (${rules.PPV_PLAFOND_ACCORD.toLocaleString("fr-FR")} € si accord d'intéressement) pour les salariés gagnant moins de 3 SMIC. ${montant > plafond ? `Votre prime de ${montant.toLocaleString("fr-FR")} € dépasse le plafond : l'excédent est imposable.` : "Vérifiez que le montant exonéré est correctement déclaré."} Depuis 2024, l'exonération fiscale est réservée aux salariés des entreprises de moins de 50 salariés.`,
      type: "deduction",
      estimatedSaving: montant > 0 ? { min: Math.round(Math.min(montant, plafond) * 0.11), max: Math.round(Math.min(montant, plafond) * 0.30) } : null,
      confidence: "moyenne",
      boxes: rules.CASES.prime_partage_valeur.boxes,
      form: rules.CASES.prime_partage_valeur.form,
      justificatifs: ["Bulletin de salaire mentionnant la PPV"],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35235",
    });
  }

  // ─── Z. Déficit foncier ───
  if (answers.bailleur_location_vide && answers.revenus_fonciers_bruts !== undefined && answers.charges_foncieres_total !== undefined) {
    const revenus = answers.revenus_fonciers_bruts;
    const charges = answers.charges_foncieres_total;
    const deficit = charges - revenus;

    if (deficit > 0) {
      const plafond = rules.DEFICIT_FONCIER_PLAFOND;
      const deductible = Math.min(deficit, plafond);
      const gainMin = Math.round(deductible * 0.11);
      const gainMax = Math.round(deductible * 0.30);

      opportunities.push({
        id: "deficit_foncier",
        title: "Déficit foncier imputable sur le revenu global",
        description: `Vos charges foncières (${charges.toLocaleString("fr-FR")} €) dépassent vos revenus fonciers (${revenus.toLocaleString("fr-FR")} €). Le déficit de ${deficit.toLocaleString("fr-FR")} € est imputable sur votre revenu global dans la limite de ${plafond.toLocaleString("fr-FR")} € par an (hors intérêts d'emprunt). L'excédent est reportable sur les revenus fonciers des 10 années suivantes. ${deficit > plafond ? `Le plafond est doublé (${rules.DEFICIT_FONCIER_PLAFOND_RENOV.toLocaleString("fr-FR")} €) si les travaux concernent la rénovation énergétique.` : ""}`,
        type: "deduction",
        estimatedSaving: { min: gainMin, max: gainMax },
        confidence: "haute",
        boxes: rules.CASES.deficit_foncier.boxes,
        form: rules.CASES.deficit_foncier.form,
        justificatifs: [
          "Déclaration 2044 détaillée",
          "Factures de travaux",
          "Tableau d'amortissement du prêt",
          "Quittances de charges",
        ],
        officialLink: "https://www.impots.gouv.fr/particulier/le-deficit-foncier",
      });
    }
  }

  // ─── AA. CSG déductible patrimoine ───
  if (answers.csg_deductible_patrimoine && answers.csg_deductible_montant) {
    const montant = answers.csg_deductible_montant;
    const gainMin = Math.round(montant * 0.11);
    const gainMax = Math.round(montant * 0.30);

    opportunities.push({
      id: "csg_deductible",
      title: "CSG déductible sur revenus du patrimoine",
      description: `La CSG payée sur vos revenus du patrimoine (revenus fonciers, plus-values, etc.) est partiellement déductible à hauteur de 6,8%. Le montant de ${montant.toLocaleString("fr-FR")} € est déductible de votre revenu global en case 6DE. Ce montant figure sur votre avis d'imposition de l'année précédente.`,
      type: "deduction",
      estimatedSaving: { min: gainMin, max: gainMax },
      confidence: "haute",
      boxes: rules.CASES.csg_deductible.boxes,
      form: rules.CASES.csg_deductible.form,
      justificatifs: ["Avis d'imposition N-1 (montant CSG déductible indiqué)"],
      officialLink: "https://www.impots.gouv.fr/particulier/questions/quest-ce-que-la-csg-deductible",
    });
  }

  // ─── AB. Pension retraite — vérification abattement 10% ───
  if (answers.profiles.includes("retraite") || answers.est_retraite) {
    opportunities.push({
      id: "verif_pension_10pct",
      title: "Vérification abattement 10% sur pensions de retraite",
      description: `Les pensions de retraite bénéficient d'un abattement automatique de 10% (min ${rules.ABATTEMENT_10_MIN} €, max ${rules.ABATTEMENT_10_MAX.toLocaleString("fr-FR")} € par foyer). Vérifiez que le montant pré-rempli de votre pension est correct et que l'abattement est bien appliqué. Les erreurs de pré-remplissage sont fréquentes, notamment en cas de cumul de plusieurs caisses de retraite.`,
      type: "info",
      estimatedSaving: null,
      confidence: "haute",
      boxes: ["1AS", "1BS"],
      form: "2042",
      justificatifs: ["Attestations fiscales de chaque caisse de retraite"],
      officialLink: "https://www.impots.gouv.fr/particulier/questions/comment-sont-imposees-les-pensions-de-retraite",
    });
  }

  // ─── AC. Prestation compensatoire ───
  if (answers.prestation_compensatoire) {
    const montant = answers.prestation_compensatoire_montant || 0;

    if (answers.prestation_compensatoire_12mois) {
      const plafond = rules.PRESTATION_COMPENSATOIRE_PLAFOND;
      const retenu = Math.min(montant, plafond);
      const reduction = Math.round(retenu * rules.PRESTATION_COMPENSATOIRE_TAUX);

      opportunities.push({
        id: "prestation_compensatoire_capital",
        title: "Réduction d'impôt — Prestation compensatoire en capital",
        description: `La prestation compensatoire versée en capital dans les 12 mois suivant le jugement ouvre droit à une réduction de 25%, plafonnée à ${plafond.toLocaleString("fr-FR")} €. Pour un versement de ${montant.toLocaleString("fr-FR")} €, la réduction estimée est de ${reduction.toLocaleString("fr-FR")} €.`,
        type: "reduction",
        estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
        confidence: montant > 0 ? "haute" : "moyenne",
        boxes: rules.CASES.prestation_compensatoire.boxes,
        form: rules.CASES.prestation_compensatoire.form,
        justificatifs: ["Jugement de divorce", "Justificatif de versement"],
        officialLink: "https://www.service-public.fr/particuliers/vosdroits/F1005",
      });
    } else {
      const gainMin = Math.round(montant * 0.11);
      const gainMax = Math.round(montant * 0.30);

      opportunities.push({
        id: "prestation_compensatoire_rente",
        title: "Déduction — Prestation compensatoire (rente ou > 12 mois)",
        description: `La prestation compensatoire versée sous forme de rente ou en capital sur plus de 12 mois est déductible comme une pension alimentaire. Montant déductible : ${montant.toLocaleString("fr-FR")} €.`,
        type: "deduction",
        estimatedSaving: montant > 0 ? { min: gainMin, max: gainMax } : null,
        confidence: montant > 0 ? "haute" : "moyenne",
        boxes: ["6GP"],
        form: "2042",
        justificatifs: ["Jugement de divorce", "Justificatifs de versements"],
        officialLink: "https://www.service-public.fr/particuliers/vosdroits/F1005",
      });
    }
  }

  // ─── AD. Pinel / Pinel+ ───
  if (answers.investissement_pinel && answers.pinel_montant && answers.pinel_duree) {
    const montant = Math.min(answers.pinel_montant, rules.PINEL_PLAFOND);
    const duree = answers.pinel_duree as "6" | "9" | "12";
    const taux = answers.pinel_type === "pinel_plus"
      ? rules.PINEL_PLUS[duree]
      : rules.PINEL_CLASSIQUE[duree];
    const reductionTotale = Math.round(montant * taux);
    const dureeNum = parseInt(duree);
    const reductionAnnuelle = Math.round(reductionTotale / dureeNum);

    opportunities.push({
      id: "pinel",
      title: `Réduction Pinel${answers.pinel_type === "pinel_plus" ? "+" : ""} — ${duree} ans`,
      description: `Investissement de ${montant.toLocaleString("fr-FR")} € en Pinel${answers.pinel_type === "pinel_plus" ? "+" : ""} sur ${duree} ans : réduction totale de ${reductionTotale.toLocaleString("fr-FR")} € (${(taux * 100).toFixed(0)}%), soit ${reductionAnnuelle.toLocaleString("fr-FR")} €/an. Le logement doit être loué nu à titre de résidence principale du locataire, à un loyer plafonné.`,
      type: "reduction",
      estimatedSaving: { min: reductionAnnuelle, max: reductionAnnuelle },
      confidence: "haute",
      boxes: rules.CASES.pinel.boxes,
      form: rules.CASES.pinel.form,
      justificatifs: [
        "Acte d'acquisition du bien",
        "Bail de location",
        "Justificatif de plafond de loyer et de ressources du locataire",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31151",
    });
  }

  // ─── AE. Denormandie ───
  if (answers.investissement_denormandie && answers.denormandie_montant) {
    const montant = Math.min(answers.denormandie_montant, rules.DENORMANDIE_PLAFOND);
    const taux = rules.DENORMANDIE_TAUX["9"]; // Taux 9 ans par défaut
    const reductionTotale = Math.round(montant * taux);
    const reductionAnnuelle = Math.round(reductionTotale / 9);

    opportunities.push({
      id: "denormandie",
      title: "Réduction Denormandie — Ancien à rénover",
      description: `Investissement de ${montant.toLocaleString("fr-FR")} € en Denormandie : réduction estimée de ${reductionAnnuelle.toLocaleString("fr-FR")} €/an sur 9 ans (mêmes taux que le Pinel). Le bien doit être dans une commune éligible, avec au moins 25% du coût total en travaux.`,
      type: "reduction",
      estimatedSaving: { min: reductionAnnuelle, max: reductionAnnuelle },
      confidence: "haute",
      boxes: rules.CASES.denormandie.boxes,
      form: rules.CASES.denormandie.form,
      justificatifs: [
        "Acte d'acquisition",
        "Factures de travaux (min 25% du coût total)",
        "Bail de location",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35011",
    });
  }

  // ─── AF. Loc'Avantages ───
  if (answers.loc_avantages && answers.loc_avantages_type) {
    const type = answers.loc_avantages_type as "loc1" | "loc2" | "loc3";
    const info = rules.LOC_AVANTAGES[type];

    opportunities.push({
      id: "loc_avantages",
      title: `Réduction Loc'Avantages — ${info.label}`,
      description: `Vous avez signé une convention Anah niveau ${info.label}. La réduction d'impôt est de ${(info.taux * 100).toFixed(0)}% des revenus bruts fonciers du bien conventionné. Plus le loyer est bas, plus la réduction est élevée. La convention dure 6 ans minimum.`,
      type: "reduction",
      estimatedSaving: null,
      confidence: "moyenne",
      boxes: rules.CASES.loc_avantages.boxes,
      form: rules.CASES.loc_avantages.form,
      justificatifs: [
        "Convention signée avec l'Anah",
        "Bail de location",
        "Avis d'imposition du locataire",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35017",
    });
  }

  // ─── AG. FIP / FCPI ───
  if (answers.investissement_fip_fcpi) {
    const montant = answers.fip_fcpi_montant || 0;
    const isOutremerCorse = answers.fip_outremer_corse || false;
    const taux = isOutremerCorse ? rules.FIP_OUTREMER_CORSE_TAUX : rules.FIP_FCPI_TAUX;
    const plafond = rules.FIP_FCPI_PLAFOND_SEUL;
    const retenu = Math.min(montant, plafond);
    const reduction = Math.round(retenu * taux);

    opportunities.push({
      id: isOutremerCorse ? "fip_outremer_corse" : "fip_fcpi",
      title: `Réduction FIP/FCPI${isOutremerCorse ? " Outre-mer/Corse" : ""}`,
      description: `Investissement de ${montant.toLocaleString("fr-FR")} € en ${isOutremerCorse ? "FIP Outre-mer/Corse" : "FIP/FCPI"}. Réduction de ${(taux * 100).toFixed(0)}%, plafonnée à ${plafond.toLocaleString("fr-FR")} € de versements (${rules.FIP_FCPI_PLAFOND_COUPLE.toLocaleString("fr-FR")} € pour un couple). Les titres doivent être conservés au moins 5 ans.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.fip_fcpi.boxes,
      form: rules.CASES.fip_fcpi.form,
      justificatifs: ["Attestation fiscale du fonds FIP/FCPI"],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31240",
    });
  }

  // ─── AH. Plus-values crypto ───
  if (answers.plus_value_crypto) {
    const montant = answers.pv_crypto_montant || 0;

    if (montant > 0) {
      const impot = Math.round(montant * rules.CRYPTO_FLAT_TAX);

      opportunities.push({
        id: "crypto",
        title: "Plus-values sur crypto-actifs",
        description: `Plus-value nette de ${montant.toLocaleString("fr-FR")} €. ${montant <= rules.CRYPTO_SEUIL_CESSION ? `Le total de vos cessions est inférieur à ${rules.CRYPTO_SEUIL_CESSION} € : vous êtes exonéré d'impôt.` : `Imposée au PFU de 30% (${impot.toLocaleString("fr-FR")} €). Vous pouvez opter pour le barème progressif (case 2OP) si votre TMI est inférieure à 12.8%.`} Chaque cession (conversion crypto → euro ou crypto → crypto) doit être déclarée via le formulaire 2086.`,
        type: "info",
        estimatedSaving: montant <= rules.CRYPTO_SEUIL_CESSION ? { min: impot, max: impot } : null,
        confidence: "haute",
        boxes: rules.CASES.crypto.boxes,
        form: rules.CASES.crypto.form,
        justificatifs: [
          "Relevé des transactions de la plateforme d'échange",
          "Formulaire 2086 (détail des cessions)",
          "Déclaration des comptes à l'étranger (formulaire 3916-bis)",
        ],
        officialLink: "https://www.impots.gouv.fr/particulier/questions/comment-declarer-mes-plus-ou-moins-values-de-cessions-dactifs-numeriques",
      });

      warnings.push(
        "N'oubliez pas de déclarer vos comptes sur les plateformes crypto étrangères (Binance, Kraken, etc.) via le formulaire 3916-bis. L'amende est de 750 € par compte non déclaré."
      );
    }
  }

  // ─── AI. Location meublée tourisme (Airbnb) ───
  if (answers.location_meuble_tourisme) {
    const revenus = answers.airbnb_revenus || 0;
    const classe = answers.airbnb_classe || false;
    const abattement = classe ? rules.AIRBNB_CLASSE_ABATTEMENT : rules.AIRBNB_MICRO_BIC_ABATTEMENT;
    const seuil = classe ? rules.AIRBNB_CLASSE_SEUIL : rules.AIRBNB_MICRO_BIC_SEUIL;
    const baseImposable = Math.round(revenus * (1 - abattement));

    opportunities.push({
      id: "airbnb",
      title: `Location meublée de tourisme${classe ? " classé" : ""}`,
      description: `Revenus locatifs de ${revenus.toLocaleString("fr-FR")} €. En micro-BIC, abattement de ${(abattement * 100).toFixed(0)}% → base imposable de ${baseImposable.toLocaleString("fr-FR")} €. ${revenus > seuil ? `Vous dépassez le seuil micro-BIC de ${seuil.toLocaleString("fr-FR")} € : passage obligatoire au régime réel.` : ""} ${!classe ? "Le classement en meublé de tourisme permettrait un abattement de 71% au lieu de 50%." : ""} Attention : obligation de déclaration en mairie et numéro d'enregistrement dans les zones tendues.`,
      type: "info",
      estimatedSaving: null,
      confidence: "haute",
      boxes: rules.CASES.airbnb.boxes,
      form: rules.CASES.airbnb.form,
      justificatifs: [
        "Relevé des revenus de la plateforme",
        "Déclaration en mairie",
        "Classement tourisme (si classé)",
      ],
      officialLink: "https://www.impots.gouv.fr/particulier/les-locations-meublees",
    });
  }

  // ─── AJ. Girardin industriel ───
  if (answers.girardin_industriel) {
    const montant = answers.girardin_montant || 0;

    opportunities.push({
      id: "girardin",
      title: "Réduction Girardin industriel / logement social",
      description: `L'investissement Girardin en Outre-mer permet une réduction d'impôt pouvant dépasser 100% du montant investi (réduction « one-shot » l'année de l'investissement). Pour ${montant.toLocaleString("fr-FR")} €, la réduction peut atteindre ${Math.round(montant * 1.1).toLocaleString("fr-FR")} à ${Math.round(montant * 1.2).toLocaleString("fr-FR")} €. Le plafond des niches Outre-mer est de ${rules.GIRARDIN_PLAFOND_OUTREMER.toLocaleString("fr-FR")} €.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: montant, max: Math.round(montant * 1.2) } : null,
      confidence: montant > 0 ? "moyenne" : "faible",
      boxes: rules.CASES.girardin.boxes,
      form: rules.CASES.girardin.form,
      justificatifs: [
        "Attestation de l'opérateur Girardin",
        "Certificat fiscal de la société de portage",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F31179",
    });
  }

  // ─── AK. Assurance-vie rachat après 8 ans ───
  if (answers.assurance_vie_rachat) {
    const gains = answers.av_rachat_montant || 0;
    const plus8ans = answers.av_duree_8ans || false;

    if (plus8ans) {
      const abattement = rules.AV_ABATTEMENT_8ANS_SEUL;
      const gainsImposables = Math.max(0, gains - abattement);
      const impotReduit = Math.round(gainsImposables * rules.AV_TAUX_PFL_8ANS);

      opportunities.push({
        id: "assurance_vie_8ans",
        title: "Assurance-vie — Fiscalité avantageuse après 8 ans",
        description: `Après 8 ans, vos gains bénéficient d'un abattement de ${abattement.toLocaleString("fr-FR")} € (${rules.AV_ABATTEMENT_8ANS_COUPLE.toLocaleString("fr-FR")} € pour un couple). Sur ${gains.toLocaleString("fr-FR")} € de gains, ${gainsImposables > 0 ? `seuls ${gainsImposables.toLocaleString("fr-FR")} € sont imposés à 7,5% (+ 17,2% PS)` : "vous êtes totalement exonéré grâce à l'abattement"}.`,
        type: "info",
        estimatedSaving: gains > 0 ? { min: Math.round(gains * 0.05), max: Math.round(abattement * 0.30) } : null,
        confidence: gains > 0 ? "haute" : "moyenne",
        boxes: rules.CASES.assurance_vie.boxes,
        form: rules.CASES.assurance_vie.form,
        justificatifs: ["Relevé fiscal de l'assureur"],
        officialLink: "https://www.service-public.fr/particuliers/vosdroits/F22414",
      });
    } else {
      opportunities.push({
        id: "assurance_vie_avant_8ans",
        title: "Assurance-vie — Rachat avant 8 ans",
        description: `Les gains de ${gains.toLocaleString("fr-FR")} € sur votre rachat sont soumis au PFU (30%) ou au barème progressif. Pas d'abattement avant 8 ans. Si possible, attendez la date anniversaire des 8 ans pour bénéficier de la fiscalité réduite.`,
        type: "info",
        estimatedSaving: null,
        confidence: "haute",
        boxes: rules.CASES.assurance_vie.boxes,
        form: rules.CASES.assurance_vie.form,
        justificatifs: ["Relevé fiscal de l'assureur"],
        officialLink: "https://www.service-public.fr/particuliers/vosdroits/F22414",
      });
    }
  }

  // ─── AL. SOFICA ───
  if (answers.investissement_sofica) {
    const montant = answers.sofica_montant || 0;
    const plafond = rules.SOFICA_PLAFOND;
    const retenu = Math.min(montant, plafond);
    const reductionMin = Math.round(retenu * rules.SOFICA_TAUX);
    const reductionMax = Math.round(retenu * rules.SOFICA_TAUX_MAJORE);

    opportunities.push({
      id: "sofica",
      title: "Réduction SOFICA — Cinéma et audiovisuel",
      description: `Investissement de ${montant.toLocaleString("fr-FR")} € en SOFICA. Réduction de 30% (36% si engagement ≥ 10 ans), plafonnée à ${plafond.toLocaleString("fr-FR")} € et 25% du revenu net global. Réduction estimée : ${reductionMin.toLocaleString("fr-FR")} à ${reductionMax.toLocaleString("fr-FR")} €. Les titres doivent être conservés au moins 5 ans.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reductionMin, max: reductionMax } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.sofica.boxes,
      form: rules.CASES.sofica.form,
      justificatifs: ["Attestation fiscale de la SOFICA"],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35172",
    });
  }

  // ─── AM. Malraux ───
  if (answers.investissement_malraux) {
    const montant = answers.malraux_montant || 0;
    const reductionMin = Math.round(montant * rules.MALRAUX_TAUX_PVAP);
    const reductionMax = Math.round(montant * rules.MALRAUX_TAUX_SPPR);

    opportunities.push({
      id: "malraux",
      title: "Réduction Malraux — Restauration en site patrimonial",
      description: `Travaux de ${montant.toLocaleString("fr-FR")} € en secteur Malraux. Réduction de 22% (PVAP) à 30% (SPPR), soit ${reductionMin.toLocaleString("fr-FR")} à ${reductionMax.toLocaleString("fr-FR")} €. Plafond de ${rules.MALRAUX_PLAFOND.toLocaleString("fr-FR")} € sur 4 ans. La Malraux n'est PAS soumise au plafonnement global des niches fiscales.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reductionMin, max: reductionMax } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.malraux.boxes,
      form: rules.CASES.malraux.form,
      justificatifs: [
        "Autorisation spéciale de travaux (ASP)",
        "Factures des travaux de restauration",
        "Attestation de conformité des travaux",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F12447",
    });
  }

  // ─── AN. Monuments Historiques ───
  if (answers.monuments_historiques) {
    const montant = answers.mh_travaux_montant || 0;
    const gainMin = Math.round(montant * 0.11);
    const gainMax = Math.round(montant * 0.45);

    opportunities.push({
      id: "monuments_historiques",
      title: "Déduction Monuments Historiques — Sans plafond",
      description: `Les travaux sur un immeuble classé Monument Historique sont déductibles intégralement de votre revenu global, sans plafond et sans limitation par le plafonnement des niches fiscales. Pour ${montant.toLocaleString("fr-FR")} € de travaux, l'économie dépend de votre TMI. Ce dispositif est réservé aux immeubles classés ou inscrits à l'inventaire.`,
      type: "deduction",
      estimatedSaving: montant > 0 ? { min: gainMin, max: gainMax } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.monuments_historiques.boxes,
      form: rules.CASES.monuments_historiques.form,
      justificatifs: [
        "Arrêté de classement ou d'inscription du bien",
        "Factures des travaux validés par l'architecte des Bâtiments de France",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F12460",
    });
  }

  // ─── AO. DEFI Forêt ───
  if (answers.investissement_foret) {
    const montant = answers.foret_montant || 0;
    const plafond = rules.DEFI_FORET_PLAFOND_SEUL;
    const retenu = Math.min(montant, plafond);
    const reduction = Math.round(retenu * rules.DEFI_FORET_TAUX_ACQUISITION);

    opportunities.push({
      id: "defi_foret",
      title: "Réduction DEFI Forêt — Investissement forestier",
      description: `Investissement forestier de ${montant.toLocaleString("fr-FR")} €. Réduction de 25%, plafonnée à ${plafond.toLocaleString("fr-FR")} € (${rules.DEFI_FORET_PLAFOND_COUPLE.toLocaleString("fr-FR")} € pour un couple). Réduction estimée : ${reduction.toLocaleString("fr-FR")} €. Inclut l'acquisition de parcelles, les travaux et les contrats d'assurance forêt.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.defi_foret.boxes,
      form: rules.CASES.defi_foret.form,
      justificatifs: [
        "Acte d'acquisition des parcelles forestières",
        "Plan simple de gestion agréé",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F10263",
    });
  }

  // ─── AP. Déduction journalistes ───
  if (answers.profession_journaliste) {
    const abattement = rules.JOURNALISTE_ABATTEMENT;

    opportunities.push({
      id: "journaliste",
      title: "Abattement fiscal — Journalistes et assimilés",
      description: `En tant que journaliste, rédacteur, photographe ou critique de presse, vous bénéficiez d'un abattement fiscal spécifique de ${abattement.toLocaleString("fr-FR")} €. Cet abattement est cumulable avec l'abattement de 10% ou les frais réels (il se substitue dans ce cas aux frais réels professionnels spécifiques). Vérifiez la case 1GA/1HA de votre déclaration.`,
      type: "deduction",
      estimatedSaving: { min: Math.round(abattement * 0.11), max: Math.round(abattement * 0.30) },
      confidence: "haute",
      boxes: rules.CASES.journaliste.boxes,
      form: rules.CASES.journaliste.form,
      justificatifs: ["Carte de presse ou attestation employeur"],
      officialLink: "https://www.impots.gouv.fr/particulier/questions/je-suis-journaliste-comment-declarer-mes-revenus",
    });
  }

  // ─── AQ. Déduction assistants maternels ───
  if (answers.profession_assistant_maternel) {
    const revenus = answers.assistant_maternel_revenus || 0;

    opportunities.push({
      id: "assistant_maternel",
      title: "Régime fiscal spécifique — Assistant(e) maternel(le)",
      description: `En tant qu'assistant(e) maternel(le) agréé(e), vous bénéficiez d'un abattement forfaitaire spécifique : 3 fois le SMIC horaire par jour et par enfant gardé. Pour des revenus de ${revenus.toLocaleString("fr-FR")} €, cet abattement peut réduire significativement votre base imposable. Comparez avec le régime général (abattement 10%) pour choisir le plus avantageux.`,
      type: "deduction",
      estimatedSaving: revenus > 0 ? { min: Math.round(revenus * 0.15), max: Math.round(revenus * 0.40) } : null,
      confidence: revenus > 0 ? "moyenne" : "faible",
      boxes: rules.CASES.assistant_maternel.boxes,
      form: rules.CASES.assistant_maternel.form,
      justificatifs: [
        "Agrément d'assistant(e) maternel(le)",
        "Relevé des jours de garde par enfant",
      ],
      officialLink: "https://www.impots.gouv.fr/particulier/questions/je-suis-assistante-maternelle-comment-declarer-mes-revenus",
    });
  }

  // ─── AR. Plus-values mobilières avec abattements ───
  if (answers.plus_value_mobiliere) {
    const montant = answers.pv_mobiliere_montant || 0;
    const duree = answers.pv_mobiliere_duree || "moins_2";
    const abattementTaux = rules.PV_MOBILIERE_ABATTEMENT[duree as keyof typeof rules.PV_MOBILIERE_ABATTEMENT];
    const abattementMontant = Math.round(montant * abattementTaux);
    const baseImposable = montant - abattementMontant;

    if (abattementTaux > 0) {
      opportunities.push({
        id: "pv_mobiliere_abattement",
        title: "Abattement pour durée de détention — Plus-values mobilières",
        description: `Plus-value de ${montant.toLocaleString("fr-FR")} € avec abattement de ${(abattementTaux * 100).toFixed(0)}% pour durée de détention (titres acquis avant 2018). Abattement : ${abattementMontant.toLocaleString("fr-FR")} €, base imposable : ${baseImposable.toLocaleString("fr-FR")} €. L'option 2OP (barème progressif) est nécessaire pour bénéficier de cet abattement — il ne s'applique pas avec le PFU.`,
        type: "deduction",
        estimatedSaving: montant > 0 ? { min: Math.round(abattementMontant * 0.11), max: Math.round(abattementMontant * 0.30) } : null,
        confidence: "haute",
        boxes: rules.CASES.pv_mobiliere.boxes,
        form: rules.CASES.pv_mobiliere.form,
        justificatifs: [
          "Relevé de cession du courtier/banque",
          "Justificatif de la date d'acquisition des titres",
        ],
        officialLink: "https://www.impots.gouv.fr/particulier/plus-values-sur-valeurs-mobilieres",
      });
    } else {
      opportunities.push({
        id: "pv_mobiliere",
        title: "Plus-values mobilières — PFU ou barème",
        description: `Plus-value de ${montant.toLocaleString("fr-FR")} €. Par défaut, imposée au PFU (30%). Si vos titres ont été acquis avant 2018 et détenus plus de 2 ans, l'option 2OP (barème) avec abattement pour durée de détention peut être plus avantageuse.`,
        type: "info",
        estimatedSaving: null,
        confidence: "moyenne",
        boxes: rules.CASES.pv_mobiliere.boxes,
        form: rules.CASES.pv_mobiliere.form,
        justificatifs: ["Relevé de cession du courtier/banque"],
        officialLink: "https://www.impots.gouv.fr/particulier/plus-values-sur-valeurs-mobilieres",
      });
    }
  }

  // ─── AS. Crédit investissement Corse ───
  if (answers.investissement_corse) {
    const montant = answers.invest_corse_montant || 0;
    const credit = Math.round(montant * rules.CREDIT_INVEST_CORSE_TAUX);

    opportunities.push({
      id: "invest_corse",
      title: "Crédit d'impôt investissement en Corse (art. 244 quater E)",
      description: `Investissement productif de ${montant.toLocaleString("fr-FR")} € en Corse. Crédit d'impôt de ${(rules.CREDIT_INVEST_CORSE_TAUX * 100).toFixed(0)}% soit ${credit.toLocaleString("fr-FR")} €. Concerne les investissements productifs neufs (matériel, équipements) réalisés en Corse par des PME.`,
      type: "credit",
      estimatedSaving: montant > 0 ? { min: credit, max: credit } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.invest_corse.boxes,
      form: rules.CASES.invest_corse.form,
      justificatifs: [
        "Factures d'investissement productif",
        "Attestation de l'expert-comptable",
      ],
      officialLink: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F37287",
    });
  }

  // ─── AT. Souscription ESUS ───
  if (answers.investissement_esus) {
    const montant = answers.esus_montant || 0;
    const plafond = rules.ESUS_PLAFOND_SEUL;
    const retenu = Math.min(montant, plafond);
    const reduction = Math.round(retenu * rules.ESUS_TAUX);

    opportunities.push({
      id: "esus",
      title: "Réduction — Souscription au capital d'une ESUS",
      description: `Investissement de ${montant.toLocaleString("fr-FR")} € dans une Entreprise Solidaire d'Utilité Sociale. Réduction de ${(rules.ESUS_TAUX * 100).toFixed(0)}%, plafonnée à ${plafond.toLocaleString("fr-FR")} € (${rules.ESUS_PLAFOND_COUPLE.toLocaleString("fr-FR")} € pour un couple). Réduction estimée : ${reduction.toLocaleString("fr-FR")} €. Les titres doivent être conservés au moins 7 ans.`,
      type: "reduction",
      estimatedSaving: montant > 0 ? { min: reduction, max: reduction } : null,
      confidence: montant > 0 ? "haute" : "moyenne",
      boxes: rules.CASES.esus.boxes,
      form: rules.CASES.esus.form,
      justificatifs: [
        "Attestation ESUS de l'entreprise",
        "Bulletin de souscription",
      ],
      officialLink: "https://www.service-public.fr/particuliers/vosdroits/F35549",
    });
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
