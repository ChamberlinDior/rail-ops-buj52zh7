# Présentation concours SETRAG — conducteur 10 minutes

## Avant le passage — 2 minutes d’installation

- Ouvrir `index.html?page=jury` dans Edge ou Chrome.
- Vérifier le zoom à 90–100 %, le plein écran et la connexion à l’écran.
- Garder ouverts en secours : `?page=capacity`, `?page=sage` et `?page=architecture`.
- Ne pas dépendre d’Internet : les médias et les fichiers de la démo sont embarqués.
- Dire clairement qu’il s’agit d’un environnement de démonstration utilisant des connecteurs simulés.

## Speech — 10 minutes

### 0:00–1:00 — Problème SETRAG

« SETRAG doit aujourd’hui sécuriser ses recettes, éliminer les doublons et les réimpressions non contrôlées, diversifier les paiements et disposer d’une traçabilité complète, y compris lorsque le réseau est indisponible. TRANSMVET répond à ces enjeux avec une plateforme billettique unifiée conçue autour du fonctionnement réel du Transgabonais. »

Montrer **Présentation jury**.

### 1:00–2:00 — Cockpit de pilotage

Montrer **Vue d’ensemble**, puis **Centre des opérations**.

Messages : ventes, recettes, occupation, alertes, circulations et terminaux sont consolidés ; la Direction dispose d’une vision nationale et les responsables métier conservent leurs vues opérationnelles.

### 2:00–3:15 — Construction de l’offre

Montrer **Horaires & livrets**, puis **Tarification & Yield**.

Messages : workflow créateur-validateur, versions, validité, import/export, activation et expiration ; réductions contractuelles et simulation Yield avec contrôle humain.

### 3:15–4:15 — Innovation principale

Montrer **Voitures & places**.

Messages : l’inventaire est géré par portion de parcours. Une place vendue Owendo–Booué redevient disponible de Booué à Franceville. Les chevauchements sont interdits et chaque blocage est justifié et audité.

### 4:15–5:00 — Réseau commercial

Montrer **Agences**.

Messages : quotas par agence, départ, train, classe et segment ; visibilité sur l’utilisation et reprise des quotas sous-utilisés ; prise en charge des 89 postes du CDC.

### 5:00–6:30 — Vente unifiée

Montrer **Ventes & prestations**, puis ouvrir rapidement **Bagages** ou **Colis express**.

Messages : billet unique, paiement diversifié, génération QR, impression, rattachement bagage, vignettes multiples et suivi COLIRAIL. Les cinq prestations sont couvertes : billets, bagages, colis, TAA et transport funéraire.

### 6:30–7:15 — Résilience terrain

Montrer **Mode dégradé**.

Messages : le numéro pré-imprimé est conservé ; le système associe son identifiant technique sans réémettre un titre ; les opérations sont réconciliées après retour du réseau.

### 7:15–8:00 — Contrôle et fraude

Montrer **Application contrôleur** ou **Contrôles & fraude**.

Messages : QR/NFC, anti-double usage, vente/régularisation à bord, incidents, PV et fonctionnement offline avec synchronisation différée.

### 8:00–8:45 — Finance et audit

Montrer **Sage X3**.

Messages : journal V65, axes analytiques, contrôle HT + TVA + CSS = TTC, gestion des rejets et preuve de déversement. Toutes les opérations sensibles alimentent l’audit.

### 8:45–9:30 — Technique et sécurité

Montrer **Architecture & sécurité**.

Messages : SaaS, API-first, AD/SSO/MFA, RBAC, TLS/AES, SIEM, sauvegardes, PRA, environnements cloisonnés et applications offline-first.

### 9:30–10:00 — Valeur et conclusion

Montrer **Impact & offre**.

« Notre proposition ne remplace pas seulement un outil de vente. Elle sécurise la recette, fluidifie l’exploitation et prépare SETRAG à la vente omnicanale. Le déploiement est progressif sur les six mois du CDC, avec formation, accompagnement et réversibilité des données. »

## Réponses aux questions sensibles

**Les paiements sont-ils déjà connectés ?**  
« Dans cet environnement de concours, les connecteurs sont simulés. L’architecture cible prévoit des adaptateurs distincts pour Airtel Money, Moov Money, Click&Pay et les acquéreurs carte, avec webhooks signés, idempotence et rapprochement. »

**La démo est-elle le produit final ?**  
« Non. Elle démontre les parcours, règles métier et états attendus. Le projet suivra les étapes de cadrage, spécifications, intégration, sécurité, recette et déploiement prévues dans notre planning de six mois. »

**Comment fonctionne le hors-ligne ?**  
« Le terminal conserve localement un référentiel chiffré des titres et une file d’événements horodatés. Au retour du réseau, les événements sont synchronisés avec détection des conflits et traitement supervisé des cas ambigus. »

**Comment empêchez-vous la double vente ?**  
« Une réservation temporaire verrouille les segments concernés. L’émission est idempotente et atomique avec l’inventaire et le paiement. Une place peut être revendue uniquement sur les segments non occupés. »

**Quel est le modèle économique ?**  
« Un socle d’intégration et de déploiement, un abonnement SaaS modulé selon les modules/sites/volumes, puis les services de support et d’évolution. Le chiffrage définitif dépendra du cadrage des interfaces et des volumes SETRAG. »

## Règles de présentation

- Ne jamais affirmer que les chiffres de la démo sont des données SETRAG réelles.
- Ne jamais présenter RFID, géolocalisation ou IA comme déjà déployés.
- Toujours rattacher une fonction à une exigence précise du CDC.
- Montrer un seul parcours fort plutôt que parcourir tous les menus.
- Garder les modules détaillés pour les questions-réponses.
