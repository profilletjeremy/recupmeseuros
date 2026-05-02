import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales — RecupMesEuros",
  description:
    "Mentions légales du site RecupMesEuros, assistant d'aide à la préparation fiscale.",
};

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Éditeur du site
            </h2>
            <p className="text-text-light mb-2">
              Le site <strong>RecupMesEuros</strong> (ci-après « le Site ») est
              édité par :
            </p>
            <ul className="text-text-light space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Raison sociale :</strong> [Nom / Raison sociale à
                compléter]
              </li>
              <li>
                <strong>Forme juridique :</strong> [Forme juridique à compléter]
              </li>
              <li>
                <strong>Adresse :</strong> [Adresse à compléter]
              </li>
              <li>
                <strong>SIRET :</strong> [Numéro SIRET à compléter]
              </li>
              <li>
                <strong>Email :</strong> [email@exemple.fr]
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Directeur de la publication
            </h2>
            <p className="text-text-light">
              [Nom du directeur de la publication à compléter]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Hébergement
            </h2>
            <p className="text-text-light">
              Le Site est hébergé par :
            </p>
            <ul className="text-text-light space-y-1 list-disc list-inside ml-2 mt-2">
              <li>
                <strong>Vercel Inc.</strong>
              </li>
              <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
              <li>
                Site :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  vercel.com
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Nature du service
            </h2>
            <p className="text-text-light mb-3">
              RecupMesEuros est un <strong>assistant d&apos;aide à la préparation
              fiscale</strong>. Il a pour vocation d&apos;aider les contribuables
              à identifier les avantages fiscaux susceptibles de s&apos;appliquer à
              leur situation, sur la base des informations qu&apos;ils fournissent.
            </p>
            <div className="bg-surface border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-text-light">
                <strong>Important :</strong> RecupMesEuros{" "}
                <strong>n&apos;est pas un cabinet de conseil fiscal</strong>,
                ni un expert-comptable, ni un service de l&apos;administration
                fiscale. Il ne fournit aucun conseil juridique ou fiscal
                personnalisé. Les informations et résultats affichés sont
                purement indicatifs et ne sauraient engager la responsabilité de
                l&apos;éditeur.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Limitation de responsabilité
            </h2>
            <p className="text-text-light mb-3">
              Les résultats fournis par le Site sont <strong>indicatifs</strong>{" "}
              et basés sur les règles fiscales publiques en vigueur au moment de
              leur publication. Ils ne constituent en aucun cas une déclaration
              fiscale, un engagement ou une garantie de montant.
            </p>
            <p className="text-text-light mb-3">
              L&apos;utilisateur est invité à <strong>vérifier sa situation</strong>{" "}
              directement sur le site officiel de l&apos;administration fiscale :{" "}
              <a
                href="https://www.impots.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                impots.gouv.fr
              </a>
              , ou à consulter un professionnel qualifié (expert-comptable,
              conseiller fiscal).
            </p>
            <p className="text-text-light">
              L&apos;éditeur ne saurait être tenu responsable des erreurs,
              omissions ou résultats de décisions prises sur la base des
              informations fournies par le Site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Propriété intellectuelle
            </h2>
            <p className="text-text-light mb-3">
              L&apos;ensemble des contenus présents sur le Site (textes, images,
              graphismes, logo, icônes, logiciels, code source) est protégé par
              les dispositions du Code de la propriété intellectuelle et
              appartient à l&apos;éditeur ou fait l&apos;objet d&apos;une
              autorisation d&apos;utilisation.
            </p>
            <p className="text-text-light">
              Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie des éléments du Site, quel que soit le
              moyen ou le procédé utilisé, est interdite sans l&apos;autorisation
              écrite préalable de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Droit applicable
            </h2>
            <p className="text-text-light">
              Les présentes mentions légales sont soumises au droit français.
              Tout litige relatif à l&apos;utilisation du Site sera soumis à la
              compétence des tribunaux français.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
