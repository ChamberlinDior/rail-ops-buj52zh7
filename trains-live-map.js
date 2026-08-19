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
 {id:'EXP-620',type:'exp',label:'Express voyageurs',composition:'8 voitures · 450 pl.',from:'OWE',to:'FCV',speedRef:72,cap:450,occ:382,delay:6,pax:true},
 {id:'OMN-218',type:'omn',label:'Omnibus voyageurs',composition:'6 voitures · 390 pl.',from:'FCV',to:'OWE',speedRef:45,cap:390,occ:301,delay:0,pax:true},
 {id:'SPE-551',type:'exp',label:'Spécial voyageurs',composition:'4 voitures · 210 pl.',from:'OWE',to:'NTM',speedRef:55,cap:210,occ:138,delay:0,pax:true},
 {id:'FRET-332',type:'fret',label:'Fret général',composition:'28 wagons',from:'OWE',to:'FCV',speedRef:48,cap:1200,occ:840,delay:3,pax:false},
 {id:'MIN-641',type:'fret',label:'Minerai · manganèse',composition:'40 wagons',from:'MOA',to:'OWE',speedRef:34,cap:3400,occ:3150,delay:9,pax:false},
 {id:'MAINT-477',type:'maint',label:'Maintenance voie',composition:'Rame technique',from:'BOU',to:'LAS',speedRef:20,cap:12,occ:8,delay:0,pax:false}
];

const MAP_X0=70,MAP_X1=1130,MAP_Y=155,TOTAL_KM=648,TRACK_Y1=MAP_Y-14,TRACK_Y2=MAP_Y+14,BLOCK_GAP=20;
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
function statusLabel(s){return{roulant:'En circulation',arret:'À quai',attente_signal:'Attente signal',incident:'Incident'}[s]||s}
function typeLabel(ty){return{exp:'Voyageurs',omn:'Voyageurs',fret:'Fret',maint:'Maintenance'}[ty]||ty}

let selected='EXP-620';
let tickHandle=null;

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

const ref={};
function svgMap(){
 const stationsHtml=STATIONS.map(s=>{
  const x=kmToX(s.km),above=s.hub;
  return `<g class="trn-station" data-st="${s.id}">
   <line x1="${x}" y1="${TRACK_Y1}" x2="${x}" y2="${TRACK_Y2}" stroke="#c7d8d2" stroke-width="2"></line>
   <circle class="trn-station-dot${s.hub?' hub':''}" cx="${x}" cy="${MAP_Y}" r="${s.hub?7:5}"></circle>
   <text class="trn-station-label" x="${x}" y="${above?MAP_Y-72:MAP_Y+42}" text-anchor="middle">${s.name}</text>
   <text class="trn-station-sub" x="${x}" y="${above?MAP_Y-60:MAP_Y+54}" text-anchor="middle">PK ${s.km} · ${s.quais} voies</text>
   <g class="trn-station-badge" transform="translate(${x-30},${above?MAP_Y-52:MAP_Y+8})" data-badge="${s.id}">
    <rect x="0" y="0" width="60" height="18" rx="6"></rect>
    <text x="8" y="12"><tspan class="w" data-w="${s.id}">${s.waiting}</tspan></text>
    <text x="34" y="12"><tspan class="b" data-b="${s.id}">${s.boarded}</tspan></text>
   </g>
  </g>`
 }).join('');
 const crossoverHtml=CROSSOVERS.map(km=>{const x=kmToX(km);return `<path class="trn-crossover" d="M${x} ${TRACK_Y1} C ${x+22} ${TRACK_Y1} ${x+10} ${TRACK_Y2} ${x+32} ${TRACK_Y2}"></path>`}).join('');
 const signalsHtml=SIGNALS.map((sig,i)=>{
  const x=kmToX(sig.km),onLine1=i%2===0,trackY=onLine1?TRACK_Y1:TRACK_Y2,out=onLine1?-1:1,poleLen=20,headH=24;
  const headY=out<0?-(poleLen+headH):poleLen;
  return `<g class="trn-signal" data-sig="${i}" transform="translate(${x},${trackY})">
   <line class="pole" x1="0" y1="0" x2="0" y2="${out*poleLen}"></line>
   <rect class="head" x="-6" y="${headY}" width="12" height="${headH}" rx="3"></rect>
   <circle class="lamp red" cx="0" cy="${headY+6}" r="2.8"></circle>
   <circle class="lamp amber" cx="0" cy="${headY+12}" r="2.8"></circle>
   <circle class="lamp green" cx="0" cy="${headY+18}" r="2.8"></circle>
  </g>`
 }).join('');
 const trainsHtml=TRAINS.map((t,i)=>{
  const y=laneYFor(t,i);
  return `<g class="trn-train ${t.type}" data-train="${t.id}" style="transform:translate(${kmToX(t.kmPos)}px,${y}px)">
   <circle class="halo" r="11"></circle>
   <rect class="body" x="-16" y="-8" width="32" height="16" rx="4"></rect>
   <text y="4">${t.id.slice(0,3)}</text>
   <text class="tag" y="-13">${t.id}</text>
   <text class="dwell" y="20" text-anchor="middle" font-size="8" fill="#c9860f">⏸ à quai</text>
   <text class="waitsig" y="20" text-anchor="middle" font-size="8" fill="#e34850">⛔ signal</text>
  </g>`
 }).join('');
 return `<svg class="trn-map-svg" viewBox="0 0 1200 280" xmlns="http://www.w3.org/2000/svg">
  <path class="trn-track-bed" d="M${MAP_X0} ${TRACK_Y1} H ${MAP_X1}"></path>
  <path class="trn-track-bed" d="M${MAP_X0} ${TRACK_Y2} H ${MAP_X1}"></path>
  <path class="trn-track" d="M${MAP_X0} ${TRACK_Y1} H ${MAP_X1}"></path>
  <path class="trn-track" d="M${MAP_X0} ${TRACK_Y2} H ${MAP_X1}"></path>
  ${crossoverHtml}
  <text class="trn-line-label" x="${MAP_X0-4}" y="${TRACK_Y1-8}" text-anchor="start">VOIE 1</text>
  <text class="trn-line-label" x="${MAP_X0-4}" y="${TRACK_Y2+16}" text-anchor="start">VOIE 2</text>
  <g class="trn-terminal"><rect x="${MAP_X0-14}" y="${MAP_Y+56}" width="118" height="20" rx="5"></rect><text x="${MAP_X0-14+59}" y="${MAP_Y+69}">DÉPÔT OWENDO</text></g>
  <g class="trn-terminal"><rect x="${MAP_X1-104}" y="${MAP_Y+56}" width="118" height="20" rx="5"></rect><text x="${MAP_X1-104+59}" y="${MAP_Y+69}">TERMINAL FRANCEVILLE</text></g>
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

function rosterHtml(){
 return TRAINS.map(t=>{
  const ns=nextStation(t);
  const endClass=t.delay>15?'stop':t.delay>0?'late':'';
  return `<button class="trn-roster-row${t.id===selected?' active':''}" data-select="${t.id}">
   <i class="${t.type}"></i>
   <span class="trn-roster-mid"><b>${t.id}</b><small>${t.label} · ${statusLabel(t.status)}</small></span>
   <span class="trn-roster-end ${endClass}"><b>${ns?ns.name:'—'}</b><small>${t.delay>0?'+'+t.delay+' min':'à l’heure'}</small></span>
  </button>`
 }).join('')
}

function flowHtml(){
 return STATIONS.map(s=>`<div class="trn-flow-row"><span><b>${s.name}</b><small>PK ${s.km} · ${s.quais} voies</small></span><span class="w">${s.waiting}<small style="display:block;font-weight:600;color:#7f97a2">attente</small></span><span class="b">${s.boarded}<small style="display:block;font-weight:600;color:#7f97a2">embarqués</small></span></div>`).join('')
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

function detailHtml(){
 const t=TRAINS.find(x=>x.id===selected);
 if(!t)return `<div class="trn-detail-empty">Sélectionnez un train sur la carte ou dans la liste.</div>`;
 const ns=nextStation(t);
 const pct=Math.round(t.occ/t.cap*100);
 const stopped=t.status==='arret'||t.status==='attente_signal';
 return `<div class="trn-detail-head"><b>${t.id}</b><span class="${t.status}">${statusLabel(t.status)}</span></div>
 <p class="sub" style="margin:0">${t.label} · ${stById(t.from).name} → ${stById(t.to).name}</p>
 <div class="trn-detail-grid">
  <span><small>Position</small><b>PK ${Math.round(t.kmPos)}</b></span>
  <span><small>Vitesse</small><b>${stopped?'0':Math.round(t.speedRef)} km/h</b></span>
  <span><small>Prochaine étape</small><b>${ns?ns.name:'—'}</b></span>
  <span><small>Écart</small><b>${t.delay>0?'+'+t.delay+' min':'à l’heure'}</b></span>
  <span><small>Composition</small><b>${t.composition}</b></span>
  <span><small>${t.pax?'Occupation':typeLabel(t.type)}</small><b>${t.pax?pct+' %':fmtNum(t.occ)+' t'}</b></span>
 </div>
 ${t.pax?`<div class="trn-occ-bar"><i style="width:${pct}%"></i></div>`:''}`
}

function render(){
 return `<div class="trn-page">
 <div class="trn-head">
  <div><h1>Trains &amp; circulations</h1><p>Réseau Transgabonais en direct — voies, signalisation tricolore, arrêts en gare et charge des circulations.</p></div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
   <span class="trn-live"><i></i> Réseau connecté</span>
   <div class="trn-actions"><button data-trn-refresh>${I('refresh-cw')} Actualiser</button><button data-trn-new>${I('plus')} Nouveau train</button></div>
  </div>
 </div>
 <div class="trn-kpis" id="trnKpis">${kpisHtml()}</div>
 <div class="trn-body">
  <div class="trn-map-card">
   <div class="trn-map-head">
    <div><h2>Réseau Transgabonais · Owendo ↔ Franceville</h2><p>648 km · 8 gares · 12 signaux tricolores · double voie</p></div>
    <div class="trn-legend">
     <span><i class="exp"></i> Voyageurs</span><span><i class="omn"></i> Omnibus</span><span><i class="fret"></i> Fret</span><span><i class="maint"></i> Maintenance</span>
     <span><i class="sig-g"></i> Voie libre</span><span><i class="sig-r"></i> Canton fermé</span>
    </div>
   </div>
   <div class="trn-map-wrap" id="trnMapWrap">${svgMap()}</div>
   <div class="trn-map-foot" id="trnFoot">${footHtml()}</div>
  </div>
  <div class="trn-panel">
   <div class="trn-card"><h3>${I('users-round')} Flux gares · temps réel</h3><p class="sub">Voyageurs en attente et embarqués depuis l’ouverture</p><div class="trn-station-flow" id="trnFlow">${flowHtml()}</div></div>
   <div class="trn-card"><h3>${I('train-front')} Circulations</h3><p class="sub">${TRAINS.length} trains suivis en direct</p><div class="trn-roster" id="trnRoster">${rosterHtml()}</div></div>
   <div class="trn-card"><h3>${I('radar')} Détail circulation</h3><div id="trnDetail">${detailHtml()}</div></div>
  </div>
 </div>
 </div>`
}

function selectTrain(id){
 selected=id;
 document.querySelectorAll('.trn-train').forEach(x=>x.classList.toggle('selected',x.dataset.train===id));
 document.querySelectorAll('.trn-roster-row').forEach(x=>x.classList.toggle('active',x.dataset.select===id));
 const d=document.getElementById('trnDetail');if(d)d.innerHTML=detailHtml();
 if(window.lucide)lucide.createIcons()
}

function paint(){
 const root=document.querySelector('.trn-page');
 if(!root)return;
 TRAINS.forEach((t,i)=>{
  const g=ref.trains&&ref.trains[t.id];
  if(!g)return;
  g.el.style.transform=`translate(${kmToX(t.kmPos)}px,${laneYFor(t,i)}px)`;
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
 const roster=document.getElementById('trnRoster');if(roster){roster.innerHTML=rosterHtml();wireRoster()}
 const detail=document.getElementById('trnDetail');if(detail&&selected)detail.innerHTML=detailHtml();
 if(window.lucide)lucide.createIcons()
}

function wireRoster(){
 document.querySelectorAll('.trn-roster-row').forEach(b=>b.onclick=()=>selectTrain(b.dataset.select))
}

function wire(){
 if(typeof current!=='undefined'&&current!=='trains')return;
 const root=document.querySelector('.trn-page');
 if(!root)return;
 if(!root.__trnStop){root.addEventListener('click',e=>e.stopPropagation());root.__trnStop=true}
 if(window.lucide)lucide.createIcons();
 ref.trains={};ref.signals=[];
 root.querySelectorAll('.trn-train').forEach(g=>{ref.trains[g.dataset.train]={el:g}});
 root.querySelectorAll('.trn-signal').forEach((g,i)=>{ref.signals[i]=g});
 root.querySelectorAll('.trn-train').forEach(g=>g.onclick=()=>selectTrain(g.dataset.train));
 wireRoster();
 selectTrain(selected);
 root.querySelectorAll('[data-trn-refresh]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Réseau actualisé')});
 root.querySelectorAll('[data-trn-new]').forEach(b=>b.onclick=()=>{if(typeof toast==='function')toast('Assistant de création de circulation · démonstration')});
 paint();
 if(tickHandle)clearInterval(tickHandle);
 tickHandle=setInterval(tick,1500);
}

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
