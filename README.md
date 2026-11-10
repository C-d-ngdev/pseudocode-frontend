# pseudocode-frontend
Interface web de la Plateforme de Pseudo Code Algo : éditeur de pseudo-code et exécution, avec React, Vite et TypeScript.
Elle permet d'écrire du pseudo-code dans un éditeur et de l'exécuter via l'API.

## Fonctionnalités

- Éditeur de code Monaco (le même que VS Code)
- Envoi du code à l'API et affichage du résultat
- Navigation multi-pages avec React Router

## Stack technique

- React + Vite + TypeScript
- Monaco Editor (`@monaco-editor/react`)
- React Router
- TanStack Query

## Prérequis

- Node.js 20+ (LTS)
- Le backend lancé : [pseudocode-backend](https://github.com/Mohamed00077/pseudocode-backend)

## Installation

```bash
git clone https://github.com/Mohamed00077/pseudocode-frontend.git
cd pseudocode-frontend
npm install
```

## Configuration

Crée un fichier `.env` à la racine :

```
VITE_API_URL=http://localhost:8000
```

## Lancer en développement

```bash
npm run dev
```

L'application est disponible sur http://localhost:5173.

## Build de production

```bash
npm run build
npm run preview
```

## Contribuer

Forkez le dépôt, créez une branche, puis ouvrez une Pull Request.

## Licence

Distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE).
