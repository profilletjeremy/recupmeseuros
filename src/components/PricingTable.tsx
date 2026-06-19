import type { PricingTier } from '@/data/products';

interface Props {
  tiers: PricingTier[];
  productName: string;
}

export default function PricingTable({ tiers, productName }: Props) {
  const baseUnit = tiers[0].price / tiers[0].quantity;

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">Tarifs dégressifs — {productName}</h3>
      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand text-text-light text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Quantité</th>
              <th className="px-4 py-3 text-right">Prix total TTC</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Prix/ex.</th>
              <th className="px-4 py-3 text-right">Économie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tiers.map((tier) => {
              const unitPrice = tier.price / tier.quantity;
              const savings = Math.round((1 - unitPrice / baseUnit) * 100);
              return (
                <tr
                  key={tier.quantity}
                  className={
                    tier.isPopular
                      ? 'bg-ocean/5 font-medium'
                      : tier.isBestValue
                      ? 'bg-palm/5'
                      : 'bg-white'
                  }
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 flex-wrap">
                      {tier.quantity.toLocaleString('fr-FR')} ex.
                      {tier.isPopular && (
                        <span className="bg-ocean text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Populaire
                        </span>
                      )}
                      {tier.isBestValue && (
                        <span className="bg-palm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Meilleure valeur
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ocean">
                    {tier.price.toFixed(2).replace('.', ',')} €
                  </td>
                  <td className="px-4 py-3 text-right text-text-light hidden sm:table-cell">
                    {unitPrice.toFixed(3).replace('.', ',')} €
                  </td>
                  <td className="px-4 py-3 text-right">
                    {savings > 0 ? (
                      <span className="text-palm font-bold">-{savings}%</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-lighter mt-2">
        Prix TTC hors frais de livraison. Les tarifs sont indicatifs et seront confirmés sur devis.
      </p>
    </div>
  );
}
