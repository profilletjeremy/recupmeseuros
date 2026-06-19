import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFeaturedProducts, categories } from '@/data/products';
import { territories } from '@/data/territories';

const HOW_IT_WORKS = [
  {
    step: '01',
    emoji: '🖼️',
    title: 'Choisissez votre produit',
    text: 'Cartes de visite, flyers, affiches, banderoles... Sélectionnez le support qui correspond à votre besoin.',
  },
  {
    step: '02',
    emoji: '🎨',
    title: 'Envoyez votre fichier',
    text: 'Téléchargez votre fichier PDF, AI ou PSD prêt à l\'impression. Notre équipe vérifie la qualité.',
  },
  {
    step: '03',
    emoji: '🚚',
    title: 'Recevez votre commande',
    text: 'Votre impression est expédiée directement en Guadeloupe, Martinique, Guyane, La Réunion et plus.',
  },
];

const ADVANTAGES = [
  {
    emoji: '🏝️',
    title: 'Spécialiste Outre-mer',
    text: 'Nous connaissons les contraintes logistiques des DOM-COM et adaptons nos services pour une livraison fiable dans tous les territoires.',
  },
  {
    emoji: '✅',
    title: 'Qualité professionnelle',
    text: 'Impression offset et numérique haute résolution, papiers haut de gamme, couleurs fidèles à vos maquettes.',
  },
  {
    emoji: '⚡',
    title: 'Délais respectés',
    text: 'Votre commande est imprimée en 2-3 jours ouvrés, puis expédiée vers votre île. Suivi en temps réel.',
  },
  {
    emoji: '💬',
    title: 'Conseil personnalisé',
    text: 'Notre équipe vous accompagne dans le choix des supports, formats et finitions adaptés à votre projet.',
  },
];

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section
          className="relative overflow-hidden text-white py-20 md:py-32"
          style={{
            background: 'linear-gradient(135deg, #0077B6 0%, #005F8E 40%, #003F5C 100%)',
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: '#F9C74F' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: '#E94B3C' }}
          />

          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              🌊 Livraison dans 6 territoires d&apos;outre-mer
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Imprimez. Livrez.
              <br />
              <span style={{ color: '#F9C74F' }}>Aux Antilles.</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Cartes de visite, flyers, affiches, banderoles et bien plus — impression professionnelle
              livrée en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produits"
                className="inline-flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
              >
                Voir nos produits →
              </Link>
              <Link
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-all"
              >
                Comment ça marche
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { value: '500+', label: 'Produits' },
                { value: '6', label: 'Territoires' },
                { value: '48h', label: 'Impression' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold" style={{ color: '#F9C74F' }}>{stat.value}</p>
                  <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Territory bar */}
        <section className="bg-sand-dark border-b border-sand-dark py-5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <span className="text-sm font-semibold text-text-light">Nous livrons dans :</span>
              {territories.map((t) => (
                <Link
                  key={t.code}
                  href={`/livraison#${t.code.toLowerCase()}`}
                  className="flex items-center gap-1.5 text-sm text-text-light hover:text-ocean font-medium transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-palm inline-block" />
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Tout ce qu&apos;il vous faut pour communiquer
            </h2>
            <p className="text-text-light text-center mb-10 max-w-xl mx-auto">
              Des supports d&apos;impression professionnels pour tous vos besoins marketing et communication.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produits?categorie=${cat.id}`}
                  className="group flex flex-col items-center gap-3 bg-sand rounded-2xl p-5 hover:bg-ocean hover:text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-center text-text group-hover:text-white transition-colors">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="comment-ca-marche" className="py-16 bg-sand">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Commander en 3 étapes
            </h2>
            <p className="text-text-light text-center mb-12 max-w-lg mx-auto">
              Simple, rapide et livré directement sur votre île.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="relative text-center">
                  <div className="w-16 h-16 rounded-2xl bg-ocean text-white flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg">
                    {step.emoji}
                  </div>
                  <span className="absolute top-0 right-1/2 translate-x-20 -translate-y-1 w-7 h-7 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-light text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-ocean text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-ocean-dark transition-colors shadow-md"
              >
                Commencer ma commande →
              </Link>
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Nos produits phares</h2>
                <p className="text-text-light">Les plus commandés par nos clients des Antilles</p>
              </div>
              <Link href="/produits" className="hidden sm:inline-flex items-center gap-1 text-ocean font-semibold hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Product image placeholder */}
                  <div
                    className="h-44 flex items-center justify-center text-6xl"
                    style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #F5E8DC 100%)' }}
                  >
                    {product.emoji}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-bold mt-1 mb-1 group-hover:text-ocean transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-light line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ocean">
                        À partir de {product.priceFrom.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="text-xs text-palm font-semibold">
                        ✓ Livré aux Antilles
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/produits" className="inline-flex items-center gap-1 text-ocean font-semibold hover:underline">
                Voir tous les produits →
              </Link>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16 bg-sand">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Pourquoi choisir KaribPrint ?
            </h2>
            <p className="text-text-light text-center mb-12 max-w-lg mx-auto">
              La première imprimerie en ligne pensée pour les Antilles et La Réunion.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ADVANTAGES.map((adv) => (
                <div key={adv.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <span className="text-4xl mb-4 block">{adv.emoji}</span>
                  <h3 className="font-bold mb-2">{adv.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{adv.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Territories section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              6 territoires desservis
            </h2>
            <p className="text-text-light text-center mb-10 max-w-lg mx-auto">
              KaribPrint livre dans tous les territoires francophones d&apos;outre-mer.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {territories.map((t) => (
                <Link
                  key={t.code}
                  href={`/livraison#${t.code.toLowerCase()}`}
                  className="group flex gap-4 items-start bg-sand rounded-2xl p-5 hover:bg-ocean hover:text-white transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-ocean group-hover:bg-white/20 flex items-center justify-center text-white font-bold flex-shrink-0 transition-colors">
                    {t.dept}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-white transition-colors">{t.name}</h3>
                    <p className="text-xs text-text-light group-hover:text-blue-200 transition-colors mt-0.5">
                      🚚 {t.deliveryDays}
                    </p>
                    <p className="text-xs text-text-lighter group-hover:text-blue-300 transition-colors mt-1 line-clamp-1">
                      {t.cities.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section
          className="py-20 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #E94B3C 0%, #C43A2D 100%)' }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à booster votre communication ?
            </h2>
            <p className="text-red-100 mb-8 text-lg">
              Commandez en ligne et recevez votre commande directement sur votre île.
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-white text-coral font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 hover:bg-sand"
            >
              Découvrir tous nos produits →
            </Link>
            <p className="text-red-200 text-sm mt-5">
              Livraison garantie • Qualité professionnelle • Service client réactif
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
