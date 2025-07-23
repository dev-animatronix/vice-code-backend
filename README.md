[![logo](https://raw.githubusercontent.com/dev-animatronix/vice-code/19636c8c76cd955564e12fd048eefbea50e49091/static/favicon.svg "logo")](https://raw.githubusercontent.com/dev-animatronix/vice-code/19636c8c76cd955564e12fd048eefbea50e49091/static/favicon.svg "logo")

Une API backend REST **rapide**, **sécurisée** et **auto-hébergeable** pour l’éditeur de code [ViceCode](https://github.com/dev-animatronix/vice-code), avec gestion des projets, des utilisateurs et de l’authentification.

## Fonctionnalités principales

* 🔐 **Authentification sécurisée** – JWT + mots de passe hashés.
* 👥 **Multi-utilisateurs** – Chaque compte gère ses propres projets.
* 📝 **CRUD projets** – Créez, modifiez, supprimez vos projets facilement.
* 📦 **API REST** – Simple à intégrer avec n’importe quel frontend.

## 🛠️ Lancer le projet en local

```bash
git clone https://github.com/dev-animatronix/vice-code-backend.git
cd vice-code-backend
npm install
npx prisma migrate dev
npm run dev
```

> ⚠️ Crée un fichier `.env` à la racine avec tes variables d’environnement `JWT_SECRET`et `DATABASE_URL`

## 🧪 Stack technique

* Node.js (Express)
* Prisma + SQLite
* JWT pour l’authentification

## 📄 Licence

![Static Badge](https://img.shields.io/badge/licence-_AGPL-violet)

## 🤝 Contribuer

Ce backend est développé **en solo** avec passion pour compléter l’éditeur [ViceCode](https://github.com/dev-animatronix/vice-code).
Tu veux contribuer, améliorer, signaler un bug ?
N’hésite pas à ouvrir une **issue**, proposer une **pull request**, ou simplement me **contacter** !

---

Made with ☕ and ❤️
