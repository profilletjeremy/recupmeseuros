import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes — KaribPrint',
  description: 'Toutes les réponses à vos questions sur l\'impression, la livraison, les fichiers et les tarifs KaribPrint pour les Antilles et La Réunion.',
};

const FAQ_SECTIONS = [
  {
    title: 'Commande et tarifs',
    icon: '💳',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Choisissez votre produit dans notre catalogue, sélectionnez le format, la quantité et les options souhaitées, puis cliquez sur "Demander un devis gratuit". Notre équipe vous répond sous 24h ouvrées avec une confirmation de prix et les instructions pour téléverser votre fichier.',
      },
      {
        q: 'Les prix affichés incluent-ils la TVA ?',
        a: 'Oui, tous les prix affichés sont TTC (toutes taxes comprises). Les frais de livraison sont calculés séparément en fonction de votre territoire et du poids du colis.',
      },
      {
        q: 'Puis-je bénéficier de tarifs dégressifs ?',
        a: 'Absolument ! Plus vous commandez, moins vous payez par exemplaire. Chaque fiche produit affiche un tableau de tarifs dégressifs. Pour un devis personnalisé sur de grandes quantités, contactez-nous directement.',
      },
      {
        q: 'Proposez-vous des remises pour les associations et administrations ?',
        a: 'Oui, nous proposons des tarifs préférentiels pour les associations loi 1901, les collectivités et les administrations. Contactez-nous pour obtenir un devis adapté à votre situation.',
      },
      {
        q: 'Puis-je modifier ou annuler une commande ?',
        a: 'Toute modification ou annulation doit être demandée avant le lancement en impression. Une fois votre fichier validé et la commande lancée, il n\'est plus possible d\'annuler. Contactez-nous le plus vite possible en cas de problème.',
      },
    ],
  },
  {
    title: 'Fichiers et conception',
    icon: '🎨',
    questions: [
      {
        q: 'Quels formats de fichier acceptez-vous ?',
        a: 'Nous acceptons les fichiers PDF, AI (Adobe Illustrator), EPS, PSD (Photoshop), TIFF et INDD (InDesign). Le format PDF haute résolution (PDF/X-4 ou PDF/X-1a) est recommandé. Consultez notre guide de préparation de fichiers pour plus de détails.',
      },
      {
        q: 'Quelle résolution minimum pour mon fichier ?',
        a: 'La résolution minimum est de 300 dpi (points par pouce) à la taille d\'impression finale. Pour les impressions grand format (affiches, banderoles), 150 dpi à la taille finale peuvent suffire. En dessous de 200 dpi, vous risquez une impression floue.',
      },
      {
        q: 'Qu\'est-ce que le fond perdu (bleed) ?',
        a: 'Le fond perdu est une zone de sécurité de 3mm de chaque côté de votre document qui s\'étend au-delà du format final. Elle permet d\'éviter les liserés blancs lors de la découpe. Exemple : pour un flyer A5 (148×210mm), votre fichier doit mesurer 154×216mm.',
      },
      {
        q: 'En mode CMJN ou RVB ?',
        a: 'Impérativement en mode CMJN (Cyan, Magenta, Jaune, Noir) pour l\'impression. Si votre fichier est en RVB, nous le convertissons automatiquement, mais cela peut entraîner un léger décalage des couleurs, notamment pour les couleurs vives. Nous recommandons vivement de travailler directement en CMJN.',
      },
      {
        q: 'Proposez-vous un service de création graphique ?',
        a: 'Nous ne proposons pas directement de création graphique, mais nous pouvons vous recommander des graphistes partenaires spécialisés dans la communication pour les Antilles. Contactez-nous pour en savoir plus.',
      },
      {
        q: 'Comment convertir mes textes en courbes ?',
        a: 'Dans Illustrator : Sélectionnez tout (Ctrl+A) > Texte > Vectoriser. Dans InDesign : exportez en PDF en cochant "Incorporer les polices". Cela évite les problèmes de police manquante lors de l\'impression.',
      },
    ],
  },
  {
    title: 'Livraison',
    icon: '🚚',
    questions: [
      {
        q: 'Dans quels territoires livrez-vous ?',
        a: 'KaribPrint livre en Guadeloupe (971), Martinique (972), Guyane (973), La Réunion (974), Saint-Martin (978) et Saint-Barthélemy (977). Nous ne livrons pas en métropole.',
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Les délais varient selon le territoire. Pour la Guadeloupe et la Martinique : 5 à 7 jours ouvrés après validation du fichier. Pour la Guyane, La Réunion, Saint-Martin et Saint-Barthélemy : 7 à 10 jours ouvrés. Ces délais s\'entendent après impression (2 à 3 jours ouvrés supplémentaires).',
      },
      {
        q: 'Comment sont expédiés mes colis ?',
        a: 'Tous nos colis sont expédiés par voie aérienne avec des transporteurs partenaires. Vos impressions sont soigneusement protégées dans des tubes carton ou des cartons plats renforcés selon le type de produit.',
      },
      {
        q: 'Puis-je suivre mon colis ?',
        a: 'Oui, un numéro de suivi vous est envoyé par email dès l\'expédition de votre commande. Vous pouvez suivre votre colis en temps réel sur le site du transporteur.',
      },
      {
        q: 'Les frais de livraison sont-ils inclus dans les prix affichés ?',
        a: 'Non, les prix affichés sont pour l\'impression uniquement. Les frais de livraison sont calculés selon le territoire, le poids et les dimensions du colis. Ils vous sont communiqués dans le devis.',
      },
    ],
  },
  {
    title: 'Qualité et garanties',
    icon: '✅',
    questions: [
      {
        q: 'Que se passe-t-il si mon fichier n\'est pas conforme ?',
        a: 'Notre équipe vérifie chaque fichier sous 4h ouvrées. En cas de problème (résolution insuffisante, fond perdu manquant, etc.), nous vous contactons pour vous aider à corriger le fichier. La commande ne sera pas lancée sans votre validation.',
      },
      {
        q: 'Offrez-vous une garantie sur vos impressions ?',
        a: 'Oui, nous garantissons la qualité de chaque impression. Si votre commande est endommagée pendant le transport ou ne correspond pas à votre fichier validé, nous réimprimons gratuitement. Contactez-nous avec photos dans les 7 jours suivant la réception.',
      },
      {
        q: 'Puis-je demander un bon à tirer (BAT) avant impression ?',
        a: 'Pour les commandes importantes (supérieures à 500€), nous pouvons vous envoyer un BAT numérique (épreuve PDF) pour validation. Pour un BAT physique, un surcoût s\'applique. Contactez-nous pour en discuter.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="bg-sand border-b border-sand-dark py-10">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-text-light mb-4">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <span>FAQ</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Questions fréquentes</h1>
            <p className="text-text-light max-w-xl">
              Tout ce que vous devez savoir avant de passer votre commande d&apos;impression.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="flex items-center gap-3 text-xl font-bold text-ocean mb-5">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.questions.map((item) => (
                  <details key={item.q} className="group bg-sand rounded-2xl border border-sand-dark">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-sm gap-4">
                      <span>{item.q}</span>
                      <span className="text-text-lighter group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-text-light leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* CTA */}
          <section className="bg-ocean rounded-3xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">Votre question n&apos;est pas ici ?</h2>
            <p className="text-blue-200 mb-6 text-sm">
              Notre équipe vous répond sous 24h du lundi au vendredi.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-ocean font-semibold px-6 py-3 rounded-xl hover:bg-sand transition-colors"
            >
              Nous contacter →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
