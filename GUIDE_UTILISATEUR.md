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

**À faire dans cet ordre :**

1. **Télécharger MetaMask (extension navigateur)**  
   - Page officielle : **[https://metamask.io/](https://metamask.io/)**  
   - Cliquez sur **« Get MetaMask »** puis choisissez votre navigateur (Chrome, Firefox, Edge ou Brave). Vous serez redirigé vers le store du navigateur.  
   - Guide d’installation détaillé (FR) : [https://support.metamask.io/fr/start/getting-started-with-metamask/](https://support.metamask.io/fr/start/getting-started-with-metamask/)

2. **Créer un nouveau compte ou en importer un**  
   - **Nouveau compte** : à l’ouverture de MetaMask, choisissez **« Créer un portefeuille »**. Suivez l’assistant (phrase de récupération secrète à noter et conserver en lieu sûr).  
     → Guide : [https://support.metamask.io/fr/start/creating-a-new-wallet/](https://support.metamask.io/fr/start/creating-a-new-wallet/)  
   - **Compte existant** : choisissez **« Importer un portefeuille »** et entrez votre phrase de récupération.  
     → Guide : [https://support.metamask.io/fr/start/use-an-existing-wallet/](https://support.metamask.io/fr/start/use-an-existing-wallet/)  
   - **Important** : ce compte sera utilisé **uniquement** pour déployer le contrat et signer les certifications DOC PROOF. Ne l’utilisez pas pour des usages personnels sensibles.

3. **Exporter la clé privée** (pour la variable `PRIVATE_KEY` du `.env`)  
   - Dans MetaMask : cliquez sur le **sélecteur de compte** (en haut — affiche « Compte 1 » ou votre adresse type `0x1234…`).  
   - **Ne pas confondre** avec le sélecteur de **réseau** (Ethereum, Polygon, Linea, Base, etc.) : il faut bien ouvrir le menu du **compte**, pas la liste des réseaux.  
   - Cliquez sur les **trois points verticaux** à côté du compte, puis **« Détails du compte »** (ou « Account details »).  
   - Cliquez sur **« Exporter la clé privée »** (« Private key »), saisissez votre mot de passe MetaMask et validez.  
   - **Interface actuelle** : vous arrivez sur l’écran « Account X / Clés privées » avec une liste de réseaux (Ethereum, Polygon, Linea, etc.). La clé est la même pour tous. Cliquez sur l’**icône copier** (deux carrés superposés) à droite d’un des réseaux (ex. **Polygon** pour DOC PROOF) pour copier la clé.  
   - *(Ancienne interface :* maintenir « Maintenir pour révéler la clé privée » puis copier.*)  
   - Collez la clé dans le `.env` pour `PRIVATE_KEY` (avec ou sans le préfixe `0x` selon la doc du projet).  
   - **Sécurité** : ne partagez jamais cette clé et ne la commitez pas dans le dépôt.  
   - Référence : [https://support.metamask.io/configure/accounts/how-to-export-an-accounts-private-key](https://support.metamask.io/configure/accounts/how-to-export-an-accounts-private-key)

### 2. Obtenir des MATIC/POL de test (réseau testnet)

Sans jetons de test (MATIC ou POL), le déploiement du contrat et les certifications échouent. **À faire dans cet ordre :**

1. **Choisir le testnet**  
   - **Mumbai** (chain ID 80001) : déprécié mais encore supporté par ce projet. Les faucets Mumbai sont de plus en plus rares.  
   - **Amoy** (chain ID 80002) : testnet Polygon actuel, recommandé. Les faucets ci‑dessous fournissent des POL sur Amoy.

2. **Récupérer l’adresse de votre portefeuille**  
   - Dans MetaMask : cliquez sur le nom du compte (ou l’adresse) en haut pour copier l’adresse (format `0x...`). C’est cette adresse qu’il faut coller dans le faucet.

3. **Aller sur un faucet et demander des jetons**  
   - Page officielle listant les faucets : **[https://faucet.polygon.technology/](https://faucet.polygon.technology/)**  
   - Faucets recommandés pour **Amoy** (recommandé) :  
     - **Alchemy** (0,5 POL/jour avec compte) : [https://www.alchemy.com/faucets/polygon-amoy](https://www.alchemy.com/faucets/polygon-amoy)  
     - **QuickNode** : [https://faucet.quicknode.com/polygon/amoy](https://faucet.quicknode.com/polygon/amoy)  
     - **GetBlock** (inscription gratuite) : [https://getblock.io/faucet/matic-amoy/](https://getblock.io/faucet/matic-amoy/)  
   - Sur le faucet : collez l’**adresse du portefeuille**, validez (et connectez un compte si demandé, ex. Alchemy). Les jetons arrivent en quelques secondes.

4. **Vérifier la réception**  
   - Dans MetaMask, ajoutez le réseau **Polygon Amoy** si besoin (Paramètres → Réseaux → Ajouter un réseau), puis vérifiez que le solde en POL (ou MATIC) a augmenté.  
   - Explorer Amoy : [https://amoy.polygonscan.com/](https://amoy.polygonscan.com/)

Si vous restez sur **Mumbai** : utilisez la même page [https://faucet.polygon.technology/](https://faucet.polygon.technology/) pour voir les options encore disponibles pour Mumbai.

### 3. Déployer le smart contract DOC PROOF

Le contrat doit être déployé **une fois** sur le réseau que vous utilisez. Sans adresse de contrat valide dans `.env`, la vérification ne peut pas fonctionner. **À faire dans cet ordre :**

1. **À la racine du projet**, copiez le fichier d’exemple d’environnement (si ce n’est pas déjà fait) :
   ```bash
   cp .env.example .env
   ```
2. Ouvrez le fichier **`.env`** à la racine et renseignez au minimum **`PRIVATE_KEY`** (la clé privée du wallet, avec ou sans `0x`).
3. Allez dans le dossier des contrats et installez les dépendances si ce n’est pas déjà fait :
   ```bash
   cd contracts
   npm install --legacy-peer-deps
   ```
4. Dans le dossier **`contracts`**, créez un fichier **`.env`** (ou copiez celui de la racine) avec :
   - **`PRIVATE_KEY`** : même clé privée.
   - **Pour Mumbai** : `POLYGON_MUMBAI_RPC_URL="https://rpc.ankr.com/polygon_mumbai"`  
   - **Pour Amoy (recommandé)** : `POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"`
5. Déployez le contrat :  
   - **Sur Mumbai** (testnet déprécié) :
     ```bash
     npx hardhat run scripts/deploy.js --network mumbai
     ```
   - **Sur Amoy** (recommandé) :
     ```bash
     npx hardhat run scripts/deploy.js --network amoy
     ```
6. À la fin du script, une ligne du type **« DocProof Proxy deployed to: 0x... »** s’affiche. **Copiez cette adresse** : c’est l’adresse du contrat à mettre dans l’app (étape 4).

Référence Hardhat : [https://hardhat.org/docs](https://hardhat.org/docs)

### 4. Remplir le `.env` à la racine du projet

De retour **à la racine** du projet (dossier `doc_proof_v1`), éditez le fichier **`.env`** et remplacez les placeholders par les **vraies valeurs** :

| Variable | Exemple / valeur à mettre |
|----------|---------------------------|
| **`NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS`** | L’adresse du contrat déployé à l’étape 3 (ex. `0x1234...abcd`). |
| **`NEXT_PUBLIC_CHAIN_ID`** | `80001` pour Mumbai, ou `80002` pour Amoy. |
| **`POLYGON_MUMBAI_RPC_URL`** | Si Mumbai : `https://rpc.ankr.com/polygon_mumbai`. |
| **`POLYGON_AMOY_RPC_URL`** | Si Amoy : `https://rpc-amoy.polygon.technology`. |
| **`PRIVATE_KEY`** | La clé privée du wallet (avec ou sans `0x`). **Ne jamais commiter ce fichier.** |

**Important** :  
- Ne laissez **pas** `NEXT_PUBLIC_DOC_PROOF_CONTRACT_ADDRESS="0x..."` ni `PRIVATE_KEY="your-metamask-private-key"`.  
- Sans adresse de contrat réelle, la vérification affichera toujours « Document introuvable ou révoqué » et « Émetteur : 0x0 ».  
- Sans `PRIVATE_KEY` valide, les certifications ne seront pas enregistrées et les documents resteront en PENDING.  
- Si vous déployez sur **Amoy** : mettez `NEXT_PUBLIC_CHAIN_ID="80002"` et `POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"` dans le `.env` à la racine (l’app utilise automatiquement l’RPC Amoy pour le chain ID 80002).

### 5. Redémarrer l’application et refaire un test

**À faire dans cet ordre :**

1. À la **racine** du projet, arrêtez le serveur de développement (Ctrl+C) puis relancez :
   ```bash
   npm run dev
   ```
2. **Re-téléchargez un document** (ou uploadez un nouveau fichier). Avec un `.env` correct, le document doit passer en statut **CERTIFIED** et vous devez voir un hash de transaction blockchain.
3. Allez sur **Vérifier**, collez le **hash du document** (format `0x...`) ou scannez le QR code.
4. Vous devriez obtenir **« Document valide »** et un **Émetteur** qui est une adresse du type `0x1234...` (plus jamais `0x0` pour un document certifié sur la chaîne).

### 6. Optionnel : IPFS (copie du document)

Pour stocker une copie du document sur IPFS (lien de preuve, pas obligatoire pour la vérification par hash). **À faire dans cet ordre :**

**Option A — Pinata**

1. Créez un compte : **[https://app.pinata.cloud/](https://app.pinata.cloud/)** (ou [https://app.pinata.cloud/register](https://app.pinata.cloud/register) pour l’inscription).
2. Une fois connecté : **API Keys** dans le menu → **New Key** → créez une clé (Admin ou avec les permissions nécessaires).
3. Copiez **API Key** et **API Secret** (ou **JWT**) dès l’affichage (ils ne seront plus visibles ensuite). Doc : [https://docs.pinata.cloud/account-management/api-keys](https://docs.pinata.cloud/account-management/api-keys)
4. Dans le **`.env`** à la racine :
   - `IPFS_PROVIDER="pinata"`
   - `PINATA_API_KEY="votre clé"`
   - `PINATA_API_SECRET="votre secret"`

**Option B — Web3.Storage**

1. Créez un compte : **[https://web3.storage/](https://web3.storage/)** (connexion par e‑mail ou GitHub).
2. Générez un **token API** depuis le tableau de bord. Doc : [https://web3.storage/docs/how-tos/generate-api-token/](https://web3.storage/docs/how-tos/generate-api-token/)
3. Dans le **`.env`** à la racine :
   - `IPFS_PROVIDER="web3storage"`
   - `WEB3_STORAGE_TOKEN="votre token"`

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
