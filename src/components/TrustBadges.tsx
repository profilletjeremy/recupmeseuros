const BADGES = [
  {
    icon: '🏆',
    title: 'Qualité garantie',
    desc: 'Chaque commande est vérifiée avant expédition. Non satisfait ? Nous réimprimons.',
  },
  {
    icon: '✈️',
    title: 'Livraison express DOM',
    desc: 'Expédition aérienne vers tous les territoires d\'outre-mer. Suivi inclus.',
  },
  {
    icon: '🔒',
    title: 'Devis sans engagement',
    desc: 'Demandez votre devis gratuitement. Aucun paiement sans votre accord.',
  },
  {
    icon: '🎯',
    title: 'Spécialiste Outre-mer',
    desc: 'Experts des contraintes logistiques des DOM-COM depuis le premier jour.',
  },
];

interface Props {
  variant?: 'horizontal' | 'grid';
}

export default function TrustBadges({ variant = 'grid' }: Props) {
  if (variant === 'horizontal') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 py-4">
        {BADGES.map((b) => (
          <div key={b.title} className="flex items-center gap-2 text-sm text-text-light">
            <span className="text-xl">{b.icon}</span>
            <span className="font-medium">{b.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {BADGES.map((b) => (
        <div key={b.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <span className="text-4xl block mb-3">{b.icon}</span>
          <h3 className="font-bold text-sm mb-1">{b.title}</h3>
          <p className="text-xs text-text-light leading-relaxed">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
