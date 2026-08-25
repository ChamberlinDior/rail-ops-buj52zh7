(function(){
'use strict';
const dossier={sale:'SET-260812-5012',reservation:'RES-260812-78421',passenger:'Nadia Raponda',customer:'CL-009821',phone:'+241 06 45 22 19',emergency:'Rose Raponda · +241 06 22 11 04',from:'Owendo',to:'Franceville',distance:'648 km',train:'EXP-620',service:'SRV-620-120826',departure:'12 août 2026 · 07:30',arrival:'12 août 2026 · 16:20',class:'1re classe',car:'V2',seat:'18 · Fenêtre',fare:'TAR-EXP-1C',ht:'16 981 FCFA',vat:'849 FCFA',css:'170 FCFA',total:'18 000 FCFA',payment:'Moov Money',paymentRef:'MOOV-982114',seller:'Grâce Mavoungou',pos:'POS-OW-01',device:'OW-POS-014',issued:'12 août 2026 · 09:40:18',bag:'BAG-260812-0841',parcel:'COL-260812-0314',taa:'TAA-260812-0029',funeral:'FUN-260812-0018'};
const qr=(value)=>`<div class="doc-qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&amp;format=png&amp;margin=0&amp;data=${encodeURIComponent('SETRAG|'+value+'|SIG=AUD-260812-9942')}" alt="QR code vérifiable ${value}"><small>QR signé</small></div>`;
const meta=(items)=>`<div class="doc-meta">${items.map(x=>`<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div>`;
const brandTone={VALIDE:'ok','ENREGISTRÉ':'ok','EN TRANSIT':'info','CHARGEMENT AUTORISÉ':'warn','DOSSIER CONFORME':'ok',RAPPROCHÉ:'ok'};
const brand=(type,ref,status='VALIDE')=>`<header class="doc-brand tkt-head"><div class="tkt-logo"><img src="public/images/setrag-logo-official.jpg" alt="SETRAG" class="tkt-logo-img"></div><div class="doc-brand-meta"><small>${type}</small><strong>${ref}</strong></div><span class="tkt-badge ${brandTone[status]||'ok'}">${ti('check')}${status}</span></header>`;
const route=()=>`<div class="doc-route"><div><small>DÉPART</small><b>${dossier.from}</b><span>07:30 · Voie 1</span></div><i>→<small>648 KM</small></i><div><small>ARRIVÉE</small><b>${dossier.to}</b><span>16:20 · Voie 2</span></div></div>`;
const tkIcon={
 user:'<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4 21c1.6-4 4.8-6 8-6s6.4 2 8 6"/>',
 tag:'<path d="M12 3.6 20.4 12 12 20.4 3.6 12V3.6H12Z"/><circle cx="7.8" cy="7.8" r="1.3"/>',
 store:'<path d="M4 9.5 5 4h14l1 5.5"/><path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5V15h4v4.5"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="16" rx="2.4"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 train:'<rect x="5" y="4" width="14" height="13" rx="4"/><path d="M5 12h14M9 4v13M8 20.5 6 17M16 20.5l2-3.5"/><circle cx="8.6" cy="14.4" r=".9"/><circle cx="15.4" cy="14.4" r=".9"/>',
 seat:'<path d="M6 4v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4"/><path d="M6 20v-3h12v3"/><path d="M4 20h16"/>',
 track:'<path d="M4 20 9 4h6l5 16"/><path d="M6.4 13h11.2M7.6 9h8.8M5.2 17h13.6"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
 shield:'<path d="M12 3.2 19 6v6c0 5-3 8.4-7 9.8-4-1.4-7-4.8-7-9.8V6l7-2.8Z"/><path d="M9 12.2l2 2 4-4.4"/>',
 offline:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.3 19.2h3.4"/><path d="M4 4l16 16"/>',
 refresh:'<path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5L19 8"/><path d="M19.5 12a7.5 7.5 0 0 1-12.6 5.5L5 16"/><path d="M19 4.5V8h-3.5M5 19.5V16h3.5"/>',
 leaf:'<path d="M5 19c9 1 14-4 14-13-9 0-14 4-14 13Z"/><path d="M5 19c3-5 6-8 12-11"/>',
 lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 check:'<path d="M5 12.5 10 17l9-10"/>',
 arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',
};
const ti=(name,cls='')=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${tkIcon[name]}</svg>`;
const tkLogo=`<svg viewBox="0 0 32 32" fill="none"><path d="M3 20.5 27 9.5l-3.6 6.4L27 22 3 20.5Z" fill="#4f6ef7"/><path d="M3 25 21 17.5l-2.4 4.2L21 26 3 25Z" fill="#8ea1fb"/></svg>`;
const tkTrainWatermark=`<svg viewBox="0 0 320 120" fill="currentColor"><rect x="0" y="100" width="320" height="4" rx="2"/><rect x="4" y="34" width="150" height="50" rx="8"/><rect x="18" y="44" width="24" height="20" rx="3" fill="#fff"/><rect x="52" y="44" width="24" height="20" rx="3" fill="#fff"/><rect x="86" y="44" width="24" height="20" rx="3" fill="#fff"/><rect x="120" y="44" width="24" height="20" rx="3" fill="#fff"/><path d="M158 30h100L300 74H166a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8Z"/><rect x="176" y="40" width="34" height="24" rx="4" fill="#fff"/><circle cx="278" cy="60" r="5" fill="#fff"/><circle cx="34" cy="88" r="13"/><circle cx="34" cy="88" r="5" fill="#fff"/><circle cx="92" cy="88" r="13"/><circle cx="92" cy="88" r="5" fill="#fff"/><circle cx="188" cy="88" r="13"/><circle cx="188" cy="88" r="5" fill="#fff"/><circle cx="246" cy="88" r="13"/><circle cx="246" cy="88" r="5" fill="#fff"/></svg>`;
const tkQrFrame=(img,caption,code)=>`<div class="tkt-bp-qr"><div class="tkt-qr-frame"><i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>${img}</div><small class="tkt-qr-caption">${ti('shield')}${caption}</small><b>${code}</b></div>`;
function ticket(){
 const [depDate,depTime]=dossier.departure.split(' · ');
 const [,arrTime]=dossier.arrival.split(' · ');
 return `<div class="tkt-page"><div class="tkt-top"><h1>Billet voyageur</h1><span class="tkt-badge ok">${ti('check')}Validé</span></div><p class="tkt-sub">Merci de vous présenter 30 minutes avant le départ.</p>
 <article class="setrag-document ticket-doc tkt-card">
  <div class="tkt-bp-main">
   <div class="tkt-bp-band"><em class="tkt-ref-tab">${dossier.sale}</em><strong>BILLET VOYAGEUR</strong><span>SETRAG</span></div>
   <div class="tkt-bp-body">
    <div class="tkt-bp-barcode"><b>${dossier.sale}</b></div>
    <div class="tkt-bp-watermark">${tkTrainWatermark}</div>
    <div class="tkt-bp-fields">
     <div><small>Passager</small><b>${dossier.passenger}</b></div>
     <div><small>Train</small><b>${dossier.train}</b></div>
     <div><small>Date</small><b>${depDate}</b></div>
     <div><small>Place</small><b>${dossier.car} · ${dossier.seat.split(' ')[0]}</b></div>
    </div>
    <div class="tkt-bp-hero"><b>${dossier.from.toUpperCase()}</b><i>${ti('train')}</i><b>${dossier.to.toUpperCase()}</b></div>
    <div class="tkt-bp-foot">
     <div><small>Voie</small><b>1</b></div>
     <div><small>Heure de départ</small><b>${depTime}</b></div>
    </div>
   </div>
  </div>
  <div class="tkt-bp-perf"></div>
  <div class="tkt-bp-stub">
   <div class="tkt-bp-band dark"><b>SETRAG</b><span>BILLET VOYAGEUR</span></div>
   <div class="tkt-bp-stub-fields">
    <div class="ic"><i class="tkt-ic sm">${ti('user')}</i><div><small>Passager</small><b>${dossier.passenger}</b></div></div>
    <div class="row"><div class="ic"><i class="tkt-ic sm">${ti('train')}</i><div><small>Train</small><b>${dossier.train}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('seat')}</i><div><small>Place</small><b>${dossier.car}·${dossier.seat.split(' ')[0]}</b></div></div></div>
    <div class="row"><div class="ic"><i class="tkt-ic sm">${ti('calendar')}</i><div><small>Date</small><b>${depDate}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('track')}</i><div><small>Voie</small><b>1</b></div></div></div>
   </div>
   <div class="tkt-bp-stub-route">
    <div class="tkt-bp-stub-stop"><i class="dot"></i><div><small>Départ</small><b>${depTime}</b><span>${dossier.from}</span></div></div>
    <div class="tkt-bp-stub-stop end"><i class="dot end"></i><div><small>Arrivée</small><b>${arrTime}</b><span>${dossier.to}</span></div></div>
   </div>
   ${tkQrFrame(qr(dossier.sale).replace('doc-qr','doc-qr tkt-qr'),'Scanner pour valider',dossier.sale)}
  </div>
 </article>
 <div class="tkt-trust">
  <div><i class="tkt-ic">${ti('shield')}</i><div><b>Billet 100% sécurisé</b><span>QR code unique et infalsifiable</span></div></div>
  <div><i class="tkt-ic">${ti('offline')}</i><div><b>Accessible hors ligne</b><span>Disponible à tout moment</span></div></div>
  <div><i class="tkt-ic">${ti('refresh')}</i><div><b>Échanges & remboursements</b><span>Selon conditions tarifaires</span></div></div>
  <div><i class="tkt-ic">${ti('leaf')}</i><div><b>Voyage responsable</b><span>Merci de voyager vert</span></div></div>
 </div>
 <p class="tkt-legal">${ti('lock')}Ce billet est personnel et non cessible. Présentez-le au personnel de bord à chaque contrôle.</p>
</div>`;
}
const barcode=v=>`<div class="premium-barcode"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><small>${v}</small></div>`;
const serviceRoute=(codeA,codeB,extra)=>`<div class="premium-service-route"><section><small>ORIGINE</small><strong>${codeA}</strong><b>${dossier.from}</b></section><div><span>TRANSGABONAIS</span><i>→</i><small>${extra}</small></div><section><small>DESTINATION</small><strong>${codeB}</strong><b>${dossier.to}</b></section></div>`;
function bag(){return `<div class="tkt-page bag-pass-page"><div class="tkt-top"><h1>Ticket bagage</h1><span class="tkt-badge ok">${ti('check')}Enregistré</span></div><p class="tkt-sub">Fixer le coupon principal au bagage et conserver le talon jusqu’à la restitution.</p><article class="setrag-document premium-service bag-doc tkt-card bag-bp-card"><div class="tkt-bp-main"><div class="tkt-bp-band"><strong>TICKET BAGAGE</strong><span>SETRAG · BAGAGE ACCOMPAGNÉ</span></div><div class="tkt-bp-body"><div class="tkt-bp-barcode"><b>${dossier.bag}</b></div><div class="tkt-bp-watermark">${tkTrainWatermark}</div><div class="tkt-bp-fields"><div><small>Propriétaire</small><b>${dossier.passenger}</b></div><div><small>Billet voyageur</small><b>${dossier.sale}</b></div><div><small>Train / service</small><b>${dossier.train} · ${dossier.service}</b></div><div><small>Date</small><b>12 AOÛT 2026</b></div></div><div class="tkt-bp-hero"><b>OWENDO</b><i>${ti('train')}</i><b>FRANCEVILLE</b></div><div class="tkt-bp-foot bag-bp-foot"><div><small>Poids contrôlé</small><b>24 KG</b></div><div><small>Affectation</small><b>SOUTE V4 · B</b></div><div><small>Montant TTC</small><b>520 FCFA</b></div><div><small>Dernier scan</small><b>09:44 · VALIDÉ</b></div></div></div></div><div class="tkt-bp-perf"></div><div class="tkt-bp-stub bag-bp-stub"><div class="tkt-bp-band dark"><b>OWENDO</b><i>${ti('train')}</i><b>FRANCEVILLE</b></div><div class="tkt-bp-stub-fields"><div class="ic"><i class="tkt-ic sm">${ti('tag')}</i><div><small>N° étiquette</small><b>${dossier.bag}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('user')}</i><div><small>Propriétaire</small><b>${dossier.passenger}</b></div></div><div class="row"><div class="ic"><i class="tkt-ic sm">${ti('train')}</i><div><small>Train</small><b>${dossier.train}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('shield')}</i><div><small>Poids</small><b>24 KG</b></div></div></div><div class="row"><div class="ic"><i class="tkt-ic sm">${ti('track')}</i><div><small>Soute</small><b>V4 · B</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('tag')}</i><div><small>Tarif</small><b>BAG-Z4</b></div></div></div></div>${tkQrFrame(qr(dossier.bag).replace('doc-qr','doc-qr tkt-qr'),'Scanner au retrait',dossier.bag)}</div></article><div class="tkt-trust bag-pass-trust"><div><i class="tkt-ic">${ti('shield')}</i><div><b>Bagage lié au billet</b><span>${dossier.sale}</span></div></div><div><i class="tkt-ic">${ti('check')}</i><div><b>Poids contrôlé</b><span>Franchise 20 kg + 4 kg</span></div></div><div><i class="tkt-ic">${ti('offline')}</i><div><b>Traçabilité hors ligne</b><span>Dernier scan mémorisé</span></div></div><div><i class="tkt-ic">${ti('refresh')}</i><div><b>Restitution sécurisée</b><span>Rapprochement talon / bagage</span></div></div></div><p class="tkt-legal">${ti('lock')}Étiquette unique et non transférable · rapprochement obligatoire avec le billet voyageur.</p></div>`}
function parcel(){return `<article class="setrag-document premium-service parcel-doc"><div class="doc-watermark">COLIS EXPRESS</div>${brand('BORDEREAU COLIS EXPRESS',dossier.parcel,'EN TRANSIT')}${serviceRoute('OWE','FVE','FRET-332 · WAGON W12')}<div class="premium-identity"><div><small>EXPÉDITEUR</small><h2>Louis Nziengui</h2><span>+241 07 78 11 04 · identité vérifiée</span></div><div class="recipient"><small>DESTINATAIRE</small><h2>Alice Andjoua</h2><span>+241 06 90 32 44</span></div><strong><small>POIDS</small>18 KG</strong></div><div class="premium-keyline"><span><small>CONTENU</small><b>2 CARTONS · PIÈCES MÉCANIQUES</b></span><span><small>VIGNETTES</small><b>VGN-0314-A / B</b></span><span><small>SUIVI COLIRAIL</small><b>CLR-884210</b></span><span><small>PROCHAINE ÉTAPE</small><b>NDJOLÉ</b></span></div>${meta([['N° expédition',dossier.parcel],['Gare départ','OWE · Owendo'],['Gare arrivée','FVE · Franceville'],['Train / wagon','FRET-332 · W12'],['Description','Pièces mécaniques'],['Montant opération','12 400 FCFA'],['Montant perçu','12 400 FCFA'],['Paiement','Airtel Money · AIR-442981'],['Dépôt','12 août · 10:12'],['Déclaration','Contenu non dangereux'],['Émetteur',dossier.device],['Agent',dossier.seller]])}<div class="premium-control">${barcode(dossier.parcel)}${qr(dossier.parcel)}<aside><small>PREUVE DE PRISE EN CHARGE</small><b>Traçabilité de bout en bout</b><span>Signature expéditeur enregistrée · deux vignettes associées · synchronisation COLIRAIL active.</span><em>✓ Scellé · ✓ pesé · ✓ paiement confirmé</em></aside></div></article>`}
function taa(){return `<article class="setrag-document premium-service taa-doc"><div class="doc-watermark">AUTO ACCOMPAGNÉE</div>${brand('AUTORISATION TRANSPORT AUTO ACCOMPAGNÉ',dossier.taa,'CHARGEMENT AUTORISÉ')}${serviceRoute('OWE','FVE','EXP-773 · PORTE-AUTO A1')}<div class="premium-identity vehicle"><div><small>VÉHICULE</small><h2>TOYOTA HILUX</h2><span>GA-482-LB · Blanc · VIN …8K214</span></div><div><small>CONDUCTEUR / BILLET</small><h2>Marc Rombi</h2><span>SET-260812-5118</span></div><strong><small>MASSE</small>2,1 T</strong></div><div class="premium-keyline"><span><small>EMPLACEMENT</small><b>NIVEAU BAS · P04</b></span><span><small>WAGON</small><b>PORTE-AUTO A1</b></span><span><small>DÉPART</small><b>12 AOÛT · 09:30</b></span><span><small>ÉTAT</small><b>PHOTOS 6/6 SIGNÉES</b></span></div>${meta([['N° expédition',dossier.taa],['Billet voyageur','SET-260812-5118'],['Code tarifaire','TAA-Z6'],['Validité','Train et date indiqués'],['Prix HT','80 189 FCFA'],['TVA / CSS','4 009 / 802 FCFA'],['Montant TTC','85 000 FCFA'],['Paiement','Visa · **** 8842'],['Clés','Remises à l’agent'],['Carburant','Niveau conforme'],['Alarme','Désactivée'],['Contrôle','Autorisé · agent OW-14']])}<div class="premium-control">${barcode(dossier.taa)}${qr(dossier.taa)}<aside><small>AUTORISATION NUMÉRIQUE DE CHARGEMENT</small><b>Contrôles départ conformes</b><span>Dossier lié au billet conducteur, au paiement et au manifeste du train.</span><em>✓ Identité · ✓ véhicule · ✓ emplacement</em></aside></div></article>`}
function funeral(){return `<article class="setrag-document premium-service funeral-doc"><div class="doc-watermark">ACCÈS RESTREINT</div>${brand('BORDEREAU TRANSPORT FUNÉRAIRE',dossier.funeral,'DOSSIER CONFORME')}${serviceRoute('OWE','FVE','EXP-620 · FOURGON M1')}<div class="premium-identity confidential"><div><small>PERSONNE HABILITÉE</small><h2>Famille Raponda</h2><span>Données sensibles protégées selon le rôle</span></div><strong><small>DOSSIER</small>TF-01</strong></div><div class="premium-keyline"><span><small>AUTORISATION</small><b>AUT-SAN-260812-118</b></span><span><small>SCELLÉ</small><b>SCL-260812-044 · INTACT</b></span><span><small>AFFECTATION</small><b>FOURGON M1</b></span><span><small>CHAÎNE DE GARDE</small><b>ACTIVE</b></span></div>${meta([['N° expédition',dossier.funeral],['Relation','Owendo → Franceville'],['Train','EXP-620'],['Départ','12 août · 07:30'],['Arrivée','12 août · 16:20'],['Poids déclaré','118 kg'],['Montant HT','141 509 FCFA'],['TVA / CSS','7 075 / 1 416 FCFA'],['Montant TTC','150 000 FCFA'],['Paiement','Espèces · CAISSE-OW-01'],['Remise','Agent habilité'],['Journal','AUD-TF-260812-18']])}<div class="premium-control">${barcode(dossier.funeral)}${qr(dossier.funeral)}<aside><small>DOCUMENT À ACCÈS RESTREINT</small><b>Chaîne de garde horodatée</b><span>Consultation, contrôle, remise et impression intégralement journalisés.</span><em>✓ Autorisation · ✓ scellé · ✓ habilitation</em></aside></div></article>`}
function receipt(){return `<div class="tkt-page"><div class="tkt-top"><h1>Reçu de paiement</h1><span class="tkt-badge ok">${ti('check')}Rapproché</span></div><p class="tkt-sub">Preuve de règlement liée au billet voyageur.</p>
 <article class="setrag-document receipt-doc ticket-doc tkt-card">
  <div class="tkt-bp-main">
   <div class="tkt-bp-band"><em class="tkt-ref-tab">${dossier.paymentRef}</em><strong>REÇU DE PAIEMENT</strong><span>SETRAG</span></div>
   <div class="tkt-bp-body">
    <div class="tkt-bp-barcode"><b>${dossier.paymentRef}</b></div>
    <div class="tkt-bp-watermark">${tkTrainWatermark}</div>
    <div class="tkt-bp-fields">
     <div><small>Payeur</small><b>${dossier.passenger}</b></div>
     <div><small>Canal</small><b>${dossier.payment}</b></div>
     <div><small>Opération</small><b>${dossier.sale}</b></div>
     <div><small>Date</small><b>${dossier.issued}</b></div>
    </div>
    <div class="tkt-bp-hero"><b>PAYÉ</b><i>${ti('shield')}</i><b>${dossier.total}</b></div>
    <div class="tkt-bp-foot">
     <div><small>Point de vente</small><b>${dossier.pos}</b></div>
     <div><small>Agent</small><b>${dossier.seller}</b></div>
    </div>
   </div>
  </div>
  <div class="tkt-bp-perf"></div>
  <div class="tkt-bp-stub">
   <div class="tkt-bp-band dark"><b>SETRAG</b><span>REÇU DE PAIEMENT</span></div>
   <div class="tkt-bp-stub-fields">
    <div class="ic"><i class="tkt-ic sm">${ti('user')}</i><div><small>Payeur</small><b>${dossier.passenger}</b></div></div>
    <div class="row"><div class="ic"><i class="tkt-ic sm">${ti('tag')}</i><div><small>HT</small><b>${dossier.ht}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('shield')}</i><div><small>TVA</small><b>${dossier.vat}</b></div></div></div>
    <div class="row"><div class="ic"><i class="tkt-ic sm">${ti('calendar')}</i><div><small>CSS</small><b>${dossier.css}</b></div></div><div class="ic"><i class="tkt-ic sm">${ti('track')}</i><div><small>TTC</small><b>${dossier.total}</b></div></div></div>
   </div>
   ${tkQrFrame(qr(dossier.paymentRef).replace('doc-qr','doc-qr tkt-qr'),'Preuve vérifiable',dossier.paymentRef)}
  </div>
 </article>
 <p class="tkt-legal">${ti('lock')}Document vérifiable · piste d’audit complète · rapproché avec le journal V65.</p>
</div>`}
const docs={ticket,bag,receipt,parcel,taa,funeral};
const saleRows=[
 {kind:'ticket',ref:dossier.sale,client:'Nadia Raponda',contact:'+241 06 45 22 19',service:'Billet voyageur',linked:dossier.reservation,route:'Owendo → Franceville',train:'EXP-620',date:'12 août · 07:30',assignment:'V2 · Place 18',amount:'18 000',pay:'Moov Money',payref:'MOOV-982114',status:'Confirmé',tone:'ok'},
 {kind:'bag',ref:dossier.bag,client:'Nadia Raponda',contact:'Lié à '+dossier.sale,service:'Bagage · 24 kg',linked:dossier.sale,route:'Owendo → Franceville',train:'EXP-620',date:'12 août · 07:30',assignment:'Soute V4 · Zone B',amount:'520',pay:'Billet lié',payref:dossier.sale,status:'Enregistré',tone:'ok'},
 {kind:'parcel',ref:dossier.parcel,client:'Louis Nziengui',contact:'+241 07 78 11 04',service:'Colis express · 18 kg',linked:'CLR-884210',route:'Owendo → Franceville',train:'FRET-332',date:'12 août · 10:12',assignment:'Wagon W12 · 2 vignettes',amount:'12 400',pay:'Airtel Money',payref:'AIR-442981',status:'En transit',tone:'info'},
 {kind:'taa',ref:dossier.taa,client:'Marc Rombi',contact:'Toyota Hilux · GA-482-LB',service:'Auto accompagnée · 2,1 t',linked:'SET-260812-5118',route:'Owendo → Franceville',train:'EXP-773',date:'12 août · 09:30',assignment:'Porte-auto A1 · P04',amount:'85 000',pay:'Visa',payref:'**** 8842',status:'Confirmé',tone:'ok'},
 {kind:'funeral',ref:dossier.funeral,client:'Famille Raponda',contact:'Contact habilité',service:'Transport funéraire',linked:'AUT-SAN-260812-118',route:'Owendo → Franceville',train:'EXP-620',date:'12 août · 07:30',assignment:'Fourgon M1 · TF-01',amount:'150 000',pay:'Espèces',payref:'CAISSE-OW-01',status:'Conforme',tone:'ok'},
 {kind:'ticket',ref:'SET-260812-4981',client:'Marc Rombi',contact:'+241 07 11 48 20',service:'Billet voyageur',linked:'RES-260812-78190',route:'Franceville → Owendo',train:'EXP-622',date:'12 août · 18:15',assignment:'V1 · Place 06',amount:'25 000',pay:'Mastercard',payref:'MC-778421',status:'Confirmé',tone:'ok'},
 {kind:'ticket',ref:'SET-260812-4979',client:'Alice Andjoua',contact:'+241 06 90 32 44',service:'Billet voyageur',linked:'RES-260812-78042',route:'Owendo → Booué',train:'OMN-624',date:'13 août · 11:20',assignment:'V4 · Place 09',amount:'7 000',pay:'Airtel Money',payref:'AIR-440217',status:'Paiement attendu',tone:'warn'}
];
const salesIcon=k=>({ticket:'🎟',bag:'▣',parcel:'◇',taa:'▤',funeral:'◆'})[k];
const swNoAvatar='<span class="avatar-cell" style="display:none" aria-hidden="true"></span>';
function salesTable(){return `<div class="sales-table-scroll"><table class="sales-table-pro"><thead><tr><th>Opération</th><th>Client / liaison</th><th>Trajet et circulation</th><th>Affectation</th><th>Montant / paiement</th><th>Statut</th><th>Documents</th></tr></thead><tbody>${saleRows.map(r=>`<tr data-sale-kind="${r.kind}" data-sale-status="${r.tone}"><td>${swNoAvatar}<div class="sale-operation"><i class="kind-${r.kind}">${salesIcon(r.kind)}</i><span><b>${r.service}</b><small>${r.ref}</small></span></div></td><td><b>${r.client}</b><small>${r.contact}</small><em>Lié · ${r.linked}</em></td><td><div class="sale-route"><b>${r.route}</b><span>${r.train} · ${r.date}</span></div></td><td><b>${r.assignment}</b><small>${r.kind==='ticket'?'Titre nominatif':'Traçabilité active'}</small></td><td><strong>${r.amount} FCFA</strong><small>${r.pay} · ${r.payref}</small></td><td><span class="sale-status ${r.tone}"><i></i>${r.status}</span></td><td><div class="sale-actions row-actions"><button data-sale-detail="${r.ref}">Détails</button><button class="primary" data-doc-open="${r.kind}">Voir le document</button></div></td></tr>`).join('')}</tbody></table></div>`}
pages.sales=function(){return `${pageHead('Ventes & prestations','Toutes les opérations, leurs liaisons et leurs documents dans une vue unique','<button class="btn ghost" data-doc-center>Centre documentaire</button><button class="btn primary" data-story-sale>＋ Nouvelle opération</button>')}<div class="sales-summary-pro"><div><small>VENTES DU JOUR</small><b>4 892</b><span>78,45 M FCFA</span></div><div><small>PAIEMENTS CONFIRMÉS</small><b>97,1 %</b><span>4 750 rapprochés</span></div><div><small>DOCUMENTS ÉMIS</small><b>5 733</b><span>Billets, étiquettes, bordereaux</span></div><div><small>À TRAITER</small><b>24</b><span>18 impressions · 6 anomalies</span></div></div><section class="sales-register-pro"><header><div><h2>Registre des opérations</h2><p>Une ligne représente une prestation. Les références indiquent immédiatement les documents et opérations liés.</p></div><button class="sales-export">Exporter</button></header><div class="sales-filterbar"><label class="sales-search"><span>⌕</span><input data-sales-search placeholder="Rechercher une référence, un client, un train ou un paiement"></label><select data-sales-service><option value="all">Toutes les prestations</option><option value="ticket">Billets voyageurs</option><option value="bag">Bagages</option><option value="parcel">Colis express</option><option value="taa">TAA</option><option value="funeral">Transport funéraire</option></select><select data-sales-status><option value="all">Tous les statuts</option><option value="ok">Confirmés / conformes</option><option value="info">En acheminement</option><option value="warn">À traiter</option></select><button data-sales-clear>Réinitialiser</button></div><div class="sales-legend"><span><i class="ok"></i>Confirmé</span><span><i class="info"></i>En acheminement</span><span><i class="warn"></i>Action attendue</span><em><b data-sales-count>${saleRows.length}</b> opérations affichées</em></div>${salesTable()}</section><section class="sales-help-pro"><div><b>Lecture rapide</b><span>Prestation → client lié → trajet → affectation → règlement → statut → document</span></div><div><b>Traçabilité automatique</b><span>Chaque ouverture et impression est enregistrée dans le journal d’audit.</span></div></section>`};
function openDocs(kind='ticket'){
 document.querySelector('.doc-overlay')?.remove();
 const modal=document.createElement('div');modal.className='doc-overlay';
 const available=kind==='ticket'||kind==='bag'||kind==='receipt'?[['ticket','Billet voyageur',dossier.sale],['bag','Bagage associé · 24 kg',dossier.bag],['receipt','Reçu de paiement',dossier.paymentRef]]:kind==='parcel'?[['parcel','Bordereau colis',dossier.parcel]]:kind==='taa'?[['taa','Dossier TAA',dossier.taa],['ticket','Billet associé','SET-260812-5118'],['receipt','Reçu de paiement','VISA-8842']]:[['funeral','Bordereau funéraire',dossier.funeral],['receipt','Reçu de paiement','CAISSE-OW-01']];
 modal.innerHTML=`<div class="doc-center"><header><div><small>DOSSIER LIÉ · ${dossier.reservation}</small><h2>Documents de voyage SETRAG</h2><p>${available.length} document(s) lié(s) · identifiants croisés · contrôle et audit centralisés</p></div><div><button class="doc-download">Télécharger PDF</button><button class="doc-print">Imprimer</button><button class="doc-close">×</button></div></header><nav>${available.map(x=>`<button data-doc="${x[0]}" class="${x[0]===kind?'active':''}">${x[1]}<small>${x[2]}</small></button>`).join('')}</nav><main id="setragDocPreview">${docs[kind]()}</main><aside><b>Chaîne documentaire</b><span>${available.map(x=>x[1]).join(' ↔ ')}</span><em>Journal AUD-260812-9942 · intégrité vérifiée</em></aside></div>`;
 document.body.append(modal);modal.querySelector('.doc-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove();const b=e.target.closest('[data-doc]');if(b){modal.querySelectorAll('[data-doc]').forEach(x=>x.classList.toggle('active',x===b));modal.querySelector('#setragDocPreview').innerHTML=docs[b.dataset.doc]();}};modal.querySelector('.doc-print').onclick=()=>window.print();modal.querySelector('.doc-download').onclick=()=>{toast('PDF sécurisé préparé · journal d’export mis à jour');setTimeout(()=>window.print(),250)};
}
document.addEventListener('click',e=>{const row=e.target.closest('tr');const direct=e.target.closest('[data-doc-open]');if(direct){e.preventDefault();e.stopImmediatePropagation();openDocs(direct.dataset.docOpen);return}const saleDetail=e.target.closest('[data-sale-detail]');if(saleDetail){e.preventDefault();e.stopImmediatePropagation();openSaleDetail(saleDetail.dataset.saleDetail);return}const detail=e.target.closest('[data-row-detail]');if(detail&&current==='sales'){e.preventDefault();e.stopImmediatePropagation();const ref=row?.cells?.[0]?.textContent||'';openDocs(ref.startsWith('BAG')?'bag':ref.startsWith('COL')?'parcel':ref.startsWith('TAA')?'taa':ref.startsWith('FUN')?'funeral':'ticket');return}if(e.target.closest('[data-doc-center]'))openDocs('ticket')},true);
function openSaleDetail(ref){const r=saleRows.find(x=>x.ref===ref)||saleRows[0];document.querySelector('.sale-detail-drawer')?.remove();const d=document.createElement('div');d.className='sale-detail-drawer';d.innerHTML=`<div><header><span><small>FICHE OPÉRATION</small><h2>${r.ref}</h2></span><button data-sale-detail-close>×</button></header><div class="sale-detail-state"><span class="sale-status ${r.tone}"><i></i>${r.status}</span><b>${r.amount} FCFA</b></div>${meta([['Prestation',r.service],['Client',r.client],['Contact / objet',r.contact],['Référence liée',r.linked],['Trajet',r.route],['Train / départ',r.train+' · '+r.date],['Affectation',r.assignment],['Paiement',r.pay+' · '+r.payref],['Point de vente',dossier.pos],['Agent',dossier.seller],['Appareil',dossier.device],['Journal','AUD-260812-9942']])}<section><h3>Chronologie</h3><ol><li><b>Opération créée</b><span>${dossier.issued}</span></li><li><b>Paiement vérifié</b><span>Référence opérateur rapprochée</span></li><li><b>Document généré</b><span>QR signé et journalisé</span></li></ol></section><footer><button data-sale-detail-close>Fermer</button><button class="primary" data-doc-open="${r.kind}">Voir le document</button></footer></div>`;document.body.append(d);d.querySelectorAll('[data-sale-detail-close]').forEach(x=>x.onclick=()=>d.remove())}
function openCdcGuide(){const root=document.querySelector('#modalRoot');root.innerHTML=`<div class="sales-cdc-overlay"><div class="sales-cdc-panel"><header><div><small>CDC BACK OFFICE v1.2 · PREUVES SUR CETTE PAGE</small><h2>Conformité Ventes & prestations</h2><p>Une lecture directe des exigences SETRAG et de leur matérialisation dans la démo.</p></div><button data-cdc-guide-close>×</button></header><div class="cdc-proof-grid">${[['Cinq prestations','Billet, bagage, colis express, TAA et transport funéraire.','§7.1'],['Titre sécurisé','Identifiant unique, vrai QR décodable, anti-doublon et audit.','§7.1.1'],['Données du billet','Client, sexe, gares, distance, classe, tarif, dates, train, place, contacts et appareil.','§7.1.1'],['Documents liés','Billet ↔ bagage associé ↔ reçu de paiement ; TAA ↔ billet conducteur.','§7.1.2 / §7.1.4'],['Fiscalité et paiement','HT, TVA, CSS, TTC, perçu, à payer et référence opérateur.','§7.2 / §7.5'],['Documents métier','Billet, étiquette, déclaration, bordereau et reçu imprimables/PDF.','§8 · Portail de vente'],['Contrôle complet','Statut, agent, terminal, chronologie, journal et QR online/offline.','§7.7'],['Pilotage','Recherche, filtres cliquables et export CSV des ventes.','§7.5']].map((x,i)=>`<article><i>${i+1}</i><div><b>${x[0]}</b><p>${x[1]}</p><span>${x[2]} · COUVERT</span></div></article>`).join('')}</div><footer><b>Parcours de preuve</b><span>Filtrer → Détails → Voir le document → Bagage associé → Reçu → Imprimer.</span><button data-cdc-guide-close>Fermer</button></footer></div></div>`;root.querySelectorAll('[data-cdc-guide-close]').forEach(x=>x.onclick=()=>root.innerHTML='')}
function exportSales(){const head=['Référence','Prestation','Client','Trajet','Train','Affectation','Montant FCFA','Paiement','Statut'];const rows=saleRows.map(r=>[r.ref,r.service,r.client,r.route,r.train,r.assignment,r.amount,r.pay+' '+r.payref,r.status]);const csv='\ufeff'+[head,...rows].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='SETRAG-ventes-2026-08-12.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('Export CSV généré · 7 opérations · journalisé')}
const WZ_TYPES=[
 {kind:'ticket',label:'Billet voyageur',icon:'🎟',prefix:'SET',amount:18000},
 {kind:'bag',label:'Bagage lié',icon:'▣',prefix:'BAG',amount:520},
 {kind:'parcel',label:'Colis express',icon:'◇',prefix:'COL',amount:12400},
 {kind:'taa',label:'Transport auto accompagnée',icon:'▤',prefix:'TAA',amount:85000},
 {kind:'funeral',label:'Transport funéraire',icon:'◆',prefix:'FUN',amount:150000}
];
const WZ_FIELDS={
 ticket:[['client','Voyageur','text','Nadia Raponda · CL-009821'],['phone','Téléphone','text','+241 06 45 22 19'],['train','Train / circulation','select',['EXP-620 · Owendo → Franceville','OMN-624 · Owendo → Booué','EXP-622 · Franceville → Owendo','EXP-773 · Franceville → Owendo']],['classe','Classe','select',['1re classe','2e classe','VIP']],['place','Voiture / place','text','V2 · Place 18']],
 bag:[['linked','Billet associé (obligatoire)','text',dossier.sale],['client','Voyageur propriétaire','text','Nadia Raponda'],['poids','Poids mesuré (kg)','text','24'],['zone','Affectation soute','text','Soute V4 · Zone B']],
 parcel:[['sender','Expéditeur','text','Louis Nziengui'],['recipient','Destinataire','text','Alice Andjoua'],['contenu','Contenu déclaré','text','2 cartons · pièces mécaniques'],['poids','Poids (kg)','text','18']],
 taa:[['vehicule','Véhicule','text','Toyota Hilux · GA-482-LB'],['linked','Billet conducteur lié (obligatoire)','text','SET-260812-5118'],['poids','Masse (t)','text','2,1'],['emplacement','Emplacement wagon','text','Porte-auto A1 · P04']],
 funeral:[['famille','Personne habilitée','text','Famille Raponda'],['autorisation','Autorisation sanitaire (obligatoire)','text','AUT-SAN-260812-118'],['poids','Poids déclaré (kg)','text','118'],['affectation','Affectation','text','Fourgon M1 · TF-01']]
};
const WZ_PAYMENTS=['Moov Money','Airtel Money','Click&Pay','Visa','Mastercard','Espèces'];
let wz={step:1,kind:'',data:{},items:[],pay:WZ_PAYMENTS[0]};
let wzCounter=0;
function refreshSalesView(){const scroll=document.querySelector('.sales-table-scroll');if(scroll)scroll.outerHTML=salesTable();const count=document.querySelector('[data-sales-count]');if(count)count.textContent=saleRows.length;const todayCount=document.querySelector('.sales-summary-pro>div:first-child b');if(todayCount)todayCount.textContent=(4892+wzCounter).toLocaleString('fr-FR');if(window.lucide)lucide.createIcons()}
function wzCartTotal(){return wz.items.reduce((s,it)=>s+Number(it.data.amount||0),0)}
function wzCartLine(it,i){const t=WZ_TYPES.find(x=>x.kind===it.kind);const who=it.data.client||it.data.famille||it.data.sender||it.data.vehicule||dossier.passenger;return `<div class="sw-cart-item"><i>${t.icon}</i><div><b>${t.label}</b><span>${who}</span></div><strong>${Number(it.data.amount||0).toLocaleString('fr-FR')} FCFA</strong><button type="button" class="sw-cart-remove" data-wz-remove="${i}" title="Retirer">×</button></div>`}
function wzCartBlock(){return wz.items.length?`<div class="sw-cart">${wz.items.map(wzCartLine).join('')}<div class="sw-cart-total"><span>${wz.items.length} prestation(s) au panier</span><b>${wzCartTotal().toLocaleString('fr-FR')} FCFA</b></div></div>`:''}
function wzStepBody(){
 if(wz.step===1)return `${wzCartBlock()}<p class="sw-cart-label">${wz.items.length?'Ajouter une autre prestation au panier :':'Choisissez une prestation :'}</p><div class="sw-types">${WZ_TYPES.map(t=>`<button type="button" class="sw-type${wz.kind===t.kind?' active':''}" data-wz-kind="${t.kind}"><i>${t.icon}</i><b>${t.label}</b></button>`).join('')}</div>`;
 if(wz.step===2){const fields=WZ_FIELDS[wz.kind]||[];return `<div class="form-grid">${fields.map(f=>{const[key,label,type,opt]=f;const val=wz.data[key];return type==='select'?`<div class="field"><label>${label}</label><select data-wz-field="${key}">${opt.map(o=>`<option ${o===val?'selected':''}>${o}</option>`).join('')}</select></div>`:`<div class="field"><label>${label}</label><input data-wz-field="${key}" value="${val}"></div>`}).join('')}<div class="field"><label>Montant TTC (FCFA)</label><input data-wz-field="amount" value="${wz.data.amount}"></div></div>`}
 if(wz.step===3)return `${wzCartBlock()}<div class="form-grid"><div class="field wide"><label>Moyen de paiement · règlement unique pour tout le panier</label><select data-wz-pay>${WZ_PAYMENTS.map(p=>`<option ${p===wz.pay?'selected':''}>${p}</option>`).join('')}</select></div></div><div class="sw-note">✓ Un seul paiement couvre les ${wz.items.length} prestation(s) · ✓ référence individuelle générée par document · ✓ rapprochement automatique du paiement groupé</div>`;
 return `${wzCartBlock()}<div class="sw-recap"><div><small>PRESTATIONS</small><b>${wz.items.length}</b></div><div><small>MONTANT TOTAL ENCAISSÉ</small><b>${wzCartTotal().toLocaleString('fr-FR')} FCFA</b></div><div><small>MOYEN DE PAIEMENT</small><b>${wz.pay}</b></div></div>`;
}
function wzFooter(){
 if(wz.step===1){
  const hasCart=wz.items.length>0;
  return `<div class="wz-foot-actions">${hasCart?`<button type="button" class="btn primary" data-wz-checkout>Passer au paiement groupé (${wz.items.length}) →</button>`:''}<button type="button" class="btn ${hasCart?'ghost':'primary'}" data-wz-addkind${wz.kind?'':' disabled'}>Ajouter cette prestation</button></div>`;
 }
 if(wz.step===2)return `<button type="button" class="btn primary" data-wz-addcart>＋ Ajouter au panier</button>`;
 if(wz.step===3)return `<button type="button" class="btn primary" data-wz-next>Continuer</button>`;
 return `<button type="button" class="btn primary" data-wz-submit>Encaisser ${wzCartTotal().toLocaleString('fr-FR')} FCFA et émettre</button>`;
}
function wzRender(){
 const root=document.querySelector('#modalRoot');
 const stepsMeta=[['1','Panier'],['2','Détails'],['3','Paiement groupé'],['4','Récapitulatif']];
 root.innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="modal-head"><div><span class="subtle">ÉMISSION GUIDÉE · PAIEMENT MULTI-PRESTATIONS</span><h2>Nouvelle opération</h2></div><button class="icon-btn" data-wz-close>×</button></div><div class="modal-body"><div class="steps">${stepsMeta.map((s,i)=>`<div class="step${wz.step===i+1?' active':''}"><i>${s[0]}</i>${s[1]}</div>`).join('')}</div><form id="swForm">${wzStepBody()}</form></div><div class="modal-foot"><button type="button" class="btn ghost" data-wz-prev${wz.step===1?' disabled':''}>Retour</button><span class="subtle">Étape ${wz.step} sur 4</span>${wzFooter()}</div></div></div>`;
 if(window.lucide)lucide.createIcons();
 wzWire();
}
function wzWire(){
 const root=document.querySelector('#modalRoot');
 const overlay=root.querySelector('.modal-backdrop');
 overlay.addEventListener('click',e=>{e.stopPropagation();if(e.target===overlay)wzClose()});
 overlay.querySelector('[data-wz-close]').onclick=wzClose;
 overlay.querySelectorAll('[data-wz-field]').forEach(el=>{el.oninput=el.onchange=()=>{wz.data[el.dataset.wzField]=el.value}});
 const payField=overlay.querySelector('[data-wz-pay]');if(payField)payField.onchange=()=>{wz.pay=payField.value};
 overlay.querySelectorAll('[data-wz-kind]').forEach(b=>b.onclick=()=>{
  overlay.querySelectorAll('[data-wz-kind]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  wz.kind=b.dataset.wzKind;
  const t=WZ_TYPES.find(x=>x.kind===wz.kind);
  wz.data={amount:t.amount};
  (WZ_FIELDS[wz.kind]||[]).forEach(f=>{wz.data[f[0]]=f[2]==='select'?f[3][0]:f[3]});
  const addBtn=overlay.querySelector('[data-wz-addkind]');if(addBtn)addBtn.disabled=false;
 });
 const addKind=overlay.querySelector('[data-wz-addkind]');if(addKind)addKind.onclick=()=>{
  if(!wz.kind){toast('Sélectionnez une prestation pour continuer');return}
  wz.step=2;wzRender();
 };
 const checkout=overlay.querySelector('[data-wz-checkout]');if(checkout)checkout.onclick=()=>{wz.step=3;wzRender()};
 const addCart=overlay.querySelector('[data-wz-addcart]');if(addCart)addCart.onclick=()=>{
  const fields=WZ_FIELDS[wz.kind]||[];
  const missing=fields.some(f=>!String(wz.data[f[0]]||'').trim());
  if(missing){toast('Complétez les champs obligatoires avant de continuer');return}
  wz.items.push({kind:wz.kind,data:{...wz.data}});
  wz.kind='';wz.data={};wz.step=1;wzRender();
  toast('Prestation ajoutée au panier');
 };
 overlay.querySelectorAll('[data-wz-remove]').forEach(b=>b.onclick=e=>{
  e.stopPropagation();
  wz.items.splice(Number(b.dataset.wzRemove),1);
  wzRender();
 });
 const prev=overlay.querySelector('[data-wz-prev]');if(prev)prev.onclick=()=>{
  if(wz.step===2){wz.kind='';wz.data={};wz.step=1;wzRender();return}
  if(wz.step>1){wz.step--;wzRender()}
 };
 const next=overlay.querySelector('[data-wz-next]');if(next)next.onclick=()=>{
  if(wz.step===3&&!wz.items.length){toast('Ajoutez au moins une prestation au panier');return}
  wz.step++;wzRender();
 };
 const submit=overlay.querySelector('[data-wz-submit]');if(submit)submit.onclick=wzSubmit;
}
function wzClose(){const root=document.querySelector('#modalRoot');root.innerHTML=''}
function wzSubmit(){
 if(!wz.items.length){toast('Le panier est vide');return}
 const groupRef='GRP-'+new Date().toTimeString().slice(0,5).replace(':','')+'-'+Math.floor(100+Math.random()*900);
 const payref='PAY-'+Math.floor(100000+Math.random()*900000);
 const refs=[];
 wz.items.forEach(it=>{
  const t=WZ_TYPES.find(x=>x.kind===it.kind);const d=it.data;
  wzCounter++;
  const ref=`${t.prefix}-260812-${5100+wzCounter}`;
  refs.push(ref);
  const row={kind:it.kind,ref,client:d.client||d.famille||d.sender||dossier.passenger,contact:d.phone||d.linked||d.vehicule||d.autorisation||d.recipient||'—',service:t.label,linked:d.linked||d.contenu||groupRef,route:'Owendo → Franceville',train:(d.train||'EXP-620').split(' · ')[0],date:'12 août · '+new Date().toTimeString().slice(0,5),assignment:d.place||d.zone||d.emplacement||d.affectation||'—',amount:Number(d.amount||t.amount).toLocaleString('fr-FR'),pay:`${wz.pay} · Paiement groupé`,payref,status:'Confirmé',tone:'ok'};
  saleRows.unshift(row);
 });
 const total=wzCartTotal();const count=wz.items.length;const lastKind=wz.items[wz.items.length-1].kind;
 wzClose();
 refreshSalesView();
 toast(`Paiement groupé ${payref} · ${count} prestation(s) · ${total.toLocaleString('fr-FR')} FCFA · documents émis et journalisés`);
 setTimeout(()=>openDocs(lastKind),350);
}
function newSaleWizard(){wz={step:1,kind:'',data:{},items:[],pay:WZ_PAYMENTS[0]};wzRender()}
document.addEventListener('click',e=>{if(current!=='sales')return;if(e.target.closest('.sales-export')){e.preventDefault();e.stopImmediatePropagation();exportSales()}else if(e.target.closest('[data-story-sale]')){e.preventDefault();e.stopImmediatePropagation();newSaleWizard()}else{const s=e.target.closest('.sale-status');if(s){const row=s.closest('[data-sale-status]'),select=document.querySelector('[data-sales-status]');if(select){select.value=row.dataset.saleStatus;select.dispatchEvent(new Event('change'));toast('Filtre appliqué · '+s.textContent.trim())}}}},true);
const previousBind=bind;bind=function(){previousBind();if(current==='sales'){const search=document.querySelector('[data-sales-search]'),service=document.querySelector('[data-sales-service]'),state=document.querySelector('[data-sales-status]');const filter=()=>{let q=(search?.value||'').toLowerCase(),n=0;document.querySelectorAll('[data-sale-kind]').forEach(row=>{let show=(!q||row.textContent.toLowerCase().includes(q))&&(!service||service.value==='all'||row.dataset.saleKind===service.value)&&(!state||state.value==='all'||row.dataset.saleStatus===state.value);row.hidden=!show;if(show)n++});const count=document.querySelector('[data-sales-count]');if(count)count.textContent=n};[search,service,state].forEach(x=>x&&(x.oninput=filter,x.onchange=filter));const clear=document.querySelector('[data-sales-clear]');if(clear)clear.onclick=()=>{search.value='';service.value='all';state.value='all';filter()}}};
const requestedDoc=new URLSearchParams(location.search).get('document');if(requestedDoc&&docs[requestedDoc])setTimeout(()=>openDocs(requestedDoc),900);
})();
