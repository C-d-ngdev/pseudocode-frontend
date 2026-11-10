# Guide de contribution (frontend)

## Règles de base

- Ne jamais pousser directement sur `main`.
- Une branche par tâche, une Pull Request par branche.
- Au moins une relecture par un autre membre avant de fusionner.
- Ne jamais commiter `.env`.

## Workflow

```bash
git checkout main
git pull
git checkout -b feature/nom-court
# ... travail et commits ...
git push -u origin feature/nom-court
```

Ouvrez ensuite une Pull Request vers `main` sur GitHub.

## Nommage des branches et commits

Mêmes conventions que le backend :
`feature/`, `fix/`, `docs/` pour les branches ;
`feat:`, `fix:`, `docs:` pour les commits.

## Avant d'ouvrir une Pull Request

- [ ] `npm run lint` passe
- [ ] `npm run build` passe
- [ ] L'interface a été testée avec le backend local
- [ ] Capture d'écran jointe à la PR si l'interface change
