# DOC PROOF — Guide utilisateur

## Vue d'ensemble

DOC PROOF est une plateforme de **certification blockchain de documents**. Elle permet de prouver de manière immuable l’authenticité et l’intégrité d’un document en enregistrant son empreinte (hash) sur la blockchain Polygon.

---

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
