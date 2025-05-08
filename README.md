# 🌍 Tunisia4You – Frontend (Angular)

Tunisia4You est une plateforme permettant aux utilisateurs de découvrir, noter et recommander les meilleurs lieux en Tunisie (restaurants, cafés, sites touristiques...).

Ce dépôt contient la partie **Frontend** développée en **Angular**, qui consomme une API REST construite avec .NET.

---

## 🚀 Fonctionnalités principales

- 🧭 Navigation par lieux (filtrage par ville, catégorie, tags…)
- 📝 Création de lieux, listes personnalisées et avis
- ⭐ Notation et affichage des meilleures recommandations
- 🛡️ Authentification, autorisation (Admin/User)
- 🧑‍💼 Interface d’administration : gestion des utilisateurs, tags, statistiques
- ⚙️ Intégration Google Maps (iframe) et images

---

## 📁 Structure du projet

```sql
src/
│
├── app/
│ ├── admin/ → Composants liés à l'admin (dashboard, gestion utilisateurs, stats…)
│ ├── components/ → Composants UI réutilisables (cards, modals, badges…)
│ ├── interceptors/ → Intercepteur HTTP pour ajouter le token JWT
│ ├── models/ → Interfaces TypeScript : User, Place, Review, etc.
│ ├── pipes/ → Pipes personnalisés (ex: tronquer du texte)
│ ├── services/ → Services d’appel API (auth, user, place, tag, etc.)
│ ├── app-routing.module.ts
│ └── app.module.ts
│
├── assets/ → Images, icônes et autres fichiers statiques
├── index.html → Fichier racine HTML
├── styles.css → Styles globaux (utilise TailwindCSS)
├── main.ts → Point d’entrée Angular
├── tailwind.config.js → Configuration de Tailwind CSS
├── angular.json → Configuration du projet Angular
```

---

## ⚙️ Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-utilisateur/tunisia4you-front.git
   cd tunisia4you-front
   ````
2. Installer les dépendances
   ```bash
    npm install
   ```
3. Configurer l’environnement
  - Modifier le fichier environment.ts
    ```bash
    export const environment = {
     production: false,
     apiUrl: 'https://localhost:5066' // URL de l'API backend .NET
    };
    ````
## 🖥️ Lancer l'application
 ```bash
   ng serve
 ```
- Accès à l'application : http://localhost:4200
## 🎨 Stack technique
- Angular 17+
- RxJS, HttpClient
- Tailwind CSS pour le style
- JWT Auth (avec Interceptor)
- Modularisation par rôle (Admin/User)
- SweetAlert2, ngx-toastr, etc.

## 🔐 Authentification
- Auth via JWT Token
- Intercepteur automatique pour les requêtes protégées
- Système de rôles User / Admin
