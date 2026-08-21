(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const QR_DATA_URI='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADo0lEQVR4nO2cTYrkSAxGn8aGWtowB8ijOG/QR2r6SH0Dx1HqAAP2siDMN4v4cTiThqGnTJcTaZGkq/xwBgiF9ElhE79n4a/fBMFJJ5100kknnXTy65GWrcds3NI3wriZ3QFYe2Atd93/8K918muRSJKYJElLJ6ATDNL+X82DxLR0am6er7VOJ88n1xJfpgU0r2aSYhOMNAMpQH3WM518TVI/bh+WvoaxhiXA7qc908lrk/3DtU3vbzKGBaZ3Q6x9FGsfP/GZTr4WWXxoELCCWDdjmsGmWRhstsuQrSB5rXU6eToZzMxsBLvTqRRiPUxLJ7unm7ZUln3WM518ETLFoSbShBFTuEUUxi6FJYXbh+kYha62TifPI2ttXxOeIRfzuaynU6rQSAU+eG3v5NGSDzFEJEU0DxGgK4LQQvpbdiSqZnStdTp5HtmoiJqpYWkBGKrTLPX2wTVGJ39BrmbJaUJqc2RVKHsTXdruNK+eUzv5YCmntvzxJpuW0QSpwJcxxN6m+cPEOgLDgv25X+vkVyRLPgTkpGjJMYdpT5QWDpe+lznZ2l6XNfnzDOw1WLpvLn1Yz4ecPFjb6wjfYs+0bFjasobYK1jVhVZD4V4vr7VOJ88j27oszX4UGSiVaXMaBcmbXP7wOOTkE2nf383sPkRShyPc1A4RzQChNvQ/55lOvgqJquXLBaBGnxnIKvYQU/vM8yEnj9ZqjHsNtn8okhse+07nPuRkYyWnXvtIHh2KPdBFwi32ArBpGYuChOfUTj7YQWMcIoINjlNDQPYcm37WabRrrdPJ88jacy3VmNSKiqUFS+3I+l7m5KM1OfUklUY9bR1fZOsSgdyHnGwt72XTDLCOKOdDQPgW2av5Vm38n8908rXIwwxabYapjg7V/kfpl5Wo5XHIyWIlH4rlaFmjLHaHwaKlTDT6XubkwR7iUHPiNafYz60P9yEnD7Z7SRahG/fJwnTTssd9yMkn09EeazBoT9nvscl9yMkjub/3A9YezWtfW2UfRhghnzkbVI6bXXGdTp5IVmmIcIvpw75L0o8RgM3KiP7m89ROHq32y0aYfuYLm957YP07GkO5DMl5yrD+xdbp5Hnkc04tpbd9tCVZOXPmdZmTz/b43g+F8Z+iU9+7KIg99V0gNu1K9bXW6eT5ZJESmd7fJC01AVrfZHc2y8Npfr7MySfLOnWyfXqxHhBaYK/3vW/v5LM9jgn9Z/N3nDvppJNOOumkky9C/gtcLxzctAII+gAAAABJRU5ErkJggg==';

// Neutralizes upgrade.js's global enhanceTables(), which rewrites any table's
// first/last cell (fake avatar, generic "···" menu) unless these markers exist.
const noAvatar='<span class="avatar-cell" style="display:none" aria-hidden="true"></span>';
const noDots='<span class="row-actions" style="display:none" aria-hidden="true"></span>';
const table=(headers,rows)=>`<div class="bp-compare to-reveal"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th>${noAvatar}${c}</th>`:i===r.length-1?`<td>${noDots}${c}</td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const conf=t=>/conforme/i.test(t)?`<span class="status">${t}</span>`:/cible/i.test(t)?`<span class="status info">${t}</span>`:t;
const card=(icon,title,text)=>`<article class="bp-card to-reveal"><span>${I(icon)}</span><h3>${title}</h3><p>${text}</p></article>`;
const S=(id,no,title,lead,body,cls='')=>`<section id="${id}" class="bp-section ${cls}" data-to-slide><header class="bp-head to-reveal"><small>${no}</small><h2>${title}</h2><p>${lead}</p></header>${body}</section>`;

function render(){
const risques=[
['Billets papier imitables / doublons','Identifiant unique, QR signé, contrôle d’unicité transactionnelle, statut du titre, piste d’audit et anti-réutilisation.'],
['Réimpressions non maîtrisées','Droit spécifique, motif obligatoire, marquage DUPLICATA, journal avant/après et compteur de réimpression.'],
['Annulations / remboursements peu traçables','Workflow d’autorisation, motif, rapprochement automatique, journal comptable et exclusion des montants remboursés.'],
['Vente uniquement présentielle / cash','Cash + Airtel Money + Moov Money + Click&Pay + Visa/Mastercard selon API disponibles.'],
['Connexion instable','Mode dégradé contrôlé, file locale chiffrée, identifiants temporaires non collisionnants, resynchronisation idempotente.'],
['PRA insuffisant','Sauvegardes testées, réplication, restauration périodique, runbooks, exercice PRA et responsabilités nominatives.']
];
const conformite=[
['5 produits voyageurs','Conforme','Billet, bagage, colis express, TAA, transport funéraire + messagerie voyageurs paramétrable.'],
['Portail de vente & portail de gestion','Conforme','Interfaces responsives, profils dédiés, workflows et habilitations.'],
['API Front Office / Contrôleur','Conforme','API REST versionnées + OpenAPI + contrôle de débit + OAuth2/OIDC.'],
['Sage X3 V12','Conforme','Journal V65, mapping, export/API, rejets et rapprochement.'],
['SSO Active Directory + MFA','Conforme','SAML2/OIDC, RBAC, déprovisionnement, MFA.'],
['Monitoring BDD / portail / API','Conforme','Métriques, logs, traces, dashboards et alertes e-mail/SIEM.'],
['SaaS obligatoire','Conforme','Production en SaaS sécurisé et cloisonné ; mécanismes edge/offline seulement pour continuité locale.'],
['Disponibilité ≥ 99,9 %','Cible contractuelle','Redondance, health checks, réplication, autoscaling selon hébergeur retenu.'],
['Émission billet &lt; 4 s','Cible de performance','Budget de latence, cache, indexation, tests de charge.'],
['Réversibilité min. 3 mois','Conforme','Export CSV/JSON/XML, scripts, documentation, accompagnement et attestation d’effacement.'],
['Livraison en 6 mois','Conforme','Jalons, recette progressive, préproduction et mise en exploitation.']
].map(r=>[r[0],conf(r[1]),r[2]]);
const stack=[
['Back Office','React + TypeScript + design system','Administration, ventes, caisses, trains, tarifs, KPI, rapports.'],
['API métier','Java 21 LTS / Spring Boot 3.x','Transactions, règles métier, sécurité, workflows, intégrations.'],
['API management','Nginx / HAProxy + API Gateway','TLS, routage, rate limiting, quotas, versionnement.'],
['Données transactionnelles','MySQL 8 / InnoDB','ACID, contraintes, verrouillage, indexation, réplication, PITR.'],
['Cache','Redis','Sessions courtes, cache référentiel, anti-doublon, limitation de débit.'],
['Messagerie','RabbitMQ ou Kafka selon volumétrie','Notifications, exports, intégrations asynchrones, reprise sur incident.'],
['Documents','Stockage objet S3-compatible / MinIO','Billets PDF, bordereaux, justificatifs, archives, rétention.'],
['CI/CD','Git + pipeline build/test/scan/deploy','Déploiements reproductibles et auditables.'],
['Observabilité','Prometheus/Grafana + OpenSearch/ELK','Métriques, journaux, alertes, recherche d’incidents.'],
['Secrets','Vault / secret manager hébergeur','Clés API, certificats, mots de passe techniques.']
];
const pra=[
['Sauvegarde transactionnelle','Full + incrémentale / logs binaires','Rapport automatique, alertes échec, rétention.'],
['PITR','Retour à un instant précis','Exercice de restauration sur environnement isolé.'],
['Copie hors zone','Réplication objet / coffre de sauvegarde','Inventaire et contrôle d’intégrité.'],
['Immutabilité','Object Lock / WORM si disponible','Protection contre suppression/ransomware.'],
['PRA','Runbook, ordre de redémarrage, responsabilités','Exercice périodique et compte rendu.'],
['Mode dégradé','Transactions locales signées + file de synchronisation','Journal de synchro, résolution contrôlée des conflits.']
];
const degrade=[
['1','Perte de connectivité','Le terminal passe en mode dégradé, affiche l’état réseau et limite les opérations selon la politique autorisée.'],
['2','Émission contrôlée','Numéro local sécurisé + plage/UUID, horodatage, vendeur, terminal, montant et empreinte cryptographique.'],
['3','Stockage local','File chiffrée avec données minimisées ; aucune clé secrète sensible en clair.'],
['4','Retour réseau','Synchronisation idempotente, détection des doublons et contrôle des séquences.'],
['5','Réconciliation','Rapport des opérations resynchronisées, rejets, conflits et régularisations à traiter.']
];
const cyber=[
['fingerprint','Identité','SSO Active Directory via SAML2/OIDC, MFA obligatoire, groupes AD, déprovisionnement automatique.'],
['key-round','Habilitations','RBAC fin : consulter / créer / modifier / valider / annuler / rembourser / réimprimer / administrer.'],
['lock','Données','TLS 1.2+ en transit, AES-256 ou équivalent au repos, chiffrement des sauvegardes, minimisation en test.'],
['terminal','Administration','Bastion/PAM si disponible, MFA, comptes nominatifs, journalisation des sessions privilégiées.'],
['shield-alert','Application','OWASP Top 10, validation serveur, protections CSRF/XSS/SQLi, scans SAST/SCA/DAST.'],
['key','Secrets','Aucun secret dans le code ; coffre de secrets, rotation et séparation par environnement.'],
['history','Traçabilité','Qui / quoi / quand / terminal / IP / ancienne valeur / nouvelle valeur / motif.'],
['radar','SIEM','Export des événements sécurité, fraudes, connexions échouées, actions sensibles et anomalies.']
];
const api=[
['Front Office','REST/JSON, disponibilités, réservation, vente, billet','OAuth2/OIDC, scopes, rate limiting, idempotency-key.'],
['Contrôleur','Validation QR, statut titre, vente à bord','Jeton terminal, cache offline contrôlé, synchronisation.'],
['Sage X3 V12','Journal V65, export/API selon interface validée','Contrôle totaux, accusé de réception, rejets et reprise.'],
['Paiements','Airtel Money, Moov Money, Click&Pay, Visa/Mastercard','Webhook signé, rapprochement, anti-rejeu, statut transaction.'],
['COLIRAIL','Suivi colis / échanges de statut','Mapping identifiants, journal d’échange, reprise sur échec.'],
['SIEM','Événements sécurité et audit','Format structuré, horodatage, corrélation.']
];
const moteurs=[
['layout-grid','Inventaire','Train, voiture, classe, rangées/colonnes, places assises/debout, blocage/déblocage, disponibilité par segment.'],
['badge-percent','Tarification','Tarif général/réduit, enfant, groupe, militaire, abonnement, week-end, étudiant, 3e âge, promotions, arrondis.'],
['trending-up','Yield Management','Classes tarifaires, quotas, anticipation, remplissage, demande, ajustement sous règles validées.'],
['ticket','Vente','Taxation, réservation, paiement, émission, impression, duplicata, annulation, remboursement, régularisation manuelle.'],
['package','Prestations','Billet, bagage, colis, TAA, transport funéraire, messagerie voyageurs.'],
['landmark','Finance','Caisses, rapprochement, V65, déversement Sage, ventilation HT/TVA/CSS/TTC.']
];
const kpiFam=[
['Commercial','Ventes par gare/agence/canal, produit, train, classe, vendeur, moyen de paiement.'],
['Capacité','Taux de remplissage, sièges disponibles par segment, occupation par classe, no-show selon données disponibles.'],
['Finance','CA HT/TTC, TVA, CSS, remboursements, annulations, écarts de caisse, rapprochements.'],
['Contrôle','Titres contrôlés, invalides, duplicata, anomalies, fraude suspectée.'],
['Technique','Disponibilité, latence API, erreurs, saturation BDD, files d’attente, synchronisations offline.'],
['Yield','Recette moyenne par siège, revenu par trajet, évolution demande / quota / tarif.']
];
const monitoring=[
['Application','Taux d’erreur, latence, débit, saturation, erreurs par fonction critique.'],
['Base de données','Connexions, requêtes lentes, réplication, espace, locks, sauvegardes, restauration.'],
['API','Disponibilité, temps de réponse, taux 4xx/5xx, quotas, dépendances externes.'],
['Paiements','Timeout, webhook en échec, statut incohérent, rapprochement incomplet.'],
['Sécurité','Échecs login, élévations de privilège, actions sensibles, comportements anormaux.'],
['Notifications','Alertes e-mail et intégration SIEM ; escalade selon gravité.']
];
const pipeline=[
['git-commit-horizontal','Commit / MR','Revue de code, conventions, secret scanning.'],
['hammer','Build','Compilation reproductible, dépendances verrouillées, artefact versionné.'],
['flask-conical','Tests','Unitaires, intégration, contrats API, non-régression.'],
['shield-alert','Sécurité','SAST, SCA dépendances, image/container scan si conteneurisation.'],
['rocket','Déploiement','Dev → Test → Préprod → Prod avec approbation et journal de changement.'],
['undo-2','Rollback','Version précédente réactivable + scripts DB compatibles / stratégie migration.']
];
const perf=[
['Disponibilité service','≥ 99,9 % selon le CDC, mesurée sur le périmètre contractuel et hors exclusions convenues.'],
['SSO','&lt; 2 s en moyenne selon le CDC, sous conditions réseau et AD disponibles.'],
['Émission billet','&lt; 4 s pour l’opération clé selon le CDC, hors latence externe de paiement si applicable.'],
['Tests de charge','Scénarios pointes gare, ventes concurrentes, consultation places, reporting, synchronisations.'],
['Scalabilité','Services stateless réplicables, pool DB dimensionné, cache, files asynchrones, stockage objet.']
];
const tests=[
['Fonctionnel','5 produits, tarification, places, paiements, annulation, remboursement, duplicata, mode manuel.'],
['Intégration','Sage X3, AD, SIEM, COLIRAIL, paiements, Front Office, Contrôleur.'],
['Sécurité','RBAC, MFA, scans, vulnérabilités, sessions, secrets, logs.'],
['Performance','Montée en charge, concurrence sur places, temps d’émission, rapports.'],
['Résilience','Perte réseau, reprise API, perte réplica, restauration, synchronisation offline.'],
['UAT','Scénarios métiers signés par référents SETRAG ; procès-verbal et registre anomalies.']
];
const equipement=[
['Poste guichet / PC','Portail de vente et gestion','Inventaire, spécifications et fourniture à cadrer séparément.'],
['Imprimante thermique / billet','Billet, reçu, étiquette','Matériel et consommables hors socle logiciel sauf chiffrage dédié.'],
['Scanner QR/2D','Contrôle et recherche titre','Modèle validé avant intégration.'],
['TPE / terminal mobile','Vente / contrôle / encaissement','SDK, SIM, licences et maintenance matérielle à chiffrer après choix.'],
['UPS / réseau local','Continuité guichet','Selon audit électrique/réseau des gares.'],
['Tablette / smartphone durci','Contrôleurs terrain','Option selon modèle opérationnel.']
];
const innovation=[
['trending-up','Yield Management avancé','Optimisation remplissage/recette par quotas et demande','Règles validées, explicables et supervisées.'],
['radar','Détection d’anomalies','Repérer fraude, réimpressions ou comportements atypiques','Alerte d’aide à la décision, pas sanction automatique.'],
['line-chart','Prévision de demande','Anticiper périodes, relations et trains sous tension','Qualité et historique des données prérequis.'],
['boxes','Digital twin billettique','Vue consolidée trains, capacité, ventes et prestations','Données opérationnelles disponibles et gouvernées.'],
['wifi-off','Offline intelligent','Continuité vente avec réconciliation fiable','Périmètre de vente dégradée défini par SETRAG.'],
['plug-zap','Open API','Écosystème futur web/mobile/contrôleur/self-service','Versionnement, scopes, quotas et documentation.']
];
const orga=[
['user-cog','Directeur / Chef de projet','Pilotage contractuel, COPIL, risques, budget, arbitrage et relation SETRAG.'],
['network','Architecte / Tech Lead','Architecture, qualité, décisions techniques, revues de code, intégrations.'],
['server','Backend Spring Boot','Services métier, transactions, sécurité, API, règles tarifaires.'],
['layout-panel-left','Frontend React','Back Office, ergonomie, dashboards, performances.'],
['database','Data / DBA','MySQL, qualité, migration, sauvegarde, performance et reprise.'],
['shield-check','DevOps / Sécurité','CI/CD, secrets, observabilité, durcissement, PRA.'],
['clipboard-check','QA / Recette','Plans de tests, automatisation, UAT, non-régression.'],
['palette','UX/UI','Parcours, design system, accessibilité et cohérence.']
];
const planning=[
['S1-S2','Cadrage','Ateliers, dossier architecture, sécurité, backlog, plan migration, plan de tests.'],
['S3-S8','Socle opérationnel','Référentiels, utilisateurs, trains/places, tarification, vente, audit, premiers écrans.'],
['S9-S14','Intégrations','Paiements, Sage X3, AD, API Front/Contrôleur, COLIRAIL, notifications.'],
['S15-S18','Pilotage','KPI, reporting, contrôle financier, yield, monitoring, mode dégradé.'],
['S19-S22','Préproduction','Performance, sécurité, migration répétée, PRA, documentation.'],
['S23-S26','Recette & production','UAT, corrections, formation, bascule, hypercare et transfert.']
];
const livrables=['Étude de l’existant et rapport de cadrage','Spécifications fonctionnelles et techniques détaillées','Dossier d’architecture logicielle, données, sécurité, intégration et exploitation','Code source spécifique, scripts de build/déploiement et gestion des versions selon contrat','Documentation OpenAPI et contrats d’interface','Plan de tests, résultats, registre anomalies, procès-verbaux de recette et mise en production','Guide utilisateur, manuel technique, runbooks d’exploitation, sauvegarde et PRA','Dossier de migration et rapport de qualité des données','Supports et sessions de formation fonctionnelle et technique','Dossier de réversibilité avec formats CSV/JSON/XML et procédure d’effacement'];
const reversibilite=[
['Réversibilité','Export intégral des données et journaux en formats ouverts ; documentation des schémas et interfaces.'],
['Assistance migration','Accompagnement minimum 3 mois après fin de contrat, conformément au CDC.'],
['Effacement','Suppression des copies après confirmation de migration + attestation.'],
['Support initial','6 mois post-production : correctifs reproductibles, réglages terrain, formation troubleshooting.'],
['Transfert de compétences','Sessions DSI, exploitation, métiers, documentation et procédures de diagnostic.']
];
const engagements=[
['map','Périmètre','Activité voyageurs et billettique sur l’ensemble du réseau.'],
['shield-check','Sécurité','Exigences CDC / Eramet intégrées dès la conception.'],
['gauge','Performance','Cibles CDC mesurées et testées.'],
['calendar-check','Délai','Mise en exploitation cible sous 6 mois.'],
['undo-2','Réversibilité','Données ouvertes, transfert de compétences et assistance.']
];

return `<div class="to-page">
<div class="bp-progress" id="toProgress"><i></i></div>
<nav class="bp-nav"><span><b>OFFRE TECHNIQUE ENTERPRISE</b><small>Système central de billettique & écosystème voyageurs</small></span><div><button data-to-go="to-conformite">Conformité</button><button data-to-go="to-architecture">Architecture</button><button data-to-go="to-planning">Planning</button><button data-to-go="to-demo">Démonstrateur</button></div></nav>

<section class="bp-hero" data-to-slide><div class="bp-photo"></div><div class="bp-grid"></div><div class="bp-hero-copy to-reveal"><span class="bp-kicker"><i></i> RÉPONSE TECHNIQUE AU CAHIER DES CHARGES SETRAG · VERSION 1.2 DU 02/07/2025</span><h1>Offre technique Enterprise<br><em>Billettique & écosystème voyageurs</em></h1><p class="lead">Une réponse conçue comme un système ferroviaire critique : plateforme transactionnelle, financière, sécurisée, auditée et exploitable sur l’ensemble du réseau Transgabonais.</p><div class="bp-badges"><span><small>Périmètre</small><b>Back Office · API Front Office / Contrôleur</b></span><span><small>Stack</small><b>Java · Spring Boot · React · MySQL</b></span><span><small>Délai</small><b>6 mois</b></span><span><small>Engagement</small><b>Sécurité · PRA · monitoring · réversibilité</b></span></div><div class="bp-actions"><button class="gold" data-to-go="to-synthese">Découvrir l’offre ${I('arrow-down')}</button><button data-to-go="to-conformite">Matrice de conformité</button><a href="https://chamberlindior.github.io/setrag-pilotage-demo/?page=business" target="_blank" rel="noopener">${I('external-link')} Démonstrateur en ligne</a></div></div></section>

${S('to-synthese','01 · SYNTHÈSE EXÉCUTIVE','Une réponse conçue comme un système ferroviaire critique','La proposition ne traite pas la billettique comme un simple site de vente, mais comme une plateforme transactionnelle, financière, sécurisée, auditée et exploitable sur tout le réseau.',`
<div class="bp-note to-reveal">${I('badge-check')}<div><small>ENGAGEMENT DE CONFORMITÉ</small><h3>Le périmètre complet du cahier des charges</h3><p>Cinq produits voyageurs, points de vente et agences, trains/voitures/places, tarification, paiements, contrôles, reporting/KPI, Sage X3 V12, API Front Office et Contrôleur, monitoring, cybersécurité, SaaS, réversibilité, formation, maintenance initiale et livraison sous six mois.</p></div></div>
<div class="bp-cards four" style="margin-top:34px">
${card('trending-up','Maturité','Architecture industrialisable, environnements séparés, CI/CD, observabilité, sauvegardes testées, PRA, documentation continue.')}
${card('sparkles','Innovation','Yield Management, détection d’anomalies, synchronisation offline, API-first, audit enrichi, pilotage temps réel et extensibilité IA sous contrôle humain.')}
${card('coins','Impact économique','Réduction de la fraude, accélération des ventes, rapprochement automatisé, meilleure occupation des trains, diversification des paiements.')}
${card('plug-zap','Interopérabilité','Sage X3 V12, Active Directory, SIEM, COLIRAIL, paiements Mobile Money et cartes via contrats d’API.')}
</div>`)}

${S('to-besoin','02 · COMPRÉHENSION DU BESOIN','Transformer les faiblesses actuelles en contrôles applicatifs vérifiables','Chaque limite identifiée dans le cahier des charges devient une réponse technique vérifiable, pas une promesse.',
table(['Risque / limitation du CDC','Réponse proposée'],risques),'dark')}

${S('to-conformite','03 · MATRICE DE CONFORMITÉ','Traçabilité complète entre le cahier des charges et la solution','Chaque exigence du CDC est reliée à sa couverture et à sa preuve ou son livrable attendu.',
table(['Exigence CDC','Couverture','Preuve / livrable'],conformite))}

${S('to-architecture','04 · ARCHITECTURE TECHNIQUE CIBLE','Architecture SaaS modulaire, API-first et security-by-design','Quatre couches de flux, trois familles de données, une plateforme d’exploitation transverse.',`
<div class="to-diagram to-reveal">
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
<div class="bp-note to-reveal">${I('shield-check')}<div><small>POINT DE CONFORMITÉ IMPORTANT</small><h3>Le CDC impose un hébergement SaaS</h3><p>La base de données de production et les services centraux restent hébergés dans l’environnement SaaS retenu. Les mécanismes locaux sont limités au cache chiffré, à la vente en mode dégradé et à la synchronisation ; ils ne deviennent pas une base de production parallèle.</p></div></div>`,'soft')}

${S('to-stack','05 · STACK TECHNOLOGIQUE & DONNÉES','Des technologies industrielles, maintenables et interchangeables','MySQL n’est pas « une base » : c’est un dispositif complet de disponibilité, intégrité et reprise.',
table(['Couche','Technologies / principes','Rôle'],stack)+`
<div class="bp-goal-box to-reveal"><span>${I('database')}</span><div><small>DONNÉES & BASE TRANSACTIONNELLE</small><ul>${['Schéma relationnel normalisé avec clés étrangères, contraintes d’unicité, transactions ACID et stratégie d’indexation par parcours critique.','Primary + réplica(s) ou MySQL InnoDB Cluster / service managé équivalent selon l’hébergeur SaaS retenu.','Point-in-Time Recovery via journaux binaires, sauvegardes complètes et incrémentales, rétention contractuelle et chiffrement au repos.','Séparation des comptes applicatifs, lecture reporting, migration et administration ; principe du moindre privilège.','Archivage des documents et justificatifs dans un stockage objet versionné, distinct de la base transactionnelle.','Contrôles de qualité : doublons, données obligatoires, cohérence billets-bagages/TAA, montants HT/TVA/CSS/TTC, référentiels actifs.'].map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>
<div class="bp-rule to-reveal">${I('info')}<p><b>Choix de déploiement</b><span>Le moteur relationnel peut être exploité comme service managé SaaS ou comme cluster administré dans l’infrastructure cloud contractuellement approuvée, dans le respect des exigences SETRAG/Eramet de chiffrement, traçabilité, localisation, sauvegarde et réversibilité.</span></p></div>`,'dark')}

${S('to-pra','06 · SAUVEGARDE, PRA & MODE DÉGRADÉ','La sauvegarde n’est utile que si la restauration est prouvée','Continuer à vendre sans jamais créer un deuxième système parallèle.',
table(['Mécanisme','Principe technique','Preuve d’exploitation'],pra)+`
<div class="bp-rule to-reveal">${I('clock')}<p><b>RPO / RTO</b><span>Les valeurs finales sont arrêtées pendant le cadrage avec la DSI selon criticité. Une cible de conception peut être proposée puis validée par SETRAG ; elle n’est pas inventée unilatéralement dans l’offre.</span></p></div>
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('wifi-off')} MODE DÉGRADÉ</small><h3>5 étapes contrôlées, de la perte réseau à la réconciliation</h3></header>
<div class="bp-timeline">${degrade.map(x=>`<article class="to-reveal"><i>${x[0]}</i><b>${x[1]}</b><p>${x[2]}</p></article>`).join('')}</div></div>`)}

${S('to-cyber','07 · CYBERSÉCURITÉ & API','Security-by-design aligné aux exigences du CDC et aux standards Eramet','Huit domaines de contrôle, six intégrations contractualisées et sécurisées.',`
<div class="bp-cards" style="grid-template-columns:repeat(4,1fr);max-width:1300px">${cyber.map(x=>card(x[0],x[1],x[2])).join('')}</div>
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('plug-zap')} API & INTEROPÉRABILITÉ</small><h3>Des contrats d’interface versionnés, documentés et testables</h3></header>
${table(['Intégration','Mécanisme','Sécurisation'],api)}</div>`,'soft')}

${S('to-moteurs','08 · MOTEURS MÉTIER & AUDIT','Le cœur de la valeur : règles transactionnelles ferroviaires','Chaque euro de logique métier devient une preuve d’audit.',`
<div class="bp-cards" style="max-width:1300px">${moteurs.map(x=>card(x[0],x[1],x[2])).join('')}</div>
<div class="bp-goal-box to-reveal" style="margin-top:34px"><span>${I('search-check')}</span><div><small>CONTRÔLE, AUDIT & FRAUDE</small><ul>${['QR code contenant un identifiant non ambigu et une signature / empreinte vérifiable par les composants autorisés.','Statuts explicites : réservé, payé, émis, contrôlé, annulé, remboursé, expiré, duplicata, régularisé.','Impossibilité d’écraser silencieusement une vente : toute modification sensible produit un événement d’audit.','Rapprochement vente ↔ règlement ↔ caisse ↔ journal comptable ↔ remboursement.','Alertes sur réimpressions répétées, annulations atypiques, écarts caisse, tentatives de réutilisation d’un titre et comportements anormaux.','Conservation des preuves d’action selon les règles de rétention définies avec SETRAG.'].map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>`)}

${S('to-pilotage','09 · KPI, REPORTING & MONITORING','De la transaction au pilotage directionnel','Voir l’incident avant qu’il ne devienne une interruption de vente.',`
<div class="bp-cards" style="max-width:1300px">${kpiFam.map(x=>`<article class="bp-card to-reveal"><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div>
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('activity')} MONITORING & OBSERVABILITÉ</small><h3>Six signaux surveillés en continu</h3></header>
<div class="bp-cards" style="max-width:1300px">${monitoring.map(x=>`<article class="bp-card to-reveal"><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div></div>`,'dark')}

${S('to-qualite','10 · DEVSECOPS, PERFORMANCE & TESTS','Industrialiser les livraisons plutôt que déployer « à la main »','Objectifs mesurables et livraison démontrée par preuves, pas des promesses vagues.',`
<div class="bp-evolution to-reveal">${pipeline.map((x,i)=>`${i?I('arrow-right'):''}<b>${x[1]}</b>`).join('')}</div>
${table(['Indicateur','Cible / méthode'],perf)}
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('flask-conical')} STRATÉGIE DE TESTS & RECETTE</small><h3>Six niveaux de tests jusqu’à l’UAT signée</h3></header>
${table(['Niveau','Exemples de tests'],tests)}</div>`)}

${S('to-migration','11 · MIGRATION & MATÉRIEL DES POINTS DE VENTE','Migrer sans importer les défauts de l’existant','Le logiciel couvre l’intégration ; le matériel est dimensionné séparément.',`
<div class="bp-goal-box to-reveal"><span>${I('database-zap')}</span><div><small>QUALITÉ DES DONNÉES</small><ul>${['Inventaire des sources : référentiels, tarifs, horaires, utilisateurs, historiques de vente, billets manuels et données nécessaires au démarrage.','Profilage et règles de qualité : doublons, formats, valeurs nulles, cohérence gares/trains/tarifs, identifiants orphelins.','ETL contrôlé : extraction, transformation, chargement en environnement de test, rapport d’écarts et validation métier.','Répétition de migration avant bascule, gel de référence, delta final et preuve de comptage avant/après.','Aucune donnée historique complexe n’est réputée migrable sans diagnostic de structure, qualité et volumétrie.'].map(x=>`<li>${I('check')} ${x}</li>`).join('')}</div></div>
<div class="bp-rule to-reveal">${I('map-pinned')}<p><b>Base du cahier des charges</b><span>Le CDC indique 22 gares à équiper, dont 19 immédiatement, avec au moins 2 points de vente dans les principales gares (Owendo, Booué, Lastourville, Moanda, Franceville) et au moins 1 dans les autres — base minimale à confirmer par inventaire terrain.</span></p></div>
${table(['Équipement','Rôle','Position commerciale'],equipement)}`,'soft')}

${S('to-innovation','12 · INNOVATION & GOUVERNANCE','Innovation utile : améliorer la recette, la sécurité et l’exploitation','Six leviers d’innovation, chacun encadré par un garde-fou explicite.',`
<div class="bp-cards" style="max-width:1300px">${innovation.map(x=>`<article class="bp-card to-reveal"><span>${I(x[0])}</span><h3>${x[1]}</h3><p>${x[2]}</p><em class="to-guardrail">${I('shield-check')} ${x[3]}</em></article>`).join('')}</div>
<div class="bp-cellblock" style="margin-top:44px"><header><small>${I('users-round')} ORGANISATION & GOUVERNANCE</small><h3>Une équipe pluridisciplinaire mobilisée par responsabilité</h3></header>
<div class="bp-cards" style="grid-template-columns:repeat(4,1fr);max-width:1300px">${orga.map(x=>card(x[0],x[1],x[2])).join('')}</div></div>`)}

${S('to-planning','13 · PLANNING DE RÉALISATION','Six mois structurés par jalons de preuve','Chaque période produit un résultat vérifiable avant d’ouvrir la suivante.',
`<div class="bp-timeline">${planning.map((x,i)=>`<article class="to-reveal"><i>${i+1}</i><small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('')}</div>`,'dark')}

${S('to-livrables','14 · LIVRABLES & RÉVERSIBILITÉ','Une solution transférable, documentée et auditée','SETRAG reste maître de ses données et de son exploitation.',`
<div class="cdc16-proof to-reveal" style="max-width:1300px;margin:0 auto">${livrables.map(x=>`<span>${x}</span>`).join('')}</div>
<div class="bp-cellblock" style="margin-top:40px"><header><small>${I('undo-2')} RÉVERSIBILITÉ & SUPPORT</small><h3>Cinq engagements de sortie et de continuité</h3></header>
${table(['Engagement','Mise en œuvre'],reversibilite)}</div>`)}

${S('to-demo','15 · DÉMONSTRATEUR','Une matérialisation déjà visible de la vision proposée','Le prototype illustre l’expérience Back Office et la logique de pilotage — référence, non preuve d’un environnement de production déjà certifié.',`
<div class="bp-monthly to-reveal"><div><small>PROTOTYPE EN LIGNE</small><strong>SETRAG PILOTAGE<em> · démonstrateur</em></strong><p>Le démonstrateur illustre l’expérience Back Office, l’accès sécurisé et la logique de pilotage sur l’ensemble des modules du cahier des charges.</p><a class="to-demo-link" href="https://chamberlindior.github.io/setrag-pilotage-demo/?page=business" target="_blank" rel="noopener">${I('external-link')} chamberlindior.github.io/setrag-pilotage-demo</a></div><aside><img src="${QR_DATA_URI}" alt="QR code du démonstrateur SETRAG PILOTAGE" width="120" height="120"><small>Scanner pour ouvrir le démonstrateur</small></aside></div>
<div class="bp-fork to-reveal" style="margin-top:30px">
<article><span>${I('circle-check-big')} CE QUE LE PROTOTYPE DÉMONTRE</span><h3>Navigation, ergonomie et vision intégrée</h3><p>Navigation et ergonomie du pilotage · vision intégrée exploitation / billettique · parcours et écrans de référence sur l’ensemble des 18 modules du CDC.</p></article>
<article><span>${I('construction')} CE QUI RESTE À INDUSTRIALISER</span><h3>Production, intégrations et preuves</h3><p>SSO réel, API réelles, infrastructure SaaS et données de production · tests de charge, cybersécurité, PRA, observabilité, CI/CD · recette métier et intégrations Sage/AD/SIEM/COLIRAIL/paiements.</p></article>
</div>`,'soft')}

${S('to-engagement','16 · ENGAGEMENT TECHNIQUE','Une billettique conçue pour être exploitée, auditée et transmise','Notre proposition répond à la lettre du cahier des charges tout en renforçant son niveau d’industrialisation.',`
<div class="bp-kpis to-reveal">${engagements.map(x=>`<span>${I(x[0])}<b>${x[1]}</b>${x[2]}</span>`).join('')}</div>
<div class="bp-final to-reveal" style="margin-top:34px"><div><small>POSITIONNEMENT FINAL</small><h3>Architecture SaaS, transactionnel robuste,<br><em>gouvernance de livraison.</em></h3><p>Mode dégradé, sécurité Active Directory/MFA/RBAC, intégrations, observabilité, sauvegardes testées, PRA, réversibilité — une billettique conçue pour être exploitée, auditée et transmise à SETRAG.</p><button class="gold" data-to-go="intro-to">Revoir l’offre technique ${I('arrow-up')}</button></div></div>
<footer class="to-footer to-reveal"><b>TRANSMVET TECHNOLOGIES</b><span>Offre technique confidentielle · Août 2026 · V3.0</span></footer>`,'dark final')}

</div>`}

function wire(){
 if(typeof current!=='undefined'&&current!=='techoffer')return;
 const root=document.querySelector('.to-page');
 if(!root)return;
 if(!root.__toStop){root.addEventListener('click',e=>e.stopPropagation());root.__toStop=true}
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-to-go]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.toGo)?.scrollIntoView({behavior:'smooth'}));
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
 root.querySelectorAll('.to-reveal').forEach(x=>obs.observe(x));
 if(!root.__toScroll){
  addEventListener('scroll',()=>{
   if(!document.querySelector('.to-page'))return;
   const d=document.documentElement;
   const bar=document.getElementById('toProgress');
   if(bar)bar.style.setProperty('--p',(scrollY/(d.scrollHeight-innerHeight)*100)+'%')
  },{passive:true});
  root.__toScroll=true
 }
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.techoffer=render;
 if(typeof bind==='function'&&!bind.__toWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__toWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="techoffer"].active')||document.querySelector('.to-page');
 if(requested==='techoffer'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
