export interface ProductFormat {
  label: string;
  dimensions: string;
}

export interface PricingTier {
  quantity: number;
  price: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  longDescription: string;
  priceFrom: number;
  quantities: number[];
  pricingTiers: PricingTier[];
  formats: ProductFormat[];
  paperTypes: string[];
  finishes: string[];
  deliveryDays: string;
  featured: boolean;
  popular: boolean;
  emoji: string;
  /** Realisaprint product ID — set once confirmed with supplier */
  realisaprintProductId?: string;
  /** Realisaprint stock/configuration ID */
  realisaprintStock?: string;
}

export const categories = [
  { id: 'communication', label: 'Communication', emoji: '📣' },
  { id: 'affichage', label: 'Affichage', emoji: '🖼️' },
  { id: 'evenementiel', label: 'Événementiel', emoji: '🎉' },
  { id: 'papeterie', label: 'Papeterie', emoji: '📄' },
  { id: 'packaging', label: 'Packaging', emoji: '📦' },
  { id: 'goodies', label: 'Goodies', emoji: '🎁' },
];

export const products: Product[] = [
  {
    id: 'cartes-visite',
    slug: 'cartes-de-visite',
    name: 'Cartes de visite',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Cartes de visite professionnelles en quadrichromie sur papier 350g/m²',
    longDescription: 'Faites une première impression mémorable avec nos cartes de visite haut de gamme. Disponibles en finition brillante, matte ou soft-touch, elles reflètent le professionnalisme de votre entreprise. Impression recto-verso possible.',
    priceFrom: 14.90,
    quantities: [100, 250, 500, 1000, 2000],
    pricingTiers: [
      { quantity: 100, price: 14.90 },
      { quantity: 250, price: 24.90, isPopular: true },
      { quantity: 500, price: 34.90 },
      { quantity: 1000, price: 49.90, isBestValue: true },
      { quantity: 2000, price: 79.90 },
    ],
    formats: [
      { label: 'Standard', dimensions: '85 × 54 mm' },
      { label: 'Carré', dimensions: '55 × 55 mm' },
      { label: 'Mini', dimensions: '70 × 28 mm' },
    ],
    paperTypes: ['Couché brillant 350g', 'Couché mat 350g', 'Soft-touch 400g'],
    finishes: ['Standard', 'Vernis sélectif', 'Pelliculage brillant', 'Pelliculage mat'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: true,
    popular: true,
    emoji: '🪪',
  },
  {
    id: 'flyers',
    slug: 'flyers-tracts',
    name: 'Flyers & Tracts',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Flyers quadrichromie recto-verso, idéaux pour vos promotions et événements',
    longDescription: 'Les flyers sont l\'outil de communication le plus efficace pour toucher rapidement votre audience locale. Impression quadrichromie haute résolution recto-verso sur papier couché. Parfaits pour promouvoir vos offres, événements et services.',
    priceFrom: 24.90,
    quantities: [250, 500, 1000, 2500, 5000],
    pricingTiers: [
      { quantity: 250, price: 24.90 },
      { quantity: 500, price: 34.90, isPopular: true },
      { quantity: 1000, price: 49.90 },
      { quantity: 2500, price: 89.90, isBestValue: true },
      { quantity: 5000, price: 149.90 },
    ],
    formats: [
      { label: 'A6', dimensions: '105 × 148 mm' },
      { label: 'A5', dimensions: '148 × 210 mm' },
      { label: 'A4', dimensions: '210 × 297 mm' },
      { label: 'DL', dimensions: '99 × 210 mm' },
    ],
    paperTypes: ['Couché brillant 135g', 'Couché brillant 170g', 'Couché mat 150g'],
    finishes: ['Standard'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: true,
    popular: true,
    emoji: '📋',
  },
  {
    id: 'affiches',
    slug: 'affiches-posters',
    name: 'Affiches & Posters',
    category: 'affichage',
    categoryLabel: 'Affichage',
    description: 'Affiches grand format quadrichromie pour vitrine, bureau ou événement',
    longDescription: 'Donnez de la visibilité à votre communication avec nos affiches haut de gamme. Impression numérique haute résolution sur papier photo satiné ou mat. Idéales pour la décoration intérieure, les vitrines commerciales et les événements.',
    priceFrom: 12.90,
    quantities: [1, 5, 10, 25, 50, 100],
    pricingTiers: [
      { quantity: 1, price: 12.90 },
      { quantity: 5, price: 39.90 },
      { quantity: 10, price: 64.90, isPopular: true },
      { quantity: 25, price: 119.90, isBestValue: true },
      { quantity: 50, price: 199.90 },
      { quantity: 100, price: 329.90 },
    ],
    formats: [
      { label: 'A4', dimensions: '210 × 297 mm' },
      { label: 'A3', dimensions: '297 × 420 mm' },
      { label: 'A2', dimensions: '420 × 594 mm' },
      { label: 'A1', dimensions: '594 × 841 mm' },
      { label: 'A0', dimensions: '841 × 1189 mm' },
    ],
    paperTypes: ['Papier photo satiné 200g', 'Papier mat 200g', 'Bâche PVC (extérieur)'],
    finishes: ['Standard', 'Pelliculage brillant', 'Pelliculage mat'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: true,
    popular: false,
    emoji: '🎨',
  },
  {
    id: 'banderoles',
    slug: 'banderoles',
    name: 'Banderoles',
    category: 'affichage',
    categoryLabel: 'Affichage',
    description: 'Banderoles PVC résistantes aux intempéries pour l\'extérieur',
    longDescription: 'Nos banderoles en PVC 440g/m² sont conçues pour résister aux conditions climatiques tropicales. Oeillets de fixation inclus. Impression UV haute résolution pour des couleurs éclatantes même en plein soleil. Idéales pour les événements, commerces et annonces publicitaires.',
    priceFrom: 35.90,
    quantities: [1, 2, 5, 10],
    pricingTiers: [
      { quantity: 1, price: 35.90 },
      { quantity: 2, price: 59.90, isPopular: true },
      { quantity: 5, price: 119.90, isBestValue: true },
      { quantity: 10, price: 199.90 },
    ],
    formats: [
      { label: '1 × 0,5 m', dimensions: '1000 × 500 mm' },
      { label: '1,5 × 0,5 m', dimensions: '1500 × 500 mm' },
      { label: '2 × 0,5 m', dimensions: '2000 × 500 mm' },
      { label: '2 × 1 m', dimensions: '2000 × 1000 mm' },
      { label: '3 × 1 m', dimensions: '3000 × 1000 mm' },
    ],
    paperTypes: ['PVC 440g/m² (extérieur)'],
    finishes: ['Oeillets inclus'],
    deliveryDays: '7 à 10 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '🚩',
  },
  {
    id: 'rollup',
    slug: 'roll-up-kakemono',
    name: 'Roll-up / Kakémono',
    category: 'evenementiel',
    categoryLabel: 'Événementiel',
    description: 'Présentoirs enroulables avec structure aluminium, idéaux pour salons et boutiques',
    longDescription: 'Nos roll-ups (kakémonos) offrent un support de communication élégant et pratique pour vos salons, conférences et points de vente. La structure en aluminium est légère et solide. Le visuel en bâche polyester se range facilement dans la cassette de protection fournie.',
    priceFrom: 79.90,
    quantities: [1, 2, 5, 10],
    pricingTiers: [
      { quantity: 1, price: 79.90 },
      { quantity: 2, price: 139.90, isPopular: true },
      { quantity: 5, price: 299.90, isBestValue: true },
      { quantity: 10, price: 499.90 },
    ],
    formats: [
      { label: '60 × 160 cm', dimensions: '600 × 1600 mm' },
      { label: '85 × 200 cm', dimensions: '850 × 2000 mm' },
      { label: '100 × 200 cm', dimensions: '1000 × 2000 mm' },
    ],
    paperTypes: ['Bâche polyester 180g/m²'],
    finishes: ['Structure aluminium incluse', 'Sac de transport inclus'],
    deliveryDays: '7 à 10 jours ouvrés',
    featured: true,
    popular: false,
    emoji: '📌',
  },
  {
    id: 'brochures',
    slug: 'brochures-depliants',
    name: 'Brochures & Dépliants',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Dépliants 2 ou 3 volets, brochures agrafées, pour présenter vos produits et services',
    longDescription: 'Présentez votre entreprise, vos produits ou vos services avec élégance grâce à nos brochures et dépliants. Disponibles en format 2 volets, 3 volets ou brochure agrafée multi-pages. Impression quadrichromie sur papier couché de qualité.',
    priceFrom: 29.90,
    quantities: [100, 250, 500, 1000],
    pricingTiers: [
      { quantity: 100, price: 29.90 },
      { quantity: 250, price: 59.90, isPopular: true },
      { quantity: 500, price: 99.90 },
      { quantity: 1000, price: 169.90, isBestValue: true },
    ],
    formats: [
      { label: 'Dépliant A4 → 2 volets A5', dimensions: '420 × 297 mm plié en 2' },
      { label: 'Dépliant A4 → 3 volets DL', dimensions: '420 × 297 mm plié en 3' },
      { label: 'Brochure A5 8 pages', dimensions: '148 × 210 mm, 4 feuillets agrafés' },
      { label: 'Brochure A4 8 pages', dimensions: '210 × 297 mm, 4 feuillets agrafés' },
    ],
    paperTypes: ['Couché brillant 135g', 'Couché mat 150g'],
    finishes: ['Standard'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '📚',
  },
  {
    id: 'papeterie',
    slug: 'papeterie-entreprise',
    name: 'Papeterie d\'entreprise',
    category: 'papeterie',
    categoryLabel: 'Papeterie',
    description: 'En-têtes de lettre, enveloppes, chemises et tampons à l\'image de votre marque',
    longDescription: 'Renforcez l\'image professionnelle de votre entreprise avec une papeterie cohérente et personnalisée. Entêtes de lettre, enveloppes à fenêtre, chemises cartonnées et tampons encreurs — tout ce qu\'il faut pour une correspondance commerciale impeccable.',
    priceFrom: 19.90,
    quantities: [100, 250, 500, 1000],
    pricingTiers: [
      { quantity: 100, price: 19.90 },
      { quantity: 250, price: 39.90, isPopular: true },
      { quantity: 500, price: 64.90 },
      { quantity: 1000, price: 109.90, isBestValue: true },
    ],
    formats: [
      { label: 'En-tête A4', dimensions: '210 × 297 mm' },
      { label: 'Enveloppe DL', dimensions: '110 × 220 mm' },
      { label: 'Enveloppe C4', dimensions: '229 × 324 mm' },
      { label: 'Chemise A4', dimensions: '240 × 320 mm' },
    ],
    paperTypes: ['Offset 80g', 'Offset 90g', 'Couché brillant 135g'],
    finishes: ['Standard'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '✉️',
  },
  {
    id: 'autocollants',
    slug: 'autocollants-stickers',
    name: 'Autocollants & Stickers',
    category: 'packaging',
    categoryLabel: 'Packaging',
    description: 'Stickers et étiquettes adhésives en vinyle ou papier, découpe standard ou à la forme',
    longDescription: 'Nos autocollants et stickers sont imprimés sur vinyle ou papier adhésif de haute qualité, résistants à l\'humidité tropicale et aux UV. Découpe carrée, ronde, ovale ou à la forme de votre visuel. Idéaux pour vos produits, packaging et décorations.',
    priceFrom: 19.90,
    quantities: [100, 250, 500, 1000, 2000],
    pricingTiers: [
      { quantity: 100, price: 19.90 },
      { quantity: 250, price: 34.90 },
      { quantity: 500, price: 54.90, isPopular: true },
      { quantity: 1000, price: 89.90, isBestValue: true },
      { quantity: 2000, price: 149.90 },
    ],
    formats: [
      { label: 'Carré 5×5 cm', dimensions: '50 × 50 mm' },
      { label: 'Rond Ø 5 cm', dimensions: 'Ø 50 mm' },
      { label: 'Ovale 7×5 cm', dimensions: '70 × 50 mm' },
      { label: 'Personnalisé', dimensions: 'À la forme' },
    ],
    paperTypes: ['Vinyle blanc brillant', 'Vinyle transparent', 'Papier brillant'],
    finishes: ['Standard', 'Résistant UV'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: false,
    popular: true,
    emoji: '🏷️',
  },
  {
    id: 'cartes-postales',
    slug: 'cartes-postales',
    name: 'Cartes postales',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Cartes postales personnalisées sur papier couché brillant ou mat 350g',
    longDescription: 'Communiquez avec style grâce à nos cartes postales personnalisées. Impression recto-verso quadrichromie sur papier couché épais 350g/m². Idéales pour les offres promotionnelles, invitations, remerciements ou souvenirs touristiques des Antilles.',
    priceFrom: 29.90,
    quantities: [100, 250, 500, 1000],
    pricingTiers: [
      { quantity: 100, price: 29.90 },
      { quantity: 250, price: 54.90, isPopular: true },
      { quantity: 500, price: 89.90 },
      { quantity: 1000, price: 149.90, isBestValue: true },
    ],
    formats: [
      { label: 'A6', dimensions: '105 × 148 mm' },
      { label: 'A5', dimensions: '148 × 210 mm' },
    ],
    paperTypes: ['Couché brillant 350g', 'Couché mat 350g'],
    finishes: ['Standard', 'Pelliculage brillant'],
    deliveryDays: '5 à 7 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '💌',
  },
  {
    id: 'calendriers',
    slug: 'calendriers',
    name: 'Calendriers',
    category: 'goodies',
    categoryLabel: 'Goodies',
    description: 'Calendriers personnalisés muraux, de bureau ou chevalet, à vos couleurs',
    longDescription: 'Offrez à vos clients un cadeau utile avec votre calendrier personnalisé. Présent toute l\'année dans les bureaux et domiciles, c\'est un support de communication à fort rendement. Disponible en format mural, bureau ou chevalet, en version 13 feuillets ou 7 feuillets.',
    priceFrom: 89.90,
    quantities: [50, 100, 250, 500],
    pricingTiers: [
      { quantity: 50, price: 89.90 },
      { quantity: 100, price: 149.90, isPopular: true },
      { quantity: 250, price: 299.90, isBestValue: true },
      { quantity: 500, price: 499.90 },
    ],
    formats: [
      { label: 'Mural 13 feuillets A3', dimensions: '297 × 420 mm' },
      { label: 'Mural 7 feuillets A3', dimensions: '297 × 420 mm' },
      { label: 'Bureau chevalet A5', dimensions: '148 × 210 mm' },
    ],
    paperTypes: ['Couché brillant 170g', 'Couché mat 170g'],
    finishes: ['Spirale métal', 'Carte de couverture 350g incluse'],
    deliveryDays: '7 à 10 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '📅',
  },
  {
    id: 'tshirts',
    slug: 'tshirts-personnalises',
    name: 'T-shirts personnalisés',
    category: 'goodies',
    categoryLabel: 'Goodies',
    description: 'T-shirts 100% coton sérigraphiés ou imprimés numériquement avec votre logo',
    longDescription: 'Habiller votre équipe ou récompenser vos clients avec des t-shirts personnalisés de qualité. Impression numérique directe (DTG) ou sérigraphie selon les quantités. Disponible en différentes couleurs et tailles. 100% coton peigné.',
    priceFrom: 12.90,
    quantities: [10, 25, 50, 100, 250],
    pricingTiers: [
      { quantity: 10, price: 129.00 },
      { quantity: 25, price: 287.50, isPopular: true },
      { quantity: 50, price: 545.00 },
      { quantity: 100, price: 990.00, isBestValue: true },
      { quantity: 250, price: 2225.00 },
    ],
    formats: [
      { label: 'S', dimensions: '' },
      { label: 'M', dimensions: '' },
      { label: 'L', dimensions: '' },
      { label: 'XL', dimensions: '' },
      { label: 'XXL', dimensions: '' },
    ],
    paperTypes: ['Coton 180g/m²', 'Coton bio 190g/m²'],
    finishes: ['Impression numérique (DTG)', 'Sérigraphie (dès 50 pcs)'],
    deliveryDays: '10 à 15 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '👕',
  },
  {
    id: 'mugs',
    slug: 'mugs-personnalises',
    name: 'Mugs personnalisés',
    category: 'goodies',
    categoryLabel: 'Goodies',
    description: 'Mugs céramique 330ml personnalisés, résistants au lave-vaisselle',
    longDescription: 'Des mugs céramique 330ml de qualité professionnelle, imprimés en sublimation pour des couleurs vives et durables. Résistants au lave-vaisselle. Idéaux comme cadeaux d\'entreprise ou de promotion. Emballage individuel disponible.',
    priceFrom: 8.90,
    quantities: [25, 50, 100, 250],
    pricingTiers: [
      { quantity: 25, price: 222.50 },
      { quantity: 50, price: 410.00, isPopular: true },
      { quantity: 100, price: 750.00, isBestValue: true },
      { quantity: 250, price: 1725.00 },
    ],
    formats: [
      { label: 'Mug classique 330ml', dimensions: 'Ø 82 mm × H 93 mm' },
      { label: 'Mug magic (thermo)', dimensions: 'Ø 82 mm × H 93 mm' },
    ],
    paperTypes: ['Céramique blanche'],
    finishes: ['Sublimation HD', 'Emballage individuel (option)'],
    deliveryDays: '7 à 10 jours ouvrés',
    featured: false,
    popular: false,
    emoji: '☕',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.popular);
}
