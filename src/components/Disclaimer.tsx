export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-text-lighter italic text-center py-2">
        Les résultats sont indicatifs. Vérifiez sur{" "}
        <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline">
          impots.gouv.fr
        </a>{" "}
        ou auprès d&apos;un professionnel.
      </p>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
      <div className="flex gap-3">
        <span className="text-amber-500 text-xl shrink-0">⚠️</span>
        <div>
          <p className="font-semibold text-amber-800 mb-1">Avertissement important</p>
          <p className="text-sm text-amber-700">
            RecupMesEuros est un assistant d&apos;aide à la préparation basé sur des règles
            fiscales publiques. Il ne remplace pas un conseiller fiscal certifié ni le
            site officiel{" "}
            <a
              href="https://www.impots.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              impots.gouv.fr
            </a>
            . Les résultats sont indicatifs et doivent être vérifiés auprès d&apos;un
            professionnel ou sur les services officiels.
          </p>
        </div>
      </div>
    </div>
  );
}
