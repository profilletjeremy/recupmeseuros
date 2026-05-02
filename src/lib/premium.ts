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

export const PREMIUM_TIERS = {
  essentiel: {
    price: 19,
    name: "Essentiel",
    subtitle: "L'indispensable",
    features: [
      "Cases exactes à remplir",
      "Formulaires concernés (2042, RICI...)",
      "Checklist personnalisée",
      "Liste des justificatifs",
    ],
    cta: "Débloquer pour 19 €",
  },
  complet: {
    price: 39,
    name: "Complet",
    subtitle: "Le plus populaire",
    features: [
      "Tout Essentiel +",
      "Rapport territorial complet",
      "Avantages DOM / zones tendues",
      "Guide pas-à-pas interactif",
      "PDF personnalisé téléchargeable",
      "Liens directs impots.gouv.fr",
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
      "Module frontalier (Suisse, Luxembourg...)",
      "Déclaration couple / complexe",
      "Conventions fiscales internationales",
      "Calendrier fiscal .ICS personnalisé",
      "Assistance prioritaire",
    ],
    cta: "Débloquer pour 59 €",
  },
} as const;

// Backward compat exports
export const PREMIUM_PRICE = PREMIUM_TIERS.complet.price;
export const PREMIUM_FEATURES = PREMIUM_TIERS.complet.features;
