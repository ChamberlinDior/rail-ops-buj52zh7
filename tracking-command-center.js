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

const TRAINS=[
 {id:'EXP-620',type:'exp',label:'Express voyageurs',from:'OWE',to:'FCV',speedRef:72,cap:450,occ:382,delay:6,pax:true},
 {id:'OMN-624',type:'omn',label:'Omnibus voyageurs',from:'FCV',to:'OWE',speedRef:45,cap:390,occ:301,delay:0,pax:true},
 {id:'SPE-551',type:'exp',label:'Spécial voyageurs',from:'OWE',to:'NTM',speedRef:55,cap:210,occ:138,delay:0,pax:true},
 {id:'FRET-332',type:'fret',label:'Fret général',from:'OWE',to:'FCV',speedRef:48,cap:1200,occ:840,delay:3,pax:false},
 {id:'MIN-641',type:'fret',label:'Minerai · manganèse',from:'MOA',to:'OWE',speedRef:34,cap:3400,occ:3150,delay:9,pax:false},
 {id:'MAINT-017',type:'maint',label:'Maintenance voie',from:'BOU',to:'LAS',speedRef:20,cap:12,occ:8,delay:0,pax:false}
];

const MAP_X0=70,MAP_X1=1130,MAP_Y=155,TOTAL_KM=648,TRACK_Y1=MAP_Y-14,TRACK_Y2=MAP_Y+14;
const CROSSOVERS=[140,320,500];
function laneYFor(t,i){return(t.dir>0?TRACK_Y1:TRACK_Y2)+[-6,0,6][i%3]}
const kmToX=km=>MAP_X0+(km/TOTAL_KM)*(MAP_X1-MAP_X0);
const SIGNALS=(()=>{const out=[];for(let km=25;km<TOTAL_KM-15;km+=52)out.push({km,state:'green'});return out})();

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
function statusLabel(s){return{roulant:'En circulation',arret:'À quai',ralenti:'Ralenti',incident:'Incident'}[s]||s}
function typeLabel(ty){return{exp:'Voyageurs',omn:'Voyageurs',fret:'Fret',maint:'Maintenance'}[ty]||ty}

let selected='EXP-620';
let tickHandle=null;
let rosterFilter='all';
function csvDownload(name,head,rows){
 const csv='﻿'+[head,...rows].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(a.href),500)
}
function locatePulse(sel){
 const el=document.querySelector(sel);
 if(!el)return;
 el.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
 el.classList.remove('pulse');void el.getBoundingClientRect();el.classList.add('pulse');
 setTimeout(()=>el.classList.remove('pulse'),2900)
}

function tick(){
 TRAINS.forEach(t=>{
  if(t.status==='arret'){t.dwell--;if(t.dwell<=0){t.status='roulant'}return}
  const ralenti=t.status==='ralenti';
  const kmPerTick=(t.speedRef/72)*14*(ralenti?.35:1);
  const prev=t.kmPos;
  let next=t.kmPos+t.dir*kmPerTick;
  if(next>=t.max){next=t.max;t.dir=-1}
  else if(next<=t.min){next=t.min;t.dir=1}
  t.kmPos=next;
  if(ralenti&&Math.random()>.55){t.status='roulant';t.delay+=1}
  else if(!ralenti&&Math.random()>.985){t.status='ralenti'}
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
  if(t.status!=='roulant')return;
  SIGNALS.forEach(sig=>{
   const ahead=t.dir>0?sig.km-t.kmPos:t.kmPos-sig.km;
   if(ahead>0&&ahead<16)sig.state='red';
   else if(ahead>0&&ahead<46&&sig.state!=='red')sig.state='amber'
  })
 });
 paint()
}

const ref={};
function svgMap(){
 const stationsHtml=STATIONS.map(s=>{
  const x=kmToX(s.km),above=s.hub;
  return `<g class="trk-station" data-st="${s.id}">
   <line x1="${x}" y1="${TRACK_Y1}" x2="${x}" y2="${TRACK_Y2}" stroke="#c7d8d2" stroke-width="2"></line>
   <circle class="trk-station-dot${s.hub?' hub':''}" cx="${x}" cy="${MAP_Y}" r="${s.hub?7:5}"></circle>
   <text class="trk-station-label" x="${x}" y="${above?MAP_Y-72:MAP_Y+42}" text-anchor="middle">${s.name}</text>
   <text class="trk-station-sub" x="${x}" y="${above?MAP_Y-60:MAP_Y+54}" text-anchor="middle">PK ${s.km} · ${s.quais} voies</text>
   <g class="trk-station-badge" transform="translate(${x-30},${above?MAP_Y-52:MAP_Y+8})" data-badge="${s.id}">
    <rect x="0" y="0" width="60" height="18" rx="6"></rect>
    <text x="8" y="12"><tspan class="w" data-w="${s.id}">${s.waiting}</tspan></text>
    <text x="34" y="12"><tspan class="b" data-b="${s.id}">${s.boarded}</tspan></text>
   </g>
  </g>`
 }).join('');
 const crossoverHtml=CROSSOVERS.map(km=>{const x=kmToX(km);return `<path class="trk-crossover" d="M${x} ${TRACK_Y1} C ${x+22} ${TRACK_Y1} ${x+10} ${TRACK_Y2} ${x+32} ${TRACK_Y2}"></path>`}).join('');
 const signalsHtml=SIGNALS.map((sig,i)=>{const x=kmToX(sig.km),ty=i%2?TRACK_Y2:TRACK_Y1,sy=ty+(i%2?24:-24);return `<g class="trk-signal" data-sig="${i}" transform="translate(${x},${sy})"><line class="pole" x1="0" y1="0" x2="0" y2="${i%2?-16:16}"></line><circle r="5"></circle></g>`}).join('');
 const trainsHtml=TRAINS.map((t,i)=>{
  const y=laneYFor(t,i);
  return `<g class="trk-train ${t.type}" data-train="${t.id}" style="transform:translate(${kmToX(t.kmPos)}px,${y}px)">
   <circle class="halo" r="11"></circle>
   <rect class="body" x="-16" y="-8" width="32" height="16" rx="4"></rect>
   <text y="4">${t.id.slice(0,3)}</text>
   <text class="tag" y="-13">${t.id}</text>
   <text class="dwell" y="20" text-anchor="middle" font-size="8" fill="#c9860f">⏸ à quai</text>
  </g>`
 }).join('');
 return `<svg class="trk-map-svg" viewBox="0 0 1200 280" xmlns="http://www.w3.org/2000/svg">
  <path class="trk-track-bed" d="M${MAP_X0} ${TRACK_Y1} H ${MAP_X1}"></path>
  <path class="trk-track-bed" d="M${MAP_X0} ${TRACK_Y2} H ${MAP_X1}"></path>
  <path class="trk-track" d="M${MAP_X0} ${TRACK_Y1} H ${MAP_X1}"></path>
  <path class="trk-track" d="M${MAP_X0} ${TRACK_Y2} H ${MAP_X1}"></path>
  ${crossoverHtml}
  <text class="trk-line-label" x="${MAP_X0-4}" y="${TRACK_Y1-8}" text-anchor="start">VOIE 1</text>
  <text class="trk-line-label" x="${MAP_X0-4}" y="${TRACK_Y2+16}" text-anchor="start">VOIE 2</text>
  <g class="trk-terminal"><rect x="${MAP_X0-14}" y="${MAP_Y+56}" width="118" height="20" rx="5"></rect><text x="${MAP_X0-14+59}" y="${MAP_Y+69}">DÉPÔT OWENDO</text></g>
  <g class="trk-terminal"><rect x="${MAP_X1-104}" y="${MAP_Y+56}" width="118" height="20" rx="5"></rect><text x="${MAP_X1-104+59}" y="${MAP_Y+69}">TERMINAL FRANCEVILLE</text></g>
  ${signalsHtml}
  ${stationsHtml}
  ${trainsHtml}
 </svg>`
}

function kpisHtml(){
 const paxTrains=TRAINS.filter(t=>t.pax);
 const aBord=paxTrains.reduce((a,t)=>a+t.occ,0);
 const enAttente=STATIONS.reduce((a,s)=>a+s.waiting,0);
 const enRetard=TRAINS.filter(t=>t.delay>5).length;
 const ponctualite=Math.round((TRAINS.length-enRetard)/TRAINS.length*100);
 const incidents=TRAINS.filter(t=>t.status==='ralenti'||t.status==='incident').length;
 const fretMaint=TRAINS.filter(t=>!t.pax).length;
 return [
  ['Trains actifs',TRAINS.length,`${TRAINS.filter(t=>t.status==='roulant').length} en circulation`,''],
  ['Ponctualité',ponctualite+' %',`${enRetard} en retard`,ponctualite<85?'warn':'good'],
  ['Voyageurs à bord',fmtNum(aBord),`sur ${fmtNum(paxTrains.reduce((a,t)=>a+t.cap,0))} places`,''],
  ['Voyageurs en attente',fmtNum(enAttente),'toutes gares confondues',enAttente>150?'warn':''],
  ['Fret & maintenance',fretMaint,'circulations actives',''],
  ['Incidents actifs',incidents,incidents?'ralentissement en cours':'réseau nominal',incidents?'bad':'good']
 ].map(k=>`<div class="trk-kpi ${k[3]}"><small>${k[0]}</small><b>${k[1]}</b><span>${k[2]}</span></div>`).join('')
}

const ROSTER_FILTERS=[['all','Tous'],['pax','Voyageurs'],['fret','Fret'],['maint','Maintenance']];
let tableSearch='';
function rosterFilterBarHtml(){
 return `<div class="trk-roster-filters">${ROSTER_FILTERS.map(f=>`<button class="${rosterFilter===f[0]?'active':''}" data-roster-filter="${f[0]}">${f[1]}</button>`).join('')}</div>`
}
function flowStripHtml(){
 return STATIONS.map(s=>{
  const total=s.waiting+s.boarded,pct=total?Math.round(s.boarded/total*100):0;
  return `<button class="trk-flow-chip" data-flow-locate="${s.id}" title="Localiser ${esc(s.name)} sur la carte">
   <i class="${s.hub?'hub':''}">${I(s.hub?'building-2':'map-pin')}</i>
   <span class="trk-flow-chip-id"><b>${s.name}</b><small>PK ${s.km}</small></span>
   <span class="trk-flow-chip-num w"><b>${s.waiting}</b><small>attente</small></span>
   <span class="trk-flow-chip-num b"><b>${s.boarded}</b><small>embarq.</small></span>
   <span class="trk-flow-chip-bar" title="${pct}% embarqués"><i style="width:${pct}%"></i></span>
  </button>`
 }).join('')
}
function tableFilteredTrains(){
 const q=tableSearch.trim().toLowerCase();
 return TRAINS.filter(t=>{
  if(rosterFilter!=='all'){
   const ok=rosterFilter==='pax'?t.pax:rosterFilter==='fret'?t.type==='fret':t.type==='maint';
   if(!ok)return false
  }
  if(q&&!(t.id.toLowerCase().includes(q)||t.label.toLowerCase().includes(q)||stById(t.from).name.toLowerCase().includes(q)||stById(t.to).name.toLowerCase().includes(q)))return false;
  return true
 })
}
function rosterTableHtml(){
 const list=tableFilteredTrains();
 if(!list.length)return `<tr><td colspan="7" class="trk-empty">${I('inbox')} Aucune circulation ne correspond à ces critères.</td></tr>`;
 return list.map(t=>{
  const ns=nextStation(t);
  const pct=t.pax?Math.round(t.occ/t.cap*100):0;
  const journeyPct=Math.max(0,Math.min(100,Math.round((t.kmPos-t.min)/((t.max-t.min)||1)*100)));
  return `<tr class="${t.id===selected?'active':''}" data-select-row="${t.id}">
   <td><div class="trk-t-id"><i class="${t.type}"></i><div><b>${t.id}</b><small>${t.label}</small></div></div></td>
   <td><span class="trk-badge ${t.status}">${statusLabel(t.status)}</span></td>
   <td><div class="trk-route"><b>${stById(t.from).name}</b>${I('arrow-right')}<b>${stById(t.to).name}</b></div></td>
   <td><div class="trk-progress-cell"><small>PK ${Math.round(t.kmPos)}</small><div class="trk-mini-bar"><i style="width:${journeyPct}%"></i></div></div></td>
   <td><b>${ns?ns.name:'—'}</b></td>
   <td><span class="${t.delay>0?'trk-late':'trk-ontime'}">${t.status==='arret'?'à quai':t.delay>0?'+'+t.delay+' min':'à l’heure'}</span></td>
   <td>${t.pax?`<div class="trk-progress-cell"><small>${fmtNum(t.occ)} / ${fmtNum(t.cap)}</small><div class="trk-mini-bar occ"><i style="width:${pct}%"></i></div></div>`:`<b>${fmtNum(t.occ)} t</b>`}</td>
   <td><div class="trk-row-actions"><button data-locate-row="${t.id}" title="Localiser sur la carte">${I('locate-fixed')}</button><button class="primary" data-detail-row="${t.id}">${I('chevron-right')} Détails</button></div></td>
  </tr>`
 }).join('')
}

function footHtml(){
 const reds=SIGNALS.filter(s=>s.state==='red').length;
 const ambers=SIGNALS.filter(s=>s.state==='amber').length;
 const arret=TRAINS.filter(t=>t.status==='arret').length;
 const items=[
  [I('shield-check'),`${SIGNALS.length} signaux · protection automatique des cantons active`,''],
  [I('circle-pause'),`${arret} train${arret>1?'s':''} à quai en gare`,''],
  reds?[I('octagon-alert'),`${reds} canton${reds>1?'s':''} fermé${reds>1?'s':''} devant un train`,'bad']:null,
  ambers?[I('triangle-alert'),`${ambers} signal${ambers>1?'aux':''} d’approche en vigilance`,'']:null
 ].filter(Boolean);
 return items.map(x=>`<span class="trk-foot-pill ${x[2]}">${x[0]} ${x[1]}</span>`).join('')
}

function drawerContentHtml(t){
 const ns=nextStation(t);
 const pct=t.pax?Math.round(t.occ/t.cap*100):0;
 return `<header><div><small>FICHE CIRCULATION</small><h2>${t.id}</h2><span class="trk-badge ${t.status}">${statusLabel(t.status)}</span></div><button data-drawer-close>×</button></header>
 <p class="sub">${t.label} · ${stById(t.from).name} → ${stById(t.to).name}</p>
 <div class="trk-detail-grid">
  <span><small>Position</small><b>PK ${Math.round(t.kmPos)}</b></span>
  <span><small>Vitesse</small><b>${t.status==='arret'?'0':Math.round(t.speedRef*(t.status==='ralenti'?.35:1))} km/h</b></span>
  <span><small>Prochaine étape</small><b>${ns?ns.name:'—'}</b></span>
  <span><small>Écart</small><b>${t.delay>0?'+'+t.delay+' min':'à l’heure'}</b></span>
  <span><small>${t.pax?'Voyageurs':typeLabel(t.type)}</small><b>${fmtNum(t.occ)}${t.pax?' / '+fmtNum(t.cap):' t'}</b></span>
  <span><small>Occupation</small><b>${t.pax?pct+' %':'—'}</b></span>
 </div>
 ${t.pax?`<div class="trk-occ-bar"><i style="width:${pct}%"></i></div>`:''}
 <div class="trk-detail-actions">
  <button data-detail-locate>${I('locate-fixed')} Centrer sur la carte</button>
  ${t.pax?`<button data-detail-contact>${I('radio')} Contacter le conducteur</button>`:''}
  <button data-detail-export>${I('download')} Exporter la fiche</button>
 </div>`
}

function render(){
 return `<div class="trk-page">
 <div class="trk-head">
  <div><h1>Centre des opérations</h1><p>Suivi ferroviaire temps réel — positions, signalisation, gares et charge voyageurs sur l’ensemble du Transgabonais.</p></div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
   <span class="trk-live"><i></i> Réseau connecté</span>
   <div class="trk-actions"><button data-trk-refresh>${I('refresh-cw')} Actualiser</button><button data-trk-incident>${I('triangle-alert')} Déclarer un incident</button></div>
  </div>
 </div>
 <div class="trk-kpis" id="trkKpis">${kpisHtml()}</div>
 <div class="trk-map-card">
  <div class="trk-map-head">
   <div><h2>Réseau Transgabonais · Owendo ↔ Franceville</h2><p>648 km · 8 gares · signalisation automatique des cantons</p></div>
   <div class="trk-legend">
    <span><i class="exp"></i> Voyageurs</span><span><i class="omn"></i> Omnibus</span><span><i class="fret"></i> Fret</span><span><i class="maint"></i> Maintenance</span>
    <span><i class="sig-g"></i> Voie libre</span><span><i class="sig-r"></i> Canton fermé</span>
   </div>
  </div>
  <div class="trk-map-wrap" id="trkMapWrap">${svgMap()}</div>
  <div class="trk-map-foot" id="trkFoot">${footHtml()}</div>
 </div>
 <div class="trk-table-card">
  <div class="trk-card-head"><div><h3>${I('users-round')} Flux gares · temps réel</h3><p class="sub">Voyageurs en attente et embarqués par gare depuis l’ouverture</p></div><button class="trk-mini-btn" data-flow-export>${I('download')} Exporter le flux</button></div>
  <div class="trk-flow-strip" id="trkFlowStrip">${flowStripHtml()}</div>
  <div class="trk-table-head">
   <div><h3>${I('train-front')} Circulations</h3><p class="sub">${TRAINS.length} trains suivis en direct sur l’ensemble du réseau</p></div>
   <div class="trk-table-toolbar">
    <div id="trkRosterFilters">${rosterFilterBarHtml()}</div>
    <label class="trk-search">${I('search')}<input id="trkSearch" placeholder="Rechercher un train, une gare…"></label>
    <button class="trk-mini-btn" data-roster-export>${I('download')} Exporter</button>
   </div>
  </div>
  <div class="trk-table-scroll"><table class="trk-table">
   <thead><tr><th>Train</th><th>Statut</th><th>Trajet</th><th>Position</th><th>Prochaine étape</th><th>Écart</th><th>Charge</th><th>Actions</th></tr></thead>
   <tbody id="trkTableBody">${rosterTableHtml()}</tbody>
  </table></div>
 </div>
 </div>`
}

function selectTrain(id){
 selected=id;
 document.querySelectorAll('.trk-train').forEach(x=>x.classList.toggle('selected',x.dataset.train===id));
 document.querySelectorAll('[data-select-row]').forEach(x=>x.classList.toggle('active',x.dataset.selectRow===id))
}
function openDrawer(id){
 selectTrain(id);
 const t=TRAINS.find(x=>x.id===id);
 const host=document.querySelector('#modalRoot');
 if(!t||!host)return;
 host.innerHTML=`<div class="trk-drawer-overlay"><div class="trk-drawer">${drawerContentHtml(t)}</div></div>`;
 wireDrawer();
 if(window.lucide)lucide.createIcons()
}
function closeDrawer(){
 const host=document.querySelector('#modalRoot');
 if(host&&host.querySelector('.trk-drawer'))host.innerHTML=''
}
function refreshDrawerIfOpen(){
 const host=document.querySelector('#modalRoot');
 if(!host)return;
 const drawer=host.querySelector('.trk-drawer');
 if(!drawer)return;
 const t=TRAINS.find(x=>x.id===selected);
 if(!t)return;
 drawer.innerHTML=drawerContentHtml(t);
 wireDrawer();
 if(window.lucide)lucide.createIcons()
}
function wireDrawer(){
 const host=document.querySelector('#modalRoot');
 if(!host||!host.querySelector('.trk-drawer'))return;
 const overlay=host.querySelector('.trk-drawer-overlay');
 if(overlay){
  overlay.addEventListener('click',e=>e.stopPropagation());
  overlay.onclick=e=>{if(e.target===overlay)closeDrawer()}
 }
 const closeBtn=host.querySelector('[data-drawer-close]');
 if(closeBtn)closeBtn.onclick=closeDrawer;
 const locateBtn=host.querySelector('[data-detail-locate]');
 if(locateBtn)locateBtn.onclick=()=>locatePulse(`.trk-train[data-train="${selected}"]`);
 const contactBtn=host.querySelector('[data-detail-contact]');
 if(contactBtn)contactBtn.onclick=()=>{if(typeof toast==='function')toast(`Conducteur de ${selected} contacté · liaison radio confirmée`)};
 const exportBtn=host.querySelector('[data-detail-export]');
 if(exportBtn)exportBtn.onclick=()=>{
  const t=TRAINS.find(x=>x.id===selected);
  if(!t)return;
  const ns=nextStation(t);
  csvDownload(`SETRAG-circulation-${t.id}.csv`,['Champ','Valeur'],[
   ['Train',t.id],['Type',typeLabel(t.type)],['Statut',statusLabel(t.status)],
   ['Origine',stById(t.from).name],['Destination',stById(t.to).name],
   ['Position (PK)',Math.round(t.kmPos)],['Vitesse (km/h)',t.status==='arret'?0:Math.round(t.speedRef*(t.status==='ralenti'?.35:1))],
   ['Prochaine étape',ns?ns.name:'—'],['Écart',t.delay>0?'+'+t.delay+' min':'à l’heure'],
   [t.pax?'Voyageurs':'Charge',t.pax?`${fmtNum(t.occ)} / ${fmtNum(t.cap)}`:`${fmtNum(t.occ)} t`]
  ]);
  if(typeof toast==='function')toast('Fiche circulation exportée')
 }
}
function wireFlowStrip(){
 document.querySelectorAll('[data-flow-locate]').forEach(b=>b.onclick=()=>locatePulse(`.trk-station[data-st="${b.dataset.flowLocate}"]`))
}
function wireTableRows(){
 document.querySelectorAll('[data-select-row]').forEach(row=>{
  row.onclick=()=>openDrawer(row.dataset.selectRow);
  const locateBtn=row.querySelector('[data-locate-row]');
  if(locateBtn)locateBtn.onclick=e=>{e.stopPropagation();locatePulse(`.trk-train[data-train="${locateBtn.dataset.locateRow}"]`)};
  const detailBtn=row.querySelector('[data-detail-row]');
  if(detailBtn)detailBtn.onclick=e=>{e.stopPropagation();openDrawer(detailBtn.dataset.detailRow)}
 })
}

function paint(){
 const root=document.querySelector('.trk-page');
 if(!root)return;
 TRAINS.forEach((t,i)=>{
  const g=ref.trains&&ref.trains[t.id];
  if(!g)return;
  g.el.style.transform=`translate(${kmToX(t.kmPos)}px,${laneYFor(t,i)}px)`;
  g.el.classList.toggle('stopped',t.status==='arret')
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
 const kpis=document.getElementById('trkKpis');if(kpis)kpis.innerHTML=kpisHtml();
 const foot=document.getElementById('trkFoot');if(foot)foot.innerHTML=footHtml();
 const strip=document.getElementById('trkFlowStrip');if(strip){strip.innerHTML=flowStripHtml();wireFlowStrip()}
 const body=document.getElementById('trkTableBody');if(body){body.innerHTML=rosterTableHtml();wireTableRows()}
 refreshDrawerIfOpen();
 if(window.lucide)lucide.createIcons()
}

function wire(){
 if(typeof current!=='undefined'&&current!=='tracking')return;
 const root=document.querySelector('.trk-page');
 if(!root)return;
 if(!root.__trkStop){root.addEventListener('click',e=>e.stopPropagation());root.__trkStop=true}
 if(window.lucide)lucide.createIcons();
 ref.trains={};ref.signals=[];
 root.querySelectorAll('.trk-train').forEach(g=>{ref.trains[g.dataset.train]={el:g}});
 root.querySelectorAll('.trk-signal').forEach((g,i)=>{ref.signals[i]=g});
 root.querySelectorAll('.trk-train').forEach(g=>g.onclick=()=>openDrawer(g.dataset.train));
 wireTableRows();
 wireFlowStrip();
 selectTrain(selected);
 root.querySelectorAll('[data-trk-refresh]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Réseau actualisé')});
 root.querySelectorAll('[data-trk-incident]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Déclaration d’incident enregistrée · équipe notifiée')});
 root.querySelectorAll('[data-roster-filter]').forEach(b=>b.onclick=()=>{
  rosterFilter=b.dataset.rosterFilter;
  root.querySelectorAll('[data-roster-filter]').forEach(x=>x.classList.toggle('active',x.dataset.rosterFilter===rosterFilter));
  const body=document.getElementById('trkTableBody');if(body){body.innerHTML=rosterTableHtml();wireTableRows()}
  if(window.lucide)lucide.createIcons()
 });
 const searchInput=root.querySelector('#trkSearch');
 if(searchInput)searchInput.oninput=()=>{
  tableSearch=searchInput.value;
  const body=document.getElementById('trkTableBody');if(body){body.innerHTML=rosterTableHtml();wireTableRows()}
  if(window.lucide)lucide.createIcons()
 };
 const flowExportBtn=root.querySelector('[data-flow-export]');
 if(flowExportBtn)flowExportBtn.onclick=()=>{
  csvDownload('SETRAG-flux-gares.csv',['Gare','PK','Voies','En attente','Embarqués'],STATIONS.map(s=>[s.name,s.km,s.quais,s.waiting,s.boarded]));
  if(typeof toast==='function')toast('Flux gares exporté en CSV')
 };
 const rosterExportBtn=root.querySelector('[data-roster-export]');
 if(rosterExportBtn)rosterExportBtn.onclick=()=>{
  csvDownload('SETRAG-circulations.csv',['Train','Type','Statut','Origine','Destination','Position (PK)','Écart'],
   TRAINS.map(t=>[t.id,typeLabel(t.type),statusLabel(t.status),stById(t.from).name,stById(t.to).name,Math.round(t.kmPos),t.delay>0?'+'+t.delay+' min':'à l’heure']));
  if(typeof toast==='function')toast('Circulations exportées en CSV')
 };
 paint();
 if(tickHandle)clearInterval(tickHandle);
 tickHandle=setInterval(tick,1500);
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.tracking=render;
 if(typeof bind==='function'&&!bind.__trkWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__trkWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="tracking"].active')||document.querySelector('.trk-page');
 if(requested==='tracking'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
