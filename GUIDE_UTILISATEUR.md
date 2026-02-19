# DOC PROOF — Guide utilisateur

## Vue d'ensemble

DOC PROOF est une plateforme de **certification blockchain de documents**. Elle permet de prouver de manière immuable l’authenticité et l’intégrité d’un document en enregistrant son empreinte (hash) sur la blockchain Polygon.


----------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------

## Pourquoi « Document introuvable ou révoqué » et « Émetteur : 0x0 » ?

Si, après avoir **téléchargé** un document puis **vérifié** son hash, vous voyez :

- **« Document introuvable ou révoqué »**
- **« Émetteur : 0x0 »**

c’est en général parce que la **blockchain n’est pas encore correctement configurée** dans le fichier `.env`. Dans ce cas :

1. **À l’upload** : le document est bien enregistré en base (hash, métadonnées), mais l’appel au smart contract échoue (adresse de contrat ou clé privée manquantes/invalides). Le document reste en statut **PENDING** et l’émetteur est enregistré comme `0x0`.
2. **À la vérification** : la plateforme interroge le contrat sur la blockchain ; si le contrat n’est pas déployé ou que l’adresse dans `.env` est un placeholder (`0x...`), le hash n’est pas trouvé sur la chaîne, donc le document est considéré comme invalide et l’émetteur affiché reste `0x0`.

**Pour que certification et vérification fonctionnent vraiment**, il faut remplir le `.env` avec de **vraies valeurs** (réseau, contrat déployé, clé de signature). La section suivante détaille quoi faire exactement.

---

## Configuration du `.env` pour certification et vérification réelles

Sans cette configuration, les documents sont seulement enregistrés en base (statut PENDING) et la vérification affiche « introuvable ou révoqué » / « Émetteur : 0x0 ». Voici ce qu’il faut faire.

### 1. Créer un portefeuille (wallet) pour la plateforme

- Installez **MetaMask** (ou un autre portefeuille compatible Ethereum/Polygon).
- Créez ou importez un compte. **Ce compte sera utilisé pour déployer le contrat et signer les certifications** (il ne doit **pas** être utilisé pour des usages personnels sensibles).
- Exportez la **clé privée** (MetaMask : Détails du compte → Exporter la clé privée). Vous en aurez besoin pour `PRIVATE_KEY` dans `.env`.

### 2. Obtenir des MATIC de test (réseau testnet Mumbai)

- Allez sur un **faucet** Polygon Mumbai, par exemple :  
  [https://faucet.polygon.technology/](https://faucet.polygon.technology/) (choisir **Mumbai** ou le testnet proposé).
- Entrez l’**adresse du portefeuille** (celle du compte dont vous avez exporté la clé).
- Réclamez des **MATIC de test**. Sans MATIC, le déploiement du contrat et les certifications échoueront.

### 3. Déployer le smart contract DOC PROOF

Le contrat doit être déployé **une fois** sur le réseau que vous utilisez (testnet ou mainnet). Sans adresse de contrat valide dans `.env`, la vérification ne peut pas fonctionner.

1. À la **racine du projet**, copiez le fichier d’exemple d’environnement :
   ```bash
   cp .env.example .env
   ```
2. Ouvrez le fichier **`.env`** et renseignez au minimum :
   - **`PRIVATE_KEY`** : la clé privée du wallet (sans le préfixe `0x` ou avec, selon ce qu’accepte le script).
3. Allez dans le dossier des contrats et installez les dépendances si ce n’est pas déjà fait :
   ```bash
   cd contracts
   npm install --legacy-peer-deps
   ```
4. Dans le dossier **`contracts`**, créez un fichier **`.env`** (ou réutilisez celui à la racine en copiant les variables nécessaires) avec :
   - **`PRIVATE_KEY`** : même clé privée que ci-dessus.
   - **`POLYGON_MUMBAI_RPC_URL`** (pour le testnet Mumbai) : par exemple  
     `https://rpc.ankr.com/polygon_mumbai`  
     ou une URL RPC Mumbai fournie par votre fournisseur (Alchemy, Infura, etc.).
5. Déployez le contrat sur le **testnet Mumbai** :
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```
6. À la fin du script, une ligne du type **« DocProof Proxy deployed to: 0x... »** s’affiche. **Copiez cette adresse** : c’est l’adresse du contrat à mettre dans l’app.

### 4. Remplir le `.env` à la racine du projet

De retour **à la racine** du projet (dossier `doc_proof_v1`), éditez le fichier **`.env`** et remplacez les placeholders par les **vraies valeurs** :

| Variable | Exemple / valeur à mettre |
|----------|---------------------------|
| **`NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS`** | L’adresse du contrat déployé à l’étape 3 (ex. `0x1234...abcd`). |
| **`NEXT_PUBLIC_CHAIN_ID`** | `80001` pour le testnet Mumbai. |
| **`POLYGON_MUMBAI_RPC_URL`** | Une URL RPC Mumbai (ex. `https://rpc.ankr.com/polygon_mumbai`). |
| **`PRIVATE_KEY`** | La clé privée du wallet (64 caractères hexadécimaux, avec ou sans `0x`). **Ne jamais commiter ce fichier.** |

**Important** :  
- Ne laissez **pas** `NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS="0x..."` ni `PRIVATE_KEY="your-metamask-private-key"`.  
- Sans adresse de contrat réelle, la vérification affichera toujours « Document introuvable ou révoqué » et « Émetteur : 0x0 ».  
- Sans `PRIVATE_KEY` valide (64 caractères hex), les certifications ne seront pas enregistrées sur la blockchain et les documents resteront en PENDING.

### 5. Redémarrer l’application et refaire un test

1. Arrêtez le serveur de développement puis relancez :
   ```bash
   npm run dev
   ```
2. **Re-téléchargez un document** (ou utilisez un nouveau fichier). Avec un `.env` correct, le document doit passer en statut **CERTIFIED** et vous devez voir un hash de transaction blockchain.
3. Allez sur **Vérifier**, collez le **hash du document** (format `0x...`) ou scannez le QR code.
4. Vous devriez obtenir **« Document valide »** et un **Émetteur** qui est une adresse du type `0x1234...` (plus jamais `0x0` pour un document certifié sur la chaîne).

### 6. Optionnel : IPFS (copie du document)

Pour stocker une copie du document sur IPFS (lien de preuve, pas obligatoire pour la vérification par hash) :

- Créez un compte sur **Pinata** (ou configurez Web3.Storage).
- Dans `.env`, renseignez par exemple :
  - `IPFS_PROVIDER="pinata"`
  - `PINATA_API_KEY="votre clé"`
  - `PINATA_API_SECRET="votre secret"`

Sans ces variables, l’upload IPFS est ignoré mais la **certification blockchain** (hash) et la **vérification** peuvent fonctionner dès que le contrat et `PRIVATE_KEY` sont correctement configurés.

----------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------

## Que peut faire un client avec cette plateforme ?

### 1. **Certifier un document**

**Utilité** : Garantir qu’un document n’a pas été modifié et prouver la date de certification.

**Cas concrets** :
- **Université** : certifier un diplôme pour qu’un employeur puisse vérifier son authenticité
- **Banque** : certifier un contrat de prêt
- **Administration** : certifier un acte administratif (naissance, mariage)
- **ONG** : certifier des rapports ou des attestations
- **Entreprise** : certifier des factures, devis ou procès-verbaux

**Comment faire** :
1. Se connecter ou créer un compte
2. Aller sur **Télécharger un document** (ou `/en/upload`)
3. Glisser-déposer le fichier (PDF recommandé) ou cliquer pour le sélectionner
4. Cliquer sur **Télécharger un document**
5. Attendre la génération du hash, l’upload IPFS et l’enregistrement sur la blockchain
6. Récupérer le **hash du document** et le **code QR** pour la vérification

---

### 2. **Vérifier un document**

**Utilité** : Vérifier qu’un document est bien certifié et n’a pas été révoqué.

**Cas concrets** :
- **Recruteur** : vérifier un diplôme présenté par un candidat
- **Notaire** : vérifier un document officiel
- **Douanes** : vérifier une attestation d’origine
- **Citoyen** : vérifier un document reçu par courriel

**Comment faire** :
1. Aller sur **Vérifier** (ou `/en/verify`)
2. Coller le hash du document (format `0x...`) ou scanner le code QR
3. Cliquer sur **Vérifier**
4. Le résultat affiche : document valide ✓ ou invalide ✗, émetteur, date de certification, lien vers la transaction blockchain

Si vous voyez **« Document introuvable ou révoqué »** et **« Émetteur : 0x0 »**, la plateforme n’est probablement pas encore configurée pour la blockchain. Consultez la section **« Configuration du .env pour certification et vérification réelles »** plus haut.

---

### 3. **Vérifier via l’API publique**

**Utilité** : Intégrer la vérification dans un autre système (site web, application, processus automatisé).

**Cas concret** : Une plateforme de recrutement qui vérifie automatiquement les diplômes sans intervention manuelle.

**Comment faire** :
```
GET https://votre-domaine.com/api/verify?hash=0x...
```

**Réponse** :
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

---

### 4. **Gérer ses documents**

**Utilité** : Suivre les documents certifiés par l’utilisateur ou l’organisation.

**Comment faire** :
1. Se connecter
2. Aller sur **Tableau de bord** (`/en/dashboard`)
3. Consulter la liste des documents certifiés
4. Voir le statut (CERTIFIED, REVOKED, PENDING)
5. Réutiliser le hash pour générer des QR codes ou partager la preuve

---

### 5. **Administration (Super Admin)**

**Utilité** : Gestion globale de la plateforme (utilisateurs, organisations, mode maintenance, paramètres).

**Cas concrets** :
- Activer/désactiver le mode maintenance
- Gérer les organisations et utilisateurs
- Suspendre des comptes
- Consulter les logs d’audit et rapports de fraude IA

**Comment faire** :
1. Se connecter avec un compte **Super Admin** (ex. `admin@docproof.io`)
2. Aller sur **Admin** dans la barre de navigation
3. Consulter les statistiques et les journaux d’audit

---

## Workflow type : université → employeur

1. **Université** :  
   - Connecte un document PDF du diplôme  
   - Obtient un hash et un QR code  
   - Imprime le QR sur le diplôme ou l’envoie par courriel  

2. **Étudiant** :  
   - Transmet le diplôme (physique ou numérique) à l’employeur  

3. **Employeur** :  
   - Scanne le QR ou saisit le hash sur DOC PROOF  
   - Reçoit une attestation de validité en quelques secondes  
   - Peut suivre le lien vers la transaction sur PolygonScan  

---

## Données stockées

- **Sur la blockchain** : uniquement le hash SHA-256 du document (immuable)
- **Sur IPFS** : copie optionnelle du document (éventuellement chiffrée)
- **Dans la base de données** : métadonnées, historique, analyse IA

Le contenu du document n’est jamais enregistré en clair sur la blockchain.
