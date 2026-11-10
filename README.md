# Pseudocode Frontend

Interface web de la Plateforme de Pseudo Code Algo : écrire et exécuter
du pseudo-code, et suivre des cours.

API : [pseudocode-backend](https://github.com/Mohamed00077/pseudocode-backend)

## Fonctionnalités

- Éditeur de code Monaco (celui de VS Code)
- Exécution du pseudo-code via l'API et affichage du résultat
- Consultation des cours et des leçons (rendu Markdown)
- Navigation multi-pages

## Stack technique

| Rôle | Outil |
|---|---|
| Framework | React + Vite + TypeScript |
| Éditeur | Monaco Editor (`@monaco-editor/react`) |
| Routing | React Router |
| Appels API | TanStack Query |
| Rendu des cours | react-markdown |

## Prérequis

- Node.js 20+ (LTS)
- Git
- Le backend lancé en local (voir son README)

## Installation

```bash
git clone https://github.com/Mohamed00077/pseudocode-frontend.git
cd pseudocode-frontend
npm install
cp .env.example .env             # Windows : copy .env.example .env
```

Contenu de `.env` :

```
VITE_API_URL=http://localhost:8000
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement (http://localhost:5173) |
| `npm run build` | build de production |
| `npm run preview` | prévisualiser le build |
| `npm run lint` | vérifier le code |

## Structure du projet

```
src/
├── components/   # composants réutilisables
├── pages/        # pages (éditeur, cours, ...)
├── api/          # appels vers le backend
└── main.tsx
```

## Contribuer

Le projet est développé en équipe.
Lisez [CONTRIBUTING.md](CONTRIBUTING.md) avant de commencer.

## Licence

Distribué sous licence MIT. Voir [LICENSE](LICENSE).
