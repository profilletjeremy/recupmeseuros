import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales — KaribPrint',
  description: 'Mentions légales du site KaribPrint, imprimerie en ligne pour les Antilles et La Réunion.',
};

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="bg-sand border-b border-sand-dark py-10">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-text-light mb-4">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <span>Mentions légales</span>
            </nav>
            <h1 className="text-3xl font-bold">Mentions légales</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Éditeur du site</h2>
            <div className="bg-sand rounded-xl p-5 text-sm text-text-light space-y-1">
              <p><strong>Nom commercial :</strong> KaribPrint</p>
              <p><strong>Raison sociale :</strong> [Raison sociale à compléter]</p>
              <p><strong>Forme juridique :</strong> [Forme juridique à compléter]</p>
              <p><strong>Adresse :</strong> [Adresse à compléter]</p>
              <p><strong>SIRET :</strong> [Numéro SIRET à compléter]</p>
              <p><strong>Email :</strong> contact@karibprint.fr</p>
              <p><strong>Téléphone :</strong> +590 000 000</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Directeur de la publication</h2>
            <p className="text-text-light text-sm">[Nom du directeur de la publication à compléter]</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Hébergement</h2>
            <div className="text-sm text-text-light space-y-1">
              <p><strong>Vercel Inc.</strong></p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p>Site : vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Propriété intellectuelle</h2>
            <p className="text-sm text-text-light leading-relaxed">
              L&apos;ensemble des contenus présents sur le site KaribPrint (textes, images, graphismes, logo, code source)
              est protégé par le Code de la propriété intellectuelle et appartient à l&apos;éditeur ou fait l&apos;objet
              d&apos;une autorisation d&apos;utilisation. Toute reproduction, même partielle, sans autorisation écrite
              préalable de l&apos;éditeur est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Limitation de responsabilité</h2>
            <p className="text-sm text-text-light leading-relaxed">
              KaribPrint s&apos;efforce de fournir des informations exactes et à jour. Cependant, l&apos;éditeur
              ne saurait être tenu responsable des erreurs ou omissions dans les contenus du site, ni des dommages
              résultant de l&apos;utilisation des informations disponibles. Les prix affichés sont indicatifs et peuvent
              varier selon les spécifications finales de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Protection des données personnelles</h2>
            <p className="text-sm text-text-light leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit
              d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits,
              contactez-nous à : contact@karibprint.fr
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Droit applicable</h2>
            <p className="text-sm text-text-light">
              Les présentes mentions légales sont soumises au droit français. Tout litige sera soumis
              à la compétence des tribunaux français.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
