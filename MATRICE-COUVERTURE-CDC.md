# Matrice de couverture — Démonstrateur Back Office SETRAG

Cette matrice décrit ce que chaque page doit permettre de montrer pendant la compétition. Les intégrations externes et les données restent simulées dans le démonstrateur.

| Page unifiée | Exigences visibles | Parcours / actions |
|---|---|---|
| Présentation concours | problème SETRAG, offre technique, impact financier, valeur commerciale | parcours guidé en six étapes |
| Vue d’ensemble | CA, billets, cinq prestations, trains, remplissage, recettes, paiements, remboursements, anomalies, ventes offline, KPI | accès à la vente et au rapport Direction |
| Centre des opérations | trains, corridor, voies/cantons, incidents, conducteurs, contrôleurs, terminaux, passagers, bagages, fret, missions | incident et sélection d’une circulation |
| Ventes & prestations | billet, bagage, colis, TAA, funéraire, calcul, paiement, impression, QR, historique, annulation, remboursement, report | émission simulée et fiche liée |
| Voyageurs | recherche, fiche, billets, historique, prestations, remboursements, contrôles, urgence, assistance | fiche 360°, listes par train |
| RFID / NFC | création, affectation, abonnement, activation, blocage, remplacement, rechargement, historique, contrôle | gestion du cycle de vie |
| Trains & circulations | EXPRESS, OMNIBUS, SPECIAL, horaires, gares, itinéraires, composition, retard, position, incidents, signalisation | création et détail de circulation |
| Voitures & places | VIP/1re/2e, assises/debout, disponibles/vendues/bloquées, libération par segment, passagers, occupation | sélection de place et règles segmentées |
| Terminaux & batteries | agent, mission, train, gare, batterie, autonomie, connectivité, synchro, localisation, maintenance, offline, file | historique et diagnostic |
| Tarification & Yield | général/réduit, enfant, groupes, militaires, abonnements, promotions, bagages, colis, relation/classe, validation/version, prévision | simulation et workflow de publication |
| Livrets horaires | création, validité, EXPRESS/OMNIBUS, itinéraires sommaire/détaillé, approbation/rejet, activation/expiration, import/export | cycle de vie complet |
| Points de vente & agences | gares, agences accréditées/Premium, codes, guichets, superviseurs, capacités, quotas, affectations | affecter/annuler un quota par train et segment |
| Paiements | espèces, Airtel, Moov, Click&Pay, Visa, Mastercard, références, statuts, échecs, rapprochement, remboursement | traitement d’un écart ou échec |
| Caisses & rapprochement | caisse agent/gare, ouverture/clôture, espèces/électronique, écarts, ventes, annulations, remboursements, TTC/perçu | clôture guidée et génération V65 |
| Contrôles & fraude | valides/invalides/doublons/annulés/déjà utilisés, PV, amende, contrôleur, terminal, heure, train, passager | parcours contrôleur online/offline |
| Comptabilité · Sage X3 | journal, pièce, site, PDV, compte, HT/TVA/CSS/TTC, axes, export, statut, erreurs, rejouage | cycle V65 jusqu’à l’accusé Sage |
| Rapports & KPI | tous domaines métier, filtres par période, exports Excel/PDF/CSV, programmation | choix et génération d’un rapport |
| Mode dégradé | vente manuelle, pré-imprimé, numérotation, reprise, offline, conflits, reconnexion | intégration sans réémission et supervision |
| Administration | utilisateurs, rôles, droits dissociés, profils, workflows, produits, paiements, trains, classes, taxes, templates, sécurité | gestion d’un compte ou paramètre |
| Monitoring | API, base, portail, disponibilité, temps, erreurs, seuils, incidents, alertes e-mail, historique | incident et règle d’alerte |
| Cybersécurité | AD, SSO, MFA, RBAC, logs, sessions, SIEM, RGPD, PRA, sauvegarde, environnements, données | scénario simulé et dossier de preuves cible |

## Cohérence du parcours transversal

Une opération `SET-260812-5012` relie les vues suivantes :

1. vente du billet dans **Ventes & prestations** ;
2. réservation de `V2/P18` dans **Voitures & places** ;
3. ajout de Nadia Raponda au manifeste dans **Voyageurs** ;
4. confirmation `PAY-5512` dans **Paiements** ;
5. alimentation de `CAISSE-OW-01` dans **Caisses** ;
6. mise à disposition du QR dans **Contrôles & fraude** ;
7. préparation de la pièce V65 dans **Comptabilité · Sage X3** ;
8. mise à jour des KPI de la **Vue d’ensemble**.
