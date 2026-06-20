# Backend Optiboost

## Stack recommandee

Pour cette application, la stack la plus adaptee est:

- Frontend: Next.js 16 deja en place
- Backend API: NestJS en TypeScript
- Base de donnees: PostgreSQL
- ORM: Prisma
- Authentification: JWT + refresh tokens, OAuth Google
- Jobs asynchrones: Redis + BullMQ
- Stockage fichiers: S3 ou Cloudinary/Supabase Storage pour les imports
- Emails: Resend ou SendGrid
- SMS / WhatsApp: Twilio ou WhatsApp Cloud API
- Validation: Zod ou class-validator
- Documentation API: OpenAPI / Swagger

## Pourquoi cette stack

Cette app n'est pas un simple site vitrine. Elle doit gerer:

- des comptes utilisateurs
- l'import CSV/XLSX
- de la segmentation clients
- des campagnes multicanales
- des statistiques et KPI
- des traitements longs et differes

Un backend NestJS est mieux adapte qu'un simple ensemble de routes Next.js car il structure proprement:

- l'authentification
- les modules metier
- les queues d'envoi
- les integrations externes
- les taches d'import et de recalcul

Si tu veux un MVP tres rapide, tu peux faire le backend dans les route handlers Next.js. Mais pour Optiboost, ce sera vite limite des que tu ajoutes les imports Excel, les campagnes et les workers. Mon conseil: garder Next.js pour le front et creer un backend NestJS separe.

## Architecture cible

### Frontend

- Next.js consomme une API REST securisee
- Les pages actuelles appellent le backend via fetch ou React Query

### Backend

- API REST pour auth, clients, campagnes, dashboard, imports
- Worker BullMQ pour parser les imports, lancer les envois et calculer les stats

### Donnees

- PostgreSQL pour les donnees metier
- Redis pour les jobs, retries et throttling
- S3 pour conserver les fichiers importes si besoin d'audit

## Modules metier a creer

- auth
- users
- organizations
- clients
- imports
- purchases
- segments
- campaigns
- messages
- dashboard
- simulator
- integrations

## Modele de donnees minimum

### 1. organizations

Une entreprise cliente de la plateforme.

- id
- name
- industry
- createdAt
- updatedAt

### 2. users

Utilisateurs qui se connectent a l'app.

- id
- organizationId
- firstName
- lastName
- email
- passwordHash
- role
- provider
- googleId
- createdAt
- updatedAt

### 3. clients

Base clients importee par l'entreprise.

- id
- organizationId
- firstName
- lastName
- fullName
- email
- phone
- birthDate
- lastPurchaseAt
- totalSpent
- premiumStatus
- status
- source
- createdAt
- updatedAt

`status` correspond a ce que ton front affiche deja: `Fidele`, `A relancer`, `Perdu`.

### 4. purchases

Historique des achats pour alimenter les KPI.

- id
- organizationId
- clientId
- amount
- productType
- productCategory
- purchasedAt
- createdAt

### 5. imports

Suivi des imports CSV/XLSX.

- id
- organizationId
- uploadedByUserId
- fileName
- storagePath
- status
- totalRows
- importedRows
- rejectedRows
- startedAt
- completedAt
- createdAt

### 6. import_rows

Lignes en erreur ou journal detaille.

- id
- importId
- rowNumber
- rawPayload
- status
- errorMessage

### 7. segments

Segments sauvegardes pour relances.

- id
- organizationId
- name
- rulesJson
- estimatedCount
- createdByUserId
- createdAt

### 8. campaigns

Campagnes de relance.

- id
- organizationId
- name
- channel
- status
- segmentId
- messageTemplate
- scheduledAt
- sentAt
- createdByUserId
- createdAt
- updatedAt

### 9. campaign_recipients

Traque l'envoi par client.

- id
- campaignId
- clientId
- status
- sentAt
- deliveredAt
- openedAt
- clickedAt
- repliedAt
- failureReason

### 10. refresh_tokens

- id
- userId
- tokenHash
- expiresAt
- createdAt
- revokedAt

## Regles metier a centraliser dans le backend

### Statut client

Le statut ne doit pas etre saisi a la main dans le front. Il doit etre calcule a partir des achats.

Exemple simple pour demarrer:

- `Fidele`: achat dans les 90 derniers jours et montant cumule important
- `A relancer`: aucun achat entre 90 et 365 jours
- `Perdu`: aucun achat depuis plus de 365 jours

### KPI dashboard

Le backend doit calculer:

- panier moyen
- ratio clients premium
- repartition `Fidele` / `A relancer` / `Perdu`
- potentiel de relance
- clients a contacter par canal
- performances des campagnes recentes

### Simulation de gains

Le calcul actuellement fait dans le front peut rester cote front pour l'UX, mais il faut aussi un endpoint backend si tu veux:

- historiser les simulations
- partager des scenarios
- utiliser de vraies donnees par entreprise

## Endpoints API a creer

Base URL proposee: `/api/v1`

## 1. Authentification

### POST /api/v1/auth/register

Inscription email/mot de passe.

Body:

```json
{
  "email": "owner@shop.fr",
  "password": "strongPassword",
  "firstName": "Alice",
  "lastName": "Martin",
  "organizationName": "Optique Martin"
}
```

### POST /api/v1/auth/login

Connexion email/mot de passe.

### POST /api/v1/auth/google

Connexion/inscription Google.

### POST /api/v1/auth/refresh

Renouvelle l'access token.

### POST /api/v1/auth/logout

Invalide le refresh token.

### POST /api/v1/auth/forgot-password

Envoie un email de reinitialisation.

### POST /api/v1/auth/reset-password

Reinitialise le mot de passe avec token.

### GET /api/v1/auth/me

Retourne l'utilisateur connecte et son organisation.

## 2. Dashboard

### GET /api/v1/dashboard/overview

Retourne toutes les cartes du dashboard:

```json
{
  "averageBasket": 285,
  "averageBasketDelta": 4.2,
  "premiumRatio": 24,
  "segments": {
    "fidele": 58,
    "aRelancer": 30,
    "perdu": 12
  },
  "recoveryPotential": 4250,
  "quickCampaignCounts": {
    "email": 318,
    "sms": 142,
    "whatsapp": 96
  }
}
```

### GET /api/v1/dashboard/recent-clients

Alimente le tableau de la page d'accueil.

### GET /api/v1/dashboard/campaigns-summary

Resume des campagnes recentes avec taux d'ouverture.

## 3. Clients

### GET /api/v1/clients

Liste paginee avec filtres.

Query params:

- `search`
- `status`
- `category`
- `page`
- `limit`
- `sortBy`
- `sortOrder`

Exemple:

`GET /api/v1/clients?search=sophie&status=A%20relancer&page=1&limit=20`

### GET /api/v1/clients/:id

Detail d'un client.

### POST /api/v1/clients

Ajout manuel d'un client.

### PATCH /api/v1/clients/:id

Modification d'un client.

### DELETE /api/v1/clients/:id

Suppression logique de preference.

### POST /api/v1/clients/:id/relance

Declenche une relance rapide pour un seul client.

Body:

```json
{
  "channel": "email",
  "template": "Bonjour {{firstName}}, il est temps de renouveler votre equipement."
}
```

### GET /api/v1/clients/stats/segments

Compte par segment/statut.

## 4. Imports CSV / Excel

### POST /api/v1/imports

Upload du fichier CSV/XLSX.

Format: `multipart/form-data`

Le backend:

- stocke le fichier
- cree un job d'analyse
- detecte les colonnes
- retourne un `importId`

### GET /api/v1/imports/:id

Statut de l'import.

Exemple de retour:

```json
{
  "id": "imp_123",
  "status": "processing",
  "totalRows": 1200,
  "importedRows": 900,
  "rejectedRows": 23
}
```

### GET /api/v1/imports/:id/errors

Liste des lignes rejetees.

### POST /api/v1/imports/:id/confirm

Confirme le mapping de colonnes avant insertion finale si tu veux une etape de validation utilisateur.

### DELETE /api/v1/imports/:id

Annule ou nettoie un import.

## 5. Achats

### GET /api/v1/purchases

Historique pagine des achats.

### POST /api/v1/purchases

Ajout manuel d'un achat.

### GET /api/v1/clients/:id/purchases

Achats d'un client.

## 6. Segmentation

### GET /api/v1/segments

Liste des segments sauvegardes.

### POST /api/v1/segments

Creation d'un segment dynamique.

Body exemple:

```json
{
  "name": "Clients inactifs 6 mois",
  "rules": {
    "lastPurchaseBeforeDays": 180,
    "minTotalSpent": 100,
    "hasEmail": true
  }
}
```

### GET /api/v1/segments/:id

Detail du segment et estimation du nombre de clients.

### GET /api/v1/segments/:id/clients

Preview des clients dans le segment.

### PATCH /api/v1/segments/:id

Modification du segment.

### DELETE /api/v1/segments/:id

Suppression du segment.

## 7. Campagnes

### GET /api/v1/campaigns

Liste des campagnes avec filtres `status`, `channel`, `page`.

### GET /api/v1/campaigns/:id

Detail d'une campagne.

### POST /api/v1/campaigns

Creation d'une campagne.

Body exemple:

```json
{
  "name": "Relance clients perdus 2024",
  "channel": "email",
  "segmentId": "seg_123",
  "messageTemplate": "Bonjour {{firstName}}, nous avons une offre pour vous.",
  "scheduledAt": "2026-06-24T09:00:00.000Z"
}
```

### PATCH /api/v1/campaigns/:id

Edition tant que la campagne n'est pas partie.

### POST /api/v1/campaigns/:id/launch

Lance immediatement la campagne.

### POST /api/v1/campaigns/:id/pause

Met en pause une campagne en cours si ton fournisseur le permet.

### POST /api/v1/campaigns/:id/cancel

Annule une campagne programmee.

### GET /api/v1/campaigns/:id/recipients

Statut des destinataires.

### GET /api/v1/campaigns/:id/analytics

Retourne les stats:

- sent
- delivered
- opened
- clicked
- replied
- failed
- revenueGenerated si tu relies un achat a une campagne

## 8. Messages et templates

### GET /api/v1/templates

Liste des templates de message.

### POST /api/v1/templates

Creation d'un template.

### PATCH /api/v1/templates/:id

Modification d'un template.

### DELETE /api/v1/templates/:id

Suppression d'un template.

### POST /api/v1/messages/preview

Genere un apercu avec variables remplacees.

## 9. Simulateur

### POST /api/v1/simulator/estimate

Permet d'avoir un calcul backend coherent avec le front.

Body:

```json
{
  "inactiveClients": 560,
  "averageBasket": 285,
  "conversionRate": 5
}
```

Response:

```json
{
  "recoveredClients": 28,
  "estimatedRevenue": 7980
}
```

### GET /api/v1/simulator/defaults

Retourne des valeurs par defaut basees sur les donnees de l'organisation.

## 10. Integrations

### GET /api/v1/integrations

Etat des integrations configurees.

### POST /api/v1/integrations/google/connect

### POST /api/v1/integrations/twilio/connect

### POST /api/v1/integrations/whatsapp/connect

### POST /api/v1/integrations/resend/connect

## Endpoints minimum pour faire fonctionner les ecrans actuels

Si tu veux seulement brancher le front actuel rapidement, commence par ces endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/dashboard/recent-clients`
- `GET /api/v1/dashboard/campaigns-summary`
- `GET /api/v1/clients`
- `POST /api/v1/clients/:id/relance`
- `POST /api/v1/imports`
- `GET /api/v1/imports/:id`
- `GET /api/v1/campaigns`
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/:id/analytics`
- `POST /api/v1/simulator/estimate`

## Providers recommandes

### Email

- Resend pour demarrer vite
- SendGrid si tu veux plus d'historique et de volume

### SMS

- Twilio

### WhatsApp

- Meta WhatsApp Cloud API
- ou Twilio si tu veux centraliser

### Fichiers

- AWS S3
- ou Supabase Storage si tu veux simplifier l'infra

## Securite a prevoir des le debut

- hash des mots de passe avec Argon2
- access token court + refresh token rotatif
- isolation stricte par `organizationId`
- rate limiting sur login, forgot-password et imports
- validation stricte des fichiers importes
- antivirus ou scan basique si tu acceptes des fichiers utilisateurs
- logs d'audit pour import, suppression, lancement de campagne

## Roadmap de realisation

### Phase 1 - base fonctionnelle

- auth email/password + Google
- gestion organisation/utilisateur
- CRUD clients
- dashboard overview
- simulateur

### Phase 2 - import donnees

- upload CSV/XLSX
- parsing + mapping colonnes
- import asynchrone
- journal d'erreurs

### Phase 3 - segmentation et campagnes

- segments dynamiques
- creation campagne
- envoi email
- analytics de base

### Phase 4 - canaux avances

- SMS
- WhatsApp
- automatisations
- attribution du CA par campagne

## Recommandation finale

Pour ton app actuelle, je recommande clairement:

- frontend conserve en Next.js
- backend separe en NestJS
- PostgreSQL + Prisma
- Redis + BullMQ pour les imports et campagnes
- Resend pour l'email
- Twilio pour SMS
- WhatsApp Cloud API pour WhatsApp

Si tu veux aller vite sans sacrifier l'architecture, commence par les modules:

1. auth
2. clients
3. dashboard
4. imports
5. campaigns

Quand ces cinq modules existent, ton front actuel peut deja devenir reellement fonctionnel.