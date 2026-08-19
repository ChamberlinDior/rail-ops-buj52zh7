(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  ['Réponse aux demandes reçues du Front Office','Nouvelle carte « File de demandes clients » : réception, prise en charge, confirmation par un agent','§7.1 · Parcours agent']
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
  ['Création et détail d’une circulation','Bouton « Nouveau train » : formulaire complet et fonctionnel']
 ]},
 capacity:{eyebrow:'VOITURES & PLACES · CDC',intro:'Le CDC exige une disponibilité exacte des places par classe et par segment de trajet.',items:[
  ['VIP / 1re / 2e, assises / debout','Plan de places par voiture avec classes'],
  ['Disponibles / vendues / bloquées','Code couleur des sièges et compteurs'],
  ['Libération par segment','Disponibilité recalculée à chaque gare (Owendo–Booué–Franceville…)'],
  ['Occupation par voiture','Tableau détaillé assises / debout / vendues / bloquées / disponibles']
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
  ['PV, amende','Colonne PV/amende et écran « PV / Amende » du terminal contrôleur'],
  ['Contrôleur, terminal, heure, train, passager','Toutes ces colonnes dans le journal des contrôles'],
  ['Parcours contrôleur online/offline','Mockup d’écran mobile : bascule En ligne / Hors ligne et file de synchronisation'],
  ['Vente à bord et billet manuel pré-imprimé','Écran « Vente à bord (TP) » du terminal contrôleur, billet émis instantanément']
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
   "Contrôles & fraude" : scan QR/NFC, résultat, vente à bord, PV,
   mode hors ligne avec file de synchronisation.
   ===================================================================== */
const CTR_NAMES=[['Nadia Raponda','1re classe','EXP-620 · V2/P18'],['Louis Nziengui','2e classe','OMN-624 · V4/P09'],['Alice Andjoua','VIP','EXP-620 · V1/P04'],['Marc Rombi','2e classe','EXP-773 · V3/P22']];
let ctr={online:true,queue:0,tab:'scan',log:[]};
function ctrLogPush(text){
 ctr.log.unshift({text,time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})});
 ctr.log=ctr.log.slice(0,6);
 const el=document.getElementById('ctrLog');
 if(el)el.innerHTML=ctrLogHtml()
}
function ctrLogHtml(){
 if(!ctr.log.length)return '<p class="ctr-log-empty">Aucune opération pour l’instant.</p>';
 return ctr.log.map(l=>`<div class="ctr-log-row"><i></i><b>${esc(l.text)}</b><span>${l.time}</span></div>`).join('')
}
function ctrScanScreen(){
 return `<div class="ctr-scan-view"><div class="ctr-viewfinder"><i></i><i></i><i></i><i></i><span>${I('scan-line')} Placez le QR ou approchez la carte NFC</span></div><button class="ctr-scan-btn" data-ctr-scan>${I('scan-line')} Scanner un titre</button></div>`
}
function ctrResultScreen(kind){
 const p=CTR_NAMES[Math.floor(Math.random()*CTR_NAMES.length)];
 const meta={
  valide:{cls:'ok',icon:'check-circle-2',label:'Titre valide'},
  invalide:{cls:'bad',icon:'x-circle',label:'Titre invalide'},
  deja:{cls:'bad',icon:'copy-x',label:'Déjà utilisé'},
  doublon:{cls:'warn',icon:'triangle-alert',label:'Doublon détecté'}
 }[kind];
 return `<div class="ctr-result ${meta.cls}"><i>${I(meta.icon)}</i><h4>${meta.label}</h4><div class="ctr-result-info"><b>${esc(p[0])}</b><span>${esc(p[1])} · ${esc(p[2])}</span></div>${meta.cls!=='ok'?`<div class="ctr-result-actions"><button data-ctr-action="pv">Rédiger un PV</button><button data-ctr-action="sale">Vendre un billet</button></div>`:''}<button class="ghost" data-ctr-action="rescan">Nouveau scan</button></div>`
}
function ctrSaleScreen(){
 return `<div class="ctr-form"><label>Train<b>EXP-620 · Owendo → Franceville</b></label><label>Prochaine gare<select><option>Booué</option><option>Lastourville</option><option>Moanda</option></select></label><label>Classe<select><option>2e classe</option><option>1re classe</option><option>VIP</option></select></label><label>Paiement<select><option>Espèces</option><option>Moov Money</option><option>Airtel Money</option><option>Carte</option></select></label><button data-ctr-issue>${I('receipt')} Émettre le billet (TP)</button></div>`
}
function ctrPvScreen(){
 return `<div class="ctr-form"><label>Motif<select><option>Titre invalide</option><option>Sans titre de transport</option><option>Titre déjà utilisé</option><option>Autre irrégularité</option></select></label><label>Montant de l’amende (FCFA)<input type="number" value="25000"></label><button data-ctr-pv>${I('file-warning')} Émettre le PV</button></div>`
}
function ctrPaint(){
 const screen=document.getElementById('ctrScreen');
 if(screen)screen.innerHTML=ctr.tab==='scan'?ctrScanScreen():ctr.tab==='sale'?ctrSaleScreen():ctr.tab==='pv'?ctrPvScreen():ctrResultScreen(ctr.tab);
 document.querySelectorAll('[data-ctr-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ctrTab===ctr.tab));
 const conn=document.getElementById('ctrConn');
 if(conn){conn.textContent=(ctr.online?'● En ligne':'● Hors ligne');conn.className='ctr-conn '+(ctr.online?'online':'offline')}
 const sync=document.getElementById('ctrSync');
 if(sync)sync.textContent=ctr.queue?`${ctr.queue} en attente de synchro`:'Synchronisé';
 const toggle=document.getElementById('ctrConnToggle');
 if(toggle)toggle.textContent=ctr.online?'Basculer hors ligne':'Repasser en ligne';
 if(window.lucide)lucide.createIcons();
 wireCtr()
}
function wireCtr(){
 document.querySelectorAll('[data-ctr-tab]').forEach(b=>b.onclick=()=>{ctr.tab=b.dataset.ctrTab;ctrPaint()});
 const scanBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-scan]');
 if(scanBtn)scanBtn.onclick=()=>{
  const roll=Math.random();
  const kind=roll<0.72?'valide':roll<0.85?'invalide':roll<0.94?'deja':'doublon';
  ctr.tab=kind;
  ctrPaint();
  if(ctr.online)ctrLogPush(`Contrôle · résultat ${kind==='valide'?'valide':kind==='invalide'?'invalide':kind==='deja'?'déjà utilisé':'doublon'}`);
  else{ctr.queue++;ctrLogPush(`Contrôle (hors ligne, en file) · ${kind}`)}
 };
 document.querySelectorAll('[data-ctr-action]').forEach(b=>b.onclick=()=>{
  const a=b.dataset.ctrAction;
  if(a==='rescan'){ctr.tab='scan';ctrPaint();return}
  if(a==='pv'){ctr.tab='pv';ctrPaint();return}
  if(a==='sale'){ctr.tab='sale';ctrPaint();return}
 });
 const issueBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-issue]');
 if(issueBtn)issueBtn.onclick=()=>{
  if(ctr.online){ctrLogPush('Billet émis à bord · TP · règlement encaissé');toastMsg('Billet émis à bord · document généré et journalisé')}
  else{ctr.queue++;ctrLogPush('Vente à bord (hors ligne, en file)');toastMsg('Vente enregistrée hors ligne · sera synchronisée')}
  ctr.tab='scan';ctrPaint()
 };
 const pvBtn=document.getElementById('ctrScreen')?.querySelector('[data-ctr-pv]');
 if(pvBtn)pvBtn.onclick=()=>{
  if(ctr.online){ctrLogPush('PV émis · amende consignée');toastMsg('PV émis · amende consignée et journalisée')}
  else{ctr.queue++;ctrLogPush('PV (hors ligne, en file)');toastMsg('PV enregistré hors ligne · sera synchronisé')}
  ctr.tab='scan';ctrPaint()
 };
 const connToggle=document.getElementById('ctrConnToggle');
 if(connToggle)connToggle.onclick=()=>{
  ctr.online=!ctr.online;
  if(ctr.online&&ctr.queue){toastMsg(`${ctr.queue} opération(s) synchronisée(s) avec le central`);ctr.queue=0}
  else if(!ctr.online)toastMsg('Mode hors ligne · les opérations sont mises en file locale');
  ctrPaint()
 };
}
function controllerAppSection(){
 return `<div class="cdc-section" style="margin-top:15px"><section class="cdc-card ctr-app">
  <header><div><h3>${I('smartphone')} Application contrôleur · terminal portable (TP)</h3><p>Ce que voit le contrôleur à bord, en ligne ou hors connexion.</p></div></header>
  <div class="cdc-card-body">
   <div class="ctr-shell">
    <div class="ctr-phone">
     <div class="ctr-phone-notch"></div>
     <div class="ctr-phone-status"><span id="ctrConn" class="ctr-conn online">● En ligne</span><span id="ctrSync" class="ctr-sync">Synchronisé</span></div>
     <div class="ctr-screen" id="ctrScreen"></div>
    </div>
    <div class="ctr-side">
     <div class="ctr-tabs"><button class="active" data-ctr-tab="scan">${I('scan-line')} Scanner</button><button data-ctr-tab="sale">${I('receipt')} Vente à bord</button><button data-ctr-tab="pv">${I('file-warning')} PV / Amende</button></div>
     <button class="ctr-conn-toggle" id="ctrConnToggle">Basculer hors ligne</button>
     <div class="ctr-log"><b>Journal du contrôleur · J-N. Lekogo</b><div id="ctrLog">${ctrLogHtml()}</div></div>
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
function agqSeed(){
 const q=window.SETRAG_SERVICE_REQUESTS=window.SETRAG_SERVICE_REQUESTS||[];
 if(!q.length){
  q.push(
   {ref:'COL-260817-4471',service:'Colis express',kind:'colis',client:'Judith Mabika',summary:'Expéditeur : Judith Mabika · Destinataire : Serge Ondo · Poids (kg) : 14',time:'08:12',status:'nouvelle',agent:null},
   {ref:'BAG-260817-9021',service:'Bagages',kind:'bagage',client:'SET-260817-2201',summary:'Numéro de billet voyageur : SET-260817-2201 · Poids (kg) : 22',time:'08:26',status:'nouvelle',agent:null},
   {ref:'FUN-260817-0092',service:'Transport funéraire',kind:'funeraire',client:'Famille Ntoutoume',summary:'Expéditeur / famille : Famille Ntoutoume · Téléphone : +241 06 12 34 56',time:'08:41',status:'en_cours',agent:'Grâce Mavoungou'}
  )
 }
 return q
}
function agqStatusLabel(s){return{nouvelle:'Nouvelle',en_cours:'En cours',traitee:'Traitée'}[s]||s}
function agqRowHtml(r){
 return `<div class="agq-row" data-agq-ref="${esc(r.ref)}"><div class="agq-icon">${I(AGQ_ICON[r.kind]||'file-text')}</div><div class="agq-main"><b>${esc(r.service)} · ${esc(r.ref)}</b><span>${esc(r.summary)}</span></div><div class="agq-meta"><small>Reçu à ${esc(r.time)}</small><span class="agq-status ${r.status}">${agqStatusLabel(r.status)}</span></div><div class="agq-actions row-actions">${
  r.status==='nouvelle'?`<button data-agq-act="treat">Prendre en charge</button>`:
  r.status==='en_cours'?`<button data-agq-act="confirm">Confirmer &amp; générer</button>`:
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
 if(count){const n=agqSeed().filter(r=>r.status!=='traitee').length;count.textContent=`${n} demande${n>1?'s':''} à traiter`}
}
function wireAgq(){
 document.querySelectorAll('[data-agq-act]').forEach(b=>b.onclick=()=>{
  const row=b.closest('[data-agq-ref]'),ref=row.dataset.agqRef;
  const q=agqSeed(),r=q.find(x=>x.ref===ref);
  if(!r)return;
  if(b.dataset.agqAct==='treat'){r.status='en_cours';r.agent='Grâce Mavoungou';toastMsg(`${ref} pris en charge par Grâce Mavoungou`)}
  else if(b.dataset.agqAct==='confirm'){r.status='traitee';toastMsg(`${ref} confirmé · document généré · client notifié par SMS`)}
  agqRefresh();
 });
}
function agentQueueSection(){
 return `<div style="margin-top:15px"><section class="cdc-card agq-queue">
  <header><div><h3>${I('inbox')} File de demandes clients · agents &amp; guichets</h3><p>Demandes reçues depuis le Front Office (bagage, colis, TAA, funéraire, messagerie) — à traiter par un agent.</p></div><span class="agq-count" id="agqCount"></span></header>
  <div class="cdc-card-body"><div class="agq-list" id="agqList">${agqListHtml()}</div></div>
 </section></div>`
}

/* ---------- install: append the two new sections to their pages ---------- */
function install(){
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 if(typeof pages.control==='function'&&!pages.control.__ctrWrapped){
  const prevControl=pages.control;
  const wrapped=()=>prevControl()+controllerAppSection();
  wrapped.__ctrWrapped=true;
  pages.control=wrapped;
 }
 if(typeof pages.sales==='function'&&!pages.sales.__agqWrapped){
  const prevSales=pages.sales;
  const wrapped=()=>prevSales()+agentQueueSection();
  wrapped.__agqWrapped=true;
  pages.sales=wrapped;
 }
 if(typeof bind==='function'&&!bind.__bocdWrapped){
  const old=bind;
  const enhanced=function(){
   old();
   if(document.getElementById('ctrScreen'))ctrPaint();
   if(document.getElementById('agqList'))agqRefresh();
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
