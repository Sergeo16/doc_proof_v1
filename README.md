# DOC PROOF — Blockchain Document Certification Platform

> Enterprise-grade Web3 SaaS for immutable document certification on Polygon

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-Mumbai%20%7C%20Mainnet-purple)](https://polygon.technology/)

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
└── DEPLOYMENT.md
```

## Smart Contract

- **DocProof.sol**: UUPS upgradeable contract
- Registers document hashes (SHA-256)
- Issuer-only revocation
- Prevents duplicate hash registration
- Events for certification/revocation

Deploy:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network mumbai
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
