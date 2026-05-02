# RecupMesEuros — Assistant fiscal grand public

Assistant d'aide à la préparation de la déclaration d'impôts pour les particuliers français.
Déclaration 2026 des revenus 2025.

> **Avertissement** : Les résultats sont indicatifs. Vérifiez votre situation sur [impots.gouv.fr](https://www.impots.gouv.fr) ou auprès d'un professionnel.

## Fonctionnalités

- **Questionnaire dynamique** : sélection de profils, questions conditionnelles, une question par écran
- **Moteur de règles fiscales** : calculs automatisés basés sur les barèmes officiels 2025
- **Résultats détaillés** : score d'opportunité, estimations, cases à vérifier, justificatifs
- **Génération PDF** : résumé téléchargeable côté client
- **Guides SEO** : pages de contenu sur les sujets fiscaux courants
- **Glossaire fiscal** : explications des termes (crédit, réduction, déduction, TMI, etc.)
- **Calendrier fiscal** : dates clés de la déclaration 2026
- **100% côté client** : aucune donnée envoyée à un serveur

## Stack technique

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Zod 4** (validation des données)
- **jsPDF** (génération PDF côté client)
- **Vitest** (tests unitaires)

## Installation

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test          # run once
npm run test:watch # watch mode
```

## Architecture

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Landing page
│   ├── questionnaire/     # Questionnaire dynamique
│   ├── resultats/         # Page résultats
│   ├── guides/            # Pages guides SEO
│   ├── mentions-legales/  # Mentions légales
│   └── confidentialite/   # Politique de confidentialité
├── components/            # Composants partagés
├── data/
│   ├── types.ts           # Types TypeScript + schémas Zod
│   ├── questions.ts       # Définition des questions du questionnaire
│   └── taxRules2026.ts    # Règles fiscales 2026 (revenus 2025)
└── lib/
    ├── engine.ts          # Moteur d'évaluation fiscale
    └── __tests__/         # Tests unitaires
```

## Mise à jour annuelle

Pour adapter à une nouvelle année fiscale :

1. Dupliquer `src/data/taxRules2026.ts` en `taxRules2027.ts`
2. Mettre à jour les barèmes, plafonds et seuils
3. Mettre à jour les dates du calendrier fiscal
4. Mettre à jour l'import dans `src/lib/engine.ts`
5. Vérifier les tests unitaires

## Règles à vérifier avant mise en production

- [ ] Vérifier les barèmes kilométriques sur impots.gouv.fr
- [ ] Vérifier les plafonds emploi à domicile
- [ ] Vérifier le plafond garde d'enfants (revalorisé récemment)
- [ ] Vérifier le plafond dons aide aux personnes en difficulté
- [ ] Vérifier le plafond pension alimentaire enfant majeur
- [ ] Vérifier le forfait hébergement ascendant
- [ ] Vérifier les seuils micro-entrepreneur
- [ ] Vérifier les dates du calendrier fiscal
- [ ] Vérifier les numéros de cases sur les formulaires
- [ ] Vérifier le crédit borne de recharge (prorogé ou modifié ?)
- [ ] Faire relire les mentions légales par un juriste
- [ ] Compléter les coordonnées éditeur dans les mentions légales
- [ ] Tester sur mobile (iOS Safari, Android Chrome)

## Licence

Privé — Tous droits réservés.
