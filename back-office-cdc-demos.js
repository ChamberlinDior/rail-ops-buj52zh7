(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('fr-FR').format(Math.round(n||0));
function toastMsg(s){if(typeof toast==='function')toast(s)}

/* =====================================================================
   PART 1 — Guide CDC : pour chaque page, remplace le guide "usage" par
   un guide de conformité : ce que le cahier des charges demande, et
   comment cette page y répond concrètement.
   ===================================================================== */
const CDC_GUIDE={
 dashboard:{eyebrow:'VUE D’ENSEMBLE · CDC',intro:'Le CDC demande une lecture immédiate de la situation commerciale, opérationnelle et financière.',items:[
  ['CA, billets vendus, taux de remplissage','KPI en tête de page, mis à jour en direct'],
  ['Cinq prestations voyageurs (billet, bagage, colis, TAA, funéraire)','Carte « Activité voyageurs » avec un chiffre par prestation'],
  ['Recettes des derniers jours','Graphique des encaissements quotidiens'],
  ['Anomalies et ventes non synchronisées','Bloc « Alertes prioritaires » : écarts de paiement, terminaux hors ligne'],
  ['Parcours transversal d’une vente','Frise vente → place → voyageur → paiement → contrôle → finance'],
  ['Accès rapide à la vente et au rapport Direction','Boutons « Nouvelle vente » et « Rapport Direction »']
 ]},
 tracking:{eyebrow:'CENTRE DES OPÉRATIONS · CDC',intro:'Le CDC demande de superviser en direct trains, corridor, agents et incidents.',items:[
  ['Trains, corridor, voies et cantons en direct','Carte animée Owendo → Franceville, position réelle des trains'],
  ['Conducteurs, contrôleurs, terminaux à bord','Tableau « Missions en cours » : équipe et terminal par train'],
  ['Passagers et fret','Colonne dédiée du tableau des missions'],
  ['Incidents et sélection d’une circulation','Carte « Incident actif » + clic sur un train pour ouvrir sa fiche'],
  ['Gares, quais, dépôts et zones spécialisées','Représentation des gares : quais, dépôts, terminal minier/hydrocarbures'],
  ['Signalisation et cantons','Feux tricolores et code couleur (libre / réservé / occupé / maintenance)']
 ]},
 sales:{eyebrow:'VENTES & PRESTATIONS · CDC §7.1',intro:'Un seul poste d’émission pour les cinq prestations voyageurs, avec calcul, paiement, impression et traçabilité.',items:[
  ['Cinq prestations','Billet, bagage, colis express, TAA et transport funéraire','§7.1'],
  ['Titre sécurisé','Identifiant unique, QR décodable, anti-doublon et audit','§7.1.1'],
  ['Données du billet','Client, gares, distance, classe, tarif, dates, train, place, contacts, appareil','§7.1.1'],
  ['Documents liés','Billet ↔ bagage associé ↔ reçu de paiement ; TAA ↔ billet conducteur','§7.1.2 / §7.1.4'],
  ['Fiscalité et paiement','HT, TVA, CSS, TTC, perçu, à payer, référence opérateur','§7.2 / §7.5'],
  ['Contrôle complet','Statut, agent, terminal, chronologie, journal et QR online/offline','§7.7'],
  ['Réponse aux demandes reçues du Front Office','Carte « File de demandes clients » : réception, prise en charge, confirmation ou rejet par un agent','§7.1 · Parcours agent'],
  ['Poste vendeur sur tablette','Simulation complète de l’application caissier : champs CDC par prestation, tarif calculé, agent et paiement affectés, document généré avec QR','§7.1 · Poste de vente']
 ]},
 frontoffice:{eyebrow:'FRONT OFFICE VOYAGEUR · CDC §3',intro:'Le canal client (web et mobile) doit permettre au voyageur d’accéder seul aux six prestations, en autonomie complète.',items:[
  ['Six prestations en libre-service','Portail unique : billets, bagages, colis express, TAA, funéraire, messagerie','§3.1–3.6'],
  ['Parcours recherche → place → paiement → billet','Funnel complet avec sélection de place et six moyens de paiement','§7.1 / §7.5'],
  ['Portefeuille voyageur','Bouton « Profil » : tous les documents achetés, e-billet avec QR','§3.7 / §7.1.1'],
  ['Application mobile voyageur','Section « Dans la poche du voyageur » : écrans mobiles pour les six services','§3 · Canal mobile'],
  ['Documents ultra-sécurisés','E-billets et bordereaux avec QR signé, filigrane, bande holographique','§7.1.1']
 ]},
 trains:{eyebrow:'TRAINS & CIRCULATIONS · CDC',intro:'Le CDC demande de piloter EXPRESS, OMNIBUS et SPECIAL avec position, composition et signalisation en direct.',items:[
  ['EXPRESS, OMNIBUS, SPECIAL','Filtres par type et tableau des circulations'],
  ['Position, retard et composition','Carte schématique avec trains animés : locomotive + wagons'],
  ['Signalisation','Signaux tricolores réagissant à l’occupation des cantons'],
  ['Voitures et wagons détaillés','Clic sur une voiture ou un wagon → manifeste complet (places, passagers, fret)'],
  ['« Bloquer une place »','Sur la fiche d’une voiture, un bouton bloque/débloque un siège précis — utile pour une panne, une réservation officielle ou la sécurité, sans toucher au reste de la vente.'],
  ['Détection des absents à l’embarquement','La fiche voiture affiche qui a un billet mais n’a pas scanné pour monter — synchronisé avec le scan d’embarquement du contrôleur (page Contrôles & fraude), sert à repérer les fraudes et les retardataires.'],
  ['Alertes terrain sur le réseau','Un incident signalé par un agent de terrain (arbre sur la voie, obstacle…) apparaît en bandeau au bas de la carte tant qu’il n’est pas résolu.'],
  ['Création et détail d’une circulation','Bouton « Nouveau train » : formulaire complet et fonctionnel']
 ]},
 capacity:{eyebrow:'VOITURES & PLACES · CDC',intro:'Le CDC exige une disponibilité exacte des places par classe et par segment de trajet.',items:[
  ['VIP / 1re / 2e, assises / debout','Plan de places par voiture avec classes'],
  ['Disponibles / vendues / bloquées','Code couleur des sièges et compteurs'],
  ['Libération par segment','Disponibilité recalculée à chaque gare (Owendo–Booué–Franceville…)'],
  ['Occupation par voiture','Tableau détaillé assises / debout / vendues / bloquées / disponibles'],
  ['« Bloquer une place »','Empêche la vente d’un siège précis (panne, réservation officielle, mobilité réduite, mesure de sécurité) sans annuler le train ; motif, agent et heure sont consignés — la place redevient vendable dès qu’elle est débloquée.']
 ]},
 pricing:{eyebrow:'TARIFICATION & YIELD · CDC',intro:'Catalogue réglementaire, quotas et publication contrôlée du prix, avec prévision de la demande.',items:[
  ['Général / réduit / enfant / groupes / militaires','Catalogue tarifaire avec familles et périmètres'],
  ['Abonnements, promotions, bagages, colis','Onglets du catalogue tarifaire'],
  ['Validation / version','Cycle de vie complet : brouillon → à valider → validé / rejeté → actif → expiré'],
  ['Prévision','Simulation Yield avec historique des recommandations'],
  ['Quotas et ajustement temps réel','Tableau « Quotas & disponibilité » avec ajustement +/- en direct'],
  ['Workflow de publication','Étapes Création → Contrôle Finance → Validation MOBIRAIL → Publication']
 ]},
 schedules:{eyebrow:'HORAIRES & LIVRETS · CDC',intro:'Le CDC demande un cycle de vie complet des livrets horaires, de la création à l’expiration.',items:[
  ['Création et validité','Formulaire de livret avec dates de validité'],
  ['EXPRESS / OMNIBUS','Types de livrets distincts'],
  ['Itinéraires sommaire et détaillé','Vue itinéraire avec arrêts détaillés'],
  ['Approbation / rejet, activation / expiration','Cycle de vie complet représenté en frise'],
  ['Import / export','Boutons d’import et d’export XLSX']
 ]},
 customers:{eyebrow:'VOYAGEURS · CDC',intro:'Le CDC demande une fiche voyageur à 360°, accessible par recherche, avec assistance et sécurité.',items:[
  ['Recherche et fiche 360°','Barre de recherche puis fiche complète du voyageur'],
  ['Billets, historique, prestations','Métriques billets / bagages / colis / TAA liées au profil'],
  ['Remboursements, contrôles','Historique financier et de contrôle sur la fiche'],
  ['Urgence, assistance','Contact d’urgence et assistance mobilité affichés'],
  ['Listes par train','Accès rapide « Liste passagers par train »']
 ]},
 agencies:{eyebrow:'POINTS DE VENTE & AGENCES · CDC',intro:'Le CDC demande de piloter gares, agences accréditées et Premium, avec quotas par train et par segment.',items:[
  ['Gares, agences accréditées / Premium','Tableau des points de vente avec leur type'],
  ['Codes, guichets, superviseurs','Colonnes code, nombre de guichets, superviseur'],
  ['Capacités et quotas','Capacité par jour et quota alloué par train'],
  ['Affecter / annuler un quota','Formulaire d’affectation par agence, train, classe et segment']
 ]},
 payments:{eyebrow:'PAIEMENTS · CDC',intro:'Le CDC demande le suivi de tous les canaux de paiement, avec rapprochement et traitement des échecs.',items:[
  ['Espèces, Airtel, Moov, Click&Pay, Visa, Mastercard','Onglets par canal de paiement'],
  ['Références et statuts','Colonnes référence externe et statut'],
  ['Échecs','Onglet « Échecs » avec action de relance'],
  ['Rapprochement','Statut de rapprochement par transaction'],
  ['Remboursement','Action de remboursement reliée à la caisse']
 ]},
 cash:{eyebrow:'CAISSES & RAPPROCHEMENT · CDC',intro:'Le CDC demande l’ouverture, le comptage et la clôture contrôlée de chaque caisse.',items:[
  ['Caisse agent / gare','Tableau par agent et par gare'],
  ['Ouverture / clôture','Bouton « Ouvrir une caisse » et clôture guidée'],
  ['Espèces / électronique','Répartition espèces vs électronique en KPI'],
  ['Écarts','Colonne écart avec justification obligatoire'],
  ['Clôture guidée et génération V65','Bloc « Clôture guidée » relié à Sage X3']
 ]},
 sage:{eyebrow:'COMPTABILITÉ · SAGE X3 · CDC',intro:'Le CDC demande un cycle comptable complet, du journal V65 jusqu’à l’accusé Sage.',items:[
  ['Journal, pièce, site, PDV, compte','Tableau des écritures V65 avec tous ces axes'],
  ['HT / TVA / CSS / TTC','Colonnes financières détaillées'],
  ['Export, statut, erreurs, rejouage','Onglets À contrôler / Prêtes / Déversées / Rejetées / Rejouées'],
  ['Cycle V65 jusqu’à l’accusé Sage','Frise « Cycle de déversement »']
 ]},
 control:{eyebrow:'CONTRÔLES & FRAUDE · CDC',intro:'Le CDC demande de démontrer précisément comment un contrôleur valide un titre à bord, en ligne ou hors connexion.',items:[
  ['Valides / invalides / doublons / annulés / déjà utilisés','Journal des contrôles avec exactement ces statuts'],
  ['PV, amende','Colonne PV/amende et écran « PV / Amende » du terminal contrôleur, document généré avec QR'],
  ['Contrôleur, terminal, heure, train, passager','Toutes ces colonnes dans le journal, et sur chaque écran du terminal mobile'],
  ['Parcours contrôleur online/offline','Bascule En ligne / Hors ligne : les opérations se mettent en file et se synchronisent au retour du réseau'],
  ['Vente à bord et billet manuel pré-imprimé','Écran « Vente à bord (TP) » du terminal contrôleur, billet premium généré instantanément avec QR'],
  ['Embarquement et anti-fraude','Écran « Embarquement » : le contrôleur scanne les voyageurs qui montent voiture par voiture ; ceux qui ont un billet mais n’ont pas scanné restent « absents » et remontent directement sur la fiche de la voiture (page Trains & circulations).'],
  ['Agent de terrain et remontée d’incident','Second poste mobile dédié : un agent au sol signale un incident (arbre sur la voie, signal en panne…) avec repère kilométrique et gravité ; l’alerte apparaît aussitôt sur la carte de Trains & circulations.']
 ]},
 reports:{eyebrow:'RAPPORTS & KPI · CDC',intro:'Le CDC demande des rapports disponibles sur tous les domaines métier, filtrables et programmables.',items:[
  ['Tous domaines métier','Neuf catégories de rapports dans la bibliothèque'],
  ['Filtres par période','Formulaire de génération avec période, gare, produit'],
  ['Exports Excel / PDF / CSV','Sélecteur de format à la génération'],
  ['Programmation','Bouton « Planifier un envoi »']
 ]},
 administration:{eyebrow:'ADMINISTRATION & SÉCURITÉ · CDC chapitres 8 et 9',intro:'Gouvernance complète du Back Office : identité, paramétrage, audit, monitoring, cybersécurité et continuité.',items:[
  ['Utilisateurs, rôles, droits dissociés','Domaine « Identité & habilitations »'],
  ['Paramétrage produits / paiements / trains / classes / taxes / templates','Domaine « Paramétrage métier »'],
  ['Journal d’audit et lutte antifraude','Domaine « Audit & lutte antifraude »'],
  ['Monitoring','Domaine « Monitoring & alertes »'],
  ['Cybersécurité','Domaine « Architecture & cybersécurité »'],
  ['Continuité, réversibilité','Domaine « Continuité & réversibilité » et liste des livrables contractuels']
 ]},
 business:{eyebrow:'MODÈLE ÉCONOMIQUE · CDC',intro:'Impact financier, déploiement et valeur commerciale du projet pour SETRAG.',items:[
  ['Impact financier, valeur commerciale','KPI déploiement, disponibilité, maintenance, réversibilité'],
  ['Trajectoire de déploiement','Frise sur 6 mois, de M1 à M6'],
  ['Alternative de partenariat','Section paiement mensuel négociable, socle de base'],
  ['Valeur économique mesurée','Tableau leviers / indicateurs avant-après']
 ]}
};
function pageIdFromCrumb(){
 return typeof current!=='undefined'&&current?current:''
}
function drawCdcGuide(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 const id=pageIdFromCrumb();
 const g=CDC_GUIDE[id];
 const pageTitle=(document.querySelector('#crumb')?.textContent||'Cette page').replace(/DÉMO CDC\s*$/,'').replace(/^\d+\s*·\s*/,'').trim()||'Cette page';
 if(!g){
  root.innerHTML=`<div class="cdcg-backdrop" data-cdcg-close><div class="cdcg-panel" onclick="event.stopPropagation()"><header><div><span class="cdcg-eyebrow">CONFORMITÉ CDC</span><h2>${esc(pageTitle)}</h2><p>Module conforme au périmètre back-office SETRAG.</p></div><button class="cdcg-close" data-cdcg-close>×</button></header><div class="cdcg-body"><p class="cdcg-empty">Détail de conformité disponible pour les modules principaux du cahier des charges.</p></div><footer><button class="cdcg-close-btn" data-cdcg-close>Fermer</button></footer></div></div>`;
 }else{
  root.innerHTML=`<div class="cdcg-backdrop" data-cdcg-close><div class="cdcg-panel" onclick="event.stopPropagation()">
   <header><div><span class="cdcg-eyebrow">${esc(g.eyebrow)}</span><h2>${esc(pageTitle)}</h2><p>${esc(g.intro)}</p></div><button class="cdcg-close" data-cdcg-close>×</button></header>
   <div class="cdcg-body">
    <div class="cdcg-grid">${g.items.map((it,i)=>`<article><i>${i+1}</i><div><b>${esc(it[0])}</b><p>${esc(it[1])}</p>${it[2]?`<span class="cdcg-ref">${esc(it[2])} · couvert</span>`:'<span class="cdcg-ref">Couvert</span>'}</div></article>`).join('')}</div>
   </div>
   <footer><span class="cdcg-count">${g.items.length} exigence${g.items.length>1?'s':''} démontrée${g.items.length>1?'s':''} sur cette page</span><button class="cdcg-close-btn" data-cdcg-close>Fermer</button></footer>
  </div></div>`;
 }
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-cdcg-close]').forEach(x=>x.onclick=e=>{if(e.target===x||x.hasAttribute('data-cdcg-close')&&x.tagName==='BUTTON')root.innerHTML=''});
}
function relabelGuideButton(){
 const b=document.querySelector('#globalGuide');
 if(!b||b.__cdcgRelabeled)return;
 const span=b.querySelector('span');
 if(span)span.textContent='Guide CDC';
 b.title='Voir comment cette page répond au cahier des charges';
 b.__cdcgRelabeled=true
}
document.addEventListener('click',e=>{if(e.target.closest('#globalGuide'))drawCdcGuide()});
new MutationObserver(relabelGuideButton).observe(document.body,{childList:true,subtree:true});
relabelGuideButton();

/* =====================================================================
   PART 2 — Application contrôleur (terminal mobile / TP) sur la page
   "Contrôles & fraude" : scan QR/NFC, résultat, vente à bord avec
   billet généré, PV avec document généré, mode hors ligne avec file
   de synchronisation. Design premium, écran de téléphone réaliste.
   ===================================================================== */
const CTR_NAMES=[
 ['Nadia Raponda','1re classe','V2 · Place 18'],['Louis Nziengui','2e classe','V4 · Place 09'],
 ['Alice Andjoua','VIP','V1 · Place 04'],['Marc Rombi','2e classe','V3 · Place 22'],
 ['Judith Mabika','2e classe','V4 · Place 31'],['Serge Ondo','1re classe','V2 · Place 07'],
 ['Prisca Boukandou','2e classe','V4 · Place 14'],['Hermann Tchibinda','VIP','V1 · Place 02']
];
const CTR_TERMINAL={id:'CT-021',agent:'J-N. Lekogo',mission:'EXP-620',from:'Owendo',to:'Franceville'};
const CTR_FARES={'VIP':25000,'1re classe':18000,'2e classe':12000};
const CTR_STOPS=['Booué','Lastourville','Moanda','Franceville'];
const CTR_OUTCOMES={
 valide:{cls:'ok',icon:'check-circle-2',label:'Titre valide',weight:.66},
 invalide:{cls:'bad',icon:'x-circle',label:'Titre invalide',weight:.12},
 deja:{cls:'bad',icon:'copy-x',label:'Déjà utilisé',weight:.08},
 doublon:{cls:'warn',icon:'triangle-alert',label:'Doublon détecté',weight:.07},
 annule:{cls:'warn',icon:'ban',label:'Billet annulé',weight:.07}
};
let ctr={screen:'scan',online:true,queue:0,lastKind:null,lastPassenger:null,lastTicket:null,lastPv:null,boardCar:null,stats:{controls:0,valid:0,irregular:0,pv:0},log:[]};
function ctrNow(){return new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
function ctrQrUrl(data){return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent('SETRAG|'+data+'|CTRL-'+CTR_TERMINAL.id)}`}
function ctrLogPush(text,icon){
 ctr.log.unshift({text,icon:icon||'circle-dot',time:ctrNow()});
 ctr.log=ctr.log.slice(0,8);
 const el=document.getElementById('ctrLog');
 if(el){el.innerHTML=ctrLogHtml();if(window.lucide)lucide.createIcons()}
}
function ctrLogHtml(){
 if(!ctr.log.length)return '<p class="ctr-log-empty">Aucune opération pour l’instant.</p>';
 return ctr.log.map(l=>`<div class="ctr-log-row"><i>${I(l.icon)}</i><b>${esc(l.text)}</b><span>${l.time}</span></div>`).join('')
}
function ctrStatsHtml(){
 const s=ctr.stats;
 return [['Contrôles',s.controls],['Valides',s.valid],['Irrégularités',s.irregular],['PV émis',s.pv]].map(x=>`<div class="ctr-stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')
}
function pickOutcome(){
 const r=Math.random();let acc=0;
 for(const k in CTR_OUTCOMES){acc+=CTR_OUTCOMES[k].weight;if(r<=acc)return k}
 return 'valide'
}
function ctrScanScreen(){
 return `<div class="ctr-scan-view"><div class="ctr-viewfinder"><i class="ctr-corner tl"></i><i class="ctr-corner tr"></i><i class="ctr-corner bl"></i><i class="ctr-corner br"></i><i class="ctr-scanline"></i><span>${I('scan-line')} Placez le QR ou approchez la carte NFC</span></div><button class="ctr-scan-btn" data-ctr-scan>${I('scan-line')} Scanner un titre</button></div>`
}
function ctrResultScreen(){
 const kind=ctr.lastKind,p=ctr.lastPassenger,meta=CTR_OUTCOMES[kind];
 const initials=p[0].split(' ').map(w=>w[0]).slice(0,2).join('');
 return `<div class="ctr-result ${meta.cls}">
  <i class="ctr-result-icon">${I(meta.icon)}</i><h4>${meta.label}</h4>
  <div class="ctr-passenger-card"><span class="ctr-avatar">${esc(initials)}</span><div><b>${esc(p[0])}</b><span>${esc(p[1])} · ${esc(p[2])}</span></div></div>
  <div class="ctr-result-meta"><span><small>Train</small><b>${CTR_TERMINAL.mission}</b></span><span><small>Heure</small><b>${ctrNow()}</b></span><span><small>Terminal</small><b>${CTR_TERMINAL.id}</b></span></div>
  ${meta.cls!=='ok'?`<div class="ctr-result-actions"><button data-ctr-action="pv">${I('file-warning')} Rédiger un PV</button><button data-ctr-action="sale">${I('receipt')} Vendre un billet</button></div>`:''}
  <button class="ghost" data-ctr-action="rescan">${I('scan-line')} Nouveau scan</button>
 </div>`
}
function ctrSaleScreen(){
 const cls=Object.keys(CTR_FARES);
 return `<div class="ctr-form"><div class="ctr-form-head"><b>${CTR_TERMINAL.mission}</b><span>${CTR_TERMINAL.from} → ${CTR_TERMINAL.to}</span></div>
  <label>Gare de descente<select id="ctrSaleStop">${CTR_STOPS.map(s=>`<option>${s}</option>`).join('')}</select></label>
  <label>Classe<select id="ctrSaleClass">${cls.map(c=>`<option>${c}</option>`).join('')}</select></label>
  <label>Paiement<select id="ctrSalePay"><option>Espèces</option><option>Moov Money</option><option>Airtel Money</option><option>Carte bancaire</option></select></label>
  <div class="ctr-fare-preview"><small>Montant à percevoir</small><b id="ctrFarePreview">${fmt(CTR_FARES[cls[0]])} FCFA</b></div>
  <button data-ctr-issue>${I('receipt')} Émettre le billet (TP)</button>
 </div>`
}
function ctrTicketScreen(){
 const t=ctr.lastTicket;
 return `<div class="ctr-doc ctr-ticket"><div class="ctr-doc-head"><span>${I('train-front')} SETRAG</span><b>Billet émis à bord</b></div>
  <div class="ctr-doc-route"><b>${CTR_TERMINAL.from}</b><i>${I('arrow-right')}</i><b>${esc(t.stop)}</b></div>
  <div class="ctr-doc-grid"><span><small>Train</small><b>${CTR_TERMINAL.mission}</b></span><span><small>Classe</small><b>${esc(t.cls)}</b></span><span><small>Paiement</small><b>${esc(t.pay)}</b></span><span><small>Montant</small><b>${fmt(t.price)} FCFA</b></span></div>
  <div class="ctr-doc-foot"><img src="${ctrQrUrl(t.ref)}" alt="QR de vérification"><div><small>N° ${t.ref}</small><span>Émis par ${CTR_TERMINAL.agent} · ${t.time}</span></div></div>
  <button class="ghost" data-ctr-action="rescan">${I('scan-line')} Nouveau scan</button>
 </div>`
}
function ctrPvScreen(){
 return `<div class="ctr-form"><div class="ctr-form-head"><b>Rédaction d’un procès-verbal</b><span>${CTR_TERMINAL.mission} · ${CTR_TERMINAL.id}</span></div>
  <label>Motif<select id="ctrPvMotif"><option>Titre invalide</option><option>Sans titre de transport</option><option>Titre déjà utilisé</option><option>Refus de contrôle</option><option>Autre irrégularité</option></select></label>
  <label>Montant de l’amende (FCFA)<input id="ctrPvAmount" type="number" value="25000"></label>
  <button data-ctr-pv>${I('file-warning')} Émettre le PV</button>
 </div>`
}
function ctrPvDocScreen(){
 const v=ctr.lastPv;
 return `<div class="ctr-doc ctr-pvdoc"><div class="ctr-doc-head"><span>${I('shield-alert')} SETRAG</span><b>Procès-verbal</b></div>
  <div class="ctr-doc-grid"><span><small>Référence</small><b>${v.ref}</b></span><span><small>Motif</small><b>${esc(v.motif)}</b></span><span><small>Montant</small><b>${fmt(v.amount)} FCFA</b></span><span><small>Contrôleur</small><b>${CTR_TERMINAL.agent}</b></span></div>
  <div class="ctr-doc-foot"><img src="${ctrQrUrl(v.ref)}" alt="QR de vérification"><div><small>${CTR_TERMINAL.mission} · ${CTR_TERMINAL.id}</small><span>Émis ${v.time}</span></div></div>
  <button class="ghost" data-ctr-action="rescan">${I('scan-line')} Nouveau scan</button>
 </div>`
}
function ctrBoardScreen(){
 const api=window.SETRAG_TRAIN_API;
 if(!api)return `<p class="ctr-log-empty">Manifeste indisponible.</p>`;
 const t=api.trains.find(x=>x.id===CTR_TERMINAL.mission);
 const paxCars=t&&t.voitures?t.voitures.filter(v=>v[3]||v[4]):[];
 if(!paxCars.length)return `<p class="ctr-log-empty">Train sans voitures voyageurs.</p>`;
 if(!ctr.boardCar||!paxCars.some(v=>v[0]===ctr.boardCar))ctr.boardCar=paxCars[0][0];
 const man=api.getPassengers(t.id,ctr.boardCar);
 const occRows=man?man.rows.filter(r=>r.status==='occupied'):[];
 const boarded=occRows.filter(r=>r.boarded).length;
 return `<div class="ctr-board-view">
  <div class="ctr-board-head"><b>${boarded}/${occRows.length} embarqués</b><select id="ctrBoardCar">${paxCars.map(v=>`<option value="${v[0]}"${v[0]===ctr.boardCar?' selected':''}>${v[0]} · ${v[1]}</option>`).join('')}</select></div>
  <div class="ctr-board-list">${occRows.length?occRows.map(r=>`<button class="ctr-board-seat ${r.boarded?'in':'out'}" data-ctr-board-seat="${r.seat}"><span class="seat">${r.seat}</span><span class="name">${esc(r.name)}</span><span class="tag">${r.boarded?I('check'):I('x')} ${r.boarded?'Embarqué':'Absent'}</span></button>`).join(''):'<p class="ctr-log-empty">Aucun passager sur cette voiture.</p>'}</div>
 </div>`
}
function ctrNavKey(){return ctr.screen==='result'?'scan':ctr.screen==='ticket'?'sale':ctr.screen==='pvdoc'?'pv':ctr.screen}
function ctrPaint(){
 const screen=document.getElementById('ctrScreen');
 if(screen){
  const html=ctr.screen==='scan'?ctrScanScreen():ctr.screen==='result'?ctrResultScreen():ctr.screen==='board'?ctrBoardScreen():ctr.screen==='sale'?ctrSaleScreen():ctr.screen==='ticket'?ctrTicketScreen():ctr.screen==='pv'?ctrPvScreen():ctrPvDocScreen();
  screen.innerHTML=`<div class="ctr-screen-inner">${html}</div>`
 }
 document.querySelectorAll('[data-ctr-nav]').forEach(b=>b.classList.toggle('active',b.dataset.ctrNav===ctrNavKey()));
 const conn=document.getElementById('ctrConn');
 if(conn){conn.textContent=ctr.online?'En ligne':'Hors ligne';conn.className='ctr-conn '+(ctr.online?'online':'offline')}
 const sync=document.getElementById('ctrSync');
 if(sync)sync.textContent=ctr.queue?`${ctr.queue} en file`:'Synchronisé';
 const sw=document.getElementById('ctrConnSwitch');
 if(sw)sw.classList.toggle('off',!ctr.online);
 const stats=document.getElementById('ctrStats');
 if(stats)stats.innerHTML=ctrStatsHtml();
 if(window.lucide)lucide.createIcons();
 wireCtr()
}
function wireCtr(){
 document.querySelectorAll('[data-ctr-nav]').forEach(b=>b.onclick=()=>{ctr.screen=b.dataset.ctrNav;ctrPaint()});
 const scanBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-scan]');
 if(scanBtn)scanBtn.onclick=()=>{
  const kind=pickOutcome(),p=CTR_NAMES[Math.floor(Math.random()*CTR_NAMES.length)];
  ctr.lastKind=kind;ctr.lastPassenger=p;ctr.screen='result';
  ctr.stats.controls++;if(kind==='valide')ctr.stats.valid++;else ctr.stats.irregular++;
  ctrPaint();
  const label=CTR_OUTCOMES[kind].label;
  if(ctr.online)ctrLogPush(`Contrôle ${p[0]} · ${label}`,CTR_OUTCOMES[kind].icon);
  else{ctr.queue++;ctrLogPush(`Contrôle ${p[0]} (hors ligne) · ${label}`,'cloud-off')}
 };
 document.querySelectorAll('[data-ctr-action]').forEach(b=>b.onclick=()=>{
  const a=b.dataset.ctrAction;
  ctr.screen=a==='rescan'?'scan':a==='pv'?'pv':'sale';
  ctrPaint()
 });
 const classSel=document.getElementById('ctrSaleClass');
 if(classSel)classSel.onchange=()=>{const el=document.getElementById('ctrFarePreview');if(el)el.textContent=fmt(CTR_FARES[classSel.value])+' FCFA'};
 const boardCarSel=document.getElementById('ctrBoardCar');
 if(boardCarSel)boardCarSel.onchange=()=>{ctr.boardCar=boardCarSel.value;ctrPaint()};
 document.querySelectorAll('[data-ctr-board-seat]').forEach(b=>b.onclick=()=>{
  const api=window.SETRAG_TRAIN_API;
  const t=api&&api.trains.find(x=>x.id===CTR_TERMINAL.mission);
  const man=t&&api.getPassengers(t.id,ctr.boardCar);
  const row=man&&man.rows.find(r=>r.seat===b.dataset.ctrBoardSeat);
  if(!row)return;
  const next=!row.boarded;
  api.setBoarding(t.id,row.seat,next);
  ctrLogPush(`${next?'Embarquement':'Marqué absent'} · ${row.name} · ${ctr.boardCar}/${row.seat}`,next?'user-check':'user-x');
  ctrPaint()
 });
 const issueBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-issue]');
 if(issueBtn)issueBtn.onclick=()=>{
  const stop=document.getElementById('ctrSaleStop').value,cls=document.getElementById('ctrSaleClass').value,pay=document.getElementById('ctrSalePay').value;
  const price=CTR_FARES[cls],ref='TP-'+Math.floor(100000+Math.random()*900000);
  ctr.lastTicket={stop,cls,pay,price,ref,time:ctrNow()};
  ctr.screen='ticket';
  if(ctr.online){ctrLogPush(`Billet émis à bord · ${fmt(price)} FCFA · ${pay}`,'receipt');toastMsg('Billet émis à bord · document généré et journalisé')}
  else{ctr.queue++;ctrLogPush('Vente à bord (hors ligne, en file)','cloud-off');toastMsg('Vente enregistrée hors ligne · sera synchronisée')}
  ctrPaint();
  setragPrint('ctrPrinter',ctrTicketReceiptLines(ctr.lastTicket))
 };
 const pvBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-pv]');
 if(pvBtn)pvBtn.onclick=()=>{
  const motif=document.getElementById('ctrPvMotif').value,amount=+document.getElementById('ctrPvAmount').value||0;
  const ref='PV-'+Math.floor(10000+Math.random()*90000);
  ctr.lastPv={motif,amount,ref,time:ctrNow()};
  ctr.stats.pv++;ctr.screen='pvdoc';
  if(ctr.online){ctrLogPush(`PV émis · ${motif} · ${fmt(amount)} FCFA`,'file-warning');toastMsg('PV émis · amende consignée et journalisée')}
  else{ctr.queue++;ctrLogPush('PV (hors ligne, en file)','cloud-off');toastMsg('PV enregistré hors ligne · sera synchronisé')}
  ctrPaint();
  setragPrint('ctrPrinter',ctrPvReceiptLines(ctr.lastPv))
 };
 const connSwitch=document.getElementById('ctrConnSwitch');
 if(connSwitch)connSwitch.onclick=()=>{
  ctr.online=!ctr.online;
  if(ctr.online&&ctr.queue){toastMsg(`${ctr.queue} opération(s) synchronisée(s) avec le central`);ctrLogPush(`${ctr.queue} opération(s) synchronisée(s) avec le central`,'refresh-cw');ctr.queue=0}
  else if(!ctr.online)toastMsg('Mode hors ligne · les opérations sont mises en file locale');
  ctrPaint()
 };
}
function controllerAppSection(){
 return `<div class="cdc-section" style="margin-top:15px"><section class="cdc-card ctr-app">
  <header><div><h3>${I('printer')} Application contrôleur · TPE mobile avec imprimante intégrée</h3><p>Ce que voit le contrôleur à bord, en ligne ou hors connexion — scan, embarquement, vente à bord, PV imprimé, synchronisation.</p></div><div class="ctr-stats" id="ctrStats">${ctrStatsHtml()}</div></header>
  <div class="cdc-card-body">
   <div class="ctr-shell ctr-shell-tpe">
    <div class="ctr-tpe-wrap">
     <div class="ctr-tpe-printer-unit" id="ctrPrinter">
      <div class="ctr-tpe-track setrag-paper-track"><div class="setrag-paper"><pre class="setrag-receipt"></pre></div></div>
      <div class="ctr-tpe-printer">
       <div class="setrag-printer-roll"><i></i><i></i><i></i><i></i></div>
       <div class="setrag-printer-slot"></div>
       <div class="setrag-printer-face"><span class="setrag-printer-led"></span><small>Imprimante intégrée</small></div>
      </div>
     </div>
     <div class="ctr-tpe">
      <div class="ctr-phone-screen">
       <div class="ctr-statusbar"><span class="ctr-time">${ctrNow()}</span><span class="ctr-statusicons">${I('signal-high')}${I('battery-full')}</span></div>
       <div class="ctr-appbar"><b>SETRAG Contrôle</b><span>${CTR_TERMINAL.id} · ${CTR_TERMINAL.agent}</span></div>
       <div class="ctr-screen" id="ctrScreen"></div>
       <div class="ctr-bottomnav">
        <button class="active" data-ctr-nav="scan">${I('scan-line')}<small>Scanner</small></button>
        <button data-ctr-nav="board">${I('users')}<small>Embarq.</small></button>
        <button data-ctr-nav="sale">${I('receipt')}<small>Vente</small></button>
        <button data-ctr-nav="pv">${I('file-warning')}<small>PV</small></button>
       </div>
      </div>
      <div class="ctr-tpe-grip"><i></i></div>
     </div>
    </div>
    <div class="ctr-side">
     <div class="ctr-conn-card"><div><span id="ctrConn" class="ctr-conn online">En ligne</span><small id="ctrSync">Synchronisé</small></div><button class="ctr-switch" id="ctrConnSwitch" title="Basculer le mode de connexion"><i></i></button></div>
     <div class="ctr-log"><b>Journal du contrôleur</b><div id="ctrLog">${ctrLogHtml()}</div></div>
    </div>
   </div>
  </div>
 </section></div>`
}

/* =====================================================================
   PART 2b — Agent de terrain (second poste mobile) : signalement d’un
   incident (arbre sur la voie, signal en panne…) avec PK et gravité,
   remonté immédiatement au centre des opérations (bandeau sur la page
   Trains & circulations).
   ===================================================================== */
const FLD_AGENT={id:'AG-014',name:'Serge Ondo'};
const FLD_INCIDENT_TYPES=[
 ['tree','Arbre sur la voie','tree-deciduous'],
 ['signal','Signal en panne','octagon-alert'],
 ['obstacle','Obstacle sur la voie','ban'],
 ['flood','Voie inondée','cloud-rain'],
 ['vandalism','Dégradation constatée','shield-alert'],
 ['other','Autre situation à risque','circle-alert']
];
let fld={screen:'report'};
function fldIncidents(){return window.SETRAG_INCIDENTS=window.SETRAG_INCIDENTS||[]}
function fldStatsHtml(){
 const list=fldIncidents();
 const active=list.filter(x=>!x.resolved).length,resolved=list.filter(x=>x.resolved).length;
 return [['Alertes actives',active],['Résolues',resolved]].map(x=>`<div class="ctr-stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')
}
function fldLogPush(text,icon){
 fld.log=fld.log||[];
 fld.log.unshift({text,icon:icon||'circle-dot',time:ctrNow()});
 fld.log=fld.log.slice(0,8);
 const el=document.getElementById('fldLog');
 if(el){el.innerHTML=fldLogHtml();if(window.lucide)lucide.createIcons()}
}
function fldLogHtml(){
 if(!fld.log||!fld.log.length)return '<p class="ctr-log-empty">Aucune alerte envoyée pour l’instant.</p>';
 return fld.log.map(l=>`<div class="ctr-log-row"><i>${I(l.icon)}</i><b>${esc(l.text)}</b><span>${l.time}</span></div>`).join('')
}
function fldReportScreen(){
 return `<div class="ctr-form"><div class="ctr-form-head"><b>Nouveau signalement</b><span>${FLD_AGENT.id} · position GPS active</span></div>
  <label>Type d’incident<select id="fldType">${FLD_INCIDENT_TYPES.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label>
  <label>Repère kilométrique (PK)<input id="fldPk" type="number" value="184" min="0" max="648"></label>
  <label>Gravité<select id="fldSeverity"><option value="bad">Élevée · circulation compromise</option><option value="warn">Moyenne · ralentissement</option><option value="">Faible · à surveiller</option></select></label>
  <label>Description<input id="fldDesc" placeholder="Ex. arbre tombé après l’orage"></label>
  <button data-fld-send>${I('send')} Envoyer l’alerte</button>
 </div>`
}
function fldActiveScreen(){
 const list=fldIncidents();
 if(!list.length)return `<div class="ctr-scan-view"><p class="ctr-log-empty">Aucune alerte active.</p></div>`;
 return `<div class="ctr-board-list">${list.map(x=>`<div class="fld-incident ${x.severity}"><b>${esc(x.label)}</b><span>PK ${x.pk} · ${x.time}</span><p>${esc(x.desc)}</p>${!x.resolved?`<button data-fld-resolve="${x.id}">${I('check')} Marquer résolu</button>`:`<span class="fld-resolved">${I('check')} Résolu</span>`}</div>`).join('')}</div>`
}
function fldNavKey(){return fld.screen}
function fldPaint(){
 const screen=document.getElementById('fldScreen');
 if(screen)screen.innerHTML=`<div class="ctr-screen-inner">${fld.screen==='report'?fldReportScreen():fldActiveScreen()}</div>`;
 document.querySelectorAll('[data-fld-nav]').forEach(b=>b.classList.toggle('active',b.dataset.fldNav===fldNavKey()));
 const stats=document.getElementById('fldStats');
 if(stats)stats.innerHTML=fldStatsHtml();
 if(window.lucide)lucide.createIcons();
 wireFld()
}
function wireFld(){
 document.querySelectorAll('[data-fld-nav]').forEach(b=>b.onclick=()=>{fld.screen=b.dataset.fldNav;fldPaint()});
 const sendBtn=document.getElementById('fldScreen')?.querySelector('[data-fld-send]');
 if(sendBtn)sendBtn.onclick=()=>{
  const type=document.getElementById('fldType').value,pk=+document.getElementById('fldPk').value||0,severity=document.getElementById('fldSeverity').value,desc=(document.getElementById('fldDesc').value||'').trim();
  const meta=FLD_INCIDENT_TYPES.find(x=>x[0]===type);
  const inc={id:'INC-'+Math.floor(1000+Math.random()*9000),type,label:meta[1],pk,severity,desc:desc||meta[1],time:ctrNow(),agent:FLD_AGENT.name,resolved:false};
  fldIncidents().unshift(inc);
  fldLogPush(`Alerte envoyée · ${meta[1]} · PK ${pk}`,meta[2]);
  toastMsg(`Alerte transmise au centre des opérations · ${inc.id}`);
  fld.screen='active';
  fldPaint()
 };
 document.querySelectorAll('[data-fld-resolve]').forEach(b=>b.onclick=()=>{
  const inc=fldIncidents().find(x=>x.id===b.dataset.fldResolve);
  if(!inc)return;
  inc.resolved=true;
  fldLogPush(`Alerte résolue · ${inc.label} · PK ${inc.pk}`,'check');
  toastMsg(`${inc.id} marquée résolue`);
  fldPaint()
 });
}
function fieldAgentSection(){
 return `<div class="cdc-section" style="margin-top:15px"><section class="cdc-card ctr-app fld-app">
  <header><div><h3>${I('map-pin')} Agent de terrain · signalement d’incidents</h3><p>Second poste mobile : un agent au sol signale un incident et l’alerte remonte aussitôt au centre des opérations et sur la carte de Trains &amp; circulations.</p></div><div class="ctr-stats" id="fldStats">${fldStatsHtml()}</div></header>
  <div class="cdc-card-body">
   <div class="ctr-shell">
    <div class="ctr-phone"><div class="ctr-phone-notch"></div>
     <div class="ctr-phone-screen">
      <div class="ctr-statusbar"><span class="ctr-time">${ctrNow()}</span><span class="ctr-statusicons">${I('signal-high')}${I('battery-full')}</span></div>
      <div class="ctr-appbar"><b>SETRAG Terrain</b><span>${FLD_AGENT.id} · ${FLD_AGENT.name}</span></div>
      <div class="ctr-screen" id="fldScreen"></div>
      <div class="ctr-bottomnav">
       <button class="active" data-fld-nav="report">${I('triangle-alert')}<small>Signaler</small></button>
       <button data-fld-nav="active">${I('list')}<small>Alertes</small></button>
      </div>
     </div>
    </div>
    <div class="ctr-side">
     <div class="ctr-log"><b>Alertes envoyées</b><div id="fldLog">${fldLogHtml()}</div></div>
    </div>
   </div>
  </div>
 </section></div>`
}

/* =====================================================================
   PART 3 — File de demandes clients (agents / caissières) sur la page
   "Ventes & prestations" : traiter les demandes reçues du Front Office
   (bagage, colis, TAA, funéraire, messagerie).
   ===================================================================== */
const AGQ_ICON={bagage:'luggage',colis:'package',taa:'car-front',funeraire:'flower-2',messagerie:'send',ticket:'ticket'};
const AGT_AGENTS=['Grâce Mavoungou','Paul Mounguengui','Aline Lekabi'];
const AGT_PAYMENTS=['Espèces','Airtel Money','Moov Money','Click&Pay','Visa','Mastercard'];
function agqSeed(){
 const q=window.SETRAG_SERVICE_REQUESTS=window.SETRAG_SERVICE_REQUESTS||[];
 if(!q.length){
  q.push(
   {ref:'COL-260817-4471',service:'Colis express',kind:'colis',client:'Judith Mabika',fields:[['Expéditeur','Judith Mabika'],['Destinataire','Serge Ondo'],['Téléphone destinataire','+241 06 12 90 44'],['Poids (kg)','14']],summary:'Expéditeur : Judith Mabika · Destinataire : Serge Ondo · Poids (kg) : 14',time:'08:12',status:'nouvelle',agent:null,channel:'Portail web'},
   {ref:'BAG-260817-9021',service:'Bagages',kind:'bagage',client:'SET-260817-2201',fields:[['Numéro de billet voyageur','SET-260817-2201'],['Poids (kg)','22'],['Gare de départ','Owendo'],['Gare d’arrivée','Franceville']],summary:'Numéro de billet voyageur : SET-260817-2201 · Poids (kg) : 22',time:'08:26',status:'nouvelle',agent:null,channel:'Application mobile'},
   {ref:'FUN-260817-0092',service:'Transport funéraire',kind:'funeraire',client:'Famille Ntoutoume',fields:[['Expéditeur / famille','Famille Ntoutoume'],['Téléphone','+241 06 12 34 56'],['Gare de départ','Owendo'],['Gare d’arrivée','Franceville']],summary:'Expéditeur / famille : Famille Ntoutoume · Téléphone : +241 06 12 34 56',time:'08:41',status:'en_cours',agent:'Grâce Mavoungou',channel:'Portail web'}
  )
 }
 return q
}
function agqStatusLabel(s){return{nouvelle:'Nouvelle',en_cours:'En cours',traitee:'Traitée',rejetee:'Rejetée'}[s]||s}
function agqFieldVal(r,part){const f=(r.fields||[]).find(x=>x[0].toLowerCase().includes(part.toLowerCase()));return f?f[1]:null}
function agqPricing(r){
 if(r.kind==='bagage'){
  const poids=+(agqFieldVal(r,'poids')||20);
  const montant=poids<=30?490:700;
  return{montant,detail:`${poids} kg · franchise 30 kg · ${poids<=30?'0–190 km':'≥200 km'}`,code:poids<=30?'BAG-Z1':'BAG-Z2'}
 }
 if(r.kind==='colis'){
  const poids=+(agqFieldVal(r,'poids')||10);
  const montant=Math.max(1500,Math.round(poids*650/100)*100);
  return{montant,detail:`${poids} kg · zone standard COLIRAIL`,code:'COL-Z1'}
 }
 if(r.kind==='taa'){
  const t=+(agqFieldVal(r,'tonnage')||1.5);
  const montant=Math.max(20000,Math.round(t*35000/500)*500);
  return{montant,detail:`${t} t · porte-auto`,code:'TAA-Z6'}
 }
 if(r.kind==='funeraire')return{montant:150000,detail:'Forfait national · dossier à accès restreint',code:'FUN-01'};
 if(r.kind==='messagerie')return{montant:1500,detail:'Pli standard · régime voyageurs',code:'MSG-01'};
 return{montant:0,detail:'',code:'—'}
}
function agqRowHtml(r){
 return `<div class="agq-row" data-agq-ref="${esc(r.ref)}"><div class="agq-icon">${I(AGQ_ICON[r.kind]||'file-text')}</div><div class="agq-main"><b>${esc(r.service)} · ${esc(r.ref)}</b><span>${esc(r.summary)}</span></div><div class="agq-meta"><small>Reçu à ${esc(r.time)} · ${esc(r.channel||'Portail web')}</small><span class="agq-status ${r.status}">${agqStatusLabel(r.status)}</span></div><div class="agq-actions row-actions">${
  r.status==='nouvelle'?`<button data-agq-act="treat">Prendre en charge</button>`:
  r.status==='en_cours'?`<button data-agq-act="tablet">${I('tablet')} Traiter sur la tablette ↓</button>`:
  r.status==='rejetee'?`<span class="agq-rejected">${I('x')} Rejetée</span>`:
  `<span class="agq-done">${I('check')} Traitée par ${esc(r.agent||'agent')}</span>`
 }</div></div>`
}
function agqListHtml(){
 const q=agqSeed();
 if(!q.length)return `<p class="agq-empty">Aucune demande en attente pour l’instant.</p>`;
 return q.map(agqRowHtml).join('')
}
function agqRefresh(){
 const el=document.getElementById('agqList');
 if(el){el.innerHTML=agqListHtml();if(window.lucide)lucide.createIcons();wireAgq()}
 const count=document.getElementById('agqCount');
 if(count){const n=agqSeed().filter(r=>r.status==='nouvelle'||r.status==='en_cours').length;count.textContent=`${n} demande${n>1?'s':''} à traiter`}
}
function wireAgq(){
 document.querySelectorAll('[data-agq-act]').forEach(b=>b.onclick=()=>{
  const row=b.closest('[data-agq-ref]'),ref=row.dataset.agqRef;
  const q=agqSeed(),r=q.find(x=>x.ref===ref);
  if(!r)return;
  if(b.dataset.agqAct==='treat'){r.status='en_cours';r.agent='Grâce Mavoungou';toastMsg(`${ref} pris en charge par Grâce Mavoungou`);agqRefresh()}
  else if(b.dataset.agqAct==='tablet'){agt.selected=ref;agtPaint();document.getElementById('agtTablet')?.scrollIntoView({behavior:'smooth',block:'center'})}
 });
}
function agentQueueSection(){
 return `<div style="margin-top:15px"><section class="cdc-card agq-queue">
  <header><div><h3>${I('inbox')} File de demandes clients · agents &amp; guichets</h3><p>Demandes reçues depuis le Front Office (bagage, colis, TAA, funéraire, messagerie) — à traiter par un agent.</p></div><span class="agq-count" id="agqCount"></span></header>
  <div class="cdc-card-body"><div class="agq-list" id="agqList">${agqListHtml()}</div></div>
 </section></div>`
}

/* ---------- Part 3b : tablette caissier · application vendeur Front Office ---------- */
let agt={mode:'sale',selected:null,svc:'billet',ticketCls:null,lastSale:null,lastSalePricing:null};
let agtGuichetCount=0;
const AGT_STATIONS=[['OWE','Owendo'],['NTM','N’Toum'],['NDJ','Ndjolé'],['LOP','Lopé'],['BOU','Booué'],['LAS','Lastourville'],['MOA','Moanda'],['FCV','Franceville']];
const AGT_TRAINS=[['EXP-620','EXPRESS · 07:30'],['OMN-624','OMNIBUS · 11:20'],['SPE-551','SPÉCIAL · 14:00']];
const AGT_SALE_SERVICES=[
 ['billet','Billet voyageur','ticket'],['bagage','Bagage','luggage'],['colis','Colis express','package'],
 ['taa','Transport Auto Accompagné','car-front'],['funeraire','Transport funéraire','flower-2'],['messagerie','Messagerie voyageurs','send']
];
const AGT_SVC_FIELDS={
 bagage:[['Numéro de billet voyageur','SET-260819-4021'],['Poids (kg)','24'],['Gare de départ','Owendo'],['Gare d’arrivée','Franceville']],
 colis:[['Expéditeur','Nom complet'],['Destinataire','Nom complet'],['Téléphone destinataire','+241 06 00 00 00'],['Poids (kg)','8']],
 taa:[['Titulaire du billet','Nom complet'],['Véhicule','Toyota Hilux'],['Immatriculation','GA-1234-AB'],['Tonnage (t)','2.1']],
 funeraire:[['Expéditeur / famille','Nom complet'],['Téléphone','+241 06 00 00 00'],['Gare de départ','Owendo'],['Gare d’arrivée','Franceville']],
 messagerie:[['Expéditeur','Nom complet'],['Destinataire','Nom complet'],['Numéro de train','EXP-620'],['Description','Nature de l’envoi']]
};

/* ---------- Documents professionnels (même gabarit que Ventes & prestations) ---------- */
const AGT_DOC_META={
 bagage:{watermark:'SETRAG BAGAGES',type:'ÉTIQUETTE BAGAGE SÉCURISÉE',status:'ENREGISTRÉ',cls:'bag-doc'},
 colis:{watermark:'COLIS EXPRESS',type:'BORDEREAU COLIS EXPRESS',status:'EN TRANSIT',cls:'parcel-doc'},
 taa:{watermark:'AUTO ACCOMPAGNÉE',type:'AUTORISATION TRANSPORT AUTO ACCOMPAGNÉ',status:'CHARGEMENT AUTORISÉ',cls:'taa-doc'},
 funeraire:{watermark:'ACCÈS RESTREINT',type:'BORDEREAU TRANSPORT FUNÉRAIRE',status:'DOSSIER CONFORME',cls:'funeral-doc'},
 messagerie:{watermark:'MESSAGERIE VOYAGEURS',type:'BORDEREAU MESSAGERIE VOYAGEURS',status:'PRIS EN CHARGE',cls:'messagerie-doc'}
};
function agtStCode(label){const s=AGT_STATIONS.find(x=>x[1]===label);return s?s[0]:(label||'—').slice(0,3).toUpperCase()}
function agtDocBrand(type,ref,status){return `<header class="doc-brand"><div class="doc-logo"><span>⚡</span><b>SETRAG</b><small>Le Transgabonais</small></div><div><small>${esc(type)}</small><strong>${esc(ref)}</strong></div><em>${esc(status)}</em></header>`}
function agtDocQr(ref){return `<div class="doc-qr"><img src="${ctrQrUrl(ref)}" alt="QR de vérification"><small>QR signé</small></div>`}
function agtBarcode(ref){return `<div class="premium-barcode">${Array.from({length:14}).map(()=>'<i></i>').join('')}<small>${esc(ref)}</small></div>`}
function agtDocMeta(items){return `<div class="doc-meta">${items.map(x=>`<div><small>${esc(x[0])}</small><b>${esc(x[1])}</b></div>`).join('')}</div>`}
function agtDocFinance(ttc){const ht=Math.round(ttc/1.06),vat=Math.round(ht*0.05),css=ttc-ht-vat;return `<div class="doc-finance"><span>Prix unitaire HT <b>${fmt(ht)}</b></span><span>TVA <b>${fmt(vat)}</b></span><span>CSS <b>${fmt(css)}</b></span><strong>TTC ${fmt(ttc)} FCFA</strong></div>`}
function agtTicketDoc(r,pricing){
 return `<article class="setrag-document ticket-doc"><div class="doc-watermark">TRANSGABONAIS</div>${agtDocBrand('BILLET VOYAGEUR ÉLECTRONIQUE',r.ref,'VALIDE')}
  <div class="doc-route"><div><small>DÉPART</small><b>${esc(r.fromLabel)}</b><span>${esc(r.trainLabel||r.train)}</span></div><i>→<small>TRANSGABONAIS</small></i><div><small>ARRIVÉE</small><b>${esc(r.toLabel)}</b><span>${esc(r.train)}</span></div></div>
  <div class="doc-passenger"><div><small>VOYAGEUR · VENTE GUICHET</small><h2>${esc(r.passenger)}</h2><span>Client comptant · encaissement immédiat au guichet</span></div><div class="doc-seat"><small>${esc(r.cls)}</small><b>${esc(r.car)} · Place ${esc(r.seat)}</b></div></div>
  ${agtDocMeta([['Train / service',r.train+(r.trainLabel?' · '+r.trainLabel:'')],['Gares',agtStCode(r.fromLabel)+' → '+agtStCode(r.toLabel)],['Classe',r.cls],['Référence',r.ref],['Type / prestation','VENTE · Billet voyageur'],['Validité','Trajet et date indiqués'],['Point de vente','POS-OW-01 · '+esc(r.agent)],['Émis le',r.processedAt]])}
  ${agtDocFinance(pricing.montant)}
  <footer>${agtDocQr(r.ref)}<div><b>Contrôle online/offline · identifiant unique</b><span>Paiement ${esc(r.payMethod)} · vente guichet</span><span>Vente et encaissement : ${esc(r.processedAt)} · POS-OW-01</span><small>Document nominatif · duplicata contrôlé · piste d’audit</small></div></footer>
 </article>`
}
function agtServiceDoc(r,pricing){
 const m=AGT_DOC_META[r.kind]||AGT_DOC_META.messagerie;
 const dep=agqFieldVal(r,'départ')||'Owendo',arr=agqFieldVal(r,'arrivée')||'Franceville';
 let identity='';
 if(r.kind==='bagage'){
  const owner=agqFieldVal(r,'billet')||r.agent,poids=agqFieldVal(r,'poids')||'—';
  identity=`<div class="premium-identity"><div><small>VOYAGEUR PROPRIÉTAIRE</small><h2>${esc(owner)}</h2><span>${esc(r.ref)} · billet lié</span></div><strong><small>POIDS CONTRÔLÉ</small>${esc(poids)} KG</strong></div>`
 }else if(r.kind==='colis'){
  const from=agqFieldVal(r,'expéditeur')||'—',to=agqFieldVal(r,'destinataire')||'—',poids=agqFieldVal(r,'poids')||'—';
  identity=`<div class="premium-identity"><div><small>EXPÉDITEUR</small><h2>${esc(from)}</h2><span>${esc(agqFieldVal(r,'téléphone')||'Identité vérifiée')}</span></div><div class="recipient"><small>DESTINATAIRE</small><h2>${esc(to)}</h2></div><strong><small>POIDS</small>${esc(poids)} KG</strong></div>`
 }else if(r.kind==='taa'){
  const owner=agqFieldVal(r,'titulaire')||'—',veh=agqFieldVal(r,'véhicule')||'—',immat=agqFieldVal(r,'immatriculation')||'—',tonnage=agqFieldVal(r,'tonnage')||'—';
  identity=`<div class="premium-identity"><div><small>VÉHICULE</small><h2>${esc(veh)}</h2><span>${esc(immat)}</span></div><div><small>CONDUCTEUR / BILLET</small><h2>${esc(owner)}</h2><span>${esc(r.ref)}</span></div><strong><small>MASSE</small>${esc(tonnage)} T</strong></div>`
 }else if(r.kind==='funeraire'){
  const fam=agqFieldVal(r,'expéditeur')||agqFieldVal(r,'famille')||'—';
  identity=`<div class="premium-identity confidential"><div><small>PERSONNE HABILITÉE</small><h2>${esc(fam)}</h2><span>Données sensibles protégées selon le rôle</span></div><strong><small>DOSSIER</small>TF-${esc(r.ref.slice(-2))}</strong></div>`
 }else{
  const from=agqFieldVal(r,'expéditeur')||'—',to=agqFieldVal(r,'destinataire')||'—',train=agqFieldVal(r,'train')||'—';
  identity=`<div class="premium-identity"><div><small>EXPÉDITEUR</small><h2>${esc(from)}</h2></div><div class="recipient"><small>DESTINATAIRE</small><h2>${esc(to)}</h2></div><strong><small>TRAIN</small>${esc(train)}</strong></div>`
 }
 const keyline=(r.fields||[]).slice(0,4).map(f=>`<span><small>${esc(f[0]).toUpperCase()}</small><b>${esc(f[1])}</b></span>`).join('');
 return `<article class="setrag-document premium-service ${m.cls}"><div class="doc-watermark">${esc(m.watermark)}</div>${agtDocBrand(m.type,r.ref,m.status)}
  <div class="premium-service-route"><section><small>ORIGINE</small><strong>${esc(agtStCode(dep))}</strong><b>${esc(dep)}</b></section><div><span>TRANSGABONAIS</span><i>→</i><small>VENTE GUICHET</small></div><section><small>DESTINATION</small><strong>${esc(agtStCode(arr))}</strong><b>${esc(arr)}</b></section></div>
  ${identity}
  <div class="premium-keyline">${keyline}</div>
  ${agtDocMeta([['N° opération',r.ref],['Code tarifaire',pricing.code],['Application tarif',pricing.detail],['Montant TTC',fmt(pricing.montant)+' FCFA'],['Paiement',r.payMethod||'—'],['Émetteur','POS-OW-01'],['Agent',r.agent||'—'],['Horodatage',r.processedAt||'']])}
  <div class="premium-control">${agtBarcode(r.ref)}${agtDocQr(r.ref)}<aside><small>IDENTIFIANT UNIQUE</small><b>${esc(r.ref)}</b><span>Document généré au guichet · rapprochement billet/paiement automatique.</span><em>✓ Paiement vérifié · ✓ document signé · ✓ piste d’audit</em></aside></div>
 </article>`
}
function agtProDoc(r,pricing){return r.kind==='billet'?agtTicketDoc(r,pricing):agtServiceDoc(r,pricing)}

function agtListHtml(){
 const q=agqSeed();
 if(!q.length)return `<p class="ctr-log-empty">Aucune demande.</p>`;
 return q.map(r=>`<button class="agt-row ${r.ref===agt.selected?'active':''}" data-agt-select="${esc(r.ref)}"><span class="agt-row-icon">${I(AGQ_ICON[r.kind]||'file-text')}</span><div><b>${esc(r.service)}</b><small>${esc(r.ref)} · ${esc(r.time)}</small></div><span class="agq-status ${r.status}">${agqStatusLabel(r.status)}</span></button>`).join('')
}
function agtSvcListHtml(){
 return AGT_SALE_SERVICES.map(s=>`<button class="agt-row svc-btn ${agt.svc===s[0]?'active':''}" data-agt-svc="${s[0]}"><span class="agt-row-icon svc-${s[0]}">${I(s[2])}</span><div><b>${esc(s[1])}</b><small>Vente directe au guichet</small></div></button>`).join('')
}
function agtRequestDetailHtml(){
 const q=agqSeed();
 const r=q.find(x=>x.ref===agt.selected)||q.find(x=>x.status==='nouvelle'||x.status==='en_cours')||q[0];
 if(!r)return `<div class="ctr-scan-view"><p class="ctr-log-empty">File vide.</p></div>`;
 agt.selected=r.ref;
 const pricing=agqPricing(r);
 if(r.status==='traitee'||r.status==='rejetee')return agtDoneHtml(r,pricing);
 return `<div class="agt-detail">
  <div class="agt-detail-head"><div><b>${esc(r.service)}</b><span>${esc(r.ref)} · reçu à ${esc(r.time)} · ${esc(r.channel||'Portail web')}</span></div><span class="agq-status ${r.status}">${agqStatusLabel(r.status)}</span></div>
  <div class="agt-fields">${(r.fields||[]).map(f=>`<div><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')||'<div><small>Détails</small><b>—</b></div>'}</div>
  <div class="agt-calc"><div><small>Code tarifaire</small><b>${esc(pricing.code)}</b></div><div><small>Application</small><b>${esc(pricing.detail)}</b></div><div><small>Montant TTC</small><b>${fmt(pricing.montant)} FCFA</b></div></div>
  <div class="agt-form-row">
   <label>Agent affecté<select id="agtAgent">${AGT_AGENTS.map(a=>`<option${a===(r.agent||AGT_AGENTS[0])?' selected':''}>${a}</option>`).join('')}</select></label>
   <label>Moyen de paiement<select id="agtPay">${AGT_PAYMENTS.map(p=>`<option>${p}</option>`).join('')}</select></label>
  </div>
  <div class="agt-actions"><button class="ghost" data-agt-reject="${esc(r.ref)}">${I('x')} Rejeter la demande</button><button class="primary" data-agt-confirm="${esc(r.ref)}">${I('badge-check')} Confirmer et générer le document</button></div>
 </div>`
}
function agtDoneHtml(r,pricing){
 if(r.status==='rejetee'){
  return `<div class="agt-doc rejected">
  <div class="agt-doc-head"><span>${I('x-circle')} SETRAG</span><b>${esc(r.service)} · demande rejetée</b></div>
  <div class="agt-doc-grid">${(r.fields||[]).map(f=>`<span><small>${esc(f[0])}</small><b>${esc(f[1])}</b></span>`).join('')}</div>
  <small class="agt-doc-id">${esc(r.ref)} · Rejetée par ${esc(r.agent||'agent')} · ${esc(r.processedAt||r.time)}</small>
 </div>`
 }
 return `<div class="agt-doc-pro">${agtProDoc(r,pricing)}<small class="agt-doc-id">Document généré à partir de la demande reçue le ${esc(r.time)} via ${esc(r.channel||'Portail web')}</small></div>`
}
function agtTicketFormHtml(){
 const clsList=Object.keys(CTR_FARES),defCls=agt.ticketCls&&clsList.includes(agt.ticketCls)?agt.ticketCls:clsList[clsList.length-1];
 return `<div class="agt-detail">
  <div class="agt-detail-head"><div><b>${I('ticket')} Billet voyageur</b><span>Vente directe · encaissement immédiat au guichet</span></div></div>
  <div class="agt-form-row">
   <label>Départ<select id="agtTFrom">${AGT_STATIONS.map(s=>`<option value="${s[0]}">${s[1]}</option>`).join('')}</select></label>
   <label>Arrivée<select id="agtTTo">${AGT_STATIONS.map((s,i)=>`<option value="${s[0]}"${i===AGT_STATIONS.length-1?' selected':''}>${s[1]}</option>`).join('')}</select></label>
  </div>
  <div class="agt-form-row">
   <label>Train<select id="agtTTrain">${AGT_TRAINS.map(t=>`<option value="${t[0]}">${t[0]} · ${t[1]}</option>`).join('')}</select></label>
   <label>Classe<select id="agtTCls">${clsList.map(c=>`<option${c===defCls?' selected':''}>${c}</option>`).join('')}</select></label>
  </div>
  <label>Voyageur<input id="agtTName" placeholder="Nom et prénom"></label>
  <div class="agt-calc"><div><small>Classe</small><b id="agtTFareLabel">${defCls}</b></div><div><small>Montant TTC</small><b id="agtTFare">${fmt(CTR_FARES[defCls])} FCFA</b></div></div>
  <div class="agt-form-row"><label>Paiement<select id="agtTPay">${AGT_PAYMENTS.map(p=>`<option>${p}</option>`).join('')}</select></label></div>
  <div class="agt-actions"><button class="primary" data-agt-ticket-confirm>${I('printer')} Encaisser et imprimer le billet</button></div>
 </div>`
}
function agtGenericSaleFormHtml(){
 const svc=AGT_SALE_SERVICES.find(s=>s[0]===agt.svc);
 const cfg=AGT_SVC_FIELDS[agt.svc]||[];
 return `<div class="agt-detail">
  <div class="agt-detail-head"><div><b>${I(svc[2])} ${esc(svc[1])}</b><span>Vente directe · encaissement immédiat au guichet</span></div></div>
  <div class="agt-fields-form">${cfg.map((f,i)=>`<label>${esc(f[0])}<input id="agtSaleF${i}" placeholder="${esc(f[1]||'')}"></label>`).join('')}</div>
  <div class="agt-calc" id="agtSaleCalc"><div><small>Tarif</small><b>—</b></div><div><small>Montant estimé</small><b>Renseignez les champs</b></div></div>
  <div class="agt-form-row"><label>Paiement<select id="agtSalePay">${AGT_PAYMENTS.map(p=>`<option>${p}</option>`).join('')}</select></label></div>
  <div class="agt-actions"><button class="primary" data-agt-sale-confirm>${I('printer')} Encaisser et imprimer</button></div>
 </div>`
}
function agtCollectSaleFields(){
 const cfg=AGT_SVC_FIELDS[agt.svc]||[];
 return cfg.map((f,i)=>{const el=document.getElementById(`agtSaleF${i}`);return[f[0],(el&&el.value.trim())||f[1]||'—']})
}
function agtSaleDocHtml(r,pricing){
 return `<div class="agt-doc-pro">${agtProDoc(r,pricing)}
  <div class="agt-actions" style="margin-top:12px"><button class="ghost" data-agt-print>${I('printer')} Imprimer</button><button class="primary" data-agt-new-sale>${I('plus')} Nouvelle vente</button></div>
 </div>`
}
function agtDetailHtml(){
 if(agt.mode==='sale'){
  if(agt.lastSale)return agtSaleDocHtml(agt.lastSale,agt.lastSalePricing);
  return agt.svc==='billet'?agtTicketFormHtml():agtGenericSaleFormHtml()
 }
 return agtRequestDetailHtml()
}
function agtStatsHtml(){
 const q=agqSeed();
 const nouvelles=q.filter(x=>x.status==='nouvelle').length,traitees=q.filter(x=>x.status==='traitee').length;
 return[['Ventes guichet',agtGuichetCount],['Demandes à traiter',nouvelles],['Demandes traitées',traitees]].map(x=>`<div class="ctr-stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')
}
function agtPaint(){
 const list=document.getElementById('agtList');
 if(list)list.innerHTML=agt.mode==='sale'?agtSvcListHtml():agtListHtml();
 const detail=document.getElementById('agtDetail');
 if(detail)detail.innerHTML=`<div class="ctr-screen-inner">${agtDetailHtml()}</div>`;
 document.querySelectorAll('[data-agt-mode]').forEach(b=>b.classList.toggle('active',b.dataset.agtMode===agt.mode));
 const stats=document.getElementById('agtStats');
 if(stats)stats.innerHTML=agtStatsHtml();
 if(window.lucide)lucide.createIcons();
 wireAgt()
}
function wireAgt(){
 document.querySelectorAll('[data-agt-mode]').forEach(b=>b.onclick=()=>{agt.mode=b.dataset.agtMode;agt.lastSale=null;agtPaint()});
 document.querySelectorAll('[data-agt-select]').forEach(b=>b.onclick=()=>{agt.selected=b.dataset.agtSelect;agtPaint()});
 document.querySelectorAll('[data-agt-svc]').forEach(b=>b.onclick=()=>{agt.svc=b.dataset.agtSvc;agt.lastSale=null;agtPaint()});
 const panel=document.getElementById('agtDetail');
 const confirmBtn=panel?.querySelector('[data-agt-confirm]');
 if(confirmBtn)confirmBtn.onclick=()=>{
  const ref=confirmBtn.dataset.agtConfirm,r=agqSeed().find(x=>x.ref===ref);
  if(!r)return;
  r.status='traitee';
  r.agent=document.getElementById('agtAgent').value;
  r.payMethod=document.getElementById('agtPay').value;
  r.processedAt=ctrNow();
  toastMsg(`${ref} confirmé · document généré · client notifié par SMS`);
  agtPaint();agqRefresh();
  setragPrint('agtPrinter',agtReceiptLines(r,agqPricing(r)))
 };
 const rejectBtn=panel?.querySelector('[data-agt-reject]');
 if(rejectBtn)rejectBtn.onclick=()=>{
  const ref=rejectBtn.dataset.agtReject,r=agqSeed().find(x=>x.ref===ref);
  if(!r)return;
  r.status='rejetee';
  r.processedAt=ctrNow();
  toastMsg(`${ref} rejeté · motif à consigner dans le journal d’audit`);
  agtPaint();agqRefresh()
 };
 const tCls=document.getElementById('agtTCls');
 if(tCls)tCls.onchange=()=>{
  agt.ticketCls=tCls.value;
  const lbl=document.getElementById('agtTFareLabel'),fare=document.getElementById('agtTFare');
  if(lbl)lbl.textContent=tCls.value;
  if(fare)fare.textContent=fmt(CTR_FARES[tCls.value])+' FCFA'
 };
 const ticketConfirm=panel?.querySelector('[data-agt-ticket-confirm]');
 if(ticketConfirm)ticketConfirm.onclick=()=>{
  const from=document.getElementById('agtTFrom').value,to=document.getElementById('agtTTo').value;
  const train=document.getElementById('agtTTrain').value,cls=document.getElementById('agtTCls').value;
  const name=(document.getElementById('agtTName').value||'Client comptant').trim();
  const pay=document.getElementById('agtTPay').value;
  const price=CTR_FARES[cls];
  const ref='SET-'+Math.floor(100000+Math.random()*900000);
  const fromSt=AGT_STATIONS.find(s=>s[0]===from),toSt=AGT_STATIONS.find(s=>s[0]===to);
  const trainInfo=AGT_TRAINS.find(t=>t[0]===train);
  const car='V'+(1+Math.floor(Math.random()*4)),seat=1+Math.floor(Math.random()*60);
  const r={ref,service:'Billet voyageur',kind:'billet',
   passenger:name,fromLabel:fromSt[1],toLabel:toSt[1],train,trainLabel:trainInfo?trainInfo[1]:'',cls,car,seat,
   fields:[['Voyageur',name],['Trajet',`${fromSt[1]} → ${toSt[1]}`],['Train',train],['Classe',cls]],
   agent:AGT_AGENTS[0],payMethod:pay,processedAt:ctrNow()};
  agt.lastSale=r;agt.lastSalePricing={montant:price};
  agtGuichetCount++;
  toastMsg(`Billet émis et encaissé au guichet · ${fmt(price)} FCFA · ${pay}`);
  agtPaint();
  setragPrint('agtPrinter',agtReceiptLines(r,{montant:price}))
 };
 if(panel&&agt.mode==='sale'&&agt.svc!=='billet'&&!agt.lastSale){
  panel.oninput=()=>{
   const fields=agtCollectSaleFields();
   const p=agqPricing({kind:agt.svc,fields});
   const calc=document.getElementById('agtSaleCalc');
   if(calc)calc.innerHTML=`<div><small>Code tarifaire</small><b>${esc(p.code)}</b></div><div><small>Montant estimé TTC</small><b>${fmt(p.montant)} FCFA</b></div>`
  }
 }
 const saleConfirm=panel?.querySelector('[data-agt-sale-confirm]');
 if(saleConfirm)saleConfirm.onclick=()=>{
  const fields=agtCollectSaleFields();
  const svc=AGT_SALE_SERVICES.find(s=>s[0]===agt.svc);
  const pricing=agqPricing({kind:agt.svc,fields});
  const prefix={bagage:'BAG',colis:'COL',taa:'TAA',funeraire:'FUN',messagerie:'MSG'}[agt.svc]||'OP';
  const ref=`${prefix}-${Math.floor(100000+Math.random()*900000)}`;
  const pay=document.getElementById('agtSalePay').value;
  const r={ref,service:svc[1],kind:agt.svc,fields,agent:AGT_AGENTS[0],payMethod:pay,processedAt:ctrNow()};
  agt.lastSale=r;agt.lastSalePricing=pricing;
  agtGuichetCount++;
  toastMsg(`${svc[1]} encaissé au guichet · ${fmt(pricing.montant)} FCFA · ${pay}`);
  agtPaint();
  setragPrint('agtPrinter',agtReceiptLines(r,pricing))
 };
 document.querySelectorAll('[data-agt-print]').forEach(b=>b.onclick=()=>{
  if(agt.lastSale)setragPrint('agtPrinter',agtReceiptLines(agt.lastSale,agt.lastSalePricing));
  toastMsg('Impression envoyée à l’imprimante du poste POS-OW-01')
 });
 document.querySelectorAll('[data-agt-new-sale]').forEach(b=>b.onclick=()=>{agt.lastSale=null;agtPaint()});
}

/* ---------- Imprimante thermique partagée : composant + animation ---------- */
function setragPrinterHtml(id){
 return `<div class="setrag-printer" id="${id}">
  <div class="setrag-printer-body">
   <div class="setrag-printer-roll"><i></i><i></i><i></i><i></i></div>
   <div class="setrag-printer-slot"></div>
   <div class="setrag-printer-face"><span class="setrag-printer-led"></span><small>Imprimante POS-OW-01</small></div>
  </div>
  <div class="setrag-paper-track"><div class="setrag-paper"><pre class="setrag-receipt"></pre></div></div>
  <div class="setrag-printer-shadow"></div>
 </div>`
}
function setragPrint(id,lines){
 const root=document.getElementById(id);
 if(!root)return;
 const track=root.querySelector('.setrag-paper-track'),receipt=root.querySelector('.setrag-receipt');
 if(!track||!receipt)return;
 receipt.textContent=lines.join('\n');
 track.style.transition='none';
 track.style.height='0px';
 void track.offsetHeight;
 const target=track.scrollHeight+'px';
 requestAnimationFrame(()=>{track.style.transition='height 1.3s cubic-bezier(.3,.9,.4,1)';track.style.height=target});
 root.classList.remove('printing');
 void root.offsetWidth;
 root.classList.add('printing');
 setTimeout(()=>root.classList.remove('printing'),1300)
}
function receiptLine(width,a,b){a=String(a);b=String(b);const sp=Math.max(1,width-a.length-b.length);return a+' '.repeat(sp)+b}
function receiptCenter(width,s){s=String(s);const pad=Math.max(0,Math.floor((width-s.length)/2));return ' '.repeat(pad)+s}
function agtReceiptLines(r,pricing){
 const w=26,rule='·'.repeat(w);
 const lines=[receiptCenter(w,'SETRAG'),receiptCenter(w,'LE TRANSGABONAIS'),rule,String(r.service).toUpperCase(),r.ref,rule];
 (r.fields||[]).slice(0,3).forEach(f=>lines.push(receiptLine(w,f[0],f[1])));
 lines.push(rule);
 lines.push(receiptLine(w,'TOTAL TTC',fmt(pricing.montant)+' F'));
 lines.push(receiptLine(w,'Paiement',r.payMethod||'—'));
 lines.push(rule);
 lines.push(receiptCenter(w,r.processedAt||ctrNow()));
 lines.push(receiptCenter(w,'Merci de votre confiance'));
 return lines
}
function ctrTicketReceiptLines(t){
 const w=24,rule='·'.repeat(w);
 return[receiptCenter(w,'SETRAG'),receiptCenter(w,'BILLET A BORD'),rule,t.ref,rule,receiptLine(w,CTR_TERMINAL.from,t.stop),receiptLine(w,'Train',CTR_TERMINAL.mission),receiptLine(w,'Classe',t.cls),receiptLine(w,'Paiement',t.pay),rule,receiptLine(w,'TOTAL',fmt(t.price)+' F'),rule,receiptCenter(w,t.time)]
}
function ctrPvReceiptLines(v){
 const w=24,rule='·'.repeat(w);
 return[receiptCenter(w,'SETRAG'),receiptCenter(w,'PROCES-VERBAL'),rule,v.ref,rule,receiptCenter(w,v.motif),rule,receiptLine(w,'AMENDE',fmt(v.amount)+' F'),rule,receiptCenter(w,CTR_TERMINAL.agent),receiptCenter(w,v.time)]
}
function agentTabletSection(){
 return `<div style="margin-top:15px" id="agtTablet"><section class="cdc-card agt-app">
  <header><div><h3>${I('tablet')} Poste vendeur · tablette caissier</h3><p>L’application vendeur du Front Office, telle que l’agent la voit en gare ou en agence : vente directe au guichet et traitement des demandes reçues en ligne.</p></div><div class="ctr-stats" id="agtStats">${agtStatsHtml()}</div></header>
  <div class="cdc-card-body">
   <div class="agt-station">
    <div class="agt-tablet-stage">
     <div class="agt-tablet-bezel">
      <div class="agt-tablet-screen">
       <div class="agt-tablet-bar">
        <b>SETRAG Vendeur</b>
        <div class="agt-modeswitch">
         <button class="active" data-agt-mode="sale">${I('shopping-cart')} Nouvelle vente</button>
         <button data-agt-mode="requests">${I('inbox')} Demandes reçues</button>
        </div>
        <span>POS-OW-01 · Grâce Mavoungou</span>
       </div>
       <div class="agt-tablet-body">
        <div class="agt-list" id="agtList">${agtSvcListHtml()}</div>
        <div class="agt-panel" id="agtDetail"></div>
       </div>
      </div>
     </div>
     <div class="agt-tablet-shadow"></div>
    </div>
    ${setragPrinterHtml('agtPrinter')}
   </div>
  </div>
 </section></div>`
}

/* ---------- install: append the two new sections to their pages ---------- */
function install(){
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 if(typeof pages.control==='function'&&!pages.control.__ctrWrapped){
  const prevControl=pages.control;
  const wrapped=()=>`<div class="bocd-nobubble">${prevControl()}${controllerAppSection()}${fieldAgentSection()}</div>`;
  wrapped.__ctrWrapped=true;
  pages.control=wrapped;
 }
 if(typeof pages.sales==='function'&&!pages.sales.__agqWrapped){
  const prevSales=pages.sales;
  const wrapped=()=>`<div class="bocd-nobubble">${prevSales()}${agentQueueSection()}${agentTabletSection()}</div>`;
  wrapped.__agqWrapped=true;
  pages.sales=wrapped;
 }
 if(typeof bind==='function'&&!bind.__bocdWrapped){
  const old=bind;
  const enhanced=function(){
   old();
   document.querySelectorAll('.bocd-nobubble').forEach(el=>{if(!el.__bocdStop){el.addEventListener('click',e=>e.stopPropagation());el.__bocdStop=true}});
   if(document.getElementById('ctrScreen'))ctrPaint();
   if(document.getElementById('fldScreen'))fldPaint();
   if(document.getElementById('agqList'))agqRefresh();
   if(document.getElementById('agtList'))agtPaint();
  };
  enhanced.__bocdWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
}
install();

/* ---------- safety net: some pages (e.g. administration) are registered
   asynchronously by their own script, after the other scripts' one-shot
   "reveal app for ?page=" checks already ran and found them undefined —
   leaving a direct deep link stuck behind the hidden login screen. Poll
   until the requested page exists, then reveal it. Idempotent if another
   script already did it. ---------- */
(function(){
 const requested=new URLSearchParams(location.search).get('page');
 if(!requested)return;
 function reveal(){
  if(typeof pages==='object'&&typeof pages[requested]==='function'){
   if(document.getElementById('app')?.classList.contains('hidden')){
    document.querySelector('.rail-film')?.remove();
    document.querySelector('#intro')?.remove();
    document.getElementById('app')?.classList.remove('hidden');
    if(typeof navigate==='function')navigate(requested)
   }
  }else setTimeout(reveal,80)
 }
 setTimeout(reveal,200)
})();
})();
