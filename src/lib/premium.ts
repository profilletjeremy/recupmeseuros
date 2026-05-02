const STORAGE_KEY = "recupmeseuros_premium";

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function setPremium(): void {
  sessionStorage.setItem(STORAGE_KEY, "true");
}

export const PREMIUM_PRICE = 49;
export const PREMIUM_FEATURES = [
  "Cases exactes à remplir sur votre déclaration",
  "Formulaires concernés (2042, 2042-RICI, etc.)",
  "Liste complète des justificatifs à conserver",
  "Liens directs vers les sources officielles",
  "Résumé PDF téléchargeable personnalisé",
  "Guide pas-à-pas pour chaque avantage détecté",
];
