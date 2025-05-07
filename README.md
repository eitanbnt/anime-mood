# 🎌 AnimeMood

AnimeMood est une application web qui recommande des animes en fonction de ton humeur, te permet d’enregistrer des favoris, de laisser des notes, de consulter ton historique et même de traduire les synopsis.

Développée avec **Next.js**, **Tailwind CSS**, **Prisma**, et une base de données **PostgreSQL (Neon)**.

---

## 🚀 Fonctionnalités principales

- 🎭 Sélection d’humeur (Heureux, Triste, Nostalgique, Énergique, Amoureux)
- 📡 Recommandation automatique de **3 animes aléatoires** via l'API [Jikan](https://jikan.moe)
- 💬 **Traduction à la demande** des synopsis via [LibreTranslate](https://libretranslate.com)
- 💾 **Ajout/retrait de favoris**
- 📜 **Ajout de notes personnelles**
- 📖 Page `/history` pour consulter toutes tes recommandations
- ❤️ Page `/favorites` pour retrouver uniquement tes favoris
- 🧠 Association d’un `userId` local pour filtrer les données par utilisateur
- 🎨 Design responsive avec Tailwind + emojis pour l’ambiance

---

## 🧱 Technologies utilisées

- `Next.js` (React)
- `Tailwind CSS` pour le design
- `Prisma ORM` pour la base de données
- `PostgreSQL` via [Neon](https://neon.tech)
- API publique : [Jikan](https://jikan.moe) (MyAnimeList non officiel)
- API de traduction : [LibreTranslate](https://libretranslate.com) (optionnel)

---

## ⚙️ Installation locale

```bash
git clone https://github.com/ton-utilisateur/animemood.git
cd animemood
npm install
```

---

## 📁 Variables d'environnement `.env`

Crée un fichier `.env` avec :

```
DATABASE_URL=postgresql://user:password@your-db.neon.tech/dbname?sslmode=require
```

---

## 🧠 Commandes utiles

### 🔧 Initialisation Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 🔄 Reset (⚠️ efface les données)
```bash
npx prisma migrate reset
```

### 🔍 Lancer Prisma Studio (explorateur BDD)
```bash
npx prisma studio
```

### 🚀 Démarrer le serveur de développement
```bash
npm run dev
```

---

## 🧪 Pages disponibles

- `/` : accueil (choix d’humeur)
- `/recommendation` : affichage de 3 animes recommandés + bouton "🔁"
- `/history` : historique complet + notes + suppression + favoris
- `/favorites` : favoris uniquement

---

## 🔮 À venir / idées futures

- Statistiques graphiques par humeur
- Authentification optionnelle
- Auto-hébergement de LibreTranslate
- Système de tags ou filtres avancés

---

## ✨ Auteur

Projet guidé étape par étape avec ChatGPT, construit par [TonNom].