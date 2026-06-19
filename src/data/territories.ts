export interface Territory {
  code: string;
  name: string;
  dept: string;
  deliveryDays: string;
  deliveryZone: string;
  description: string;
  cities: string[];
}

export const territories: Territory[] = [
  {
    code: 'GP',
    name: 'Guadeloupe',
    dept: '971',
    deliveryDays: '5 à 7 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Grande-Terre, Basse-Terre, Marie-Galante, Les Saintes, La Désirade',
    cities: ['Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault', 'Le Gosier', 'Petit-Bourg'],
  },
  {
    code: 'MQ',
    name: 'Martinique',
    dept: '972',
    deliveryDays: '5 à 7 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Fort-de-France, Le Robert, Schoelcher, Le Lamentin',
    cities: ['Fort-de-France', 'Le Lamentin', 'Le Robert', 'Schoelcher', 'Sainte-Marie'],
  },
  {
    code: 'GF',
    name: 'Guyane',
    dept: '973',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Cayenne, Kourou, Saint-Laurent-du-Maroni',
    cities: ['Cayenne', 'Kourou', 'Saint-Laurent-du-Maroni', 'Matoury', 'Rémire-Montjoly'],
  },
  {
    code: 'RE',
    name: 'La Réunion',
    dept: '974',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'DOM',
    description: 'Saint-Denis, Saint-Paul, Saint-Pierre, Le Tampon',
    cities: ['Saint-Denis', 'Saint-Paul', 'Saint-Pierre', 'Le Tampon', 'Saint-André'],
  },
  {
    code: 'MF',
    name: 'Saint-Martin',
    dept: '978',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'COM',
    description: 'Partie française de l\'île de Saint-Martin',
    cities: ['Marigot', 'Grand-Case', 'Quartier d\'Orléans'],
  },
  {
    code: 'BL',
    name: 'Saint-Barthélemy',
    dept: '977',
    deliveryDays: '7 à 10 jours ouvrés',
    deliveryZone: 'COM',
    description: 'Ile de Saint-Barthélemy (Saint-Barth)',
    cities: ['Gustavia', 'Saint-Jean', 'Lorient', 'Flamands'],
  },
];
