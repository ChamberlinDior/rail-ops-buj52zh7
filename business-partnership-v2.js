(function(){'use strict';
window.BUSINESS_PARTNERSHIP_V2=true;
const I=n=>`<i data-lucide="${n}"></i>`;
const fmt=n=>new Intl.NumberFormat('fr-FR').format(n);
const C=(icon,title,text)=>`<article class="bp-card bp-reveal"><span>${I(icon)}</span><h3>${title}</h3><p>${text}</p></article>`;
const S=(id,no,title,lead,body,cls='')=>`<section id="${id}" class="bp-section ${cls}" data-bp-slide><header class="bp-head bp-reveal"><small>${no}</small><h2>${title}</h2><p>${lead}</p></header>${body}</section>`;
// Neutralizes upgrade.js's global enhanceTables(), which rewrites any table's
// first/last cell (fake avatar, generic "···" menu) unless these markers exist.
const noAvatar='<span class="avatar-cell" style="display:none" aria-hidden="true"></span>';
const noDots='<span class="row-actions" style="display:none" aria-hidden="true"></span>';
const table=(headers,rows)=>`<div class="bp-compare bp-reveal"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th>${noAvatar}${c}</th>`:i===r.length-1?`<td>${noDots}${c}</td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const LOTS=[
 {n:'Gouvernance, cadrage & AMOA',icon:'compass',amount:6000000,just:'Ateliers, processus, exigences, risques, backlog, pilotage.',subs:[
  ['Ateliers métiers & cartographie des processus',1600000,'Vente, contrôle, bagages, colis, TAA, funéraire, finance, exploitation.'],
  ['Spécifications & backlog priorisé',1500000,'User stories, règles, cas d’erreur, critères d’acceptation.'],
  ['Gouvernance projet & risques',1400000,'COPIL, reporting, arbitrages, registre risques/dépendances.'],
  ['AMOA recette & conduite du changement',1500000,'Préparation UAT, validation métier et accompagnement décisions.']]},
 {n:'UX/UI & design system',icon:'palette',amount:4000000,just:'Parcours, prototypes, ergonomie guichets/terrain, design system.',subs:[
  ['Recherche utilisateurs & parcours',900000,'Guichet, back office, contrôle, voyageur.'],
  ['Prototypes haute fidélité',1200000,'Écrans clés et scénarios critiques avant développement.'],
  ['Design system',1000000,'Composants, états, formulaires, tableaux, responsive.'],
  ['Accessibilité & optimisation terrain',900000,'Lisibilité, vitesse d’exécution, erreurs et usage sur terminaux.']]},
 {n:'Architecture & socle plateforme',icon:'network',amount:8000000,just:'Architecture, sécurité, API edge, socles techniques, standards.',subs:[
  ['Architecture applicative & données',1800000,'Découpage, flux, modèles, exigences non fonctionnelles.'],
  ['Socle sécurité / API / gateway',1500000,'AuthN/AuthZ, TLS, rate limit, conventions API.'],
  ['Socle technique Spring Boot',1700000,'Gestion erreurs, audit, validation, configuration, standards.'],
  ['Architecture HA & déploiement',1500000,'Topologies local/cloud/hybride, réseau et redondance.'],
  ['Dossier d’architecture & revues',1500000,'Documentation, schémas, décisions et revues de conformité.']]},
 {n:'Backend Spring Boot & moteurs métier',icon:'server-cog',amount:14000000,just:'Transactions, ventes, places, tarifs, finance, audit, workflows.',subs:[
  ['Référentiels & identité métier',2000000,'Gares, trains, voitures, places, produits, utilisateurs.'],
  ['Moteur vente / réservation',3000000,'Disponibilité, concurrence, émission, QR, duplicata.'],
  ['Moteur tarification / quotas',2500000,'Tarifs, réductions, règles, classes, segments, remplissage.'],
  ['Prestations annexes',2000000,'Bagages, colis, TAA, funéraire, messagerie.'],
  ['Finance transactionnelle',2500000,'Paiements, caisse, annulation, remboursement, rapprochement.'],
  ['Audit & traitements asynchrones',2000000,'Traçabilité, idempotence, queues, notifications, reprise.']]},
 {n:'Back Office & pilotage',icon:'layout-dashboard',amount:10000000,just:'Administration, ventes, caisses, trains, prestations, KPI, rapports.',subs:[
  ['Administration & référentiels',2000000,'Paramétrage central et gestion des droits.'],
  ['Ventes, caisses & contrôle financier',2400000,'Guichets, journaux, clôtures, écarts, annulations.'],
  ['Exploitation ferroviaire',2000000,'Trains, compositions, places, quotas, statuts.'],
  ['Prestations & recherche',1500000,'Voyageurs, bagages, colis et dossiers associés.'],
  ['KPI, rapports & exports',2100000,'Pilotage opérationnel, directionnel et contrôles.']]},
 {n:'Front Office & mobilité terrain',icon:'smartphone',amount:8000000,just:'Réservation, paiement, billet, contrôle QR, notifications, synchro.',subs:[
  ['Parcours consultation/réservation',2000000,'Recherche, disponibilité, sélection et confirmation.'],
  ['Paiement & e-billet',1700000,'Paiement, QR, reçu, historique et statut.'],
  ['Suivi prestations & notifications',1200000,'Bagages, colis, messages et informations client.'],
  ['Application contrôle terrain',2100000,'Scan QR, validation, statut, synchronisation.'],
  ['Mode connectivité dégradée',1000000,'Cache local, file de synchronisation et résolution des conflits.']]},
 {n:'Data, stockage, migration, sauvegarde & PRA',icon:'database',amount:8000000,just:'DB HA, cache, objet, migration, sauvegarde, restauration, PRA.',subs:[
  ['Modèle de données & optimisation',1500000,'Schéma, contraintes, index, transactions, capacité.'],
  ['Haute disponibilité DB',1100000,'Réplication/cluster, procédures de bascule et monitoring.'],
  ['Cache & stockage objet',900000,'Redis, S3-compatible/MinIO, versioning et organisation.'],
  ['Migration & qualité des données',1500000,'Mapping, nettoyage, contrôles, reprises et preuves.'],
  ['Sauvegarde, PITR & rétention',1400000,'Politique 3-2-1, chiffrement, rotation et restauration.'],
  ['PRA & tests de restauration',1600000,'Runbooks, exercices, RPO/RTO et rapport de validation.']]},
 {n:'API, paiements & intégrations SI',icon:'plug-zap',amount:9000000,just:'Sage X3, AD, SIEM, COLIRAIL, paiements, contrats d’interface.',subs:[
  ['Paiements & réconciliation',2000000,'API, callbacks, idempotence, statuts et rapprochement.'],
  ['Sage X3 V12',1800000,'Mapping, flux, erreurs, journalisation et tests.'],
  ['Active Directory / SSO',1300000,'Intégration identité et groupes.'],
  ['SIEM / monitoring',1000000,'Format, transport, corrélation et tests.'],
  ['COLIRAIL',1400000,'Contrat d’interface, mapping et reprises.'],
  ['API partenaires / imports-exports',1500000,'Versioning, documentation et jeux de tests.']]},
 {n:'Cybersécurité & IAM',icon:'shield-check',amount:7000000,just:'SSO/MFA/RBAC, chiffrement, secrets, hardening, scans, audit.',subs:[
  ['IAM SSO/MFA/RBAC',1600000,'Rôles, politiques, moindre privilège, déprovisionnement.'],
  ['Chiffrement & secrets',1000000,'TLS, at-rest, coffre de secrets, rotation.'],
  ['Hardening & sécurité réseau',1000000,'Headers, WAF/rate limiting, segmentation, configuration.'],
  ['Audit & SIEM',1000000,'Événements sensibles, export et conservation.'],
  ['DevSecOps & scans',1100000,'SAST, dépendances, containers, remédiation.'],
  ['Revue sécurité / tests',1300000,'Vérifications ciblées avant mise en production.']]},
 {n:'DevOps, environnements & observabilité',icon:'git-branch',amount:6000000,just:'CI/CD, Docker, configuration, logs, métriques, alertes.',subs:[
  ['Dev/Test/Préprod/Prod',1300000,'Configurations, isolation et règles de promotion.'],
  ['CI/CD',1200000,'Builds, tests, artefacts, approbations, rollback.'],
  ['Conteneurisation & déploiement',900000,'Docker, registry et procédures.'],
  ['Monitoring & dashboards',1000000,'Métriques techniques et métier.'],
  ['Logs centralisés & alertes',900000,'Recherche, corrélation, seuils et notifications.'],
  ['Infrastructure as Code / runbooks',700000,'Reproductibilité, documentation et exploitation.']]},
 {n:'QA, performance, sécurité & UAT',icon:'flask-conical',amount:5000000,just:'Tests, non-régression, charge, intégration, recette, corrections.',subs:[
  ['Stratégie & cas de tests',900000,'Couverture fonctionnelle et criticité.'],
  ['Tests automatisés ciblés',900000,'API, non-régression et parcours critiques.'],
  ['Tests intégration & bout en bout',900000,'SI tiers, paiements, rôles et erreurs.'],
  ['Charge & performance',900000,'Scénarios, seuils, bottlenecks et recommandations.'],
  ['UAT & corrections recette',1400000,'Support métier, anomalies et validation finale.']]},
 {n:'Documentation, formation, déploiement & support initial',icon:'graduation-cap',amount:5000000,just:'Guides, transfert, mise en production, garantie corrective initiale.',subs:[
  ['Documentation utilisateur',900000,'Guides agents, superviseurs et administrateurs.'],
  ['Documentation technique',1000000,'Architecture, API, données, exploitation et sécurité.'],
  ['Formation & transfert',1100000,'Sessions utilisateurs clés et équipe technique.'],
  ['Mise en production',1000000,'Checklist, migration, validation et accompagnement.'],
  ['Garantie corrective initiale',1000000,'Correction anomalies du périmètre livré selon modalités convenues.']]}
];
const TOTAL=LOTS.reduce((a,l)=>a+l.amount,0);

function render(){
const facteurs=[
 ['Complexité métier','Billetterie, trains, voitures, places, segments, tarifs, bagages, colis, TAA, funéraire, messagerie, annulations, remboursements, caisses et reporting.','Multiples règles concurrentes et impacts financiers.'],
 ['Interopérabilité','Paiements, Sage X3 V12, Active Directory, SIEM, COLIRAIL, imports/exports et API partenaires.','Contrats d’interface, sécurité, reprise et tests croisés.'],
 ['Données critiques','Transactions financières, identité voyageurs, inventaire de places, documents, historique et audit.','Intégrité, sauvegarde, restauration, chiffrement, rétention.'],
 ['Disponibilité','Exploitation gares/guichets/terrain, connectivité variable, besoin de mode dégradé.','Redondance, files de traitement, synchronisation et PRA.'],
 ['Cybersécurité','Comptes agents, droits, données personnelles, paiements, opérations sensibles.','SSO/MFA/RBAC, SIEM, secrets, OWASP, journalisation.'],
 ['Responsabilité de livraison','Architecture, code, tests, déploiement, formation, documentation, garantie corrective.','Le prestataire porte la chaîne de livraison de bout en bout.']
];
const stack=[
 ['Front Office','React','Réservation, paiement, billet, suivi services, espace client.'],
 ['Back Office','React','Administration, ventes, caisses, tarification, trains, places, KPI, audit.'],
 ['Mobile terrain','React Native / Expo selon contraintes','QR, contrôle, synchronisation, notifications et mode dégradé.'],
 ['Services métier','Java 21+ / Spring Boot','Règles métier, transactions, sécurité, API, workflows, intégrations.'],
 ['API & Edge','Nginx/HAProxy + API Gateway','TLS, routage, rate limiting, contrôle d’accès, exposition sécurisée.'],
 ['Cache','Redis','Sessions techniques, cache contrôlé, verrous distribués selon besoin.'],
 ['Messagerie','RabbitMQ ou Kafka selon volumétrie','Découplage, reprise asynchrone, notifications et traitements fiables.'],
 ['Observabilité','Prometheus/Grafana + OpenSearch/ELK ou équivalent','Métriques, logs centralisés, alertes, diagnostics et capacité.']
];
const hebergement=[
 ['Option A · On-premise SETRAG','VM/serveurs dans le datacenter SETRAG, stockage local, réplication interne, sauvegarde sur NAS/repository + copie hors site.','Souveraineté maximale, maîtrise réseau et données.','Nécessite capacité datacenter, supervision et redondance locales.'],
 ['Option B · Cloud autorisé','VM/containers + base managée ou autogérée, stockage objet, sauvegardes multi-zone, WAF et supervision.','Élasticité, services managés, PRA simplifié.','Dépend des politiques SETRAG, coûts récurrents et connectivité.'],
 ['Option C · Hybride','Applications et données principales dans l’environnement choisi, réplication/backup secondaire sur site ou cloud autorisé.','Compromis résilience/souveraineté, stratégie de secours renforcée.','Architecture réseau et gouvernance plus poussées.']
];
const donnees=[
 ['Base transactionnelle','MySQL 8 / InnoDB de référence','Transactions ACID, contraintes, indexation, réplication, journal binaire, audit.'],
 ['Haute disponibilité','Primary/Replica ou InnoDB Cluster','Réduction du point de panne unique, lectures secondaires et bascule contrôlée.'],
 ['Cache','Redis','Réduction de charge, données temporaires, verrous/idempotence selon cas.'],
 ['Documents','Stockage objet S3-compatible / MinIO','Billets, justificatifs, exports, pièces et archives avec versioning.'],
 ['Archivage','Partitions / politiques de rétention','Séparation données chaudes/froides, maîtrise volumétrie et conformité.'],
 ['Sauvegarde','Full + incrémental/logs + PITR','Retour à un point précis, sauvegardes chiffrées et contrôlées.'],
 ['Option SGBD alternatif','PostgreSQL si standard SETRAG l’exige','Portabilité d’architecture ; étude de compatibilité et migration au cadrage.']
];
const cyber=[
 ['fingerprint','Identité','SSO Active Directory via OIDC/SAML2, MFA','Centraliser les identités, réduire les comptes locaux et renforcer les accès sensibles.'],
 ['key-round','Autorisation','RBAC + moindre privilège','Profils guichet, contrôle, finance, supervision, administrateur, audit ; séparation des tâches.'],
 ['lock','Chiffrement','TLS 1.2/1.3 en transit + chiffrement au repos','Protéger données voyageurs, financières, sauvegardes et documents.'],
 ['key','Secrets','Vault / gestionnaire de secrets ou équivalent','Aucun mot de passe/API key en code source ; rotation et contrôle d’accès.'],
 ['shield-alert','Application','OWASP Top 10, validation d’entrée, CSRF/CORS, rate limiting','Réduire les attaques web/API et abus de service.'],
 ['history','Traçabilité','Audit immuable des actions sensibles + horodatage','Qui a vendu, annulé, remboursé, modifié un tarif ou changé des droits.'],
 ['radar','SIEM','Export logs sécurité vers SIEM SETRAG','Détection, investigation, alertes et corrélation.'],
 ['scan-search','Sécurité DevSecOps','SAST, dépendances, images containers, scans vulnérabilités','Détecter plus tôt les failles et gérer les correctifs.'],
 ['eye-off','Données de test','Masquage/anonymisation','Éviter l’utilisation de données réelles non nécessaires hors production.']
];
const pra=[
 ['Disponibilité cible','À contractualiser après cadrage','Architecture redondable, monitoring 24/7 possible selon organisation, health checks et alertes.'],
 ['RPO','Objectif de perte de données maximale','Défini selon criticité ; PITR et réplication permettent d’abaisser la perte potentielle.'],
 ['RTO','Objectif de délai de reprise','Procédures, infrastructure secondaire et tests de bascule adaptés au niveau choisi.'],
 ['Mode dégradé','Continuité limitée en cas de connectivité instable','File locale/queue, synchronisation, contrôle des doublons et réconciliation.'],
 ['PRA','Plan de reprise après activité','Runbooks, rôles, ordre de redémarrage, bascule, communication et retour nominal.'],
 ['Tests de restauration','Exercices planifiés','Prouver que les sauvegardes sont exploitables et mesurer le temps réel de reprise.']
];
const apiInteg=[
 ['Paiements / Mobile Money','API sécurisée, callback/webhook, idempotence, rapprochement','Éviter les doubles débits, gérer timeouts, statuts incertains et réconciliation.'],
 ['Sage X3 V12','API/fichiers selon interfaces disponibles','Écritures, journaux, rapprochement, exports et contrôle de cohérence.'],
 ['Active Directory','OIDC/SAML2/LDAP selon environnement','SSO, groupes, rôles et cycle de vie des utilisateurs.'],
 ['SIEM','Syslog/API/agent selon standard SETRAG','Centraliser événements sécurité et alertes.'],
 ['COLIRAIL','Contrat d’interface à définir','Synchronisation des données utiles, statuts et échanges métier.'],
 ['Front Office / contrôle','API versionnées','Même source de vérité, sécurité uniforme, évolutions maîtrisées.'],
 ['Imports/exports','CSV/JSON/XML contrôlés','Reprise, échanges batch, exports réglementaires et exploitation.']
];
const devops=[
 ['Gestion du code','Git + branches protégées + revue','Traçabilité des changements et validation par pair.'],
 ['CI','Build, tests unitaires, SAST, dépendances','Bloquer les versions défectueuses avant déploiement.'],
 ['CD','Pipelines Dev/Test/Préprod/Prod','Déploiements reproductibles, approbations et rollback.'],
 ['Conteneurs','Docker','Parité d’environnement et packaging standard.'],
 ['Secrets','Vault/équivalent','Injection sécurisée des secrets par environnement.'],
 ['Monitoring','Prometheus/Grafana ou équivalent','CPU, RAM, JVM, DB, API, transactions, files, erreurs.'],
 ['Logs','OpenSearch/ELK ou équivalent','Recherche centralisée, corrélation et diagnostic.'],
 ['Alerting','Canaux SETRAG à définir','Notification proactive des incidents et dérives.'],
 ['Capacity planning','Tests de charge + suivi tendance','Dimensionnement basé sur les volumes réels et seuils de saturation.']
];
const orga=[
 ['Directeur / Chef de projet','Pilotage contractuel, COPIL, risques, arbitrages, qualité.','M1-M6'],
 ['Architecte / Tech Lead','Architecture, standards, revues de code, décisions techniques.','M1-M6'],
 ['Backend Spring Boot','Services métier, transactions, sécurité, intégrations.','M2-M5'],
 ['Frontend React','Back Office, Front Office, tableaux, ergonomie.','M2-M5'],
 ['Mobile React Native','Contrôle, QR, offline/sync, notifications.','M3-M5'],
 ['UX/UI','Recherche, prototypes, design system.','M1-M3'],
 ['Data / DBA','Modèle, performance, migration, sauvegarde, réplication.','M1-M6'],
 ['DevOps / SRE','CI/CD, infra, monitoring, logs, déploiement.','M1-M6'],
 ['Cybersecurity','IAM, hardening, scans, SIEM, revue.','M1-M6'],
 ['QA / Recette','Stratégie tests, automatisation, UAT, suivi anomalies.','M2-M6'],
 ['Formateur / Change','Guides, formation, transfert et support démarrage.','M5-M6']
];
const planning=[
 ['Mois 1','Cadrage, UX, architecture, sécurité','Dossier de cadrage, cartographie, architecture cible, prototypes, backlog, plan data/PRA.'],
 ['Mois 2','Socles, référentiels, IAM, DevOps','Environnements, CI/CD, SSO/RBAC, référentiels, schéma DB, API socle.'],
 ['Mois 3','Vente, capacité, prestations','Billets, places, tarification, bagages, colis, TAA, funéraire, QR, Front/Back principaux.'],
 ['Mois 4','Finance & intégrations','Paiements, caisse, annulations/remboursements, Sage X3, COLIRAIL, SIEM, AD.'],
 ['Mois 5','Pilotage, performance, PRA','KPI, reporting, observabilité, charge, sécurité, sauvegardes, restauration, préproduction.'],
 ['Mois 6','UAT, migration, formation, production','Recette, corrections, migration finale, formation, documentation, mise en production, support démarrage.']
];
const recetteCriteres=[
 ['Fonctionnel','Parcours critiques conformes ; aucune anomalie bloquante à la recette.'],
 ['Finance','Cohérence ventes/encaissements/annulations/remboursements ; rapprochement démontré.'],
 ['Sécurité','Contrôles d’accès, audit, vulnérabilités critiques traitées, secrets gérés.'],
 ['Données','Sauvegarde et restauration démontrées ; intégrité et migration validées.'],
 ['Performance','Seuils définis pendant cadrage respectés sur scénario de charge convenu.'],
 ['Exploitation','Monitoring, logs, alertes, runbooks et PRA disponibles avant production.'],
 ['Adoption','Utilisateurs clés formés et transfert de compétences réalisé.']
];
const livrables=['Rapport de cadrage et cartographie des processus','Spécifications fonctionnelles et techniques, backlog et critères d’acceptation','Dossier d’architecture applicative, données, réseau, sécurité et intégration','Code source et pipelines de build/déploiement selon conditions contractuelles','Back Office, Front Office, mobile terrain et services API déployés','Documentation OpenAPI/contrats d’interface et jeux de tests','Plan de tests, résultats, rapport de charge, registre d’anomalies et PV de recette','Dossier d’exploitation : supervision, sauvegardes, restauration, PRA, secrets','Guides utilisateurs, manuel administrateur et documentation technique','Supports de formation, transfert de compétences et PV de mise en production'];
const commissionRegles=[
 ['Transactions éligibles','Billets voyageurs, bagages, colis express, TAA, transport funéraire et messagerie encaissés via la plateforme.'],
 ['Assiette','Montant HT effectivement encaissé, net des annulations, remboursements, fraudes et opérations invalidées.'],
 ['Déclenchement','À compter de la mise en production et de l’ouverture commerciale.'],
 ['Périodicité','Calcul mensuel avec journal détaillé et rapprochement.'],
 ['Plafond','80 000 000 FCFA HT cumulés.'],
 ['Arrêt','Automatique lorsque le plafond est atteint.'],
 ['Paiement anticipé','SETRAG peut solder le montant restant directement, sans pénalité, selon contrat.']
];
const commissionExemples=[[50000000,32.0],[100000000,16.0],[150000000,10.7],[200000000,8.0],[300000000,5.3]];
const hypotheses=[
 ['Matériels TPE / terminaux','Non inclus par défaut ; fourniture, SIM, accessoires et maintenance à chiffrer après choix.'],
 ['RFID / NFC','Cartes, encodeurs, lecteurs et licences éventuelles à traiter si retenus.'],
 ['Imprimantes / scanners','Matériel et consommables sur devis ou fournis par SETRAG.'],
 ['Bornes libre-service','Option après validation du modèle opérationnel.'],
 ['Frais opérateurs / banques','Selon contrats SETRAG avec opérateurs et établissements financiers.'],
 ['Cloud/datacenter récurrent','Coûts d’hébergement récurrents dimensionnés après choix de l’architecture et volumes.'],
 ['Licences tierces','Non incluses sauf mention expresse ; priorité aux composants open source / existants SETRAG.'],
 ['Migration historique complexe','Incluse pour données disponibles, documentées et exploitables ; anomalies lourdes après diagnostic.'],
 ['Évolutions hors périmètre','Chiffrées et validées par avenant ou bon de commande.']
];
const valeur=[
 ['trending-up','Maîtrise des recettes','Traçabilité des ventes, annulations, remboursements, caisses et rapprochements.'],
 ['shield-check','Réduction du risque','Architecture HA, sauvegardes testées, PRA, observabilité et procédures incident.'],
 ['lock','Sécurité','Identités centralisées, droits, chiffrement, audit et SIEM.'],
 ['gauge','Productivité','Back Office unifié, recherches rapides, automatisation et réduction des doubles saisies.'],
 ['plug-zap','Interopérabilité','API et contrats d’interface pour intégrer l’écosystème SETRAG.'],
 ['blocks','Évolutivité','Architecture modulaire, conteneurisée et portable entre local/cloud/hybride.'],
 ['graduation-cap','Transfert de compétences','Documentation, formation et procédures permettant à SETRAG de maîtriser l’exploitation.'],
 ['wallet','Protection budgétaire','Prix initial plafonné, lots contrôlables et rémunération différée alignée sur l’activité.']
];
const cadreContractuel=['Valeur contractuelle initiale : 90 000 000 FCFA HT pour le périmètre de référence','Acompte : 10 000 000 FCFA HT à la signature / ordre de service','Solde différé : 80 000 000 FCFA HT après mise en exploitation','Taux indicatif : 5 % de l’assiette HT éligible, taux définitif inscrit au contrat','Définition précise des transactions éligibles et exclusions des annulations, remboursements, fraudes et montants non encaissés','Rapprochement mensuel, journal détaillé, droit de vérification réciproque','Arrêt automatique de la commission dès 80 M FCFA HT recouvrés','Possibilité de paiement anticipé du solde restant','Procédure formelle de changement de périmètre pour maîtriser coûts et délais','Critères de recette, garantie corrective, propriété intellectuelle, réversibilité et remise du code à préciser au contrat'];

return `<div class="bp-page"><div class="bp-progress"><i></i></div>
<nav class="bp-nav"><span><b>SETRAG × TRANSMVET</b><small>Proposition financière & architecture Enterprise</small></span><div><button data-go-bp="budget">Budget</button><button data-go-bp="financement">Financement</button><button data-go-bp="planning">Planning</button><button class="gold" data-bp-present>${I('presentation')} Présenter</button></div></nav>
<section id="intro-business" class="bp-hero" data-bp-slide><div class="bp-photo"></div><div class="bp-grid"></div><div class="bp-hero-copy bp-reveal"><span class="bp-kicker"><i></i> SYSTÈME CENTRAL DE BILLETTIQUE · BACK OFFICE · FRONT OFFICE · API · PAIEMENTS · FINANCE · DATA · SÉCURITÉ · CONTINUITÉ</span><h1>Proposition financière<br><em>& architecture Enterprise</em></h1><p class="lead">SETRAG mobilise 10 000 000 FCFA HT au démarrage. Le solde contractuel de 80 000 000 FCFA HT est recouvré après mise en exploitation par une commission plafonnée sur les transactions éligibles effectivement encaissées. Le prix global reste plafonné à 90 000 000 FCFA HT pour le périmètre contractuel de référence.</p><div class="bp-badges"><span><small>Valeur globale</small><b>90 M FCFA HT</b></span><span><small>Démarrage</small><b>10 M FCFA HT</b></span><span><small>Rémunération différée</small><b>80 M FCFA HT</b></span></div><div class="bp-actions"><button class="gold" data-go-bp="synthese">Comprendre la proposition ${I('arrow-down')}</button><button data-go-bp="budget">Budget détaillé</button><button data-go-bp="financement">Modèle de financement</button></div><p class="bp-promise" style="margin-top:22px">Version 3.0 · Août 2026 · Libreville, Gabon — Document confidentiel, proposition soumise à validation contractuelle.</p></div></section>

${S('synthese','01 · SYNTHÈSE EXÉCUTIVE','Une plateforme ferroviaire critique, pas une simple application','Le budget finance une chaîne complète : conception, développement, intégration, infrastructure, sécurité, données, recette, mise en production et transfert de compétences.',`
<div class="bp-cards" style="max-width:1300px">
${C('server-cog','Backend transactionnel','Java / Spring Boot structuré en services métier modulaires, API REST sécurisées et traitements transactionnels idempotents.')}
${C('layout-dashboard','Front & Back Office','React pour le Back Office et le Front Office, complétés par des parcours mobiles React Native pour le contrôle et les opérations terrain.')}
${C('database','Données professionnelles','MySQL 8/InnoDB comme socle de référence, haute disponibilité, réplication, cache Redis, stockage objet S3-compatible/MinIO, sauvegarde 3-2-1.')}
${C('server','Déploiement libre','Datacenter SETRAG, cloud privé/public autorisé ou architecture hybride, sans dépendance obligatoire à un fournisseur unique.')}
${C('shield-check','Sécurité by design','SSO/Active Directory, MFA, RBAC, TLS, chiffrement au repos, secrets centralisés, audit, SIEM, durcissement et tests de vulnérabilité.')}
${C('git-branch','Industrialisation','Dev/Test/Préproduction/Production, CI/CD, conteneurisation, monitoring, alerting, métriques, journaux et procédures de reprise.')}
</div>
<div class="bp-kpis" style="margin-top:34px">
<span><small>Délai cible</small><b>6 mois</b></span>
<span><small>Environnements</small><b>4</b>Dev · Test · Préprod · Prod</span>
<span><small>Budget plafonné</small><b>90 M</b>FCFA HT</span>
<span><small>Traçabilité</small><b>100 %</b>actions sensibles tracées</span>
</div>
<div class="bp-note bp-reveal">${I('badge-check')}<div><small>ENGAGEMENT DE RÉSULTAT</small><h3>Chaque lot budgétaire est vérifiable</h3><p>Chaque lot est associé à des livrables vérifiables, des critères de recette, une documentation et des responsabilités identifiables. Le budget ne rémunère pas uniquement du développement : il finance la capacité de mise en exploitation.</p></div></div>`)}

${S('pourquoi','02 · POURQUOI 90 MILLIONS FCFA','Une valorisation fondée sur le périmètre, le risque et l’exploitabilité','Six facteurs objectifs expliquent le passage d’une simple application à un système d’information métier industrialisé.',
table(['Facteur','Ce que le projet doit réellement couvrir','Pourquoi cela crée de la valeur / du coût'],facteurs)+
`<div class="bp-rule bp-reveal">${I('landmark')}<p><b>Conclusion financière</b><span>Le passage de 10 M à 90 M FCFA HT repositionne la proposition au niveau d’un système d’information métier industrialisé. Le montant couvre la construction du produit, mais aussi les mécanismes qui permettent à SETRAG de l’exploiter, l’auditer, le sécuriser, le restaurer et le faire évoluer.</span></p></div>`,'dark')}

${S('architecture','03 · ARCHITECTURE TECHNIQUE CIBLE','Une architecture modulaire, portable et exploitable sur la durée','Le socle Java/Spring Boot + React reste le cœur applicatif. Autour de ce socle, la proposition ajoute les briques nécessaires à une exploitation professionnelle.',`
<div class="to-diagram bp-reveal">
 <div class="to-diagram-row">
  ${[['smartphone','Canaux','Front Office React','Mobile terrain','TPE / guichets','Contrôle QR'],['router','Edge & API','Nginx / HAProxy','API Gateway','WAF / rate limiting','TLS'],['server-cog','Services métier','Java / Spring Boot','Billetterie & capacité','Tarification & finance','Workflow & audit'],['plug-zap','Intégrations','Paiements / Mobile Money','Sage X3 V12','Active Directory / SIEM','COLIRAIL / SI tiers']].map((x,i)=>`${i?`<span class="to-arrow">${I('arrow-right')}</span>`:''}<div class="to-box"><i>${I(x[0])}</i><b>${x[1]}</b><ul>${x.slice(2).map(v=>`<li>${v}</li>`).join('')}</ul></div>`).join('')}
 </div>
 <div class="to-diagram-fan"><i></i><i></i><i></i></div>
 <div class="to-diagram-row three">
  ${[['database','Données transactionnelles','MySQL 8 / InnoDB','Primary + réplica / cluster','PITR & réplication','Chiffrement au repos'],['zap','Cache & messagerie','Redis','RabbitMQ / Kafka*','Idempotence','Reprise asynchrone'],['archive','Stockage & archives','S3 compatible / MinIO','Documents & justificatifs','Backups immuables','Rétention / archivage']].map(x=>`<div class="to-box"><i>${I(x[0])}</i><b>${x[1]}</b><ul>${x.slice(2).map(v=>`<li>${v}</li>`).join('')}</ul></div>`).join('')}
 </div>
 <div class="to-diagram-down">${I('arrow-down')}</div>
 <div class="to-box wide"><i>${I('layers')}</i><b>Plateforme d’exploitation</b><ul class="inline"><li>Docker</li><li>CI/CD</li><li>Vault / Secrets</li><li>Prometheus / Grafana</li><li>OpenSearch / ELK</li><li>Dev / Test / Préprod / Prod</li></ul></div>
 <small class="to-diagram-note">* selon volumétrie et standards SETRAG</small>
</div>
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('layers')} STACK TECHNIQUE DÉTAILLÉE</small><h3>Des composants éprouvés et remplaçables</h3><p>Chaque brique est choisie pour sa fonction et peut être adaptée aux standards d’infrastructure SETRAG.</p></header>
${table(['Couche','Technologie / principe','Rôle'],stack)}</div>`)}

${S('hebergement','04 · HÉBERGEMENT & SOUVERAINETÉ','Trois modèles de déploiement, un même socle applicatif','SETRAG peut choisir un hébergement local, cloud autorisé ou hybride sans réécrire l’application.',
table(['Modèle','Description','Avantages','Points de cadrage'],hebergement)+
`<div class="bp-note bp-reveal">${I('shield-check')}<div><small>AUCUNE DÉPENDANCE CLOUD IMPOSÉE</small><h3>Des composants tous déployables localement</h3><p>MySQL, Redis, RabbitMQ, MinIO, Prometheus/Grafana, OpenSearch, Vault/équivalent disposent d’options déployables localement. Les services cloud managés restent une option de simplification, non une obligation. Docker standardise les déploiements ; Kubernetes est optionnel selon l’infrastructure SETRAG. Réseaux segmentés (DMZ/applicatif/données/administration) et Infrastructure as Code (Terraform/Ansible) possibles pour des environnements reproductibles et auditables.</p></div></div>`,'soft')}

${S('donnees','05 · DONNÉES, STOCKAGE & SAUVEGARDE','Une stratégie de données multi-couches, restaurable et auditée','La base de données n’est qu’une composante : disponibilité, sauvegarde, archivage, cache, documents et reprise sont traités ensemble.',
table(['Composant','Référence proposée','Fonction'],donnees)+`
<div class="to-diagram bp-reveal" style="margin-top:36px">
 <div class="to-diagram-row">
  ${[['database','Production','Base principale + réplica, stockage documents, journal des transactions'],['hard-drive-download','Backup local','Snapshots + sauvegarde logique, rotation, copie NAS/repository dédié'],['cloud-upload','Copie hors site','DR / repository secondaire ou stockage objet S3-compatible'],['lock','Immutabilité','Versioning / Object Lock, comptes séparés, rétention contrôlée']].map((x,i)=>`${i?`<span class="to-arrow">${I('arrow-right')}</span>`:''}<div class="to-box"><i>${I(x[0])}</i><b>${x[1]}</b><ul><li>${x[2]}</li></ul></div>`).join('')}
 </div>
 <div class="to-diagram-fan"><i></i><i></i><i></i></div>
 <div class="to-diagram-row three">
  ${[['history','PITR','Journaux binaires/WAL pour retour à un point précis'],['rotate-ccw','Test de restauration','Exercices périodiques, preuves de restauration, mesure RPO/RTO'],['life-buoy','PRA','Runbooks, ordre de bascule, responsabilités, communication et retour en service']].map(x=>`<div class="to-box"><i>${I(x[0])}</i><b>${x[1]}</b><ul><li>${x[2]}</li></ul></div>`).join('')}
 </div>
</div>
<div class="bp-rule bp-reveal">${I('shield-check')}<p><b>Principe de sauvegarde 3-2-1</b><span>Au minimum trois copies des données, sur deux supports ou environnements distincts, avec au moins une copie hors site ou isolée. Les sauvegardes ne sont considérées comme fiables qu’après tests de restauration documentés.</span></p></div>`,'dark')}

${S('cyber','06 · CYBERSÉCURITÉ & IAM','Sécurité intégrée à l’architecture et au cycle de développement','Neuf domaines de contrôle couvrant l’identité, les données, l’application et la détection.',`
<div class="bp-cards" style="grid-template-columns:repeat(3,1fr);max-width:1300px">${cyber.map(x=>C(x[0],x[1]+' — '+x[2],x[3])).join('')}</div>
<div class="bp-note bp-reveal">${I('shield-check')}<div><small>SECURITY BY DESIGN</small><h3>Les contrôles sont budgétés dès le départ</h3><p>Ils ne sont pas ajoutés en urgence à la fin du projet, ce qui réduit le risque de retard, de dette technique et de non-conformité opérationnelle.</p></div></div>`)}

${S('disponibilite','07 · DISPONIBILITÉ, PRA & MODE DÉGRADÉ','Concevoir pour la panne, pas seulement pour le fonctionnement normal','Cinq dispositifs de résilience, du health check applicatif au plan de reprise complet.',
table(['Objectif','Définition','Dispositif prévu'],pra)+
`<div class="bp-goal-box bp-reveal"><span>${I('activity')}</span><div><small>DISPOSITIF DE SUPERVISION</small><ul>${['Health checks applicatifs et base de données ; supervision des temps de réponse, erreurs, files, espace disque, connexions et réplication.','Alertes hiérarchisées : information, warning, critique ; procédures d’escalade et tickets d’incident.','Journal des incidents et post-mortem pour traiter les causes racines et non seulement les symptômes.','Capacité à restaurer une base sur un environnement isolé avant réinjection en production.'].map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>`,'soft')}

${S('api','08 · API & INTÉGRATIONS SI','Une couche d’intégration contractuelle, sécurisée et résiliente','Sept systèmes intégrés, chacun documenté par un contrat d’interface.',
table(['Système','Mécanisme','Exigence technique'],apiInteg)+
`<div class="bp-rule bp-reveal">${I('file-check-2')}<p><b>Contrats d’interface</b><span>Chaque intégration est documentée par un contrat : format, authentification, codes retour, timeouts, reprise, idempotence, volumétrie, journalisation, données sensibles et responsabilités en cas d’indisponibilité.</span></p></div>`)}

${S('devops','09 · DEVOPS, OBSERVABILITÉ & QUALITÉ','Industrialiser la mise en production pour réduire le risque opérationnel','Neuf pratiques pour passer d’un projet qui fonctionne sur un poste de développeur à un produit supervisé et reproductible.',
table(['Pratique','Mécanisme','Valeur'],devops)+
`<div class="bp-evolution bp-reveal"><span>Code versionné</span>${I('arrow-right')}<strong>Pipelines CI/CD</strong>${I('arrow-right')}<b>Environnements reproductibles</b>${I('arrow-right')}<b>Observabilité continue</b></div>`,'dark')}

${S('budget','10 · BUDGET DÉTAILLÉ','90 000 000 FCFA HT répartis en 12 lots contrôlables','Chaque lot se déplie pour révéler ses sous-lots, montants et livrables — cliquez une ligne pour voir le détail.',`<div class="bp-budget"><aside class="bp-total bp-reveal"><small>INVESTISSEMENT TOTAL</small><strong>${fmt(TOTAL)}</strong><b>FCFA HT</b><div class="bp-donut"><span>12<small>lots</small></span></div><p>Découpage permettant à SETRAG de rattacher chaque dépense à des livrables, critères de recette et responsabilités clairement identifiables.</p></aside><div class="bp-budget-list">${LOTS.map((l,i)=>{
 const pct=Math.round(l.amount/TOTAL*1000)/10;
 return `<div class="fm-lot bp-reveal" data-lot-toggle>
  <button class="bp-budget-row" data-lot-head><span>${I(l.icon)}</span><div><small>${String(i+1).padStart(2,'0')}</small><b>${l.n}</b><p>${l.just}</p><i><u></u></i></div><strong>${fmt(l.amount)}<small>FCFA · ${pct} %</small></strong></button>
  <div class="fm-lot-detail"><table><thead><tr><th>Sous-lot</th><th>Montant</th><th>Ce qui est livré</th></tr></thead><tbody>${l.subs.map(s=>`<tr><td>${noAvatar}<b>${s[0]}</b></td><td>${fmt(s[1])} FCFA</td><td>${noDots}${s[2]}</td></tr>`).join('')}</tbody></table></div>
 </div>`
}).join('')}</div></div>`,'dark')}

${S('organisation','11 · ORGANISATION & RESSOURCES','Une équipe pluridisciplinaire mobilisée selon les phases','Onze profils mobilisés en fonction des phases, pour éviter de facturer une équipe complète en permanence.',
table(['Profil','Responsabilités','Mobilisation principale'],orga)+
`<div class="bp-rule bp-reveal">${I('users-round')}<p><b>Organisation maîtrisée</b><span>Les profils sont mobilisés en fonction des phases, ce qui évite de facturer une équipe complète en permanence tout en assurant la présence des compétences critiques au bon moment.</span></p></div>`)}

${S('planning','12 · PLANNING DE RÉALISATION','Six mois structurés par jalons et preuves de livraison','Chaque mois produit des livrables vérifiables et prépare le jalon suivant.',`<div class="bp-timeline">${planning.map((x,i)=>`<article class="bp-reveal"><i>${i+1}</i><small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('')}</div>
<div class="bp-goal-box bp-reveal" style="margin-top:34px"><span>${I('shield-check')}</span><div><small>DISCIPLINE DE LIVRAISON</small><ul>${['COPIL régulier avec décisions et risques documentés.','Démonstration de fin de sprint/lot pour éviter l’effet tunnel.','Aucun passage en production sans critères de recette, sauvegarde et rollback validés.','Documentation produite au fil de l’eau, versionnée avec le produit.'].map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>`,'dark')}

${S('livrables','13 · LIVRABLES & CRITÈRES DE RECETTE','Une livraison vérifiable, documentée et transférable','Dix livrables contractuels et sept critères de réussite mesurés à la recette.',`
<div class="cdc16-proof bp-reveal" style="max-width:1300px;margin:0 auto">${livrables.map(x=>`<span>${x}</span>`).join('')}</div>
<div class="bp-cellblock" style="margin-top:40px"><header><small>${I('clipboard-check')} CRITÈRES DE RÉUSSITE</small><h3>Sept axes évalués à la recette</h3></header>
${table(['Axe','Critère de réussite'],recetteCriteres)}</div>`)}

${S('financement','14 · MODÈLE DE FINANCEMENT','10 M au démarrage, 80 M alignés sur l’activité réelle','Un principe simple : SETRAG limite son décaissement initial, le solde suit l’activité commerciale réelle.',`
<div class="bp-kpis bp-reveal">
<span><small>À la signature</small><b>10 M</b>FCFA HT</span>
<span><small>Solde différé</small><b>80 M</b>FCFA HT</span>
<span><small>Valeur totale</small><b>90 M</b>FCFA HT</span>
</div>
<div class="bp-cards" style="max-width:1300px;margin-top:30px">
${C('rocket','1 · Démarrage','L’acompte de 10 M FCFA HT finance la mobilisation, le cadrage, l’architecture initiale, les environnements et le lancement opérationnel.')}
${C('hammer','2 · Construction','Les travaux sont réalisés sur six mois avec jalons, démonstrations et recette. Aucun paiement additionnel en numéraire n’est requis pendant la construction sauf changement de périmètre formel.')}
${C('play','3 · Mise en exploitation','Après recette et ouverture commerciale, le solde de 80 M FCFA HT est recouvré via une commission sur les transactions éligibles effectivement encaissées.')}
${C('octagon-pause','4 · Plafond','Le cumul de cette commission s’arrête automatiquement lorsque 80 M FCFA HT ont été recouvrés.')}
${C('handshake','5 · Après recouvrement','Maintenance, évolutions, TMA ou partenariat digital ultérieur sont contractualisés séparément.')}
</div>`,'soft')}

${S('commission','15 · COMMISSION DE RECOUVREMENT','Un mécanisme transparent, auditable et plafonné','Taux indicatif de 5 % des montants HT effectivement encaissés sur les transactions éligibles, exclusivement destiné au recouvrement du solde de 80 M FCFA HT.',`
${table(['Élément','Règle proposée'],commissionRegles)}
<div class="bp-cellblock" style="margin-top:40px"><header><small>${I('calculator')} SIMULATEUR DE RECOUVREMENT</small><h3>Estimer la durée théorique de recouvrement</h3><p>Simulation à titre d’illustration du mécanisme — aucune prévision de chiffre d’affaires SETRAG.</p></header>
<div class="fm-calc bp-reveal">
 <div class="fm-calc-input"><label for="fmVolume">Volume mensuel éligible HT (FCFA)</label><input type="range" id="fmVolume" min="20000000" max="350000000" step="5000000" value="100000000"><div class="fm-calc-value" id="fmVolumeLabel">100 000 000 FCFA</div></div>
 <div class="fm-calc-results">
  <div><small>Commission mensuelle (5 %)</small><b id="fmCommission">5 000 000 FCFA</b></div>
  <div><small>Durée théorique pour recouvrer 80 M</small><b id="fmDuration">16,0 mois</b></div>
 </div>
</div>
${table(['Volume mensuel éligible HT','Commission mensuelle à 5 %','Durée théorique pour 80 M'],commissionExemples.map(x=>[fmt(x[0])+' FCFA',fmt(x[0]*0.05)+' FCFA',x[1].toFixed(1).replace('.',',')+' mois']))}
</div>
<div class="bp-rule bp-reveal">${I('info')}<p><b>Important</b><span>Illustrations de mécanisme uniquement ; aucune prévision de chiffre d’affaires SETRAG.</span></p></div>`)}

${S('hypotheses','16 · HYPOTHÈSES, PRÉREQUIS & EXCLUSIONS','Protéger le budget de 90 M par un périmètre contractuel clair','Neuf éléments explicitement hors périmètre logiciel ou à chiffrer séparément.',
table(['Élément','Traitement commercial proposé'],hypotheses)+
`<div class="bp-note bp-reveal">${I('list-checks')}<div><small>PRÉREQUIS SETRAG</small><h3>Ce que SETRAG doit fournir</h3><p>Accès aux interlocuteurs métiers, règles tarifaires, référentiels, environnements, documentation des SI tiers, clés/API, comptes techniques, politiques sécurité et ressources d’intégration nécessaires.</p></div></div>`,'dark')}

${S('valeur','17 · VALEUR POUR SETRAG','Ce que SETRAG achète réellement avec les 90 M FCFA','Huit leviers de valeur, au-delà du simple développement logiciel.',`
<div class="bp-cards" style="grid-template-columns:repeat(4,1fr);max-width:1300px">${valeur.map(x=>card2(x)).join('')}</div>
<div class="bp-rule bp-reveal">${I('telescope')}<p><b>Vision long terme</b><span>La proposition vise à livrer un socle qui peut accueillir de nouvelles interfaces, canaux, matériels ou services sans reconstruire l’ensemble du système. L’objectif est de créer un actif numérique durable, exploitable et gouvernable.</span></p></div>`)}

${S('contrat','18 · CADRE CONTRACTUEL RECOMMANDÉ','Les clauses qui sécurisent les deux parties','Dix points de cadrage pour un contrat clair, mesurable et protecteur.',`
<div class="bp-goal-box bp-reveal"><span>${I('file-signature')}</span><div><small>CLAUSES RECOMMANDÉES</small><ul>${cadreContractuel.map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>
<div class="bp-note bp-reveal">${I('shield-check')}<div><small>PRINCIPE DE PROTECTION</small><h3>Une commission plafonnée, jamais illimitée</h3><p>La rémunération différée ne doit jamais devenir une commission illimitée. Elle est un mécanisme de paiement du solde contractuel, avec plafond, traçabilité et arrêt automatique.</p></div></div>`,'soft')}

${S('conclusion','19 · PROPOSITION COMMERCIALE FINALE','Un investissement de 90 M FCFA, avec 10 M mobilisés au départ','Concevoir, développer, intégrer, sécuriser, tester et mettre en exploitation la plateforme digitale SETRAG dans un délai cible de six mois, puis accompagner le démarrage opérationnel.',`<div class="bp-final bp-reveal"><div><small>ENGAGEMENT PROPOSÉ</small><h3>Construire avec SETRAG,<br><em>exploiter avec SETRAG.</em></h3><p>La solution repose sur des standards modernes et portables : Spring Boot, React, API sécurisées, MySQL haute disponibilité, cache, messagerie, stockage objet, conteneurs, CI/CD, observabilité, sauvegarde 3-2-1, PRA et sécurité intégrée. SETRAG limite son décaissement initial à 10 M FCFA HT tandis que le prestataire porte une part importante du financement jusqu’à l’exploitation ; le recouvrement reste strictement plafonné à 80 M FCFA HT.</p><button class="gold" data-go-bp="intro-business">Revoir la proposition ${I('arrow-up')}</button></div><aside><span><small>Valeur globale</small><b>90 M</b><em>FCFA HT</em></span><span><small>Démarrage</small><b>10 M</b><em>FCFA HT</em></span><span><small>Solde différé</small><b>80 M</b><em>sur activité, plafonné</em></span><span><small>Délai cible</small><b>6</b><em>mois</em></span><p>* Le taux de commission (indicatif 5 %) et les modalités définitives sont arrêtés au contrat avec SETRAG.</p></aside></div>
<div class="fm-sign bp-reveal"><div><small>POUR LE PRESTATAIRE</small><span>Nom · Fonction · Date</span><i></i></div><div><small>POUR LA SETRAG</small><span>Nom · Fonction · Date</span><i></i></div></div>
<footer><b>TRANSMVET TECHNOLOGIES</b><span>Proposition financière & architecture Enterprise</span><small>Document confidentiel · Libreville, Gabon · Version 3.0 · Août 2026</small></footer>`,'dark final')}
</div><div class="bp-present"><button data-bp-exit>${I('x')} Quitter</button><span><b data-bp-num>1</b> / 21</span><button data-bp-prev>${I('arrow-left')}</button><button data-bp-next>${I('arrow-right')}</button></div>`;

function card2(x){return `<article class="bp-card bp-reveal"><span>${I(x[0])}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`}
}

function wireCalculator(root){
 const range=root.querySelector('#fmVolume');
 if(!range||range.__fmWired)return;
 range.__fmWired=true;
 const label=root.querySelector('#fmVolumeLabel');
 const commissionEl=root.querySelector('#fmCommission');
 const durationEl=root.querySelector('#fmDuration');
 const update=()=>{
  const vol=Number(range.value);
  const commission=vol*0.05;
  const duration=commission>0?80000000/commission:0;
  label.textContent=fmt(vol)+' FCFA';
  commissionEl.textContent=fmt(Math.round(commission))+' FCFA';
  durationEl.textContent=duration.toFixed(1).replace('.',',')+' mois';
 };
 range.oninput=update;
 update();
}

function wire(){if(typeof current!=='undefined'&&current!=='business')return;const root=document.querySelector('.bp-page');if(!root)return;if(!root.__bpStop){root.addEventListener('click',e=>e.stopPropagation());root.__bpStop=true}if(window.lucide)lucide.createIcons();root.querySelectorAll('[data-go-bp]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.goBp)?.scrollIntoView({behavior:'smooth'}));root.querySelectorAll('[data-lot-head]').forEach(b=>b.onclick=()=>b.closest('[data-lot-toggle]').classList.toggle('open'));wireCalculator(root);const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});root.querySelectorAll('.bp-reveal').forEach(x=>obs.observe(x));addEventListener('scroll',()=>{if(!document.querySelector('.bp-page'))return;let d=document.documentElement;root.style.setProperty('--p',(scrollY/(d.scrollHeight-innerHeight)*100)+'%')},{passive:true});const slides=[...root.querySelectorAll('[data-bp-slide]')];let n=0;const show=x=>{n=Math.max(0,Math.min(slides.length-1,x));slides.forEach((s,i)=>s.classList.toggle('current',i===n));document.querySelector('[data-bp-num]').textContent=n+1};root.querySelector('[data-bp-present]').onclick=()=>{document.body.classList.add('bp-presenting');show(0)};document.querySelector('[data-bp-exit]').onclick=()=>document.body.classList.remove('bp-presenting');document.querySelector('[data-bp-prev]').onclick=()=>show(n-1);document.querySelector('[data-bp-next]').onclick=()=>show(n+1)}
document.addEventListener('keydown',e=>{if(!document.body.classList.contains('bp-presenting'))return;({'ArrowRight':'[data-bp-next]','ArrowLeft':'[data-bp-prev]','Escape':'[data-bp-exit]'})[e.key]&&document.querySelector(({'ArrowRight':'[data-bp-next]','ArrowLeft':'[data-bp-prev]','Escape':'[data-bp-exit]'})[e.key]).click()});
const install=()=>{
  if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
  window.renderBusinessPartnership=render;
  pages.business=render;
  if(typeof bind==='function'&&!bind.__businessPartnershipWrapped){
    const old=bind;
    const enhanced=function(){old();wire()};
    enhanced.__businessPartnershipWrapped=true;
    bind=enhanced;
    window.bind=enhanced;
  }
  const requested=new URLSearchParams(location.search).get('page');
  const active=document.querySelector('[data-page="business"].active')||document.querySelector('.bp-page');
  if(requested==='business'||active){
    const content=document.querySelector('#content');
    if(content){content.innerHTML=render();wire()}
  }
};
install();
})();
