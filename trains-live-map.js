(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const STATIONS=[
 {id:'OWE',name:'Owendo',km:0,quais:4,hub:true,waiting:38,boarded:0},
 {id:'NTM',name:'N’Toum',km:35,quais:2,hub:false,waiting:14,boarded:0},
 {id:'NDJ',name:'Ndjolé',km:158,quais:2,hub:false,waiting:22,boarded:0},
 {id:'LOP',name:'Lopé',km:260,quais:2,hub:false,waiting:9,boarded:0},
 {id:'BOU',name:'Booué',km:357,quais:3,hub:false,waiting:31,boarded:0},
 {id:'LAS',name:'Lastourville',km:460,quais:2,hub:false,waiting:12,boarded:0},
 {id:'MOA',name:'Moanda',km:560,quais:3,hub:false,waiting:26,boarded:0},
 {id:'FCV',name:'Franceville',km:648,quais:4,hub:true,waiting:45,boarded:0}
];
const stById=id=>STATIONS.find(s=>s.id===id);

const BRANCHES=[
 {km:14,side:1,len:78,label:'PORT / DÉPÔT OWENDO'},
 {km:357,side:1,len:64,label:'ATELIER MAINTENANCE'},
 {km:560,side:-1,len:82,label:'EMBRANCHEMENT COMILOG'},
 {km:620,side:1,len:60,label:'TERMINAL FRET'}
];

const TRAINS=[
 {id:'EXP-620',type:'exp',label:'Express voyageurs',livret:'LH-EXP-S2-2026',composition:'8 voitures · 450 pl.',from:'OWE',to:'FCV',speedRef:72,cap:450,occ:382,delay:6,pax:true,
  voitures:[['V1','VIP','CAR-2041',36,0,9,4,0],['V2','1re classe','CAR-2042',48,0,12,4,3],['V3','1re classe','CAR-2043',48,0,12,4,0],['V4','2e classe','CAR-2044',72,10,18,4,3],['V5','2e classe','CAR-2045',72,10,18,4,0],['V6','2e classe','CAR-2046',72,10,18,4,1],['B1','Bagages','CAR-2047',0,0,0,0,0],['S1','Service','CAR-2048',0,0,0,0,0]]},
 {id:'OMN-218',type:'omn',label:'Omnibus voyageurs',livret:'LH-OMN-S1-2026',composition:'6 voitures · 390 pl.',from:'FCV',to:'OWE',speedRef:45,cap:390,occ:301,delay:0,pax:true,
  voitures:[['V1','1re classe','CAR-3011',40,0,10,4,0],['V2','2e classe','CAR-3012',64,20,16,4,2],['V3','2e classe','CAR-3013',64,20,16,4,0],['V4','2e classe','CAR-3014',64,20,16,4,1],['V5','2e classe','CAR-3015',64,20,16,4,0],['B1','Bagages','CAR-3016',0,0,0,0,0]]},
 {id:'SPE-551',type:'exp',label:'Spécial voyageurs',livret:'LH-SPE-S3-2026',composition:'4 voitures · 210 pl.',from:'OWE',to:'NTM',speedRef:55,cap:210,occ:138,delay:0,pax:true,
  voitures:[['V1','1re classe','CAR-4001',40,0,10,4,0],['V2','2e classe','CAR-4002',60,10,15,4,0],['V3','2e classe','CAR-4003',60,10,15,4,1],['V4','Service','CAR-4004',0,0,0,0,0]]},
 {id:'FRET-332',type:'fret',label:'Fret général',livret:'—',composition:'28 wagons',from:'OWE',to:'FCV',speedRef:48,cap:1200,occ:840,delay:3,pax:false,
  wagons:[['Wagons trémie','24','Vrac / minerai'],['Wagons plats','4','Conteneurs']]},
 {id:'MIN-641',type:'fret',label:'Minerai · manganèse',livret:'—',composition:'40 wagons',from:'MOA',to:'OWE',speedRef:34,cap:3400,occ:3150,delay:9,pax:false,
  wagons:[['Wagons trémie manganèse','38','Comilog'],['Wagons frein','2','Sécurité convoi']]},
 {id:'MAINT-477',type:'maint',label:'Maintenance voie',livret:'—',composition:'Rame technique',from:'BOU',to:'LAS',speedRef:20,cap:12,occ:8,delay:0,pax:false,
  wagons:[['Voiture technique','1','Équipe 8 agents'],['Wagon outillage','1','Matériel de voie']]}
];

const MAP_X0=70,MAP_X1=1130,MAP_Y=170,TOTAL_KM=648,BLOCK_GAP=20,LANE=9;
const SIGNAL_KMS=(()=>{const out=[];for(let km=25;km<TOTAL_KM-15;km+=52)out.push(km);return out})();
const SIGNALS=SIGNAL_KMS.map(km=>({km,state:'green'}));

function init(){
 TRAINS.forEach(t=>{
  const a=stById(t.from),b=stById(t.to);
  t.min=Math.min(a.km,b.km);t.max=Math.max(a.km,b.km);
  t.kmPos=a.km;t.dir=a.km<=b.km?1:-1;
  t.status='roulant';t.dwell=0;t.lastStation=t.from
 })
}
init();

function fmtNum(n){return new Intl.NumberFormat('fr-FR').format(Math.round(n))}
function nextStation(t){
 const forward=STATIONS.filter(s=>t.dir>0?s.km>t.kmPos+0.01:s.km<t.kmPos-0.01).sort((a,b)=>t.dir>0?a.km-b.km:b.km-a.km);
 return forward[0]||stById(t.dir>0?(t.max===stById(t.to).km?t.to:t.from):(t.min===stById(t.to).km?t.to:t.from))
}
function statusLabel(s){return{roulant:'En circulation',arret:'À quai',attente_signal:'Attente signal',incident:'Incident'}[s]||s}
function typeLabel(ty){return{exp:'EXPRESS',omn:'OMNIBUS',fret:'FRET',maint:'MAINTENANCE'}[ty]||ty}

let selected='EXP-620';
let expanded=null;
let tickHandle=null;

/* ---------- simulation ---------- */
function tick(){
 TRAINS.forEach(t=>{
  if(t.status==='arret'){t.dwell--;if(t.dwell<=0)t.status='roulant'}
 });
 TRAINS.forEach(t=>{
  if(t.status==='arret')return;
  let blocked=false;
  TRAINS.forEach(o=>{
   if(o===t||o.dir!==t.dir)return;
   const ahead=t.dir>0?o.kmPos-t.kmPos:t.kmPos-o.kmPos;
   if(ahead>0.4&&ahead<BLOCK_GAP)blocked=true
  });
  if(blocked){t.status='attente_signal';return}
  if(t.status==='attente_signal')t.status='roulant';
  const kmPerTick=(t.speedRef/72)*13;
  const prev=t.kmPos;
  let next=t.kmPos+t.dir*kmPerTick;
  if(next>=t.max){next=t.max;t.dir=-1}
  else if(next<=t.min){next=t.min;t.dir=1}
  t.kmPos=next;
  STATIONS.forEach(s=>{
   if(s.km<t.min-0.01||s.km>t.max+0.01)return;
   const crossed=(prev-s.km)*(t.kmPos-s.km)<=0;
   if(crossed&&s.id!==t.lastStation){
    t.kmPos=s.km;t.lastStation=s.id;t.status='arret';t.dwell=3+Math.floor(Math.random()*3);
    if(t.pax){
     const board=Math.min(s.waiting,8+Math.floor(Math.random()*38));
     s.waiting=Math.max(0,s.waiting-board);s.boarded+=board;t.occ=Math.min(t.cap,t.occ+board);
     const alight=Math.round(t.occ*(0.04+Math.random()*.08));t.occ=Math.max(0,t.occ-alight);
     s.waiting+=4+Math.floor(Math.random()*18)
    }
   }
  })
 });
 SIGNALS.forEach(sig=>{sig.state='green'});
 TRAINS.forEach(t=>{
  if(t.status==='attente_signal'){
   let nearest=null,nd=Infinity;
   SIGNALS.forEach(sig=>{const ahead=t.dir>0?sig.km-t.kmPos:t.kmPos-sig.km;if(ahead>=-4&&ahead<nd){nd=ahead;nearest=sig}});
   if(nearest)nearest.state='red'
  }else if(t.status==='roulant'){
   SIGNALS.forEach(sig=>{const ahead=t.dir>0?sig.km-t.kmPos:t.kmPos-sig.km;if(ahead>0&&ahead<46&&sig.state!=='red')sig.state='amber'})
  }
 });
 paint()
}

/* ---------- curved geometry (uses the real DOM path, filled in after mount) ---------- */
const geo={trunk:null,len:0};
function pointAtKm(km){
 if(!geo.trunk)return{x:MAP_X0+(km/TOTAL_KM)*(MAP_X1-MAP_X0),y:MAP_Y};
 return geo.trunk.getPointAtLength(Math.max(0,Math.min(1,km/TOTAL_KM))*geo.len)
}
function tangentAt(km){
 if(!geo.trunk)return 0;
 const f=Math.max(0,Math.min(1,km/TOTAL_KM))*geo.len;
 const p1=geo.trunk.getPointAtLength(Math.max(0,f-3)),p2=geo.trunk.getPointAtLength(Math.min(geo.len,f+3));
 return Math.atan2(p2.y-p1.y,p2.x-p1.x)
}
function laneOffset(km,side){
 const a=tangentAt(km);
 return{x:-Math.sin(a)*side,y:Math.cos(a)*side}
}
function trainPoint(t,i){
 const p=pointAtKm(t.kmPos);
 const off=laneOffset(t.kmPos,(t.dir>0?1:-1)*LANE+((i%3)-1)*3);
 return{x:p.x+off.x,y:p.y+off.y,angle:tangentAt(t.kmPos)*180/Math.PI}
}

/* ---------- map svg shell (paths only; stations/signals/trains mounted after DOM insert) ---------- */
function trunkPath(){
 return `M${MAP_X0} ${MAP_Y-8} C 260 ${MAP_Y-55}, 340 ${MAP_Y+58}, 470 ${MAP_Y+10} S 700 ${MAP_Y-52}, 780 ${MAP_Y+6} S 980 ${MAP_Y+46}, ${MAP_X1} ${MAP_Y-14}`
}
function svgShell(){
 return `<svg class="trn-map-svg" viewBox="0 0 1200 340" xmlns="http://www.w3.org/2000/svg">
  <path class="trn-track-bed" d="${trunkPath()}"></path>
  <path id="trnTrunk" class="trn-track" d="${trunkPath()}"></path>
  <g id="trnBranches"></g>
  <g id="trnDynamic"></g>
 </svg>`
}
function mountDynamic(){
 const svg=document.querySelector('.trn-map-svg');
 if(!svg)return;
 geo.trunk=document.getElementById('trnTrunk');
 if(!geo.trunk)return;
 geo.len=geo.trunk.getTotalLength();

 const branchesHtml=BRANCHES.map(b=>{
  const p=pointAtKm(b.km),a=tangentAt(b.km);
  const nx=-Math.sin(a),ny=Math.cos(a);
  const midX=p.x+nx*b.side*b.len*.55+Math.cos(a)*b.len*.35, midY=p.y+ny*b.side*b.len*.55+Math.sin(a)*b.len*.35;
  const endX=p.x+nx*b.side*b.len+Math.cos(a)*b.len*.55, endY=p.y+ny*b.side*b.len+Math.sin(a)*b.len*.55;
  const d=`M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  return `<g><path class="trn-branch-bed" d="${d}"></path><path class="trn-branch" d="${d}"></path><circle class="trn-branch-end" cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="4"></circle><text class="trn-branch-label" x="${endX.toFixed(1)}" y="${(endY+(b.side>0?15:-9)).toFixed(1)}" text-anchor="middle">${b.label}</text></g>`
 }).join('');
 document.getElementById('trnBranches').innerHTML=branchesHtml;

 const stationsHtml=STATIONS.map(s=>{
  const p=pointAtKm(s.km),above=s.hub;
  return `<g class="trn-station" data-st="${s.id}">
   <g class="trn-house" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">
    <rect class="body${s.hub?' hub':''}" x="-9" y="-3" width="18" height="12" rx="1.5"></rect>
    <path class="roof" d="M-11 -3 L0 -13 L11 -3 Z"></path>
    <rect class="door" x="-2.5" y="2.5" width="5" height="6.5"></rect>
   </g>
   <text class="trn-station-label" x="${p.x.toFixed(1)}" y="${(above?p.y-42:p.y+38).toFixed(1)}" text-anchor="middle">${s.name}</text>
   <text class="trn-station-sub" x="${p.x.toFixed(1)}" y="${(above?p.y-30:p.y+50).toFixed(1)}" text-anchor="middle">PK ${s.km} · ${s.quais} voies</text>
   <g class="trn-station-badge" transform="translate(${(p.x-30).toFixed(1)},${(above?p.y-24:p.y+16).toFixed(1)})" data-badge="${s.id}">
    <rect x="0" y="0" width="60" height="18" rx="6"></rect>
    <text x="8" y="12"><tspan class="w" data-w="${s.id}">${s.waiting}</tspan></text>
    <text x="34" y="12"><tspan class="b" data-b="${s.id}">${s.boarded}</tspan></text>
   </g>
  </g>`
 }).join('');

 const signalsHtml=SIGNALS.map((sig,i)=>{
  const p=pointAtKm(sig.km),a=tangentAt(sig.km),side=i%2===0?-1:1;
  const nx=-Math.sin(a),ny=Math.cos(a),poleLen=20;
  const tipX=p.x+nx*side*poleLen, tipY=p.y+ny*side*poleLen;
  return `<g class="trn-signal" data-sig="${i}" transform="translate(${tipX.toFixed(1)},${tipY.toFixed(1)})">
   <line class="pole" x1="0" y1="0" x2="${(p.x-tipX).toFixed(1)}" y2="${(p.y-tipY).toFixed(1)}"></line>
   <rect class="head" x="-6" y="-11" width="12" height="22" rx="3"></rect>
   <circle class="lamp red" cx="0" cy="-6" r="2.6"></circle>
   <circle class="lamp amber" cx="0" cy="0" r="2.6"></circle>
   <circle class="lamp green" cx="0" cy="6" r="2.6"></circle>
  </g>`
 }).join('');

 const trainsHtml=TRAINS.map((t,i)=>{
  const p=trainPoint(t,i);
  return `<g class="trn-train ${t.type}" data-train="${t.id}" style="transform:translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)">
   <circle class="halo" r="11"></circle>
   <g transform="rotate(${p.angle.toFixed(1)})"><rect class="body" x="-16" y="-8" width="32" height="16" rx="4"></rect><text y="4">${t.id.slice(0,3)}</text></g>
   <text class="tag" y="-15">${t.id}</text>
   <text class="dwell" y="21" text-anchor="middle" font-size="8" fill="#c9860f">⏸ à quai</text>
   <text class="waitsig" y="21" text-anchor="middle" font-size="8" fill="#e34850">⛔ signal</text>
  </g>`
 }).join('');

 document.getElementById('trnDynamic').innerHTML=stationsHtml+signalsHtml+trainsHtml;
 ref.trains={};ref.signals=[];
 document.querySelectorAll('.trn-train').forEach(g=>{ref.trains[g.dataset.train]={el:g}});
 document.querySelectorAll('.trn-signal').forEach((g,i)=>{ref.signals[i]=g});
 document.querySelectorAll('.trn-train').forEach(g=>g.onclick=()=>selectTrain(g.dataset.train));
}

/* ---------- KPIs ---------- */
function kpisHtml(){
 const paxTrains=TRAINS.filter(t=>t.pax);
 const aBord=paxTrains.reduce((a,t)=>a+t.occ,0);
 const enAttente=STATIONS.reduce((a,s)=>a+s.waiting,0);
 const enRetard=TRAINS.filter(t=>t.delay>5).length;
 const ponctualite=Math.round((TRAINS.length-enRetard)/TRAINS.length*100);
 const attente=TRAINS.filter(t=>t.status==='attente_signal').length;
 const fretMaint=TRAINS.filter(t=>!t.pax).length;
 return [
  ['Trains actifs',TRAINS.length,`${TRAINS.filter(t=>t.status==='roulant').length} en circulation`,''],
  ['Ponctualité',ponctualite+' %',`${enRetard} en retard`,ponctualite<85?'warn':'good'],
  ['Voyageurs à bord',fmtNum(aBord),`sur ${fmtNum(paxTrains.reduce((a,t)=>a+t.cap,0))} places`,''],
  ['Voyageurs en attente',fmtNum(enAttente),'toutes gares confondues',enAttente>150?'warn':''],
  ['Fret & maintenance',fretMaint,'circulations actives',''],
  ['Signaux fermés',attente,attente?'train à l’arrêt devant un canton':'circulation fluide',attente?'bad':'good']
 ].map(k=>`<div class="trn-kpi ${k[3]}"><small>${k[0]}</small><b>${k[1]}</b><span>${k[2]}</span></div>`).join('')
}

/* ---------- circulations table ---------- */
function carCardHtml(t,v){
 const[code,classe,serie,assises,debout,rangees,colonnes,bloquees]=v;
 if(!assises&&!debout)return `<div class="trn-car"><b>${code} · ${classe}</b><small>${serie}</small><div class="meta"><span>Voiture technique</span></div></div>`;
 return `<div class="trn-car"><b>${code} · ${classe}</b><small>${serie} · ${rangees}×${colonnes}</small><div class="meta"><span>${assises} assises</span><span>${debout} debout</span></div><button data-block-car="${t.id}:${code}" class="${bloquees?'blocked':''}">${bloquees?bloquees+' place(s) bloquée(s) · débloquer':'Bloquer une place'}</button></div>`
}
function expandHtml(t){
 if(t.pax){
  return `<div class="trn-expand">
   <div class="trn-expand-head"><b>Composition détaillée · ${t.composition}</b><span>Livret horaire ${t.livret} · type ${typeLabel(t.type)}</span></div>
   <div class="trn-consist">${t.voitures.map(v=>carCardHtml(t,v)).join('')}</div>
  </div>`
 }
 return `<div class="trn-expand">
  <div class="trn-expand-head"><b>Composition détaillée · ${t.composition}</b><span>Type ${typeLabel(t.type)}</span></div>
  <div class="trn-consist">${t.wagons.map(w=>`<div class="trn-car"><b>${w[0]}</b><small>${w[2]}</small><div class="meta"><span>${w[1]} unités</span></div></div>`).join('')}</div>
 </div>`
}
function tableHtml(){
 const rows=TRAINS.map(t=>{
  const ns=nextStation(t);
  const pct=t.pax?Math.round(t.occ/t.cap*100):null;
  return `<tr class="${t.id===selected?'active':''}" data-row="${t.id}">
   <td><div class="trn-cell-id"><i class="${t.type}"></i><div><b>${t.id}</b><small>${t.label}</small></div></div></td>
   <td><span class="trn-type-badge ${t.type}">${typeLabel(t.type)}</span></td>
   <td>${t.composition}</td>
   <td class="trn-route-cell">${stById(t.from).name} → ${stById(t.to).name}<small>Livret ${t.livret}</small></td>
   <td>${ns?ns.name:'—'}<small style="color:#8aa0a6;font-size:9.5px">PK ${Math.round(t.kmPos)}</small></td>
   <td><span class="trn-status-badge ${t.status}">${statusLabel(t.status)}</span></td>
   <td class="trn-charge-cell">${t.pax?`${fmtNum(t.occ)} / ${fmtNum(t.cap)}<div class="trn-charge-bar"><i style="width:${pct}%"></i></div>`:`${fmtNum(t.occ)} t`}</td>
   <td class="trn-ecart ${t.delay>0?'late':'ontime'}">${t.delay>0?'+'+t.delay+' min':'à l’heure'}</td>
   <td><div class="trn-row-actions"><button data-expand="${t.id}">${I('layout-list')} Composition</button><button data-locate="${t.id}">${I('map-pin')} Localiser</button></div></td>
  </tr>${expanded===t.id?`<tr class="trn-expand-row"><td colspan="9">${expandHtml(t)}</td></tr>`:''}`
 }).join('');
 return `<table class="trn-table"><thead><tr>
  <th>Train</th><th>Type</th><th>Composition</th><th>Trajet</th><th>Position</th><th>Statut</th><th>Charge</th><th>Écart</th><th>Actions</th>
 </tr></thead><tbody>${rows}</tbody></table>`
}

function flowHtml(){
 return STATIONS.map(s=>`<span class="trn-flow-chip">${I('map-pin')}<b>${s.name}</b><span class="w">${s.waiting} attente</span> · <span class="b">${s.boarded} embarqués</span></span>`).join('')
}

function footHtml(){
 const reds=SIGNALS.filter(s=>s.state==='red').length;
 const ambers=SIGNALS.filter(s=>s.state==='amber').length;
 const arret=TRAINS.filter(t=>t.status==='arret').length;
 const items=[
  [I('shield-check'),`${SIGNALS.length} signaux tricolores · protection automatique des cantons active`,''],
  [I('circle-pause'),`${arret} train${arret>1?'s':''} à quai en gare`,''],
  reds?[I('octagon-alert'),`${reds} train${reds>1?'s':''} à l’arrêt au signal rouge`,'bad']:null,
  ambers?[I('triangle-alert'),`${ambers} signal${ambers>1?'aux':''} d’approche en vigilance`,'']:null
 ].filter(Boolean);
 return items.map(x=>`<span class="trn-foot-pill ${x[2]}">${x[0]} ${x[1]}</span>`).join('')
}

function render(){
 return `<div class="trn-page">
 <div class="trn-head">
  <div><h1>Trains &amp; circulations</h1><p>Réseau Transgabonais en direct — voies, embranchements, signalisation tricolore et charge des circulations.</p></div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
   <span class="trn-live"><i></i> Réseau connecté</span>
   <div class="trn-actions"><button data-trn-refresh>${I('refresh-cw')} Actualiser</button><button data-trn-new>${I('plus')} Nouveau train</button></div>
  </div>
 </div>
 <div class="trn-kpis" id="trnKpis">${kpisHtml()}</div>

 <div class="trn-section">
  <div class="trn-table-card">
   <div class="trn-table-head">
    <div><h2>Circulations en temps réel</h2><p>Composition, voitures, classes, places et disponibilité — conforme au périmètre CDC §7.3</p></div>
    <div class="trn-table-tools"><input placeholder="Rechercher un train…" id="trnSearch"><select><option>Tous types</option><option>EXPRESS</option><option>OMNIBUS</option><option>SPÉCIAL</option><option>FRET</option><option>MAINTENANCE</option></select></div>
   </div>
   <div class="trn-table-wrap" id="trnTableWrap">${tableHtml()}</div>
  </div>
 </div>

 <div class="trn-section">
  <div class="trn-map-card">
   <div class="trn-map-head">
    <div><h2>Réseau Transgabonais · Owendo ↔ Franceville</h2><p>648 km · 8 gares · embranchements fret/mine/maintenance · 12 signaux tricolores</p></div>
    <div class="trn-legend">
     <span><i class="exp"></i> Voyageurs</span><span><i class="omn"></i> Omnibus</span><span><i class="fret"></i> Fret</span><span><i class="maint"></i> Maintenance</span>
     <span><i class="sig-g"></i> Voie libre</span><span><i class="sig-r"></i> Canton fermé</span>
    </div>
   </div>
   <div class="trn-map-wrap" id="trnMapWrap">${svgShell()}</div>
   <div class="trn-map-foot" id="trnFoot">${footHtml()}</div>
  </div>
 </div>

 <div class="trn-section">
  <div class="trn-map-card">
   <div class="trn-map-head"><div><h2>${I('users-round')} Flux gares · temps réel</h2><p>Voyageurs en attente et embarqués depuis l’ouverture</p></div></div>
   <div class="trn-map-foot" id="trnFlow" style="border-top:none">${flowHtml()}</div>
  </div>
 </div>
 </div>`
}

/* ---------- interaction ---------- */
function selectTrain(id){
 selected=id;
 document.querySelectorAll('.trn-train').forEach(x=>x.classList.toggle('selected',x.dataset.train===id));
 document.querySelectorAll('.trn-table tbody tr[data-row]').forEach(x=>x.classList.toggle('active',x.dataset.row===id));
}
function toggleExpand(id){
 expanded=expanded===id?null:id;
 selectTrain(id);
 const wrap=document.getElementById('trnTableWrap');
 if(wrap){wrap.innerHTML=tableHtml();wireTable()}
 if(window.lucide)lucide.createIcons()
}
function locateTrain(id){
 selectTrain(id);
 document.getElementById('trnMapWrap')?.scrollIntoView({behavior:'smooth',block:'center'});
 if(typeof toast==='function')toast(`${id} localisé sur la carte`)
}

function paint(){
 const root=document.querySelector('.trn-page');
 if(!root||!geo.trunk)return;
 TRAINS.forEach((t,i)=>{
  const g=ref.trains&&ref.trains[t.id];
  if(!g)return;
  const p=trainPoint(t,i);
  g.el.style.transform=`translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
  const inner=g.el.querySelector('g');if(inner)inner.setAttribute('transform',`rotate(${p.angle.toFixed(1)})`);
  g.el.classList.toggle('stopped',t.status==='arret');
  g.el.classList.toggle('waiting',t.status==='attente_signal')
 });
 SIGNALS.forEach((sig,i)=>{
  const el=ref.signals&&ref.signals[i];
  if(!el)return;
  el.classList.remove('red','amber');
  if(sig.state==='red')el.classList.add('red');else if(sig.state==='amber')el.classList.add('amber')
 });
 STATIONS.forEach(s=>{
  const w=root.querySelector(`[data-w="${s.id}"]`),b=root.querySelector(`[data-b="${s.id}"]`);
  if(w)w.textContent=s.waiting;if(b)b.textContent=s.boarded
 });
 const kpis=document.getElementById('trnKpis');if(kpis)kpis.innerHTML=kpisHtml();
 const foot=document.getElementById('trnFoot');if(foot)foot.innerHTML=footHtml();
 const flow=document.getElementById('trnFlow');if(flow)flow.innerHTML=flowHtml();
 const wrap=document.getElementById('trnTableWrap');if(wrap){wrap.innerHTML=tableHtml();wireTable()}
 if(window.lucide)lucide.createIcons()
}

function wireTable(){
 document.querySelectorAll('.trn-table tbody tr[data-row]').forEach(tr=>tr.onclick=e=>{if(e.target.closest('button'))return;selectTrain(tr.dataset.row)});
 document.querySelectorAll('[data-expand]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggleExpand(b.dataset.expand)});
 document.querySelectorAll('[data-locate]').forEach(b=>b.onclick=e=>{e.stopPropagation();locateTrain(b.dataset.locate)});
 document.querySelectorAll('[data-block-car]').forEach(b=>b.onclick=e=>{
  e.stopPropagation();
  const[tid,code]=b.dataset.blockCar.split(':');
  const t=TRAINS.find(x=>x.id===tid);
  const v=t&&t.voitures&&t.voitures.find(x=>x[0]===code);
  if(!v)return;
  v[7]=v[7]?0:1;
  if(typeof toast==='function')toast(v[7]?`Place bloquée · ${code} · motif consigné`:`Place débloquée · ${code}`);
  const wrap=document.getElementById('trnTableWrap');if(wrap){wrap.innerHTML=tableHtml();wireTable()}
  if(window.lucide)lucide.createIcons()
 })
}

function wire(){
 if(typeof current!=='undefined'&&current!=='trains')return;
 const root=document.querySelector('.trn-page');
 if(!root)return;
 if(!root.__trnStop){root.addEventListener('click',e=>e.stopPropagation());root.__trnStop=true}
 mountDynamic();
 wireTable();
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-trn-refresh]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Réseau actualisé')});
 root.querySelectorAll('[data-trn-new]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Assistant de création de circulation · démonstration')});
 selectTrain(selected);
 if(tickHandle)clearInterval(tickHandle);
 tickHandle=setInterval(tick,1500);
}

const ref={};
const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.trains=render;
 if(typeof bind==='function'&&!bind.__trnWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__trnWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="trains"].active')||document.querySelector('.trn-page');
 if(requested==='trains'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
