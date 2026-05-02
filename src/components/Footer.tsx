import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-primary mb-2">
              Récup<span className="text-secondary">Mes€uros</span>
            </p>
            <p className="text-sm text-text-light">
              Assistant d&apos;aide à la préparation de votre déclaration d&apos;impôts.
              Ne remplace pas un conseil fiscal professionnel.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Guides pratiques</p>
            <ul className="text-sm text-text-light space-y-1">
              <li><Link href="/guides/emploi-a-domicile" className="hover:text-primary">Emploi à domicile</Link></li>
              <li><Link href="/guides/frais-reels" className="hover:text-primary">Frais réels</Link></li>
              <li><Link href="/guides/dons" className="hover:text-primary">Dons aux associations</Link></li>
              <li><Link href="/guides/garde-enfant" className="hover:text-primary">Garde d&apos;enfant</Link></li>
              <li><Link href="/guides/pension-alimentaire" className="hover:text-primary">Pension alimentaire</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Informations</p>
            <ul className="text-sm text-text-light space-y-1">
              <li><Link href="/mentions-legales" className="hover:text-primary">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-primary">Confidentialité & RGPD</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4">
          <p className="text-xs text-text-lighter text-center">
            Les résultats sont indicatifs. Vérifiez votre situation sur{" "}
            <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline">
              impots.gouv.fr
            </a>{" "}
            ou auprès d&apos;un professionnel. © {new Date().getFullYear()} RecupMesEuros.
          </p>
        </div>
      </div>
    </footer>
  );
}
