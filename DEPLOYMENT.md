# DOC PROOF - Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

## Quick Start (Docker)

```bash
# Clone and configure
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up -d

# Run migrations (in app container or locally)
npx prisma migrate deploy
npx prisma db seed
```

## Manual Setup

### 1. Install Dependencies

```bash
npm install
cd contracts && npm install && cd ..
```

### 2. Database

```bash
# Create PostgreSQL database
createdb docproof

# Run migrations
npx prisma migrate dev

# Seed initial data (Super Admin: admin@docproof.io / Admin123!)
npx prisma db seed
```

### 3. Smart Contract Deployment

```bash
cd contracts

# Configure .env with PRIVATE_KEY and RPC URLs

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Copy the proxy address to NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS
```

### 4. Run Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| REDIS_URL | No* | Redis for rate limiting/caching |
| JWT_SECRET | Yes | 32+ char secret for JWT |
| NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS | Yes** | Deployed contract address |
| PRIVATE_KEY | Yes** | Wallet for blockchain transactions |
| PINATA_API_KEY / WEB3_STORAGE_TOKEN | No* | For IPFS uploads |

*App works without Redis (rate limiting disabled) and IPFS (documents stored in DB only)
**Required for blockchain certification; without it, documents are marked PENDING

## Polygon Networks

- **Mumbai** (80001): Deprecated testnet - use for legacy
- **Amoy** (80002): Current Polygon testnet - update RPC if using
- **Polygon Mainnet** (137): Production

## Production Checklist

- [ ] Strong JWT_SECRET (32+ chars)
- [ ] PostgreSQL with SSL
- [ ] Redis for rate limiting
- [ ] Contract deployed and verified on PolygonScan
- [ ] IPFS credentials (Pinata/Web3.Storage)
- [ ] MAINTENANCE_MODE=false
- [ ] CORS/security headers configured
- [ ] Backup strategy for database

## Upgrading Smart Contract

```bash
cd contracts
npx hardhat run scripts/upgrade.js --network polygon
```

Implement upgrade.js using OpenZeppelin's upgrades.upgradeProxy().
