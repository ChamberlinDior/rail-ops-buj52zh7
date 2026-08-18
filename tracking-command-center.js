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

const MAP_X0=70,MAP_X1=1130,MAP_Y=155,TOTAL_KM=648;
const TRK_LANES=[-56,-36,-16,16,36,56];
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
 const signalsHtml=SIGNALS.map((sig,i)=>`<g class="trk-signal" data-sig="${i}" transform="translate(${kmToX(sig.km)},${MAP_Y-24})"><circle r="5"></circle></g>`).join('');
 const trainsHtml=TRAINS.map((t,i)=>{
  const laneY=MAP_Y+(TRK_LANES[i]||0);
  return `<g class="trk-train ${t.type}" data-train="${t.id}" style="transform:translate(${kmToX(t.kmPos)}px,${laneY}px)">
   <circle class="halo" r="11"></circle>
   <rect class="body" x="-16" y="-8" width="32" height="16" rx="4"></rect>
   <text y="4">${t.id.slice(0,3)}</text>
   <text class="tag" y="-13">${t.id}</text>
   <text class="dwell" y="20" text-anchor="middle" font-size="8" fill="#f5a623">⏸ à quai</text>
  </g>`
 }).join('');
 return `<svg class="trk-map-svg" viewBox="0 0 1200 320" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="trkFlow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#13d38e" stop-opacity="0"/><stop offset="50%" stop-color="#13d38e" stop-opacity=".9"/><stop offset="100%" stop-color="#13d38e" stop-opacity="0"/></linearGradient></defs>
  <path class="trk-track-bed" d="M${MAP_X0} ${MAP_Y} H ${MAP_X1}"></path>
  <path class="trk-track" d="M${MAP_X0} ${MAP_Y} H ${MAP_X1}"></path>
  <path class="trk-track-glow" d="M${MAP_X0} ${MAP_Y} H ${MAP_X1}"></path>
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

function rosterHtml(){
 return TRAINS.map(t=>{
  const ns=nextStation(t);
  const endClass=t.delay>15?'stop':t.delay>0?'late':'';
  return `<button class="trk-roster-row${t.id===selected?' active':''}" data-select="${t.id}">
   <i class="${t.type}"></i>
   <span class="trk-roster-mid"><b>${t.id}</b><small>${t.label} · ${statusLabel(t.status)}</small></span>
   <span class="trk-roster-end ${endClass}"><b>${ns?ns.name:'—'}</b><small>${t.delay>0?'+'+t.delay+' min':'à l’heure'}</small></span>
  </button>`
 }).join('')
}

function flowHtml(){
 return STATIONS.map(s=>`<div class="trk-flow-row"><span><b>${s.name}</b><small>PK ${s.km} · ${s.quais} voies</small></span><span class="w">${s.waiting}<small style="display:block;font-weight:600;color:#7f97a2">attente</small></span><span class="b">${s.boarded}<small style="display:block;font-weight:600;color:#7f97a2">embarqués</small></span></div>`).join('')
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

function detailHtml(){
 const t=TRAINS.find(x=>x.id===selected);
 if(!t)return `<div class="trk-detail-empty">Sélectionnez un train sur la carte ou dans la liste.</div>`;
 const ns=nextStation(t);
 const pct=Math.round(t.occ/t.cap*100);
 return `<div class="trk-detail-head"><b>${t.id}</b><span class="${t.status}">${statusLabel(t.status)}</span></div>
 <p class="sub" style="margin:0">${t.label} · ${stById(t.from).name} → ${stById(t.to).name}</p>
 <div class="trk-detail-grid">
  <span><small>Position</small><b>PK ${Math.round(t.kmPos)}</b></span>
  <span><small>Vitesse</small><b>${t.status==='arret'?'0':Math.round(t.speedRef*(t.status==='ralenti'?.35:1))} km/h</b></span>
  <span><small>Prochaine étape</small><b>${ns?ns.name:'—'}</b></span>
  <span><small>Écart</small><b>${t.delay>0?'+'+t.delay+' min':'à l’heure'}</b></span>
  <span><small>${t.pax?'Voyageurs':typeLabel(t.type)}</small><b>${fmtNum(t.occ)}${t.pax?' / '+fmtNum(t.cap):' t'}</b></span>
  <span><small>Occupation</small><b>${t.pax?pct+' %':'—'}</b></span>
 </div>
 ${t.pax?`<div class="trk-occ-bar"><i style="width:${pct}%"></i></div>`:''}`
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
 <div class="trk-body">
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
  <div class="trk-panel">
   <div class="trk-card"><h3>${I('users-round')} Flux gares · temps réel</h3><p class="sub">Voyageurs en attente et embarqués depuis l’ouverture</p><div class="trk-station-flow" id="trkFlow">${flowHtml()}</div></div>
   <div class="trk-card"><h3>${I('train-front')} Circulations</h3><p class="sub">${TRAINS.length} trains suivis en direct</p><div class="trk-roster" id="trkRoster">${rosterHtml()}</div></div>
   <div class="trk-card"><h3>${I('radar')} Détail circulation</h3><div id="trkDetail">${detailHtml()}</div></div>
  </div>
 </div>
 </div>`
}

function selectTrain(id){
 selected=id;
 document.querySelectorAll('.trk-train').forEach(x=>x.classList.toggle('selected',x.dataset.train===id));
 document.querySelectorAll('.trk-roster-row').forEach(x=>x.classList.toggle('active',x.dataset.select===id));
 const d=document.getElementById('trkDetail');if(d)d.innerHTML=detailHtml();
 if(window.lucide)lucide.createIcons()
}

function paint(){
 const root=document.querySelector('.trk-page');
 if(!root)return;
 TRAINS.forEach((t,i)=>{
  const g=ref.trains&&ref.trains[t.id];
  if(!g)return;
  const laneY=MAP_Y+(TRK_LANES[i]||0);
  g.el.style.transform=`translate(${kmToX(t.kmPos)}px,${laneY}px)`;
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
 const flow=document.getElementById('trkFlow');if(flow)flow.innerHTML=flowHtml();
 const roster=document.getElementById('trkRoster');if(roster){roster.innerHTML=rosterHtml();wireRoster()}
 const detail=document.getElementById('trkDetail');if(detail&&selected)detail.innerHTML=detailHtml();
 if(window.lucide)lucide.createIcons()
}

function wireRoster(){
 document.querySelectorAll('.trk-roster-row').forEach(b=>b.onclick=()=>selectTrain(b.dataset.select))
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
 root.querySelectorAll('.trk-train').forEach(g=>g.onclick=()=>selectTrain(g.dataset.train));
 wireRoster();
 selectTrain(selected);
 root.querySelectorAll('[data-trk-refresh]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Réseau actualisé')});
 root.querySelectorAll('[data-trk-incident]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Déclaration d’incident enregistrée · équipe notifiée')});
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
