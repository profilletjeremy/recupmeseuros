import { describe, it, expect } from "vitest";
import {
  evaluateTaxOpportunities,
  calculateFraisKm,
  calculateAbattement10,
} from "../engine";
import type { QuestionnaireAnswers } from "@/data/types";

function makeAnswers(
  overrides: Partial<QuestionnaireAnswers> = {}
): QuestionnaireAnswers {
  return {
    profiles: ["salarie"],
    ...overrides,
  };
}

describe("calculateFraisKm", () => {
  it("calcule correctement pour 5CV, 10000 km, thermique", () => {
    const result = calculateFraisKm(10000, 5, false);
    // 5CV, 5001-20000: coef 0.357, add 1395
    expect(result).toBe(Math.round(10000 * 0.357 + 1395));
  });

  it("calcule correctement pour petits km (< 5000)", () => {
    const result = calculateFraisKm(3000, 5, false);
    // 5CV, <= 5000: coef 0.636
    expect(result).toBe(Math.round(3000 * 0.636));
  });

  it("calcule correctement pour gros km (> 20000)", () => {
    const result = calculateFraisKm(25000, 5, false);
    // 5CV, > 20000: coef 0.427
    expect(result).toBe(Math.round(25000 * 0.427));
  });

  it("applique la majoration électrique de 20%", () => {
    const thermique = calculateFraisKm(10000, 5, false);
    const electrique = calculateFraisKm(10000, 5, true);
    expect(electrique).toBe(Math.round(thermique * 1.2));
  });

  it("plafonne la puissance fiscale à 3-7 CV", () => {
    const result = calculateFraisKm(10000, 1, false);
    // Should use CV 3
    expect(result).toBe(Math.round(10000 * 0.316 + 1065));
  });
});

describe("calculateAbattement10", () => {
  it("calcule 10% du salaire", () => {
    expect(calculateAbattement10(30000)).toBe(3000);
  });

  it("respecte le plancher de 504€", () => {
    expect(calculateAbattement10(2000)).toBe(504);
  });

  it("respecte le plafond de 14426€", () => {
    expect(calculateAbattement10(200000)).toBe(14426);
  });
});

describe("evaluateTaxOpportunities", () => {
  it("détecte le crédit emploi à domicile", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        emploi_menage: true,
        emploi_domicile_montant: 4000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "emploi_domicile");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving).toEqual({ min: 2000, max: 2000 });
    expect(opp!.boxes).toContain("7DB");
  });

  it("détecte le crédit garde enfant", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["parent"],
        garde_creche: true,
        garde_enfant_moins_6: true,
        garde_montant: 3000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "garde_enfant");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving).toEqual({ min: 1500, max: 1500 });
  });

  it("plafonne la garde enfant à 3500€", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["parent"],
        garde_creche: true,
        garde_enfant_moins_6: true,
        garde_montant: 5000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "garde_enfant");
    expect(opp!.estimatedSaving).toEqual({ min: 1750, max: 1750 });
  });

  it("détecte les dons classiques à 66%", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        don_association: true,
        don_montant_classique: 1000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "don_classique");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving).toEqual({ min: 660, max: 660 });
  });

  it("détecte les dons aide à 75% plafonnés à 2000€", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        don_aide_personnes: true,
        don_montant_aide: 3000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "don_aide");
    expect(opp).toBeDefined();
    // 75% of 2000€ cap = 1500
    expect(opp!.estimatedSaving).toEqual({ min: 1500, max: 1500 });
  });

  it("détecte la cotisation syndicale", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        cotisation_syndicale: true,
        cotisation_syndicale_montant: 300,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "syndicat");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving).toEqual({ min: 198, max: 198 });
  });

  it("compare frais réels vs abattement 10%", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        frais_reels_km_aller_retour: 60,
        frais_reels_jours_travailles: 220,
        frais_reels_puissance_fiscale: 5,
        frais_reels_electrique: false,
        frais_reels_repas: true,
        salaire_net_imposable: 30000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "frais_reels");
    expect(opp).toBeDefined();
    expect(opp!.title).toContain("plus avantageux");
  });

  it("détecte pension alimentaire enfant majeur", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        pension_enfant_majeur: true,
        pension_montant: 5000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "pension_enfant");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving!.min).toBeGreaterThan(0);
  });

  it("plafonne pension enfant à 6674€", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        pension_enfant_majeur: true,
        pension_montant: 10000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "pension_enfant");
    // Should be calculated on 6674, not 10000
    expect(opp!.estimatedSaving!.min).toBe(Math.round(6674 * 0.11));
    expect(opp!.estimatedSaving!.max).toBe(Math.round(6674 * 0.30));
  });

  it("détecte la borne de recharge", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        borne_recharge: true,
        borne_recharge_montant: 1200,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "borne_recharge");
    expect(opp).toBeDefined();
    // 75% of 1200 = 900, but capped at 500
    expect(opp!.estimatedSaving).toEqual({ min: 500, max: 500 });
  });

  it("détecte EHPAD", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["aidant_familial"],
        frais_ehpad: true,
        frais_ehpad_montant: 8000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "ehpad");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving).toEqual({ min: 2000, max: 2000 });
  });

  it("calcule le score élevé pour 4+ opportunités", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        emploi_menage: true,
        emploi_domicile_montant: 2000,
        don_association: true,
        don_montant_classique: 500,
        cotisation_syndicale: true,
        cotisation_syndicale_montant: 200,
        borne_recharge: true,
        borne_recharge_montant: 800,
      })
    );
    expect(result.score).toBe("eleve");
  });

  it("retourne un score faible sans opportunités", () => {
    const result = evaluateTaxOpportunities(makeAnswers());
    expect(result.score).toBe("faible");
    expect(result.opportunities).toHaveLength(0);
  });

  it("inclut le calendrier fiscal", () => {
    const result = evaluateTaxOpportunities(makeAnswers());
    expect(result.calendarReminders.length).toBeGreaterThan(0);
  });

  it("ajoute un warning pour revenus Vinted", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({ revenus_vinted_leboncoin: true })
    );
    expect(result.warnings.some((w) => w.includes("Vinted"))).toBe(true);
  });

  it("ajoute un warning pour rattachement enfant majeur", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({ enfant_majeur_rattachement: true })
    );
    expect(result.warnings.some((w) => w.includes("rattachement"))).toBe(true);
  });

  it("détecte micro-entrepreneur", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["micro_entrepreneur"],
        micro_type_activite: "service_bnc",
        micro_ca_annuel: 50000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "micro_entrepreneur");
    expect(opp).toBeDefined();
    // toLocaleString uses narrow no-break space (U+202F) as thousands separator
    expect(opp!.description).toContain("33");
    expect(opp!.description).toContain("000");
    expect(opp!.description).toContain("base imposable");
  });

  it("détecte les frais de scolarité", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["parent"],
        scolarite_college: 1,
        scolarite_lycee: 1,
        scolarite_superieur: 1,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "scolarite");
    expect(opp).toBeDefined();
    // 61 + 153 + 183 = 397
    expect(opp!.estimatedSaving).toEqual({ min: 397, max: 397 });
  });

  it("détecte le PER", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        per_versements: true,
        per_montant: 5000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "per");
    expect(opp).toBeDefined();
    expect(opp!.estimatedSaving!.min).toBe(Math.round(5000 * 0.11));
    expect(opp!.estimatedSaving!.max).toBe(Math.round(5000 * 0.30));
  });

  it("plafonne le PER à 35194€", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        per_versements: true,
        per_montant: 50000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "per");
    expect(opp!.estimatedSaving!.min).toBe(Math.round(35194 * 0.11));
  });

  it("détecte l'investissement PME", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        investissement_pme: true,
        investissement_pme_montant: 10000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "investissement_pme");
    expect(opp).toBeDefined();
    // 25% of 10000 = 2500
    expect(opp!.estimatedSaving).toEqual({ min: 2500, max: 2500 });
  });

  it("détecte l'abattement senior 65+", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["retraite"],
        senior_plus_65: true,
        senior_revenu_net: 15000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "abattement_senior");
    expect(opp).toBeDefined();
    // 2822€ abattement, TMI 11% to 30%
    expect(opp!.estimatedSaving!.min).toBe(Math.round(2822 * 0.11));
    expect(opp!.estimatedSaving!.max).toBe(Math.round(2822 * 0.30));
  });

  it("pas d'abattement senior si revenu > seuil", () => {
    const result = evaluateTaxOpportunities(
      makeAnswers({
        profiles: ["retraite"],
        senior_plus_65: true,
        senior_revenu_net: 30000,
      })
    );
    const opp = result.opportunities.find((o) => o.id === "abattement_senior");
    expect(opp).toBeUndefined();
  });
});
