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
 {id:'bagage',icon:'luggage',title:'Bagages',desc:'Enregistrement lié au billet, étiquette unique, 0 à 30 kg.',tags:['Étiquette unique','0–30 kg'],cta:'Enregistrer un bagage',fields:[['Numéro de billet voyageur','text','SET-260822-5012'],['Poids (kg)','number','18'],['Gare de départ','select'],['Gare d’arrivée','select']],prefix:'BAG'},
 {id:'colis',icon:'package',title:'Colis express',desc:'Expédition autonome, vignette et suivi interfacé COLIRAIL.',tags:['COLIRAIL','Suivi expéditeur'],cta:'Créer une expédition',fields:[['Expéditeur','text','Nom complet'],['Destinataire','text','Nom complet'],['Téléphone destinataire','tel','+241 06 00 00 00'],['Poids (kg)','number','8']],prefix:'COL'},
 {id:'taa',icon:'car-front',title:'Transport Auto Accompagné',desc:'Votre véhicule voyage avec vous, rattaché à votre billet.',tags:['TAA','Wagon porte-autos'],cta:'Déclarer un véhicule',fields:[['Numéro de billet voyageur','text','SET-260822-5012'],['Véhicule','text','Toyota Hilux'],['Immatriculation','text','GA-1234-AB'],['Tonnage (t)','number','2.1']],prefix:'TAA'},
 {id:'funeraire',icon:'flower-2',title:'Transport funéraire',desc:'Service dédié, confidentiel et autonome, sans billet obligatoire.',tags:['Confidentiel','Prestation autonome'],cta:'Faire une demande',fields:[['Expéditeur / famille','text','Nom complet'],['Téléphone','tel','+241 06 00 00 00'],['Gare de départ','select'],['Gare d’arrivée','select']],prefix:'FUN'},
 {id:'messagerie',icon:'send',title:'Messagerie voyageurs',desc:'Envoi de plis et messages associés au régime des trains voyageurs.',tags:['Régime voyageurs'],cta:'Envoyer un pli',fields:[['Expéditeur','text','Nom complet'],['Destinataire','text','Nom complet'],['Numéro de train','text','EXP-620'],['Description','text','Nature de l’envoi']],prefix:'MSG'}
];
const stationOptions=sel=>STATIONS.map(s=>`<option value="${s[0]}" ${s[0]===sel?'selected':''}>${s[1]}</option>`).join('');

const ST={o:'OWE',d:'FCV',date:'2026-08-22',pax:1,cls:'2e',train:null,seats:[],pass:{},pay:null};
const WALLET=[];
const kindIcon=k=>({billet:'ticket',bagage:'luggage',colis:'package',taa:'car-front',funeraire:'flower-2',messagerie:'send'}[k]||'file-text');
function addToWallet(rec){WALLET.unshift(rec);updateWalletBadge()}
function updateWalletBadge(){const b=document.getElementById('fosWalletBadge');if(!b)return;if(WALLET.length){b.style.display='inline-flex';b.textContent=WALLET.length}else{b.style.display='none'}}
function docCardHtml(rec){
 return `<div class="fos-ticket">
  <div class="fos-ticket-holo"></div>
  <div class="fos-ticket-body">
  <div class="fos-ticket-main">
   <div class="fos-ticket-brand"><span>S</span> ${rec.brand}</div>
   <div class="fos-ticket-route">${rec.headlineHtml}</div>
   <div class="fos-ticket-meta">${rec.fields.map(f=>`<span><small>${f[0]}</small><b>${f[1]}</b></span>`).join('')}</div>
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
   <div class="fos-barcode"></div>
  </div>
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

function appSection(){
 return `<section class="fos-section" id="application">
 <div class="fos-app">
  <div class="fos-app-copy fos-reveal">
   <span class="fos-kicker" style="color:#0b8a56;border-color:#cfe6de;background:#eef8f3"><i style="background:#0b8a56"></i>APPLICATION MOBILE & WEB</span>
   <h3 style="margin-top:16px;color:#092238">La même expérience, dans la poche du voyageur</h3>
   <p style="color:#5d717a">Une seule API alimente le portail web et l’application mobile : recherche, réservation, paiement et billet QR restent identiques, en ligne comme hors connexion.</p>
   <ul class="fos-app-list" style="color:#3f545c">
    ${['Recherche et achat en moins de 2 minutes','Billet et QR disponibles hors ligne après achat','Notifications de départ, retard et embarquement','Historique des voyages et re-achat en un clic'].map(x=>`<li style="color:#3f545c">${I('check-circle-2')} ${x}</li>`).join('')}
   </ul>
   <div class="fos-store-badges" style="filter:invert(0)">
    ${[['smartphone','App Store','iOS'],['play','Google Play','Android']].map(x=>`<span style="border-color:#e3ebe8;background:#f3f7f6;color:#092238">${I(x[0])}<span><small>Disponible sur</small><b>${x[1]}</b></span></span>`).join('')}
   </div>
  </div>
  <div class="fos-phones fos-reveal">
   <div class="fos-phone b"><div class="fos-phone-screen">
    <div class="fos-screen-bar"><span>9:41</span><span>●●● 5G</span></div>
    <div class="fos-screen-ticket" style="margin-top:20px"><b>SETRAG · Billet</b><small>${stName('OWE')} → ${stName('FCV')}</small><div class="fos-screen-qr">${qr('demo-phone-b')}</div></div>
   </div></div>
   <div class="fos-phone a"><div class="fos-phone-screen">
    <div class="fos-screen-bar"><span>9:41</span><span>●●● 5G</span></div>
    <div class="fos-screen-nav">${I('map-pin')} Rechercher un billet</div>
    <div class="fos-screen-card"><b>${stName('OWE')} → ${stName('FCV')}</b><small>Aujourd’hui · 1 voyageur</small><div class="fos-screen-row"><span>EXP-620 · 07:30</span><span>7 000 FCFA</span></div></div>
    <div class="fos-screen-card"><b>${stName('BOU')} → ${stName('LAS')}</b><small>Demain · 2 voyageurs</small><div class="fos-screen-row"><span>OMN-624 · 09:15</span><span>3 500 FCFA</span></div></div>
    <div class="fos-screen-btn">Rechercher</div>
   </div></div>
  </div>
 </div>
 </section>`
}

function payMarketingSection(){
 return `<section class="fos-section" id="paiement" style="background:#f3f7f6">
 <div class="fos-head fos-reveal"><small>MOYENS DE PAIEMENT</small><h2>Payez comme vous le souhaitez</h2><p>Mobile Money, carte bancaire ou espèces en guichet — tous les canaux prévus au cahier des charges.</p></div>
 <div class="fos-paygrid">${PAYMENTS.map(p=>`<div class="fos-paylogo fos-reveal"><i style="background:${p[3]}">${p[0].toUpperCase()}</i><b>${p[1]}</b></div>`).join('')}</div>
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
 <nav class="fos-nav"><div class="fos-nav-brand"><span>S</span> SETRAG · Front Office voyageur</div>
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
  const rec={id:ref,kind:s.id,brand:`SETRAG · ${s.title.toUpperCase()}`,headlineHtml:`<b>${s.title}</b>`,code:s.prefix,date:today(),fields:[...vals,['Statut','Confirmé'],['Date',today()]]};
  addToWallet(rec);
  root.querySelector('.fos-modal').innerHTML=`<div class="fos-modal-success-doc"><div class="fos-modal-success-head"><i>${I('check')}</i><div><h3>Demande confirmée</h3><p>Ajouté à votre portefeuille · confirmation envoyée par SMS et e-mail.</p></div></div>${docCardHtml(rec)}<div class="fos-ticket-actions" style="margin-top:16px"><button data-fos-action="pdf">${I('download')} Télécharger le PDF</button><button class="gold" data-fos-modal-close>Fermer</button></div></div>`;
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
