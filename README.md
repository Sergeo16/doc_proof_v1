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

## License

MIT
