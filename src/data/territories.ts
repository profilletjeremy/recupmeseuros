export interface Territory {
  code: string;
  slug: string;
  name: string;
  dept: string;
  deliveryDays: string;
  deliveryZone: string;
  description: string;
  cities: string[];
  intro: string;
  seoDescription: string;
}

export const territories: Territory[] = [
  {
    code: 'GP',
    slug: 'guadeloupe',
    name: 'Guadeloupe',
    dept: '971',
    deliveryDays: '5 à 7 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Grande-Terre, Basse-Terre, Marie-Galante, Les Saintes, La Désirade',
    cities: ['Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault', 'Le Gosier', 'Petit-Bourg'],
    intro: 'KaribPrint livre vos impressions en Guadeloupe en 5 à 7 jours ouvrés. Cartes de visite, flyers, affiches et banderoles expédiés par voie aérienne directement à votre adresse.',
    seoDescription: 'Imprimerie en ligne Guadeloupe 971 — Cartes de visite, flyers, affiches. Livraison express 5-7 jours. Devis gratuit sous 24h.',
  },
  {
    code: 'MQ',
    slug: 'martinique',
    name: 'Martinique',
    dept: '972',
    deliveryDays: '5 à 7 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Fort-de-France, Le Robert, Schoelcher, Le Lamentin',
    cities: ['Fort-de-France', 'Le Lamentin', 'Le Robert', 'Schoelcher', 'Sainte-Marie'],
    intro: 'Imprimerie professionnelle pour la Martinique. KaribPrint vous livre en 5 à 7 jours ouvrés tous vos supports de communication imprimés à Fort-de-France, Le Lamentin ou partout en Martinique.',
    seoDescription: 'Imprimerie en ligne Martinique 972 — Flyers, cartes de visite, affiches. Livraison 5-7 jours ouvrés. Devis gratuit.',
  },
  {
    code: 'GF',
    slug: 'guyane',
    name: 'Guyane',
    dept: '973',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Cayenne, Kourou, Saint-Laurent-du-Maroni',
    cities: ['Cayenne', 'Kourou', 'Saint-Laurent-du-Maroni', 'Matoury', 'Rémire-Montjoly'],
    intro: 'Livraison de vos impressions en Guyane en 7 à 10 jours ouvrés. KaribPrint propose une gamme complète de supports imprimés pour les entreprises et commerçants de Cayenne, Kourou et Saint-Laurent.',
    seoDescription: 'Imprimerie en ligne Guyane 973 — Cartes de visite, flyers, affiches. Livraison 7-10 jours. Devis gratuit.',
  },
  {
    code: 'RE',
    slug: 'la-reunion',
    name: 'La Réunion',
    dept: '974',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Saint-Denis, Saint-Paul, Saint-Pierre, Le Tampon',
    cities: ['Saint-Denis', 'Saint-Paul', 'Saint-Pierre', 'Le Tampon', 'Saint-André'],
    intro: 'KaribPrint livre vos impressions à La Réunion en 7 à 10 jours ouvrés. Qualité professionnelle pour vos cartes de visite, flyers et affiches, livrés à domicile ou en entreprise à Saint-Denis et partout dans l\'île.',
    seoDescription: 'Imprimerie en ligne La Réunion 974 — Cartes de visite, flyers, affiches. Livraison 7-10 jours. Devis gratuit sous 24h.',
  },
  {
    code: 'MF',
    slug: 'saint-martin',
    name: 'Saint-Martin',
    dept: '978',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'COM',
    description: 'Partie française de l\'île de Saint-Martin',
    cities: ['Marigot', 'Grand-Case', 'Quartier d\'Orléans'],
    intro: 'Imprimerie en ligne pour Saint-Martin. KaribPrint livre vos supports imprimés à Marigot et partout dans la partie française de Saint-Martin en 7 à 10 jours ouvrés.',
    seoDescription: 'Imprimerie en ligne Saint-Martin 978 — Cartes de visite, flyers, affiches. Livraison 7-10 jours. Devis gratuit.',
  },
  {
    code: 'BL',
    slug: 'saint-barthelemy',
    name: 'Saint-Barthélemy',
    dept: '977',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'COM',
    description: 'Ile de Saint-Barthélemy (Saint-Barth)',
    cities: ['Gustavia', 'Saint-Jean', 'Lorient', 'Flamands'],
    intro: 'Livraison de vos impressions à Saint-Barthélemy en 7 à 10 jours ouvrés. Cartes de visite luxe, menus de restaurant, affiches et supports événementiels livrés directement à Gustavia ou Saint-Jean.',
    seoDescription: 'Imprimerie en ligne Saint-Barthélemy 977 — Cartes de visite, menus, affiches. Livraison 7-10 jours. Devis gratuit.',
  },
];

export function getTerritoryBySlug(slug: string): Territory | undefined {
  return territories.find((t) => t.slug === slug);
}

export function getTerritoryByCode(code: string): Territory | undefined {
  return territories.find((t) => t.code === code);
}
