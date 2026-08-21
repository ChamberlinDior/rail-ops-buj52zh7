(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mulberry32(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function qr(seed){const n=17,rnd=mulberry32(hash(seed));const inFinder=(x,y)=>(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);let cells='';for(let y=0;y<n;y++)for(let x=0;x<n;x++){if(inFinder(x,y))continue;if(rnd()>.56)cells+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
const finder=(ox,oy)=>`<rect x="${ox}" y="${oy}" width="7" height="7" fill="none" stroke="#000" stroke-width="1.4"/><rect x="${ox+2.2}" y="${oy+2.2}" width="2.6" height="2.6"/>`;
return `<svg viewBox="0 0 ${n} ${n}" fill="#000" xmlns="http://www.w3.org/2000/svg">${cells}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</svg>`}

const STATIONS=[['OWE','Owendo',0],['NTM','N’Toum',35],['NDJ','Ndjolé',158],['LOP','Lopé',260],['BOU','Booué',357],['LAS','Lastourville',460],['MOA','Moanda',560],['FCV','Franceville',648]];
const stName=c=>STATIONS.find(s=>s[0]===c)[1];
const stKm=c=>STATIONS.find(s=>s[0]===c)[2];
const CLASSES=[['2e','2ᵉ classe',11],['1re','1re classe',27],['VIP','VIP',40]];
const clsLabel=c=>CLASSES.find(x=>x[0]===c)[1];
const clsRate=c=>CLASSES.find(x=>x[0]===c)[2];
const TEMPLATES=[['EXP-620','EXPRESS',7.5,72,{'2e':38,'1re':14,'VIP':4}],['OMN-624','OMNIBUS',9.25,45,{'2e':52,'1re':9,'VIP':0}],['SPE-551','SPÉCIAL',14,58,{'2e':20,'1re':10,'VIP':6}]];
const PAYMENTS=[['am','Airtel Money','Mobile Money','#e30613'],['mm','Moov Money','Mobile Money','#005baa'],['cp','Click&Pay','Portefeuille en ligne','#e9b94f'],['vi','Visa','Carte bancaire','#1a1f71'],['mc','Mastercard','Carte bancaire','#eb5e28'],['cs','Espèces','Paiement en guichet','#087b5b']];
const SERVICES=[
 {id:'ticket',icon:'ticket',title:'Billets voyageurs',desc:'Recherche, place, paiement et billet électronique QR en quelques clics.',tags:['Papier','Électronique','QR Code'],cta:'Réserver un billet'},
 {id:'bagage',icon:'luggage',title:'Bagages',desc:'Enregistrement lié au billet, étiquette unique, 0 à 30 kg. Poids déclaré ici, vérifié et validé en gare.',tags:['Étiquette unique','0–30 kg','Pesée en gare'],cta:'Enregistrer un bagage',fields:[['Numéro de billet voyageur','text','SET-260822-5012'],['Poids déclaré (kg)','number','18'],['Gare de départ','select'],['Gare d’arrivée','select']],prefix:'BAG'},
 {id:'colis',icon:'package',title:'Colis express',desc:'Pré-demande autonome, vignette et suivi COLIRAIL. Poids et contenu déclarés, contrôlés au dépôt avant expédition.',tags:['COLIRAIL','Suivi expéditeur','Contrôle au dépôt'],cta:'Créer une expédition',fields:[['Expéditeur','text','Nom complet'],['Destinataire','text','Nom complet'],['Téléphone destinataire','tel','+241 06 00 00 00'],['Poids déclaré (kg)','number','8'],['Dimensions','text','40×30×20 cm'],['Contenu déclaré','text','Nature du contenu']],prefix:'COL'},
 {id:'taa',icon:'car-front',title:'Transport Auto Accompagné',desc:'Votre véhicule voyage avec vous, rattaché à votre billet. Dossier vérifié puis véhicule contrôlé au chargement.',tags:['TAA','Wagon porte-autos','Contrôle au chargement'],cta:'Déclarer un véhicule',fields:[['Numéro de billet voyageur','text','SET-260822-5012'],['Véhicule','text','Toyota Hilux'],['Immatriculation','text','GA-1234-AB'],['Type de véhicule','text','4×4 / Berline / Utilitaire'],['Tonnage déclaré (t)','number','2.1']],prefix:'TAA'},
 {id:'funeraire',icon:'flower-2',title:'Transport funéraire',desc:'Service dédié et confidentiel : ouverture de dossier, pièces vérifiées par SETRAG, puis prise en charge.',tags:['Confidentiel','Dossier vérifié'],cta:'Faire une demande',fields:[['Expéditeur / famille','text','Nom complet'],['Téléphone','tel','+241 06 00 00 00'],['Gare de départ','select'],['Gare d’arrivée','select'],['Date souhaitée','date',''],['Type de cercueil / contenant','text','Cercueil standard'],['Personne autorisée à remettre/récupérer','text','Nom complet']],prefix:'FUN'},
 {id:'messagerie',icon:'send',title:'Messagerie voyageurs',desc:'Envoi de plis et messages associés au régime des trains voyageurs.',tags:['Régime voyageurs'],cta:'Envoyer un pli',fields:[['Expéditeur','text','Nom complet'],['Destinataire','text','Nom complet'],['Numéro de train','text','EXP-620'],['Description','text','Nature de l’envoi']],prefix:'MSG'}
];
const stationOptions=sel=>STATIONS.map(s=>`<option value="${s[0]}" ${s[0]===sel?'selected':''}>${s[1]}</option>`).join('');

const ST={o:'OWE',d:'FCV',date:'2026-08-22',pax:1,cls:'2e',train:null,seats:[],pass:{},pay:null};
const WALLET=[];
const AGENT_QUEUE=window.SETRAG_SERVICE_REQUESTS=window.SETRAG_SERVICE_REQUESTS||[];
const kindIcon=k=>({billet:'ticket',bagage:'luggage',colis:'package',taa:'car-front',funeraire:'flower-2',messagerie:'send'}[k]||'file-text');
function addToWallet(rec){WALLET.unshift(rec);updateWalletBadge()}
function updateWalletBadge(){const b=document.getElementById('fosWalletBadge');if(!b)return;if(WALLET.length){b.style.display='inline-flex';b.textContent=WALLET.length}else{b.style.display='none'}}
const FOS_STEPS=['Demande envoyée','Examen SETRAG','Contrôle / validation','Paiement','Prise en charge','Transport','Remise / clôture'];
function fosStepIndex(status){return{nouvelle:0,prise_en_charge:1,complement:1,controle:2,validee:3,confirmee:4}[status]??0}
function fosStatusLabel(status){return{nouvelle:'Demande reçue · en attente de validation par un agent SETRAG',prise_en_charge:'En cours de vérification par un agent SETRAG',complement:'Complément d’information requis — consultez vos messages',controle:'Contrôle physique requis : présentez-vous au point de dépôt en gare',validee:'Dossier validé',confirmee:'Demande confirmée et prise en charge',rejetee:'Demande rejetée — contactez le service client'}[status]||status}
function fosTrackingHtml(status){
 if(status==='rejetee')return `<div class="fos-track-row rejected">${I('x-circle')}<span>Demande rejetée</span></div>`;
 const idx=fosStepIndex(status);
 return `<div class="fos-track-row">${FOS_STEPS.map((s,i)=>`<i class="fos-track-dot ${i<idx?'done':i===idx?'current':''}" title="${s}"></i>`).join('')}</div>`
}
function docCardHtml(rec){
 const live=rec.kind!=='billet'?(window.SETRAG_SERVICE_REQUESTS||[]).find(x=>x.ref===rec.id):null;
 const liveFields=live?[...live.fields,...(live.poidsControle!=null?[[live.kind==='taa'?'Tonnage contrôlé':'Poids contrôlé',`${live.poidsControle} ${live.kind==='taa'?'t':'kg'}`]]:[]),...(live.convocationDate?[['Date de convocation',fmtDate(live.convocationDate)]]:[])]:rec.fields;
 return `<div class="fos-ticket">
  <div class="fos-ticket-holo"></div>
  <div class="fos-ticket-headbar">
   <div class="fos-ticket-brand"><span>S</span><div><b>${rec.kind==='billet'?'Votre e-billet':'Votre document électronique'}</b><small>Nominatif, incessible — à présenter lors du contrôle</small></div></div>
   <div class="fos-ticket-headbar-route">${I('train-front')} ${rec.brand}</div>
  </div>
  <div class="fos-ticket-body">
  <div class="fos-ticket-main">
   <div class="fos-ticket-route">${rec.headlineHtml}</div>
   ${live?`<div class="fos-track-block"><div class="fos-track-head"><span>${I('route')} Suivi de la demande</span><b>${fosStatusLabel(live.status)}</b></div>${fosTrackingHtml(live.status)}</div>`:''}
   <div class="fos-ticket-meta">${liveFields.map(f=>`<span><small>${f[0]}</small><b>${f[1]}</b></span>`).join('')}</div>
   <div class="fos-ticket-security">
    <span>${I('shield-check')} Titre sécurisé</span>
    <span>${I('badge-check')} Vérifié SETRAG</span>
    <span>${I('scan-line')} Contrôle QR/NFC</span>
   </div>
   <div class="fos-ticket-stamp">${I('badge-check')}<span>SETRAG<br>OFFICIEL</span></div>
  </div>
  <div class="fos-ticket-stub">
   <small class="fos-stub-label">${rec.kind==='billet'?'TRAJET':'RÉFÉRENCE'}</small>
   <div class="fos-stub-code">${I(kindIcon(rec.kind))} ${rec.code}</div>
   <div class="fos-qr">${qr(rec.id)}</div>
   <small class="fos-stub-label">${rec.kind==='billet'?'N° BILLET':'N° DOSSIER'}</small>
   <b class="fos-stub-id">${rec.id}</b>
  </div>
  </div>
  <div class="fos-ticket-footer">
   <div class="fos-barcode-full"></div>
   <div class="fos-ticket-footer-row"><b>${rec.id}</b><small>Présentez-vous au quai 2 min avant le départ · setrag.ga/controle</small></div>
  </div>
 </div>`
}

function trainsFor(){
 const dist=Math.abs(stKm(ST.d)-stKm(ST.o));
 return TEMPLATES.map(t=>{
  const[code,type,baseH,speed,cap]=t;
  const durH=Math.max(.6,dist/speed);
  const depH=baseH,arrH=(baseH+durH)%24;
  const fmt=h=>`${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`;
  const durLabel=`${Math.floor(durH)}h${String(Math.round((durH%1)*60)).padStart(2,'0')}`;
  const prices={};CLASSES.forEach(c=>{prices[c[0]]=Math.max(1500,Math.round(dist*c[2]/500)*500)});
  return{code,type,depart:fmt(depH),arrive:fmt(arrH),duree:durLabel,cap,prices,dist}
 })
}
function fmtMoney(n){return typeof money==='function'?money(n):new Intl.NumberFormat('fr-FR').format(n)+' FCFA'}
function today(){const d=new Date();return`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`}
function fmtDate(iso){if(!iso)return today();const[y,m,d]=iso.split('-');return`${d}/${m}/${y}`}

function heroSearch(){
 return `<div class="fos-search fos-reveal" id="fosSearch">
 <div class="fos-search-body">
 <div class="fos-grid-fields">
  <div class="fos-field"><label>${I('map-pin')} Gare de départ</label><select id="fosOrigin">${stationOptions(ST.o)}</select></div>
  <div class="fos-field fos-swap-cell" style="align-self:center"><button class="fos-swap" id="fosSwap" type="button" title="Inverser">${I('arrow-left-right')}</button></div>
  <div class="fos-field"><label>${I('map-pin')} Gare d’arrivée</label><select id="fosDest">${stationOptions(ST.d)}</select></div>
  <div class="fos-field"><label>${I('calendar')} Date</label><input type="date" id="fosDate" value="${ST.date}"></div>
  <div class="fos-field"><label>${I('users')} Voyageurs</label><input type="number" id="fosPax" min="1" max="6" value="${ST.pax}"></div>
  <div class="fos-field"><label>${I('sparkles')} Classe</label><select id="fosCls">${CLASSES.map(c=>`<option value="${c[0]}" ${c[0]===ST.cls?'selected':''}>${c[1]}</option>`).join('')}</select></div>
  <div class="fos-field fos-submit-cell"><button class="fos-search-submit" id="fosSearchBtn" type="button">${I('search')} Rechercher</button></div>
 </div>
 </div>
 <div class="fos-quicklinks">
  <span>Autres services :</span>
  ${SERVICES.filter(s=>s.id!=='ticket').map(s=>`<button data-fos-quick="${s.id}">${I(s.icon)} ${s.title}</button>`).join('')}
 </div>
 </div>
 <div class="fos-flow" id="fosFlow"></div>`
}

function resultsPanel(){
 const trains=trainsFor();
 const rows=trains.map(t=>{
  const avail=t.cap[ST.cls];
  const full=avail===0;
  return `<div class="fos-train">
   <span class="fos-train-badge">${I('train-front')}</span>
   <div class="fos-train-mid">
    <b>${t.code} · ${t.type}</b>
    <div class="fos-train-times"><span>${t.depart}</span><i></i><span>${t.arrive}</span><small style="margin-left:8px;color:#8aa0a6">· ${t.duree}</small></div>
    <div class="fos-classes">${CLASSES.map(c=>`<span>${c[1]}<b>${t.cap[c[0]]>0?t.cap[c[0]]+' pl.':'complet'}</b></span>`).join('')}</div>
   </div>
   <div class="fos-train-cta">
    <strong>${full?'—':fmtMoney(t.prices[ST.cls])}</strong>
    <small>${full?'Classe indisponible':'par voyageur · '+clsLabel(ST.cls)}</small>
    <button data-fos-choose="${t.code}" ${full?'disabled style="opacity:.4;cursor:not-allowed"':''}>${full?'Complet':'Choisir ce train'}</button>
   </div>
  </div>`
 }).join('');
 return `<div class="fos-flow-panel active fos-reveal">
  <div class="fos-flow-head"><div><h3>${stName(ST.o)} → ${stName(ST.d)}</h3><p>${fmtDate(ST.date)} · ${ST.pax} voyageur${ST.pax>1?'s':''} · ${clsLabel(ST.cls)} · ${Math.abs(stKm(ST.d)-stKm(ST.o))} km</p></div><button class="fos-flow-back" data-fos-back="search">${I('arrow-left')} Modifier la recherche</button></div>
  <div class="fos-results">${rows}</div>
 </div>`
}

function seatPanel(){
 const t=trainsFor().find(x=>x.code===ST.train);
 const rnd=mulberry32(hash(ST.train+ST.cls));
 const total=24;
 let seatsHtml='';
 for(let i=1;i<=total;i++){
  const taken=rnd()>.72;
  const picked=ST.seats.includes(i);
  seatsHtml+=`<button type="button" class="fos-seat ${taken?'taken':''} ${picked?'picked':''}" data-fos-seat="${i}" ${taken?'disabled':''}>${i}</button>`
 }
 return `<div class="fos-flow-panel active fos-reveal">
  <div class="fos-flow-head"><div><h3>${t.code} · ${clsLabel(ST.cls)}</h3><p>Choisissez ${ST.pax} place${ST.pax>1?'s':''}, puis renseignez le voyageur principal.</p></div><button class="fos-flow-back" data-fos-back="results">${I('arrow-left')} Changer de train</button></div>
  <div class="fos-seatwrap">
   <div>
    <div class="fos-seatmap">${seatsHtml}</div>
    <div class="fos-seat-legend"><span><i></i>Disponible</span><span><i class="taken"></i>Vendue</span><span><i class="picked"></i>Sélectionnée</span></div>
   </div>
   <div class="fos-passenger">
    <label>Nom<input id="fosNom" placeholder="Raponda"></label>
    <label>Prénom<input id="fosPrenom" placeholder="Nadia"></label>
    <label>Sexe<select id="fosSexe"><option>Féminin</option><option>Masculin</option></select></label>
    <label>Téléphone<input id="fosTel" placeholder="+241 06 45 22 19"></label>
    <label>Contact d’urgence<input id="fosUrg" placeholder="+241 07 00 00 00"></label>
    <div class="fos-recap"><span>Places sélectionnées</span><b id="fosSeatCount">0 / ${ST.pax}</b></div>
    <button class="fos-continue" id="fosToPay">${I('credit-card')} Continuer vers le paiement</button>
   </div>
  </div>
 </div>`
}

function payPanel(){
 const t=trainsFor().find(x=>x.code===ST.train);
 const amount=t.prices[ST.cls]*ST.pax;
 return `<div class="fos-flow-panel active fos-reveal">
  <div class="fos-flow-head"><div><h3>Paiement sécurisé</h3><p>Choisissez un moyen de paiement pour finaliser l’achat.</p></div><button class="fos-flow-back" data-fos-back="seat">${I('arrow-left')} Retour au voyageur</button></div>
  <div class="fos-paymethods">${PAYMENTS.map(p=>`<button type="button" class="fos-paymethod" data-fos-pay="${p[0]}"><span style="background:${p[3]}">${p[0].toUpperCase()}</span><span><b>${p[1]}</b><small>${p[2]}</small></span></button>`).join('')}</div>
  <div class="fos-pay-amount"><span>Montant à régler</span><b>${fmtMoney(amount)}</b></div>
  <div class="fos-pay-processing" id="fosProcessing"><span class="fos-spinner"></span> Transaction en cours…</div>
  <button class="fos-pay-btn" id="fosPayBtn">${I('lock')} Payer ${fmtMoney(amount)}</button>
 </div>`
}

function ticketPanel(){
 const t=trainsFor().find(x=>x.code===ST.train);
 const amount=t.prices[ST.cls]*ST.pax;
 const ht=Math.round(amount/1.05),tva=amount-ht;
 const id=ST.ticketId||(ST.ticketId=`SET-${ST.date.replace(/-/g,'').slice(2)}-${String(1000+Math.floor(mulberry32(hash(ST.train+ST.pass.nom||'x'))()*9000)).slice(0,4)}`);
 const resa=`RES-${ST.date.replace(/-/g,'').slice(2)}-${id.slice(-4)}`;
 const tarif=`T-${ST.o}-${ST.d}-${ST.cls.toUpperCase()}`;
 const nom=(ST.pass.prenom||'Nadia')+' '+(ST.pass.nom||'Raponda');
 const rec={id,kind:'billet',brand:'SETRAG · BILLET ÉLECTRONIQUE',headlineHtml:`<b>${stName(ST.o)}</b>${I('arrow-right')}<b>${stName(ST.d)}</b>`,code:`${ST.o} → ${ST.d}`,date:today(),fields:[
  ['Train',`${t.code} · ${t.type}`],['Classe',clsLabel(ST.cls)],['Départ',`${fmtDate(ST.date)} · ${t.depart}`],['Arrivée',t.arrive],
  ['Titulaire',esc(nom)],['Place(s)',ST.seats.join(', ')||'—'],['Distance',`${t.dist} km`],['Code tarifaire',tarif],
  ['Montant HT',fmtMoney(ht)],['TVA',fmtMoney(tva)],['Montant TTC perçu',fmtMoney(amount)],['Mode de paiement',(PAYMENTS.find(p=>p[0]===ST.pay)||['','Espèces'])[1]],
  ['N° réservation',resa],['Date de vente',today()]
 ]};
 if(!ST.savedToWallet){addToWallet(rec);ST.savedToWallet=true}
 return `<div class="fos-flow-panel active fos-reveal">
  <div class="fos-flow-head"><div><h3>Billet électronique</h3><p>Votre titre de transport est prêt — présentez le QR code à l’embarquement, ou retrouvez-le dans votre portefeuille.</p></div><button class="fos-flow-back" data-fos-back="reset">${I('rotate-ccw')} Nouvelle recherche</button></div>
  ${docCardHtml(rec)}
  <div class="fos-ticket-actions">
   <button data-fos-action="pdf">${I('download')} Télécharger le PDF</button>
   <button data-fos-action="sms">${I('send')} Envoyer par SMS</button>
   <button class="gold" data-fos-open-wallet>${I('wallet')} Voir mon portefeuille</button>
  </div>
 </div>`
}

function servicesSection(){
 return `<section class="fos-section" id="services">
 <div class="fos-head fos-reveal"><small>TOUS LES SERVICES VOYAGEURS</small><h2>Un seul portail, six services SETRAG</h2><p>Chaque prestation prévue au cahier des charges, accessible directement par le voyageur — sans passer par un guichet.</p></div>
 <div class="fos-services">${SERVICES.map(s=>`<article class="fos-service fos-reveal"><span>${I(s.icon)}</span><h3>${s.title}</h3><p>${s.desc}</p><ul>${s.tags.map(t=>`<li>${t}</li>`).join('')}</ul><button data-fos-service="${s.id}">${s.cta} ${I('arrow-right')}</button></article>`).join('')}</div>
 </section>`
}

function stepsSection(){
 const steps=[['search','Recherche','Trajet, date et disponibilité en temps réel.'],['armchair','Réservation','Choix de la place et du voyageur.'],['credit-card','Paiement','Mobile Money, carte bancaire ou espèces.'],['qr-code','Billet & QR','Émission électronique instantanée.'],['scan-line','Contrôle','Validation QR/NFC à bord, anti-fraude.'],['route','Traçabilité','Suivi et synchronisation avec le Back Office.']];
 return `<section class="fos-section dark">
 <div class="fos-head fos-reveal"><small>PARCOURS VOYAGEUR</small><h2>De la recherche au contrôle à bord</h2><p>Le même parcours pour tous les services, pensé pour fonctionner même en zone de connectivité instable.</p></div>
 <div class="fos-steps">${steps.map((s,i)=>`<div class="fos-step fos-reveal"><i>${I(s[0])}</i><b>0${i+1} · ${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>
 </section>`
}

/* ---------- interactive mobile app phone ---------- */
let fap={screen:'home',o:'OWE',d:'FCV',cls:'2e',train:null,seat:null,pay:null,lastRec:null,svc:null,walletIdx:null,walletBack:'wallet',notifications:[],notifUnread:0,lastKnownStatus:{}};
function fosPositionLabel(r){
 if(!r)return '—';
 const gare=(r.fields||[]).find(f=>/départ/i.test(f[0]));
 const agence=gare?gare[1]:'Owendo';
 const dateTxt=r.convocationDate?fmtDate(r.convocationDate):null;
 return{
  nouvelle:'Chez vous · en attente d’examen',
  prise_en_charge:`Agence ${agence} · vérification du dossier en cours`,
  complement:'Chez vous · complément d’information requis',
  controle:`Agence ${agence} · présentez-vous${dateTxt?` avant le ${dateTxt}`:''} pour le contrôle`,
  validee:`Agence ${agence} · dossier validé, prise en charge imminente`,
  confirmee:`Agence ${agence} · pris en charge${dateTxt?` · rendez-vous du ${dateTxt}`:''}`,
  rejetee:'Dossier rejeté · contactez le service client'
 }[r.status]||'—'
}
function fapNotifMessage(live){
 const id=live.ref,dateTxt=live.convocationDate?fmtDate(live.convocationDate):null;
 return{
  prise_en_charge:`Votre demande ${id} a été prise en charge par un agent SETRAG.`,
  complement:`Complément d’information requis pour votre demande ${id}.`,
  controle:`Présentez-vous en gare${dateTxt?` avant le ${dateTxt}`:''} pour le contrôle physique de ${id}.`,
  validee:`Votre dossier ${id} a été validé par SETRAG.`,
  confirmee:`Votre demande ${id} est confirmée et prise en charge${dateTxt?` · rendez-vous du ${dateTxt}`:''} !`,
  rejetee:`Votre demande ${id} a été rejetée.`
 }[live.status]||`Mise à jour de votre demande ${id}.`
}
function fapShowPushBanner(msg){
 const phone=document.querySelector('.fap-phone-screen');
 if(!phone)return;
 phone.querySelector('.fap-push-banner')?.remove();
 const b=document.createElement('div');
 b.className='fap-push-banner';
 b.innerHTML=`<span class="fap-push-icon">${I('bell-ring')}</span><div><b>SETRAG</b><span>${esc(msg)}</span></div>`;
 phone.appendChild(b);
 if(window.lucide)lucide.createIcons();
 requestAnimationFrame(()=>b.classList.add('show'));
 setTimeout(()=>{b.classList.remove('show');setTimeout(()=>b.remove(),400)},3400)
}
function fapCheckNotifications(){
 const q=window.SETRAG_SERVICE_REQUESTS||[];
 let changed=false;
 WALLET.filter(r=>r.kind!=='billet').forEach(r=>{
  const live=q.find(x=>x.ref===r.id);
  if(!live)return;
  const prev=fap.lastKnownStatus[r.id];
  if(prev===undefined){fap.lastKnownStatus[r.id]=live.status;return}
  if(prev!==live.status){
   fap.lastKnownStatus[r.id]=live.status;
   const msg=fapNotifMessage(live);
   fap.notifications.unshift({text:msg,time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),ref:r.id});
   fap.notifications=fap.notifications.slice(0,20);
   fap.notifUnread=(fap.notifUnread||0)+1;
   fapShowPushBanner(msg);
   changed=true;
  }
 });
 if(changed&&document.getElementById('fapScreen'))fapPaint()
}
if(!window.__fapNotifyTimer)window.__fapNotifyTimer=setInterval(fapCheckNotifications,2500);
function fapTrainsFor(o,d){
 const dist=Math.abs(stKm(d)-stKm(o));
 return TEMPLATES.map(t=>{
  const[code,type,baseH,speed]=t;
  const durH=Math.max(.6,dist/speed);
  const depH=baseH,arrH=(baseH+durH)%24;
  const f=h=>`${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`;
  const prices={};CLASSES.forEach(c=>{prices[c[0]]=Math.max(1500,Math.round(dist*c[2]/500)*500)});
  return{code,type,depart:f(depH),arrive:f(arrH),prices,dist}
 })
}
function fapHomeScreen(){
 return `<div class="fap-home">
  <div class="fap-search-card">
   <label>Départ<select id="fapFrom">${STATIONS.map(s=>`<option value="${s[0]}"${s[0]===fap.o?' selected':''}>${s[1]}</option>`).join('')}</select></label>
   <label>Arrivée<select id="fapTo">${STATIONS.map(s=>`<option value="${s[0]}"${s[0]===fap.d?' selected':''}>${s[1]}</option>`).join('')}</select></label>
   <button data-fap-search>${I('search')} Rechercher un billet</button>
  </div>
  ${WALLET.length?`<div class="fap-recent"><b>Vos billets récents</b>${WALLET.slice(0,2).map((r,i)=>`<button class="fap-recent-row" data-fap-wallet="${i}"><span>${I(kindIcon(r.kind))}</span><div><b>${esc(r.brand)}</b><small>${esc(r.code)}</small></div>${I('chevron-right')}</button>`).join('')}</div>`:''}
 </div>`
}
function fapResultsScreen(){
 const trains=fapTrainsFor(fap.o,fap.d);
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="home">${I('arrow-left')}</button><b>${stName(fap.o)} → ${stName(fap.d)}</b></div>
  ${trains.map(t=>`<button class="fap-train-card" data-fap-choose="${t.code}"><div><b>${t.code} · ${t.type}</b><small>${t.depart} → ${t.arrive}</small></div><span>${fmtMoney(t.prices['2e'])}</span></button>`).join('')}
 </div>`
}
function fapSeatScreen(){
 const t=fapTrainsFor(fap.o,fap.d).find(x=>x.code===fap.train);
 const taken=[2,6,11,14,19];
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="results">${I('arrow-left')}</button><b>${t.code} · choisir une place</b></div>
  <div class="fap-seatgrid">${Array.from({length:24},(_,i)=>`<button class="fap-seat ${taken.includes(i)?'taken':fap.seat===i?'picked':''}" ${taken.includes(i)?'disabled':''} data-fap-seat="${i}">${i+1}</button>`).join('')}</div>
  <div class="fap-classrow">${CLASSES.map(c=>`<button class="fap-classchip ${fap.cls===c[0]?'active':''}" data-fap-cls="${c[0]}">${c[1]}</button>`).join('')}</div>
  <button data-fap-next="pay" ${fap.seat==null?'disabled':''}>${I('arrow-right')} Continuer · ${fmtMoney(t.prices[fap.cls||'2e'])}</button>
 </div>`
}
function fapPayForm(pay){
 const p=PAYMENTS.find(x=>x[0]===pay);
 if(pay==='cs')return `<div class="fap-payform"><p>${I('info')} Réglez en espèces au guichet ou auprès du contrôleur à bord — votre place reste réservée 15 minutes.</p></div>`;
 if(pay==='vi'||pay==='mc')return `<div class="fap-payform"><label>N° de carte<input placeholder="4242 4242 4242 4242"></label><div class="fap-payform-row"><label>Expiration<input placeholder="12/28"></label><label>CVC<input placeholder="123"></label></div></div>`;
 return `<div class="fap-payform"><label>Numéro ${esc(p[1])}<input placeholder="+241 06 00 00 00"></label><p>${I('info')} Un code de confirmation sera envoyé par SMS.</p></div>`
}
function fapPayScreen(){
 const t=fapTrainsFor(fap.o,fap.d).find(x=>x.code===fap.train);
 const amount=t.prices[fap.cls||'2e'];
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="seat">${I('arrow-left')}</button><b>Paiement · ${fmtMoney(amount)}</b></div>
  <div class="fap-paygrid">${PAYMENTS.map(p=>`<button class="fap-pay ${fap.pay===p[0]?'active':''}" data-fap-pay="${p[0]}" style="--c:${p[3]}"><i>${esc(p[1][0])}</i><b>${esc(p[1])}</b><small>${esc(p[2])}</small></button>`).join('')}</div>
  ${fap.pay?fapPayForm(fap.pay):''}
  <button data-fap-confirm ${fap.pay?'':'disabled'}>${I('lock')} Payer ${fmtMoney(amount)}</button>
 </div>`
}
function fapTicketScreen(){
 const t=fapTrainsFor(fap.o,fap.d).find(x=>x.code===fap.train),r=fap.lastRec;
 return `<div class="fap-ticket"><div class="fap-ticket-head"><span>${I('check-circle-2')}</span><b>Paiement confirmé</b></div>
  <div class="fap-ticket-card">
   <div class="fap-ticket-route"><b>${stName(fap.o)}</b>${I('arrow-right')}<b>${stName(fap.d)}</b></div>
   <div class="fap-ticket-qr">${qr(r.id)}</div>
   <div class="fap-ticket-grid"><span><small>Train</small><b>${t.code}</b></span><span><small>Classe</small><b>${clsLabel(fap.cls||'2e')}</b></span><span><small>Place</small><b>${(fap.seat??0)+1}</b></span><span><small>Montant</small><b>${fmtMoney(r.amount)}</b></span></div>
   <small class="fap-ticket-id">${r.id}</small>
  </div>
  <button data-fap-wallet-open="last">${I('wallet')} Voir dans mon portefeuille</button>
  <button class="ghost" data-fap-back="home">${I('rotate-ccw')} Nouvel achat</button>
 </div>`
}
function fapServicesScreen(){
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="home">${I('arrow-left')}</button><b>Tous les services</b></div>
  <div class="fap-svcgrid">${SERVICES.filter(s=>s.id!=='ticket').map(s=>`<button class="fap-svc" data-fap-svc="${s.id}"><span>${I(s.icon)}</span><b>${s.title}</b></button>`).join('')}</div>
 </div>`
}
function fapSvcFormScreen(){
 const s=SERVICES.find(x=>x.id===fap.svc);
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="services">${I('arrow-left')}</button><b>${esc(s.title)}</b></div>
  <div class="fap-payform">${s.fields.map((f,i)=>`<label>${esc(f[0])}<input data-fap-f="${i}" placeholder="${esc(f[2]||'')}"></label>`).join('')}</div>
  <button data-fap-svc-submit>${I('check')} ${esc(s.cta)}</button>
 </div>`
}
function fapSvcDoneScreen(){
 const r=fap.lastRec;
 return `<div class="fap-ticket"><div class="fap-ticket-head"><span>${I('send')}</span><b>Demande envoyée</b></div>
  <p class="fap-svc-pending">${I('info')} En attente de validation par un agent SETRAG. Vous serez notifié par SMS dès que votre dossier ${esc(r.id)} sera examiné.</p>
  <div class="fap-ticket-card"><div class="fap-ticket-route"><b>${esc(r.title)}</b></div><div class="fap-ticket-qr">${qr(r.id)}</div><small class="fap-ticket-id">${r.id}</small></div>
  <button data-fap-wallet-open="last">${I('wallet')} Suivre ma demande</button>
  <button class="ghost" data-fap-back="home">${I('arrow-left')} Retour à l’accueil</button>
 </div>`
}
function fapWalletScreen(){
 if(!WALLET.length)return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="home">${I('arrow-left')}</button><b>Portefeuille</b></div><p class="fap-empty">${I('inbox')} Aucun document pour l’instant.</p></div>`;
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="home">${I('arrow-left')}</button><b>Portefeuille · ${WALLET.length}</b></div>
  ${WALLET.map((r,i)=>`<button class="fap-recent-row" data-fap-wallet="${i}"><span>${I(kindIcon(r.kind))}</span><div><b>${esc(r.brand)}</b><small>${esc(r.code)} · ${r.date}</small></div>${I('chevron-right')}</button>`).join('')}
 </div>`
}
function fapWalletDetailScreen(){
 const r=WALLET[fap.walletIdx];
 if(!r)return fapWalletScreen();
 const live=r.kind!=='billet'?(window.SETRAG_SERVICE_REQUESTS||[]).find(x=>x.ref===r.id):null;
 const fields=live?[...live.fields,...(live.poidsControle!=null?[[live.kind==='taa'?'Tonnage contrôlé':'Poids contrôlé',`${live.poidsControle} ${live.kind==='taa'?'t':'kg'}`]]:[]),...(live.convocationDate?[['Date de convocation',fmtDate(live.convocationDate)]]:[])]:r.fields;
 return `<div class="fap-list"><div class="fap-list-head"><button class="fap-back" data-fap-back="${esc(fap.walletBack||'wallet')}">${I('arrow-left')}</button><b>${esc(r.brand)}</b></div>
  ${live?`<div class="fap-track-block"><div class="fap-track-head"><span>${I('route')} Suivi de la demande</span><b class="fap-track-live">${I('radio')} en direct</b></div>${fosTrackingHtml(live.status)}<p class="fap-track-status">${esc(fosStatusLabel(live.status))}</p><div class="fap-track-position"><i>${I('map-pin')}</i><span>${esc(fosPositionLabel(live))}</span></div></div>`:''}
  <div class="fap-ticket-card"><div class="fap-ticket-qr">${qr(r.id)}</div><div class="fap-ticket-grid">${fields.slice(0,8).map(f=>`<span><small>${esc(f[0])}</small><b>${esc(String(f[1]))}</b></span>`).join('')}</div><small class="fap-ticket-id">${r.id}</small></div>
 </div>`
}
function fapTrackingListScreen(){
 const mine=WALLET.filter(r=>r.kind!=='billet');
 if(!mine.length)return `<div class="fap-list"><div class="fap-list-head"><b>Mes demandes</b></div><p class="fap-empty">${I('inbox')} Aucune demande en cours — faites-en une depuis « Services ».</p></div>`;
 return `<div class="fap-list"><div class="fap-list-head"><b>Mes demandes · ${mine.length}</b></div>
  ${mine.map(r=>{
   const live=(window.SETRAG_SERVICE_REQUESTS||[]).find(x=>x.ref===r.id);
   const status=live?live.status:'nouvelle';
   return `<button class="fap-track-row" data-fap-track-open="${esc(r.id)}"><span class="fap-track-row-icon">${I(kindIcon(r.kind))}</span><div class="fap-track-row-mid"><b>${esc(r.brand)}</b><small>${esc(r.id)}</small><em>${esc(fosPositionLabel(live))}</em></div><span class="fap-track-row-status ${status}">${esc(agqStatusLabelFos(status))}</span></button>`
  }).join('')}
 </div>`
}
function agqStatusLabelFos(s){return{nouvelle:'Reçue',prise_en_charge:'Vérification',complement:'Complément',controle:'Contrôle',validee:'Validée',confirmee:'Confirmée',rejetee:'Rejetée'}[s]||s}
function fapNotifsScreen(){
 const head=`<div class="fap-list-head"><button class="fap-back" data-fap-back="home">${I('arrow-left')}</button><b>Notifications</b></div>`;
 if(!fap.notifications.length)return `<div class="fap-list">${head}<p class="fap-empty">${I('bell-off')} Aucune notification pour l’instant.</p></div>`;
 return `<div class="fap-list">${head}
  ${fap.notifications.map(n=>`<button class="fap-notif-row" data-fap-notif-open="${esc(n.ref)}"><span>${I('bell-ring')}</span><div><b>${esc(n.text)}</b><small>${n.time}</small></div>${I('chevron-right')}</button>`).join('')}
 </div>`
}
function fapScreenHtml(){
 return{home:fapHomeScreen,results:fapResultsScreen,seat:fapSeatScreen,pay:fapPayScreen,ticket:fapTicketScreen,services:fapServicesScreen,svcform:fapSvcFormScreen,svcdone:fapSvcDoneScreen,wallet:fapWalletScreen,walletdetail:fapWalletDetailScreen,tracking:fapTrackingListScreen,notifs:fapNotifsScreen}[fap.screen]()
}
function fapNavKey(){
 if(['services','svcform','svcdone'].includes(fap.screen))return 'services';
 if(fap.screen==='tracking'||(fap.screen==='walletdetail'&&fap.walletBack==='tracking'))return 'tracking';
 if(fap.screen==='wallet'||(fap.screen==='walletdetail'&&fap.walletBack!=='tracking'))return 'wallet';
 return 'home'
}
function fapPaint(){
 const screen=document.getElementById('fapScreen');
 if(screen)screen.innerHTML=`<div class="fap-screen-inner">${fapScreenHtml()}</div>`;
 document.querySelectorAll('[data-fap-nav]').forEach(b=>b.classList.toggle('active',b.dataset.fapNav===fapNavKey()));
 const bell=document.querySelector('[data-fap-bell]');
 if(bell)bell.innerHTML=`${I('bell')}${fap.notifUnread?`<i class="fap-bell-badge">${fap.notifUnread}</i>`:''}`;
 if(window.lucide)lucide.createIcons();
 wireFap()
}
function wireFap(){
 document.querySelectorAll('[data-fap-nav]').forEach(b=>b.onclick=()=>{const k=b.dataset.fapNav;fap.screen=k;fapPaint()});
 document.querySelectorAll('[data-fap-back]').forEach(b=>b.onclick=()=>{fap.screen=b.dataset.fapBack;fapPaint()});
 const screenEl=document.getElementById('fapScreen');
 const searchBtn=screenEl?.querySelector('[data-fap-search]');
 if(searchBtn)searchBtn.onclick=()=>{
  fap.o=document.getElementById('fapFrom').value;fap.d=document.getElementById('fapTo').value;
  if(fap.o===fap.d){if(typeof toast==='function')toast('Choisissez deux gares différentes');return}
  fap.screen='results';fapPaint()
 };
 document.querySelectorAll('[data-fap-choose]').forEach(b=>b.onclick=()=>{fap.train=b.dataset.fapChoose;fap.seat=null;fap.screen='seat';fapPaint()});
 document.querySelectorAll('[data-fap-seat]').forEach(b=>b.onclick=()=>{fap.seat=+b.dataset.fapSeat;fapPaint()});
 document.querySelectorAll('[data-fap-cls]').forEach(b=>b.onclick=()=>{fap.cls=b.dataset.fapCls;fapPaint()});
 const nextBtn=screenEl?.querySelector('[data-fap-next]');
 if(nextBtn)nextBtn.onclick=()=>{if(fap.seat==null)return;fap.screen='pay';fapPaint()};
 document.querySelectorAll('[data-fap-pay]').forEach(b=>b.onclick=()=>{fap.pay=b.dataset.fapPay;fapPaint()});
 const confirmBtn=screenEl?.querySelector('[data-fap-confirm]');
 if(confirmBtn)confirmBtn.onclick=()=>{
  if(!fap.pay)return;
  const t=fapTrainsFor(fap.o,fap.d).find(x=>x.code===fap.train);
  const amount=t.prices[fap.cls||'2e'];
  const id=`SET-${today().split('/').reverse().join('').slice(2)}-${String(1000+Math.floor(Math.random()*9000))}`;
  const rec={id,kind:'billet',brand:'SETRAG · Billet électronique (mobile)',headlineHtml:`<b>${stName(fap.o)}</b>${I('arrow-right')}<b>${stName(fap.d)}</b>`,code:`${fap.o} → ${fap.d}`,date:today(),fields:[
   ['Train',`${t.code} · ${t.type}`],['Classe',clsLabel(fap.cls||'2e')],['Départ',t.depart],['Place',String((fap.seat??0)+1)],
   ['Montant TTC',fmtMoney(amount)],['Mode de paiement',(PAYMENTS.find(p=>p[0]===fap.pay)||['','Espèces'])[1]],['Canal','Application mobile'],['N° billet',id]
  ]};
  addToWallet(rec);
  fap.lastRec={id,amount};
  fap.screen='ticket';fapPaint();
  if(typeof toast==='function')toast('Paiement confirmé depuis l’application mobile · billet généré')
 };
 document.querySelectorAll('[data-fap-svc]').forEach(b=>b.onclick=()=>{fap.svc=b.dataset.fapSvc;fap.screen='svcform';fapPaint()});
 const svcSubmit=screenEl?.querySelector('[data-fap-svc-submit]');
 if(svcSubmit)svcSubmit.onclick=()=>{
  const s=SERVICES.find(x=>x.id===fap.svc);
  const vals=s.fields.map((f,i)=>{const el=document.querySelector(`[data-fap-f="${i}"]`);return[f[0],esc((el&&el.value.trim())||f[2]||'—')]});
  const id=`${s.prefix}-${today().split('/').reverse().join('').slice(2)}-${String(1000+Math.floor(Math.random()*9000))}`;
  const rec={id,kind:s.id,brand:`SETRAG · ${s.title.toUpperCase()} (mobile)`,headlineHtml:`<b>${s.title}</b>`,code:s.prefix,date:today(),fields:[...vals,['Canal','Application mobile']]};
  addToWallet(rec);
  const q=window.SETRAG_SERVICE_REQUESTS;
  if(q)q.unshift({ref:id,service:s.title,kind:s.id,client:vals[0]?.[1]||'—',fields:vals,summary:vals.map(v=>`${v[0]} : ${v[1]}`).join(' · '),time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),status:'nouvelle',agent:null,channel:'Application mobile'});
  fap.lastKnownStatus[id]='nouvelle';
  fap.lastRec={id,title:s.title};
  fap.screen='svcdone';fapPaint();
  if(typeof toast==='function')toast('Demande envoyée · en attente de validation par SETRAG')
 };
 document.querySelectorAll('[data-fap-wallet]').forEach(b=>b.onclick=()=>{fap.walletIdx=+b.dataset.fapWallet;fap.walletBack='wallet';fap.screen='walletdetail';fapPaint()});
 document.querySelectorAll('[data-fap-wallet-open]').forEach(b=>b.onclick=()=>{fap.walletIdx=0;fap.walletBack='tracking';fap.screen='walletdetail';fapPaint()});
 document.querySelectorAll('[data-fap-track-open]').forEach(b=>b.onclick=()=>{const idx=WALLET.findIndex(x=>x.id===b.dataset.fapTrackOpen);if(idx>=0){fap.walletIdx=idx;fap.walletBack='tracking';fap.screen='walletdetail';fapPaint()}});
 document.querySelectorAll('[data-fap-notif-open]').forEach(b=>b.onclick=()=>{const idx=WALLET.findIndex(x=>x.id===b.dataset.fapNotifOpen);if(idx>=0){fap.walletIdx=idx;fap.walletBack='notifs';fap.screen='walletdetail';fapPaint()}});
 document.querySelectorAll('[data-fap-bell]').forEach(b=>b.onclick=()=>{fap.notifUnread=0;fap.screen='notifs';fapPaint()});
}
function appSection(){
 return `<section class="fos-section" id="application">
 <div class="fos-app">
  <div class="fos-app-copy fos-reveal">
   <span class="fos-kicker" style="color:#0b8a56;border-color:#cfe6de;background:#eef8f3"><i style="background:#0b8a56"></i>APPLICATION MOBILE & WEB</span>
   <h3 style="margin-top:16px;color:#092238">La même expérience, dans la poche du voyageur</h3>
   <p style="color:#5d717a">Une seule API alimente le portail web et l’application mobile : recherche, réservation, paiement et billet QR restent identiques, en ligne comme hors connexion. Essayez le téléphone ci-contre — il est entièrement interactif.</p>
   <ul class="fos-app-list" style="color:#3f545c">
    ${['Recherche et achat en moins de 2 minutes','Six moyens de paiement, du Mobile Money à la carte bancaire','Billet et QR disponibles hors ligne après achat','Portefeuille et historique partagés avec le portail web'].map(x=>`<li style="color:#3f545c">${I('check-circle-2')} ${x}</li>`).join('')}
   </ul>
   <div class="fos-store-badges" style="filter:invert(0)">
    ${[['App Store','iOS'],['Google Play','Android']].map(x=>`<span style="border-color:#e3ebe8;background:#f3f7f6;color:#092238"><img class="fap-store-icon" src="public/images/setrag-logo-official.jpg" alt="SETRAG"><span><small>Disponible sur</small><b>${x[0]}</b></span></span>`).join('')}
   </div>
  </div>
  <div class="fap-shell fos-reveal">
   <div class="fap-phone"><div class="fap-notch"><i class="fap-cam"></i></div>
    <div class="fap-phone-screen">
     <div class="fap-statusbar"><span>${new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span><span class="fap-statusicons">${I('signal-high')}${I('wifi')}${I('battery-full')}</span></div>
     <div class="fap-appbar"><span class="fap-logo"><img src="public/images/setrag-logo-official.jpg" alt="SETRAG"></span><b>SETRAG</b><button class="fap-bell" data-fap-bell>${I('bell')}${fap.notifUnread?`<i class="fap-bell-badge">${fap.notifUnread}</i>`:''}</button></div>
     <div class="fap-screen" id="fapScreen"></div>
     <div class="fap-bottomnav">
      <button class="active" data-fap-nav="home">${I('house')}<small>Accueil</small></button>
      <button data-fap-nav="services">${I('grid-2x2')}<small>Services</small></button>
      <button data-fap-nav="tracking">${I('route')}<small>Suivi</small></button>
      <button data-fap-nav="wallet">${I('wallet')}<small>Portefeuille</small></button>
     </div>
     <div class="fap-home-indicator"></div>
    </div>
   </div>
  </div>
 </div>
 </section>`
}

function payMarketingSection(){
 return `<section class="fos-section" id="paiement" style="background:#f3f7f6">
 <div class="fos-head fos-reveal"><small>MOYENS DE PAIEMENT</small><h2>Payez comme vous le souhaitez</h2><p>Mobile Money, carte bancaire ou espèces en guichet — tous les canaux prévus au cahier des charges.</p></div>
 <div class="fos-paygrid">${PAYMENTS.map(p=>{const icon={am:'wallet',mm:'wallet',cp:'globe',vi:'credit-card',mc:'credit-card',cs:'banknote'}[p[0]]||'credit-card';return `<div class="fos-paylogo fos-reveal"><i style="background:${p[3]}">${I(icon)}</i><b>${p[1]}</b><small>${p[2]}</small></div>`}).join('')}</div>
 </section>`
}

function trustSection(){
 const items=[['shield-check','SSO & MFA','Connexion protégée'],['zap','< 2 s','Temps de connexion'],['server-cog','≥ 99,9 %','Disponibilité du service'],['lock','TLS 1.2+ / AES-256','Données chiffrées'],['timer','< 4 s','Émission du billet']];
 return `<section class="fos-section" style="padding-top:0">
 <div class="fos-trust fos-reveal">${items.map(x=>`<span>${I(x[0])}<b>${x[1]}</b>${x[2]}</span>`).join('')}</div>
 </section>`
}

function finalSection(){
 return `<section class="fos-section">
 <div class="fos-final fos-reveal">
  <div>
   <span class="fos-kicker">${I('rocket')} FRONT OFFICE VOYAGEUR</span>
   <h3 style="margin-top:16px">Ce que vos clients utiliseront, chaque jour</h3>
   <p>Cette page reproduit fidèlement le portail web et l’application mobile prévus au cahier des charges : mêmes services, mêmes moyens de paiement, même API que le Back Office.</p>
   <div class="fos-final-actions"><button class="gold" data-fos-scroll="fosSearch">${I('search')} Essayer la recherche</button><button class="ghost" data-fos-scroll="services">${I('grid')} Voir les 6 services</button></div>
  </div>
  <div class="fos-final-stat">
   <span><small>Services voyageurs</small><b>6</b></span>
   <span><small>Moyens de paiement</small><b>6</b></span>
   <span><small>Émission du billet</small><b>&lt; 4 s</b></span>
   <span><small>Disponibilité</small><b>99,9 %</b></span>
  </div>
 </div>
 </section>`
}

function render(){
 return `<div class="fos-page"><div class="fos-progress"><i></i></div>
 <nav class="fos-nav"><div class="fos-nav-brand"><span class="fap-logo"><img src="public/images/setrag-logo-official.jpg" alt="SETRAG"></span> SETRAG · Front Office voyageur</div>
 <div class="fos-nav-links"><button data-fos-scroll="fosSearch">Réserver</button><button data-fos-scroll="services">Services</button><button data-fos-scroll="application">Application</button><button data-fos-scroll="paiement">Paiement</button></div>
 <div class="fos-nav-cta"><button data-fos-scroll="services">${I('grid')} Tous les services</button><button id="fosWalletBtn">${I('wallet')} Profil<span class="fos-wallet-badge" id="fosWalletBadge">0</span></button><button class="gold" data-fos-scroll="fosSearch">${I('ticket')} Réserver</button></div>
 </nav>
 <section class="fos-hero"><div class="fos-hero-photo"></div>
  <div class="fos-hero-copy">
   <span class="fos-kicker"><i></i> DÉMONSTRATION FRONT OFFICE · APPLICATION VOYAGEUR</span>
   <h1>Votre billet de train,<br><em>en moins de 2 minutes.</em></h1>
   <p class="lead">Recherche, réservation, paiement et billet électronique QR — exactement ce que voyageurs et agences accréditées retrouveront sur le web et sur mobile.</p>
   <div class="fos-hero-badges">
    <span>${I('shield-check')} Paiement sécurisé</span>
    <span>${I('qr-code')} Billet QR instantané</span>
    <span>${I('smartphone')} Web & application mobile</span>
   </div>
  </div>
 </section>
 ${heroSearch()}
 ${servicesSection()}
 ${stepsSection()}
 ${appSection()}
 ${payMarketingSection()}
 ${trustSection()}
 ${finalSection()}
 </div>`
}

function refreshFlowHead(){
 const originSel=document.getElementById('fosOrigin'),destSel=document.getElementById('fosDest');
 if(originSel)originSel.value=ST.o;
 if(destSel)destSel.value=ST.d;
}

function openServiceModal(id){
 const s=SERVICES.find(x=>x.id===id);
 if(!s||!s.fields)return;
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.innerHTML=`<div class="fos-modal-backdrop" data-fos-modal-close><div class="fos-modal fos-modal-wide" onclick="event.stopPropagation()">
  <header><div style="display:flex;gap:12px;align-items:flex-start"><span>${I(s.icon)}</span><div><h3>${s.title}</h3></div></div><button class="fos-modal-close" data-fos-modal-close>×</button></header>
  <p class="desc">${s.desc}</p>
  <div class="fos-modal-fields">${s.fields.map((f,i)=>`<label>${f[0]}${f[1]==='select'?`<select data-f="${i}">${stationOptions(/arrivée/i.test(f[0])?'FCV':'OWE')}</select>`:`<input data-f="${i}" type="${f[1]}" placeholder="${f[2]||''}">`}</label>`).join('')}</div>
  <button class="fos-modal-submit" id="fosModalSubmit">${I('check')} ${s.cta}</button>
 </div></div>`;
 if(window.lucide)lucide.createIcons();
 root.addEventListener('click',e=>e.stopPropagation());
 root.querySelectorAll('[data-fos-modal-close]').forEach(x=>x.onclick=e=>{if(e.target===x)root.innerHTML=''});
 document.getElementById('fosModalSubmit').onclick=()=>{
  const vals=s.fields.map((f,i)=>{const el=root.querySelector(`[data-f="${i}"]`);return[f[0],esc((el&&el.value.trim())||f[2]||'—')]});
  const ref=`${s.prefix}-${today().split('/').reverse().join('').slice(2)}-${String(1000+Math.floor(Math.random()*9000))}`;
  const rec={id:ref,kind:s.id,brand:`SETRAG · ${s.title.toUpperCase()}`,headlineHtml:`<b>${s.title}</b>`,code:s.prefix,date:today(),fields:[...vals]};
  addToWallet(rec);
  AGENT_QUEUE.unshift({ref,service:s.title,kind:s.id,client:vals[0]?.[1]||'—',fields:vals,summary:vals.map(v=>`${v[0]} : ${v[1]}`).join(' · '),time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),status:'nouvelle',agent:null,channel:'Portail web'});
  root.querySelector('.fos-modal').innerHTML=`<div class="fos-modal-success-doc"><div class="fos-modal-success-head"><i>${I('send')}</i><div><h3>Demande envoyée</h3><p>Dossier ${ref} en attente de validation par un agent SETRAG · vous serez notifié par SMS et e-mail.</p></div></div>${docCardHtml(rec)}<div class="fos-ticket-actions" style="margin-top:16px"><button data-fos-action="pdf">${I('download')} Télécharger le PDF</button><button class="gold" data-fos-modal-close>Fermer</button></div></div>`;
  if(window.lucide)lucide.createIcons();
  root.querySelectorAll('[data-fos-modal-close]').forEach(x=>x.onclick=()=>root.innerHTML='');
  root.querySelectorAll('[data-fos-action]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Document PDF généré')})
 }
}

function renderWalletList(root){
 if(!WALLET.length){
  root.innerHTML=`<div class="fos-modal-backdrop" data-fos-modal-close><div class="fos-modal" onclick="event.stopPropagation()">
   <header><div style="display:flex;gap:12px;align-items:flex-start"><span>${I('wallet')}</span><div><h3>Mon portefeuille</h3></div></div><button class="fos-modal-close" data-fos-modal-close>×</button></header>
   <div class="fos-wallet-empty">${I('inbox')}<p>Vos billets et confirmations de service apparaîtront ici après un achat ou une demande.</p></div>
  </div></div>`;
 }else{
  root.innerHTML=`<div class="fos-modal-backdrop" data-fos-modal-close><div class="fos-modal fos-modal-wide" onclick="event.stopPropagation()">
   <header><div style="display:flex;gap:12px;align-items:flex-start"><span>${I('wallet')}</span><div><h3>Mon portefeuille</h3><p class="desc" style="margin:2px 0 0">${WALLET.length} document${WALLET.length>1?'s':''} · voyageur et services</p></div></div><button class="fos-modal-close" data-fos-modal-close>×</button></header>
   <div class="fos-wallet-list">${WALLET.map((r,i)=>`<button class="fos-wallet-row" data-wallet-open="${i}"><span class="fos-wallet-row-icon">${I(kindIcon(r.kind))}</span><span class="fos-wallet-row-mid"><b>${r.brand}</b><small>${r.code} · ${r.id}</small></span><span class="fos-wallet-row-date">${r.date}</span>${I('chevron-right')}</button>`).join('')}</div>
  </div></div>`;
 }
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-fos-modal-close]').forEach(x=>x.onclick=e=>{if(e.target===x)root.innerHTML=''});
 root.querySelectorAll('[data-wallet-open]').forEach(b=>b.onclick=()=>openWalletDetail(root,+b.dataset.walletOpen));
}
function openWalletDetail(root,i){
 const r=WALLET[i];
 if(!r)return;
 root.innerHTML=`<div class="fos-modal-backdrop" data-fos-modal-close><div class="fos-modal fos-modal-wide" onclick="event.stopPropagation()">
  <header><button class="fos-wallet-back" data-wallet-back>${I('arrow-left')} Portefeuille</button><button class="fos-modal-close" data-fos-modal-close>×</button></header>
  ${docCardHtml(r)}
  <div class="fos-ticket-actions"><button data-fos-action="pdf">${I('download')} Télécharger le PDF</button><button data-fos-action="sms">${I('send')} Envoyer par SMS</button></div>
 </div></div>`;
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-fos-modal-close]').forEach(x=>x.onclick=e=>{if(e.target===x)root.innerHTML=''});
 root.querySelector('[data-wallet-back]').onclick=()=>renderWalletList(root);
 root.querySelectorAll('[data-fos-action]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast(b.dataset.fosAction==='pdf'?'Document PDF généré':'Document envoyé par SMS')});
}
function openWallet(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 renderWalletList(root);
 root.addEventListener('click',e=>e.stopPropagation());
}

function wire(){
 if(typeof current!=='undefined'&&current!=='frontoffice')return;
 const root=document.querySelector('.fos-page');
 if(!root)return;
 if(!root.__fosStopBubble){root.addEventListener('click',e=>e.stopPropagation());root.__fosStopBubble=true}
 if(window.lucide)lucide.createIcons();
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
 root.querySelectorAll('.fos-reveal').forEach(x=>obs.observe(x));
 addEventListener('scroll',()=>{const d=document.documentElement;root.style.setProperty('--p',(scrollY/(d.scrollHeight-innerHeight||1)*100)+'%')},{passive:true});

 root.querySelectorAll('[data-fos-scroll]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.fosScroll)?.scrollIntoView({behavior:'smooth',block:'start'}));
 root.querySelectorAll('[data-fos-quick]').forEach(b=>b.onclick=()=>openServiceModal(b.dataset.fosQuick));
 root.querySelectorAll('[data-fos-service]').forEach(b=>b.onclick=()=>{const id=b.dataset.fosService;if(id==='ticket'){document.getElementById('fosSearch')?.scrollIntoView({behavior:'smooth'})}else openServiceModal(id)});
 const walletBtn=document.getElementById('fosWalletBtn');
 if(walletBtn)walletBtn.onclick=openWallet;
 updateWalletBadge();

 const swap=document.getElementById('fosSwap');
 if(swap)swap.onclick=()=>{const t=ST.o;ST.o=ST.d;ST.d=t;refreshFlowHead()};

 const searchBtn=document.getElementById('fosSearchBtn');
 if(searchBtn)searchBtn.onclick=()=>{
  ST.o=document.getElementById('fosOrigin').value;
  ST.d=document.getElementById('fosDest').value;
  ST.date=document.getElementById('fosDate').value||ST.date;
  ST.pax=Math.max(1,Math.min(6,+document.getElementById('fosPax').value||1));
  ST.cls=document.getElementById('fosCls').value;
  if(ST.o===ST.d){if(typeof toast==='function')toast('Choisissez deux gares différentes');return}
  ST.seats=[];ST.train=null;ST.ticketId=null;
  const flow=document.getElementById('fosFlow');
  flow.innerHTML=resultsPanel();
  wireFlow();
  flow.scrollIntoView({behavior:'smooth',block:'start'})
 };
 wireFlow();
 if(document.getElementById('fapScreen'))fapPaint();
}

function wireFlow(){
 const flow=document.getElementById('fosFlow');
 if(!flow)return;
 if(window.lucide)lucide.createIcons();
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.05});
 flow.querySelectorAll('.fos-reveal').forEach(x=>obs.observe(x));

 flow.querySelectorAll('[data-fos-choose]').forEach(b=>b.onclick=()=>{
  ST.train=b.dataset.fosChoose;ST.seats=[];
  flow.innerHTML=seatPanel();wireFlow();flow.scrollIntoView({behavior:'smooth',block:'start'})
 });
 flow.querySelectorAll('[data-fos-seat]').forEach(b=>b.onclick=()=>{
  const n=+b.dataset.fosSeat;
  const idx=ST.seats.indexOf(n);
  if(idx>-1){ST.seats.splice(idx,1)}
  else{if(ST.seats.length>=ST.pax){if(typeof toast==='function')toast(`Vous ne pouvez sélectionner que ${ST.pax} place(s)`);return}ST.seats.push(n)}
  flow.innerHTML=seatPanel();wireFlow()
 });
 const toPay=document.getElementById('fosToPay');
 if(toPay){
  const count=document.getElementById('fosSeatCount');
  if(count)count.textContent=`${ST.seats.length} / ${ST.pax}`;
  toPay.onclick=()=>{
   if(ST.seats.length<ST.pax){if(typeof toast==='function')toast('Sélectionnez toutes vos places avant de continuer');return}
   const nom=document.getElementById('fosNom').value.trim(),prenom=document.getElementById('fosPrenom').value.trim();
   if(!nom||!prenom){if(typeof toast==='function')toast('Renseignez le nom et le prénom du voyageur');return}
   ST.pass={nom,prenom,sexe:document.getElementById('fosSexe').value,tel:document.getElementById('fosTel').value,urgence:document.getElementById('fosUrg').value};
   flow.innerHTML=payPanel();wireFlow();flow.scrollIntoView({behavior:'smooth',block:'start'})
  }
 }
 flow.querySelectorAll('[data-fos-pay]').forEach(b=>b.onclick=()=>{
  ST.pay=b.dataset.fosPay;
  flow.querySelectorAll('[data-fos-pay]').forEach(x=>x.classList.toggle('picked',x===b))
 });
 const payBtn=document.getElementById('fosPayBtn');
 if(payBtn)payBtn.onclick=()=>{
  if(!ST.pay){if(typeof toast==='function')toast('Choisissez un moyen de paiement');return}
  const proc=document.getElementById('fosProcessing');
  payBtn.disabled=true;payBtn.style.opacity='.5';
  if(proc)proc.style.display='flex';
  setTimeout(()=>{flow.innerHTML=ticketPanel();wireFlow();flow.scrollIntoView({behavior:'smooth',block:'start'});if(typeof toast==='function')toast('Paiement confirmé · billet généré')},1400)
 };
 flow.querySelectorAll('[data-fos-back]').forEach(b=>b.onclick=()=>{
  const to=b.dataset.fosBack;
  if(to==='search'){flow.innerHTML='';document.getElementById('fosSearch')?.scrollIntoView({behavior:'smooth'});return}
  if(to==='reset'){ST.train=null;ST.seats=[];ST.pass={};ST.pay=null;ST.ticketId=null;flow.innerHTML='';document.getElementById('fosSearch')?.scrollIntoView({behavior:'smooth'});return}
  if(to==='results'){flow.innerHTML=resultsPanel();wireFlow();flow.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(to==='seat'){flow.innerHTML=seatPanel();wireFlow();flow.scrollIntoView({behavior:'smooth',block:'start'});return}
 });
 flow.querySelectorAll('[data-fos-action]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast(b.dataset.fosAction==='pdf'?'Billet PDF généré et prêt au téléchargement':'Billet envoyé par SMS')});
 flow.querySelectorAll('[data-fos-open-wallet]').forEach(b=>b.onclick=openWallet);
 updateWalletBadge();
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 window.renderFrontofficeShowcase=render;
 pages.frontoffice=render;
 if(typeof bind==='function'&&!bind.__frontofficeShowcaseWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__frontofficeShowcaseWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="frontoffice"].active')||document.querySelector('.fos-page');
 if(requested==='frontoffice'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
