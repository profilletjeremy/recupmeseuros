const STORAGE_KEY = "recupmeseuros_premium";
const TIER_KEY = "recupmeseuros_tier";

export type PremiumTier = "essentiel" | "complet" | "expert";

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function setPremium(tier: PremiumTier = "complet"): void {
  sessionStorage.setItem(STORAGE_KEY, "true");
  sessionStorage.setItem(TIER_KEY, tier);
}

export function getPremiumTier(): PremiumTier | null {
  if (typeof window === "undefined") return null;
  const tier = sessionStorage.getItem(TIER_KEY);
  if (tier === "essentiel" || tier === "complet" || tier === "expert") return tier;
  // Legacy users who paid before tiers → default to complet
  if (isPremium()) return "complet";
  return null;
}

/** Vérifie si le tier permet l'accès à une fonctionnalité */
export function hasTierAccess(required: PremiumTier): boolean {
  const tier = getPremiumTier();
  if (!tier) return false;
  const order: PremiumTier[] = ["essentiel", "complet", "expert"];
  return order.indexOf(tier) >= order.indexOf(required);
}

export const PREMIUM_TIERS = {
  essentiel: {
    price: 19,
    name: "Essentiel",
    subtitle: "Aperçu de votre potentiel",
    features: [
      "Nombre d'avantages détectés",
      "Estimation du gain potentiel",
      "Formulaires concernés",
      "Résumé de votre situation",
    ],
    excluded: [
      "Cases exactes à remplir",
      "Guide pas-à-pas",
      "PDF téléchargeable",
      "Boutons copier-coller",
      "Calendrier fiscal .ICS",
    ],
    cta: "Débloquer pour 19 €",
  },
  complet: {
    price: 39,
    name: "Complet",
    subtitle: "Le guide pour agir",
    features: [
      "Tout Essentiel +",
      "Cases exactes à remplir",
      "Guide pas-à-pas interactif",
      "Boutons copier-coller",
      "PDF personnalisé téléchargeable",
      "Liens directs impots.gouv.fr",
      "Calendrier fiscal .ICS",
      "Liste complète des justificatifs",
    ],
    cta: "Débloquer pour 39 €",
    popular: true,
  },
  expert: {
    price: 59,
    name: "Expert",
    subtitle: "Situations complexes",
    features: [
      "Tout Complet +",
      "Module frontalier complet",
      "Rapport territorial détaillé",
      "Conventions fiscales internationales",
      "Optimisation couple / complexe",
      "Assistance prioritaire",
    ],
    cta: "Débloquer pour 59 €",
  },
} as const;

// Backward compat exports
export const PREMIUM_PRICE = PREMIUM_TIERS.complet.price;
export const PREMIUM_FEATURES = PREMIUM_TIERS.complet.features;
