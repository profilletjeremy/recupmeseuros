import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité — RecupMesEuros",
  description:
    "Politique de confidentialité et informations RGPD du site RecupMesEuros.",
};

export default function Confidentialite() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">
            Politique de confidentialité
          </h1>

          <p className="text-text-light mb-8">
            RecupMesEuros accorde une importance particulière à la protection de
            votre vie privée. Cette page détaille notre approche en matière de
            traitement des données personnelles, conformément au Règlement
            Général sur la Protection des Données (RGPD) et à la loi
            Informatique et Libertés.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Aucune collecte de données personnelles
            </h2>
            <p className="text-text-light mb-3">
              RecupMesEuros <strong>ne collecte, ne stocke et ne transmet
              aucune donnée personnelle</strong> sur ses serveurs.
            </p>
            <p className="text-text-light">
              Le questionnaire et les calculs sont exécutés{" "}
              <strong>entièrement dans votre navigateur</strong> (côté client).
              Les réponses que vous fournissez sont temporairement conservées
              dans le <code className="bg-surface px-1.5 py-0.5 rounded text-sm">sessionStorage</code>{" "}
              de votre navigateur et sont automatiquement supprimées lorsque vous
              fermez l&apos;onglet ou la fenêtre.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Pas de cookies de suivi
            </h2>
            <p className="text-text-light">
              Le Site <strong>n&apos;utilise aucun cookie de suivi</strong>,
              aucun cookie publicitaire et aucun outil de tracking (pas de Google
              Analytics, pas de pixel Facebook, etc.). Aucune bannière de
              consentement aux cookies n&apos;est donc nécessaire.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Pas de compte utilisateur
            </h2>
            <p className="text-text-light">
              Le Site ne propose <strong>aucune inscription</strong> et ne
              requiert <strong>aucune création de compte</strong>. Aucune adresse
              email, aucun mot de passe, aucune information d&apos;identification
              n&apos;est collectée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Traitement côté client
            </h2>
            <div className="bg-surface border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-text-light mb-2">
                <strong>En résumé :</strong>
              </p>
              <ul className="text-sm text-text-light space-y-1 list-disc list-inside">
                <li>Vos réponses restent dans votre navigateur</li>
                <li>Aucune donnée n&apos;est envoyée vers un serveur distant</li>
                <li>
                  Les données sont stockées dans le{" "}
                  <code className="bg-white px-1 py-0.5 rounded">sessionStorage</code>{" "}
                  (mémoire temporaire du navigateur)
                </li>
                <li>
                  Fermer l&apos;onglet ou le navigateur supprime toutes les
                  données
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Vos droits au titre du RGPD
            </h2>
            <p className="text-text-light mb-3">
              Conformément au RGPD (Règlement UE 2016/679), vous disposez des
              droits suivants :
            </p>
            <ul className="text-text-light space-y-2 list-disc list-inside ml-2">
              <li>
                <strong>Droit d&apos;accès :</strong> vous pouvez demander quelles
                données personnelles sont détenues à votre sujet.
              </li>
              <li>
                <strong>Droit de rectification :</strong> vous pouvez demander la
                correction de données inexactes.
              </li>
              <li>
                <strong>Droit à l&apos;effacement :</strong> vous pouvez demander
                la suppression de vos données.
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> vous pouvez demander à
                recevoir vos données dans un format structuré.
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> vous pouvez vous opposer
                au traitement de vos données.
              </li>
            </ul>
            <div className="bg-surface border border-gray-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-text-light">
                <strong>En pratique :</strong> puisque RecupMesEuros ne collecte
                et ne stocke aucune donnée personnelle, ces droits sont
                satisfaits par défaut. Il n&apos;existe aucune donnée à consulter,
                rectifier ou supprimer de notre côté.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Hébergement
            </h2>
            <p className="text-text-light">
              Le Site est hébergé par <strong>Vercel Inc.</strong> (440 N
              Barranca Ave #4133, Covina, CA 91723, États-Unis). Les serveurs
              peuvent journaliser des informations techniques standard (adresse
              IP, type de navigateur, horodatage des requêtes) dans le cadre
              normal du fonctionnement d&apos;un hébergement web. Ces journaux
              sont gérés par Vercel conformément à sa propre politique de
              confidentialité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-3">
              Contact
            </h2>
            <p className="text-text-light">
              Pour toute question relative à la protection de vos données
              personnelles, vous pouvez nous contacter à l&apos;adresse suivante :
            </p>
            <p className="text-text-light mt-2">
              <strong>Email :</strong>{" "}
              <a
                href="mailto:contact@recupmeseuros.fr"
                className="text-primary hover:underline"
              >
                [email@exemple.fr]
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Autorité de contrôle
            </h2>
            <p className="text-text-light">
              Si vous estimez que le traitement de vos données ne respecte pas la
              réglementation en vigueur, vous avez le droit d&apos;introduire une
              réclamation auprès de la{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                CNIL
              </a>{" "}
              (Commission Nationale de l&apos;Informatique et des Libertés).
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
