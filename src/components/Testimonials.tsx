const TESTIMONIALS = [
  {
    name: 'Marie-Christine T.',
    location: 'Pointe-à-Pitre, Guadeloupe',
    role: 'Propriétaire de boutique',
    text: 'Mes flyers sont arrivés en parfait état en 6 jours seulement. La qualité d\'impression dépasse ce que je trouvais localement, et le prix est très compétitif. Je recommande KaribPrint sans hésiter !',
    rating: 5,
    initial: 'M',
  },
  {
    name: 'Jean-Marc D.',
    location: 'Fort-de-France, Martinique',
    role: 'Organisateur d\'événements',
    text: 'J\'ai commandé 500 cartes de visite et 200 affiches pour notre festival. Tout est arrivé dans les délais, parfaitement emballé. Le suivi par email était très rassurant. Super service !',
    rating: 5,
    initial: 'J',
  },
  {
    name: 'Sophie L.',
    location: 'Saint-Denis, La Réunion',
    role: 'Restauratrice',
    text: 'Nos menus et cartes de visite sont d\'une qualité remarquable. Le rapport qualité/prix est imbattable et l\'équipe répond vite. Je passe désormais systématiquement par KaribPrint.',
    rating: 5,
    initial: 'S',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Ils nous font confiance
        </h2>
        <p className="text-text-light text-center mb-10 max-w-lg mx-auto">
          Des centaines de professionnels des Antilles et de La Réunion ont déjà choisi KaribPrint.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-sand rounded-3xl p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-sun fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-light leading-relaxed flex-1 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ocean text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-text-light">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
