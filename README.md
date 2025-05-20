# OYA - Plateforme IA pour le Recrutement

OYA est une plateforme d'IA RH intelligente, conçue pour automatiser, sécuriser et accélérer tout le processus de recrutement, tout en supprimant les intermédiaires coûteux.

## Vision

Dans un contexte de guerre des talents, de pression sur les délais de recrutement, et de coûts d'intermédiation en constante augmentation, les directions RH ont besoin d'un levier stratégique : OYA est ce levier.

OYA n'est pas un simple outil, mais une plateforme stratégique IA qui fonctionne comme un moteur intelligent centralisé, capable de:

1. Rechercher automatiquement des profils sur toutes les plateformes et LinkedIn, selon vos critères
2. Scorer et estimer la valeur salariale des candidats en temps réel
3. Centraliser les profils dans une interface claire avec filtres, notes et matching
4. Organiser les prises de contact, entretiens, relances et convocations automatiquement
5. Mettre à jour l'agenda des recruteurs
6. Préparer les contrats de travail, leur génération, leur renouvellement ou non, en fonction de vos directives RH

## Fonctionnalités clés

- **Recherche IA de candidats**: Trouver automatiquement des candidats sur LinkedIn et autres plateformes
- **Analyse de CV avec IA**: Extraction automatique de compétences, expériences et recommandations d'emplois
- **Scoring des candidats**: Évaluation objective des compétences et adéquation avec les postes
- **Estimation de valeur salariale**: Calcul en temps réel de la fourchette salariale des candidats
- **Planification d'entretiens**: Gestion automatisée des rendez-vous et envoi d'invitations
- **Suivi des candidats**: Dashboard intégré pour suivre tout le processus de recrutement
- **Génération de contrats**: Préparation automatisée des contrats de travail

## Technologies

- React
- TypeScript
- Firebase (Firestore & Auth)
- TailwindCSS
- APIs d'IA (Claude/GPT)

## Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

## Structure du projet

```
src/
├── components/        # Composants React
│   ├── ai/            # Composants liés à l'IA
│   ├── auth/          # Authentification
│   ├── candidates/    # Gestion des candidats
│   └── dashboard/     # Interface principale
├── pages/             # Pages de l'application
├── services/          # Services API et logique métier
├── store/             # État global (stores)
└── styles/            # Styles et thèmes
```

## Roadmap

- Implémentation de l'extraction LinkedIn automatisée
- Amélioration des algorithmes de scoring
- Ajout de fonctionnalités d'IA conversationnelle
- Intégration avec les agendas (Google Calendar, Outlook)
- Système de suivi de performance des recrutements

## Équipe

- [Stéphane Zayat] - Lead Developer 