const TESTIMONIALS = [
  {
    name: 'Marie-Christine T.',
    location: 'Pointe-à-Pitre, Guadeloupe',
    role: 'Propriétaire de boutique',
    product: 'Flyers A5',
    text: 'Mes flyers sont arrivés en parfait état en 6 jours. La qualité dépasse ce que je trouvais localement, et le prix est très compétitif. Je recommande sans hésiter !',
    rating: 5,
    initials: 'MC',
    color: '#0077B6',
  },
  {
    name: 'Jean-Marc D.',
    location: 'Fort-de-France, Martinique',
    role: 'Organisateur d\'événements',
    product: 'Cartes de visite + Affiches',
    text: 'Commande passée le lundi, tout reçu le vendredi suivant. Parfaitement emballé, aucun dégât. Le suivi par email était très rassurant. Super service, je reviens !',
    rating: 5,
    initials: 'JM',
    color: '#E94B3C',
  },
  {
    name: 'Sophie L.',
    location: 'Saint-Denis, La Réunion',
    role: 'Restauratrice',
    product: 'Menus & Cartes de visite',
    text: 'Nos menus et cartes de visite sont d\'une qualité remarquable. Rapport qualité/prix imbattable et l\'équipe répond vite. Je passe désormais systématiquement par KaribPrint.',
    rating: 5,
    initials: 'SL',
    color: '#43AA8B',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? 'text-sun fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 bg-sand">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-ocean uppercase tracking-widest mb-2 block">Avis clients</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ils nous font confiance</h2>
          <p className="text-text-light max-w-lg mx-auto">
            Des centaines de professionnels des Antilles et de La Réunion ont déjà choisi KaribPrint.
          </p>
          {/* Global rating */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100 mt-5">
            <div>
              <p className="text-3xl font-bold text-ocean leading-none">5.0</p>
              <p className="text-xs text-text-lighter mt-0.5">/ 5</p>
            </div>
            <div>
              <Stars count={5} />
              <p className="text-xs text-text-lighter mt-1">Basé sur 120+ avis</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-6 flex flex-col shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Stars + product */}
              <div className="flex items-center justify-between mb-4">
                <Stars count={t.rating} />
                <span className="text-[10px] font-bold bg-sand text-text-light px-2.5 py-1 rounded-full border border-sand-dark">
                  {t.product}
                </span>
              </div>

              {/* Quote */}
              <div className="relative flex-1">
                <svg className="absolute -top-1 -left-1 w-6 h-6 text-ocean/20 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm text-text-light leading-relaxed italic pl-4">
                  {t.text}
                </p>
              </div>

              {/* Author */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}CC 100%)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-text-lighter">{t.role}</p>
                  <p className="text-xs text-ocean font-medium">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
