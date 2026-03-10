# DOC PROOF — Blockchain Document Certification Platform

> Enterprise-grade Web3 SaaS for immutable document certification on Polygon

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-Amoy%20%7C%20Mumbai%20%7C%20Mainnet-purple)](https://polygon.technology/)

## Features

- **Document Certification**: SHA-256 hashing, IPFS storage, blockchain registration
- **Public Verification**: Verify any document by hash or QR code
- **Smart Contract**: Upgradeable Solidity contract (OpenZeppelin) on Polygon
- **AI Analysis**: Fraud detection, integrity scoring, anomaly detection
- **Multilingual**: English, French, Chinese, Arabic, Spanish
- **Multi-Theme**: DaisyUI themes (dark, cyberpunk, retro, business, etc.)
- **RBAC**: Super Admin, Org Admin, Verifier, User roles
- **Enterprise Ready**: Docker, Redis rate limiting, audit logs, GDPR-ready

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, DaisyUI, Framer Motion |
| Backend | Server Actions, Prisma, PostgreSQL, Redis |
| Blockchain | Solidity, Hardhat, Ethers.js, Polygon |
| Storage | IPFS (Pinata/Web3.Storage) |
| Auth | JWT, bcrypt, 2FA (admin) |

## Quick Start

```bash
# Install
npm install
cd contracts && npm install --legacy-peer-deps && cd ..

# Démarrer PostgreSQL + Redis avec Docker (obligatoire avant migrate et dev)
npm run docker:dev

# Setup database
cp .env.example .env
# Edit .env
npx prisma migrate dev
npx prisma db seed

# Run
 npm run dev
```

Visit http://localhost:3000

> **Note** : `npm run docker:dev` lance les conteneurs PostgreSQL et Redis. Arrêter avec `npm run docker:dev:stop`.

## Pousser le projet sur GitHub

Commandes pour envoyer le projet sur votre compte GitHub :

```bash
# 1. Initialiser le dépôt Git (si pas encore fait)
git init

# 2. Un .gitignore est inclus (.env, node_modules, .next exclus — ne jamais pousser .env !)

# 3. Ajouter tous les fichiers
git add .

# 4. Premier commit
git commit -m "Initial commit: DOC PROOF platform"

# 5. Créer le dépôt sur GitHub (via github.com : New repository)

# 6. Associer le dépôt distant (remplacez USER et REPO par vos valeurs)
git remote add origin https://github.com/USER/REPO.git

# 7. Branche par défaut (optionnel si déjà main)
git branch -M main

# 8. Pousser sur GitHub
git push -u origin main
```

**Exemple** : si votre compte est `johndoe` et le repo `doc_proof_v1` :

```bash
git remote add origin https://github.com/johndoe/doc_proof_v1.git
git branch -M main
git push -u origin main
```

**Ensuite, pour les mises à jour** :

```bash
git add .
git commit -m "Description des changements"
git push
```

**Erreur « Large files detected » (node_modules, .next > 100 MB)** :

Si GitHub refuse le push, c'est que `node_modules` ou `.next` ont été commités. Procédure de correction :

```bash
# Réinitialiser l'historique et créer un commit propre
rm -rf .next
git update-ref -d HEAD
git reset
git add .
git status   # vérifier qu'il n'y a pas node_modules, .next, .env
git commit -m "Initial commit: DOC PROOF platform"
git push -u origin main --force
```

Le `.gitignore` doit exclure `node_modules/`, `.next/`, `.env`.

**Default Admin**: admin@docproof.io / Admin123!

## Déploiement sur Render (partage DB/Redis avec prospects-app)

Cette section décrit comment héberger DOC PROOF sur [Render](https://render.com) en **réutilisant** la base PostgreSQL (`prospects-db`) et Redis (`prospects-redis`) déjà présents dans le même workspace que `prospects-app`, **sans chevauchement des données**.

### Ce qui est automatisé (`render.yaml`)

| Élément | Automatique |
|---------|-------------|
| Config Web Service (build, start, région) | ✅ |
| Migrations Prisma à chaque déploiement | ✅ `preDeployCommand` |
| JWT_SECRET (génération aléatoire) | ✅ |
| REDIS_KEY_PREFIX, POLYGON_AMOY_RPC_URL | ✅ |

### Ce qui reste manuel

- **Base `docproof`** : Render ne permet pas de créer une 2ᵉ base sur une instance existante via Blueprint.
- **Secrets** : DATABASE_URL, REDIS_URL, PRIVATE_KEY… — saisis au premier déploiement (jamais dans Git).

### Stratégie anti-chevauchement

| Ressource | Méthode d'isolation | Détail |
|-----------|--------------------|--------|
| **PostgreSQL** | Base séparée | Créer une base `docproof` sur la même instance `prospects-db` (pas la base `prospects_v2`) |
| **Redis** | Préfixe de clés | Variable `REDIS_KEY_PREFIX=docproof:` pour éviter toute collision avec prospects-app |

Référence : [Render – Adding multiple databases](https://render.com/docs/postgresql-creating-connecting#adding-multiple-databases-to-a-single-instance).

---

### Étape 0 : Créer la base PostgreSQL `docproof`

Ouvrir le service **prospects-db** dans le [Render Dashboard](https://dashboard.render.com) → **Info** → copier l’**Internal Database URL**.

Choisir une des méthodes suivantes :

#### Option A : Docker (sans installer psql)

```bash
docker run -it --rm postgres:16-alpine psql "postgresql://prospects_user:PASSWORD@dpg-xxx-a.oregon-postgres.render.com/prospects_v2" -c "CREATE DATABASE docproof;"
```

Remplacer l’URL par celle de prospects-db (Internal Database URL, base `prospects_v2`).

#### Option B : psql installé localement

```bash
psql "postgresql://prospects_user:PASSWORD@dpg-xxx-a.oregon-postgres.render.com/prospects_v2"
```

Puis dans la session :
```sql
CREATE DATABASE docproof;
\q
```

> Si `psql` n’est pas installé : `brew install libpq` puis `brew link --force libpq`.

#### Option C : Render Shell

Si Render propose un **Shell** pour prospects-db : y ouvrir une session et exécuter :
```bash
psql $DATABASE_URL -c "CREATE DATABASE docproof;"
```

#### URL pour DOC PROOF

L’**Internal Database URL** pour DOC PROOF est la même que prospects-db, avec `/docproof` à la fin (au lieu de `/prospects_v2`) :
```
postgresql://prospects_user:PASSWORD@dpg-xxx-a.oregon-postgres.render.com/docproof
```

---

### Étape 1 : Prérequis

- Compte Render et workspace contenant `prospects-app`, `prospects-db`, `prospects-redis`.
- Dépôt DOC PROOF poussé sur GitHub (ex. `Sergeo16/doc_proof_v1`).
- Base `docproof` créée (étape 0).

### Étape 2 : Déployer le Blueprint DOC PROOF

1. **My Workspace** → **New** → **Blueprint**.
2. Connecter le dépôt GitHub du projet DOC PROOF (ex. `Sergeo16/doc_proof_v1`).
3. Render détecte le fichier `render.yaml` à la racine.
4. Cliquer sur **Apply** puis saisir les variables demandées (voir Étape 3). Build et migrations se lancent automatiquement.

### Étape 3 : Variables d’environnement

Dans l’onglet **Environment** du Web Service DOC PROOF :

#### Base de données (base dédiée docproof)

- **`DATABASE_URL`** : URL **Internal** de prospects-db, base `docproof` :
  ```
  postgresql://prospects_user:VOTRE_MOT_DE_PASSE@dpg-d5ap9rpr0fns738fvr5g-a:5432/docproof
  ```
  (Copier l’Internal Database URL de prospects-db, remplacer `prospects_v2` par `docproof`.)

#### Redis (préfixe obligatoire si partagé)

- **`REDIS_URL`** : Internal Key Value URL de prospects-redis (ex. `redis://red-d5ap9rhr0fns738fvr40:6379`).
- **`REDIS_KEY_PREFIX`** : `docproof:` — **obligatoire** pour éviter les collisions avec prospects-app.

#### Application et auth

- **`JWT_SECRET`** : généré automatiquement par le Blueprint (pas besoin de le saisir).
- **`NEXT_PUBLIC_APP_URL`** : URL publique du service DOC PROOF sur Render (ex. `https://doc-proof-app.onrender.com`).

#### Blockchain (voir [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md))

- **`PRIVATE_KEY`** : clé privée du wallet (certification).
- **`NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS`** : adresse du contrat déployé.
- **`NEXT_PUBLIC_CHAIN_ID`** : `80002` (Amoy) ou `80001` (Mumbai).
- **`POLYGON_AMOY_RPC_URL`** (ou `POLYGON_MUMBAI_RPC_URL`) : URL RPC du testnet/mainnet.

#### Optionnel : IPFS (Pinata)

- **`IPFS_PROVIDER`** : `pinata`
- **`PINATA_API_KEY`** et **`PINATA_API_SECRET`**

### Étape 4 : Migrations et seed

- **Migrations** : exécutées automatiquement à chaque déploiement via `preDeployCommand` dans `render.yaml`.
- **Seed optionnel** : Shell Render sur le service DOC PROOF → `npx prisma db seed`.

### Étape 5 : Vérifications

- **prospects-app** → base `prospects_v2`, clés Redis sans préfixe → aucune collision.
- **DOC PROOF** → base `docproof`, clés Redis préfixées `docproof:` → données isolées.

### Étape 6 : Résumé des coûts

- **Pas de nouveau coût** pour PostgreSQL ni Redis (réutilisation de prospects-db et prospects-redis).
- **Un nouveau Web Service** (Starter ou plus) est facturé en plus.

### Références Render

- **Internal Database URL** : dans le service PostgreSQL → onglet **Info** → **Internal Database URL**.
- **Internal Key Value URL** : dans le service Redis/Valkey → onglet **Info** → **Internal Key Value URL**.

Ces URLs ne sont accessibles qu’aux services du même workspace Render (réseau interne).

## Project Structure

```
doc_proof_v1/
├── contracts/           # Solidity smart contracts
│   ├── contracts/
│   │   └── DocProof.sol  # Upgradeable certification contract
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── actions/          # Server actions
│   ├── app/              # Next.js App Router
│   ├── components/
│   ├── i18n/             # Translations (en, fr, zh, ar, es)
│   ├── lib/              # Core libraries
│   │   ├── ai/           # AI document analysis
│   │   ├── auth.ts
│   │   ├── blockchain.ts
│   │   ├── crypto.ts
│   │   ├── ipfs.ts
│   │   └── redis.ts
│   └── store/            # Zustand
├── Dockerfile
├── docker-compose.yml
├── render.yaml         # Blueprint Render (déploiement automatisé)
└── DEPLOYMENT.md
```

## Smart Contract

- **DocProof.sol**: UUPS upgradeable contract
- Registers document hashes (SHA-256)
- Issuer-only revocation
- Prevents duplicate hash registration
- Events for certification/revocation

Deploy (testnet Amoy recommandé ; voir [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md) pour obtenir des POL de test, par ex. via [StakePool Amoy Faucet](https://faucet.stakepool.dev.br/)) :
```bash
cd contracts
npx hardhat run scripts/deploy.js --network amoy   # recommandé
# ou --network mumbai (testnet déprécié)
```

## API

### Public Verification
```
GET /api/verify?hash=0x...
```

Returns:
```json
{
  "isValid": true,
  "document": {
    "hash": "0x...",
    "issuer": "0x...",
    "certifiedAt": "2024-...",
    "blockchainTxHash": "0x..."
  }
}
```

## Bonus Features (Concept)

- **NFT Certification**: Optional NFT mint per document
- **ZK Verification**: Zero-knowledge proof concept for privacy
- **DID Integration**: Decentralized identity readiness
- **DAO Governance**: Institutional multi-sig patterns


**Méthode 1 : Reset complet (Recommandée si vous voulez vraiment tout écraser)**
```bash
# 1. Récupérer toutes les informations du dépôt distant
git fetch origin

# 2. Réinitialiser votre branche locale pour qu'elle corresponde exactement à la branche distante
git reset --hard origin/main

# 3. Nettoyer tous les fichiers non suivis (optionnel, mais recommandé)
git clean -fd
```

**Explication :**
- `git fetch origin` : Télécharge les dernières informations du dépôt distant sans modifier vos fichiers locaux
- `git reset --hard origin/main` : Réinitialise votre branche locale `main` pour qu'elle corresponde exactement à `origin/main`. **Toutes vos modifications locales non commitées seront perdues**
- `git clean -fd` : Supprime tous les fichiers et dossiers non suivis par Git (fichiers créés localement mais jamais ajoutés à Git)

**Méthode 2 : Checkout direct (Alternative simple)**
```bash
# 1. Récupérer les dernières informations
git fetch origin

# 2. Forcer le checkout de la branche distante
git checkout -f origin/main

# 3. Déplacer votre branche locale sur cette version
git branch -f main origin/main

# 4. Revenir sur votre branche locale
git checkout main
```

**Explication :**
- `git fetch origin` : Télécharge les informations du dépôt distant
- `git checkout -f origin/main` : Force le checkout de la version distante (ignore les modifications locales)
- `git branch -f main origin/main` : Force votre branche locale `main` à pointer vers `origin/main`
- `git checkout main` : Revenir sur votre branche locale (maintenant identique à la distante)

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Développé par Open Digital Land**
