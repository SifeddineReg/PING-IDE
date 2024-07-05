# PING: Un éditeur de code web réalisé en React et Java

## Lancement du Projet

### Lancement Normal (l'ouverture des fichiers/dossiers dépend sur le backend)

```bash
cd ping_frontend
npm install
npm run dev
```

### Lancement sur NixOS

```bash
cd ping_frontend
npm install
npm start # Va lancer la base de données ainsi que l'application

cd ../ping_backend # Le backend
mvn quarkus:dev # Lancer le serveur et les endpoints
```
