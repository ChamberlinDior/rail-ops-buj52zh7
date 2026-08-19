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

/* schematic straight-segment lines — NYC control-room style: each route is its own
   polyline of straight (but variously angled) segments, sharing only interchange points */
const LINES={
 pax:{kmMin:0,kmMax:648,label:'Ligne voyageurs',points:[[70,220],[127,150],[328,220],[495,150],[654,220],[822,150],[986,220],[1130,185]]},
 fret:{kmMin:0,kmMax:648,label:'Ligne fret / mine',points:[[70,220],[280,292],[560,322],[840,292],[1130,185]]},
 maint:{kmMin:357,kmMax:460,label:'Ligne maintenance',points:[[654,220],[738,266],[822,150]]}
};

const TRAINS=[
 {id:'EXP-620',type:'exp',line:'pax',label:'Express voyageurs',livret:'LH-EXP-S2-2026',composition:'8 voitures · 450 pl.',from:'OWE',to:'FCV',speedRef:72,cap:450,occ:382,delay:6,pax:true,
  voitures:[['V1','VIP','CAR-2041',36,0,9,4,0],['V2','1re classe','CAR-2042',48,0,12,4,3],['V3','1re classe','CAR-2043',48,0,12,4,0],['V4','2e classe','CAR-2044',72,10,18,4,3],['V5','2e classe','CAR-2045',72,10,18,4,0],['V6','2e classe','CAR-2046',72,10,18,4,1],['B1','Bagages','CAR-2047',0,0,0,0,0],['S1','Service','CAR-2048',0,0,0,0,0]]},
 {id:'OMN-218',type:'omn',line:'pax',label:'Omnibus voyageurs',livret:'LH-OMN-S1-2026',composition:'6 voitures · 390 pl.',from:'FCV',to:'OWE',speedRef:45,cap:390,occ:301,delay:0,pax:true,
  voitures:[['V1','1re classe','CAR-3011',40,0,10,4,0],['V2','2e classe','CAR-3012',64,20,16,4,2],['V3','2e classe','CAR-3013',64,20,16,4,0],['V4','2e classe','CAR-3014',64,20,16,4,1],['V5','2e classe','CAR-3015',64,20,16,4,0],['B1','Bagages','CAR-3016',0,0,0,0,0]]},
 {id:'SPE-551',type:'exp',line:'pax',label:'Spécial voyageurs',livret:'LH-SPE-S3-2026',composition:'4 voitures · 210 pl.',from:'OWE',to:'NTM',speedRef:55,cap:210,occ:138,delay:0,pax:true,
  voitures:[['V1','1re classe','CAR-4001',40,0,10,4,0],['V2','2e classe','CAR-4002',60,10,15,4,0],['V3','2e classe','CAR-4003',60,10,15,4,1],['V4','Service','CAR-4004',0,0,0,0,0]]},
 {id:'FRET-332',type:'fret',line:'fret',label:'Fret général',livret:'—',composition:'28 wagons',from:'OWE',to:'FCV',speedRef:48,cap:1200,occ:840,delay:3,pax:false,
  wagons:[['Wagons trémie','24','Vrac / minerai'],['Wagons plats','4','Conteneurs']]},
 {id:'MIN-641',type:'fret',line:'fret',label:'Minerai · manganèse',livret:'—',composition:'40 wagons',from:'MOA',to:'OWE',speedRef:34,cap:3400,occ:3150,delay:9,pax:false,
  wagons:[['Wagons trémie manganèse','38','Comilog'],['Wagons frein','2','Sécurité convoi']]},
 {id:'MAINT-477',type:'maint',line:'maint',label:'Maintenance voie',livret:'—',composition:'Rame technique',from:'BOU',to:'LAS',speedRef:20,cap:12,occ:8,delay:0,pax:false,
  wagons:[['Voiture technique','1','Équipe 8 agents'],['Wagon outillage','1','Matériel de voie']]}
];

const TOTAL_KM=648,BLOCK_GAP=20,LANE=9;
const SIGNAL_KMS=(()=>{const out=[];for(let km=25;km<TOTAL_KM-15;km+=52)out.push(km);return out})();
const SIGNALS=SIGNAL_KMS.map(km=>({km,state:'green'}));

function wagonCount(t){
 if(t.pax)return Math.max(3,Math.min(6,t.voitures.length));
 if(t.type==='fret')return 5;
 return 3;
}
function consistSvg(t){
 const n=wagonCount(t);
 let s='';
 for(let i=0;i<n;i++){
  const cx=-(i*13);
  if(i===0){
   s+=`<rect class="trn-loco" x="${(cx-7).toFixed(1)}" y="-7" width="14" height="14" rx="3"></rect><rect class="trn-cab" x="${(cx+2).toFixed(1)}" y="-3" width="5" height="6" rx="1"></rect>`
  }else{
   s+=`<line class="trn-coupler" x1="${(cx+7).toFixed(1)}" y1="0" x2="${(cx+13).toFixed(1)}" y2="0"></line><rect class="trn-wagon" x="${(cx-6).toFixed(1)}" y="-6" width="12" height="12" rx="2"></rect>`
  }
 }
 return s
}

function initTrain(t){
 const a=stById(t.from),b=stById(t.to);
 t.min=Math.min(a.km,b.km);t.max=Math.max(a.km,b.km);
 t.kmPos=a.km;t.dir=a.km<=b.km?1:-1;
 t.status='roulant';t.dwell=0;t.lastStation=t.from
}
function init(){TRAINS.forEach(initTrain)}
init();

/* ---------- new-train creation ---------- */
const TYPE_META={
 exp:{line:'pax',pax:true,speed:65,defLabel:'Express voyageurs'},
 omn:{line:'pax',pax:true,speed:45,defLabel:'Omnibus voyageurs'},
 fret:{line:'fret',pax:false,speed:45,defLabel:'Fret général'},
 maint:{line:'maint',pax:false,speed:20,defLabel:'Maintenance voie'}
};
function trainIdSuggest(type){
 const prefix={exp:'EXP',omn:'OMN',fret:'FRET',maint:'MAINT'}[type]||'TRN';
 let id;do{id=`${prefix}-${100+Math.floor(Math.random()*900)}`}while(TRAINS.some(t=>t.id===id));
 return id
}
function stationOptionsForType(type){
 return type==='maint'?STATIONS.filter(s=>s.id==='BOU'||s.id==='LAS'):STATIONS
}
function buildVoitures(n,mix){
 const out=[];
 for(let i=0;i<n;i++){
  const cls=mix==='confort'?(i===0?'VIP':i<3?'1re classe':'2e classe'):mix==='standard'?(i===0?'1re classe':'2e classe'):'2e classe';
  const assises=cls==='VIP'?36:cls==='1re classe'?44:66;
  const debout=cls==='2e classe'?16:0;
  out.push([`V${i+1}`,cls,`CAR-${9000+Math.floor(Math.random()*900)}`,assises,debout,Math.ceil(assises/4),4,0])
 }
 return out
}
function newTrainModal(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 let type='exp';
 const render=()=>{
  const meta=TYPE_META[type],opts=stationOptionsForType(type);
  root.innerHTML=`<div class="trn-modal-backdrop" data-trn-modal-close><div class="trn-modal" onclick="event.stopPropagation()">
   <header><div><span class="trn-modal-eyebrow">CRÉATION · CIRCULATION</span><h3>Nouveau train</h3><p>Informations nécessaires à la mise en service — conforme au périmètre CDC §7.3</p></div><button class="trn-modal-close" data-trn-modal-close>×</button></header>
   <div class="trn-modal-body">
    <label>Type de circulation<select id="ntType">
     <option value="exp">Express / Spécial voyageurs</option>
     <option value="omn">Omnibus voyageurs</option>
     <option value="fret">Fret / Minerai</option>
     <option value="maint">Maintenance voie</option>
    </select></label>
    <label>Désignation<input id="ntLabel" placeholder="ex. Express voyageurs" value="${meta.defLabel}"></label>
    <div class="trn-modal-grid2">
     <label>Identifiant<input id="ntId" value="${trainIdSuggest(type)}"></label>
     <label>Livret horaire<input id="ntLivret" value="LH-${type.toUpperCase().slice(0,3)}-${new Date().getFullYear()}"></label>
    </div>
    <div class="trn-modal-grid2">
     <label>Gare de départ<select id="ntFrom">${opts.map((s,i)=>`<option value="${s.id}"${i===0?' selected':''}>${s.name}</option>`).join('')}</select></label>
     <label>Gare d’arrivée<select id="ntTo">${opts.map((s,i)=>`<option value="${s.id}"${i===opts.length-1?' selected':''}>${s.name}</option>`).join('')}</select></label>
    </div>
    <div class="trn-modal-grid2">
     <label>Vitesse de référence (km/h)<input id="ntSpeed" type="number" value="${meta.speed}" min="15" max="120"></label>
     <label>${meta.pax?'Nombre de voitures':'Nombre de wagons'}<input id="ntUnits" type="number" value="${meta.pax?6:20}" min="1" max="${meta.pax?10:50}"></label>
    </div>
    ${meta.pax?`<label>Composition<select id="ntMix"><option value="confort">Confort — VIP + 1re + 2e classe</option><option value="standard" selected>Standard — 1re + 2e classe</option><option value="eco">Économique — 2e classe uniquement</option></select></label>`
      :`<label>Nature du chargement<input id="ntCargo" value="${type==='fret'?'Vrac / minerai':'Équipe technique · matériel de voie'}"></label>`}
   </div>
   <footer><button class="btn ghost" data-trn-modal-close>Annuler</button><button class="btn primary" id="ntSubmit">${I('plus')} Créer et mettre en service</button></footer>
  </div></div>`;
  if(window.lucide)lucide.createIcons();
  root.querySelectorAll('[data-trn-modal-close]').forEach(x=>x.onclick=()=>{root.innerHTML=''});
  document.getElementById('ntType').value=type;
  document.getElementById('ntType').onchange=e=>{type=e.target.value;render()};
  document.getElementById('ntSubmit').onclick=submit;
 };
 const submit=()=>{
  const meta=TYPE_META[type];
  const id=(document.getElementById('ntId').value||'').trim().toUpperCase();
  const label=(document.getElementById('ntLabel').value||'').trim();
  const from=document.getElementById('ntFrom').value,to=document.getElementById('ntTo').value;
  const speedRef=Math.max(10,+document.getElementById('ntSpeed').value||meta.speed);
  const livret=(document.getElementById('ntLivret').value||'—').trim();
  if(!id||TRAINS.some(t=>t.id===id)){if(typeof toast==='function')toast('Identifiant invalide ou déjà utilisé');return}
  if(from===to){if(typeof toast==='function')toast('Gare de départ et d’arrivée identiques');return}
  const t={id,type,line:meta.line,label:label||meta.defLabel,livret,from,to,speedRef,delay:0,pax:meta.pax};
  if(meta.pax){
   const n=Math.max(1,Math.min(10,+document.getElementById('ntUnits').value||6));
   const mix=document.getElementById('ntMix').value;
   t.voitures=buildVoitures(n,mix);
   t.cap=t.voitures.reduce((a,v)=>a+v[3]+v[4],0);
   t.occ=Math.round(t.cap*(0.35+Math.random()*0.25));
   t.composition=`${n} voiture${n>1?'s':''} · ${t.cap} pl.`
  }else{
   const n=Math.max(1,Math.min(50,+document.getElementById('ntUnits').value||20));
   const cargo=(document.getElementById('ntCargo').value||'Chargement').trim();
   t.wagons=[[type==='maint'?'Voiture technique':'Wagons trémie',String(n),cargo]];
   t.cap=n*(type==='maint'?12:45);
   t.occ=Math.round(t.cap*(0.5+Math.random()*0.3));
   t.composition=`${n} wagon${n>1?'s':''}`
  }
  initTrain(t);
  TRAINS.push(t);
  selected=t.id;
  mountDynamic();
  const kpis=document.getElementById('trnKpis');if(kpis)kpis.innerHTML=kpisHtml();
  const wrap=document.getElementById('trnTableWrap');if(wrap){wrap.innerHTML=tableHtml();wireTable()}
  selectTrain(t.id);
  if(window.lucide)lucide.createIcons();
  root.innerHTML='';
  if(typeof toast==='function')toast(`${t.id} créé et mis en service · ${stById(from).name} → ${stById(to).name}`)
 };
 render();
 if(!root.__trnModalStop){root.addEventListener('click',e=>e.stopPropagation());root.__trnModalStop=true}
}

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
   if(o===t||o.dir!==t.dir||o.line!==t.line)return;
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
  if(t.line!=='pax')return;
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

/* ---------- schematic geometry: one real SVG <path> per line, straight segments only ---------- */
const geo={};
function pointAtKm(line,km){
 const g=geo[line],cfg=LINES[line];
 if(!g||!g.el)return{x:cfg.points[0][0],y:cfg.points[0][1]};
 const frac=(km-cfg.kmMin)/(cfg.kmMax-cfg.kmMin);
 return g.el.getPointAtLength(Math.max(0,Math.min(1,frac))*g.len)
}
function tangentAt(line,km){
 const g=geo[line],cfg=LINES[line];
 if(!g||!g.el)return 0;
 const frac=(km-cfg.kmMin)/(cfg.kmMax-cfg.kmMin);
 const f=Math.max(0,Math.min(1,frac))*g.len;
 const p1=g.el.getPointAtLength(Math.max(0,f-3)),p2=g.el.getPointAtLength(Math.min(g.len,f+3));
 return Math.atan2(p2.y-p1.y,p2.x-p1.x)
}
function laneOffset(line,km,side){
 const a=tangentAt(line,km);
 return{x:-Math.sin(a)*side,y:Math.cos(a)*side}
}
function trainPoint(t,i){
 const p=pointAtKm(t.line,t.kmPos);
 const off=laneOffset(t.line,t.kmPos,(t.dir>0?1:-1)*LANE+((i%3)-1)*3);
 const tangent=tangentAt(t.line,t.kmPos)*180/Math.PI;
 return{x:p.x+off.x,y:p.y+off.y,angle:t.dir>0?tangent:tangent+180}
}

/* ---------- map svg shell (paths only; stations/signals/trains mounted after DOM insert) ---------- */
function linePath(line){
 return LINES[line].points.map((p,i)=>`${i===0?'M':'L'}${p[0]} ${p[1]}`).join(' ')
}
function svgShell(){
 return `<svg class="trn-map-svg" viewBox="0 0 1200 350" xmlns="http://www.w3.org/2000/svg">
  <path class="trn-track-bed" d="${linePath('fret')}"></path>
  <path class="trn-track-bed" d="${linePath('maint')}"></path>
  <path class="trn-track-bed" d="${linePath('pax')}"></path>
  <path id="trnLineFret" class="trn-track fret" d="${linePath('fret')}"></path>
  <path id="trnLineMaint" class="trn-track maint" d="${linePath('maint')}"></path>
  <path id="trnLinePax" class="trn-track pax" d="${linePath('pax')}"></path>
  <g id="trnDynamic"></g>
 </svg>`
}
function mountDynamic(){
 const svg=document.querySelector('.trn-map-svg');
 if(!svg)return;
 ['pax','fret','maint'].forEach(line=>{
  const el=document.getElementById('trnLine'+line[0].toUpperCase()+line.slice(1));
  if(el)geo[line]={el,len:el.getTotalLength()}
 });
 if(!geo.pax)return;

 const stationsHtml=STATIONS.map((s,i)=>{
  const p=pointAtKm('pax',s.km),above=(i%2===1)||s.id==='FCV';
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
  const p=pointAtKm('pax',sig.km),a=tangentAt('pax',sig.km),side=i%2===0?-1:1;
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
   <g class="consist" transform="rotate(${p.angle.toFixed(1)})">${consistSvg(t)}</g>
   <text class="tag" y="-15">${t.id}</text>
   <text class="dwell" y="24" text-anchor="middle" font-size="8" fill="#c9860f">⏸ à quai</text>
   <text class="waitsig" y="24" text-anchor="middle" font-size="8" fill="#e34850">⛔ signal</text>
  </g>`
 }).join('');

 document.getElementById('trnDynamic').innerHTML=stationsHtml+signalsHtml+trainsHtml;
 ref.trains={};ref.signals=[];
 document.querySelectorAll('.trn-train').forEach(g=>{ref.trains[g.dataset.train]={el:g}});
 document.querySelectorAll('.trn-signal').forEach((g,i)=>{ref.signals[i]=g});
 document.querySelectorAll('.trn-train').forEach(g=>g.onclick=()=>{toggleExpand(g.dataset.train);document.getElementById('trnTableWrap')?.scrollIntoView({behavior:'smooth',block:'center'})});
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

/* ---------- passenger / cargo manifests ---------- */
const FIRST_NAMES=['Jean-Pierre','Alice','Patrick','Nadia','Louis','Grâce','Marc','Paul','Aline','Christian','Sarah','Diane','Rose','Éric','Clovis','Serge','Alain','David','Mireille','Judith','Steevy','Prisca','Yannick','Larissa','Ornella','Franck','Bertrand','Sandrine','Guy-Roger','Rachel','Fabrice','Nadège','Hermann'];
const LAST_NAMES=['Agondjo','Lekogo','Mavoungou','Okoumba','Raponda','Nziengui','Andjoua','Rombi','Mounguengui','Lekabi','Mabika','Moukagni','Obiang','Ndong Ella','Ngoua','Mba','Ondo','Assoumou','Mihindou','Ivala','Boussamba','Ogandaga','Moussavou','Bekale'];
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function seededPerson(seed){const r=mulberry32(seed);return `${FIRST_NAMES[Math.floor(r()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(r()*LAST_NAMES.length)]}`}
function carPassengers(t,v){
 const[,classe,,assises,debout,,colonnes,bloquees]=v;
 const seedBase=hashStr(t.id+v[0]);
 const occRatio=t.cap?Math.min(0.97,t.occ/t.cap):0.7;
 const capacity=Math.max(0,assises-(bloquees||0));
 const occupied=Math.max(0,Math.min(capacity,Math.round(capacity*occRatio)));
 const legStations=STATIONS.filter(s=>s.km>=t.min-0.01&&s.km<=t.max+0.01);
 const rows=[];
 for(let i=0;i<assises;i++){
  const row=Math.floor(i/colonnes)+1,col=String.fromCharCode(65+(i%colonnes)),seat=`${row}${col}`;
  if(i<(bloquees||0)){rows.push({seat,status:'blocked'});continue}
  if(i-(bloquees||0)>=occupied){rows.push({seat,status:'free'});continue}
  const seedI=seedBase+i*97;
  const r=mulberry32(seedI);
  const name=`${FIRST_NAMES[Math.floor(r()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(r()*LAST_NAMES.length)]}`;
  const oi=legStations.length>1?Math.floor(r()*(legStations.length-1)):0;
  const di=Math.min(legStations.length-1,oi+1+Math.floor(r()*Math.max(1,legStations.length-oi-1)));
  const from=legStations[oi]||stById(t.from),to=legStations[di]||stById(t.to);
  rows.push({seat,status:'occupied',name,classe,from:from.name,to:to.name,ref:`SETRAG-${String(10000+seedI%89999)}`})
 }
 const standing=[];
 for(let i=0;i<Math.min(debout,8);i++)standing.push(seededPerson(seedBase+5000+i*53));
 return{rows,standing,standingTotal:debout}
}
function passengerModal(t,v){
 const[code,classe,serie,assises,debout,rangees,colonnes,bloquees]=v;
 const man=carPassengers(t,v);
 const occCount=man.rows.filter(r=>r.status==='occupied').length,freeCount=man.rows.filter(r=>r.status==='free').length;
 const rowsHtml=man.rows.map(r=>r.status==='occupied'?`<tr><td class="seat">${r.seat}</td><td>${esc(r.name)}</td><td>${esc(r.classe)}</td><td>${esc(r.from)} → ${esc(r.to)}</td><td class="ref">${r.ref}</td></tr>`:r.status==='blocked'?`<tr class="blocked"><td class="seat">${r.seat}</td><td colspan="4">Place bloquée · consignée par contrôle</td></tr>`:`<tr class="free"><td class="seat">${r.seat}</td><td colspan="4">Libre</td></tr>`).join('');
 const standingHtml=man.standingTotal?`<div class="trn-car-standing"><b>${man.standingTotal} voyageur${man.standingTotal>1?'s':''} debout</b><span>${man.standing.join(' · ')}${man.standingTotal>man.standing.length?` · +${man.standingTotal-man.standing.length} autres`:''}</span></div>`:'';
 return `<div class="trn-modal-backdrop" data-trn-modal-close><div class="trn-modal trn-modal-wide" onclick="event.stopPropagation()">
  <header><div><span class="trn-modal-eyebrow">FICHE VOITURE · ${esc(t.id)}</span><h3>${esc(code)} · ${esc(classe)}</h3><p>${esc(serie)} · ${rangees}×${colonnes} · ${assises} assises${debout?` · ${debout} places debout`:''}</p></div><button class="trn-modal-close" data-trn-modal-close>×</button></header>
  <div class="trn-car-stats"><span><b>${occCount}</b>occupées</span><span><b>${freeCount}</b>libres</span><span><b>${bloquees||0}</b>bloquées</span></div>
  <div class="trn-car-table-wrap"><table class="trn-car-table"><thead><tr><th>Place</th><th>Voyageur</th><th>Classe</th><th>Trajet</th><th>Réf. billet</th></tr></thead><tbody>${rowsHtml}</tbody></table></div>
  ${standingHtml}
  <footer><button class="btn ghost" data-trn-modal-close>Fermer</button><button class="btn primary" data-block-car="${t.id}:${code}">${bloquees?'Débloquer la place':'Bloquer une place'}</button></footer>
 </div></div>`
}
function techCarModal(t,v){
 const[code,classe,serie]=v;
 const seedBase=hashStr(t.id+code);
 if(classe==='Bagages'){
  const r=mulberry32(seedBase),n=6+Math.floor(r()*8);
  const items=Array.from({length:n},(_,i)=>{
   const rr=mulberry32(seedBase+i*71+1);
   const name=`${FIRST_NAMES[Math.floor(rr()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(rr()*LAST_NAMES.length)]}`;
   const poids=(4+rr()*26).toFixed(1);
   return `<tr><td class="ref">BG-${String(1000+(seedBase+i*71)%9000)}</td><td>${esc(name)}</td><td>${poids} kg</td><td>Enregistré</td></tr>`
  }).join('');
  return `<div class="trn-modal-backdrop" data-trn-modal-close><div class="trn-modal trn-modal-wide" onclick="event.stopPropagation()">
   <header><div><span class="trn-modal-eyebrow">FICHE VOITURE · ${esc(t.id)}</span><h3>${esc(code)} · Bagages</h3><p>${esc(serie)} · fourgon à bagages</p></div><button class="trn-modal-close" data-trn-modal-close>×</button></header>
   <div class="trn-car-table-wrap"><table class="trn-car-table"><thead><tr><th>N° tag</th><th>Propriétaire</th><th>Poids</th><th>Statut</th></tr></thead><tbody>${items}</tbody></table></div>
   <footer><button class="btn primary" data-trn-modal-close>Fermer</button></footer>
  </div></div>`
 }
 const crew=['Chef de bord','Contrôleur','Agent commercial','Agent de sécurité'].map((role,i)=>({role,name:seededPerson(seedBase+i*131+2)}));
 const items=crew.map(c=>`<tr><td>${c.role}</td><td>${esc(c.name)}</td><td>En service</td></tr>`).join('');
 return `<div class="trn-modal-backdrop" data-trn-modal-close><div class="trn-modal trn-modal-wide" onclick="event.stopPropagation()">
  <header><div><span class="trn-modal-eyebrow">FICHE VOITURE · ${esc(t.id)}</span><h3>${esc(code)} · ${esc(classe||'Voiture technique')}</h3><p>${esc(serie)}</p></div><button class="trn-modal-close" data-trn-modal-close>×</button></header>
  <div class="trn-car-table-wrap"><table class="trn-car-table"><thead><tr><th>Fonction</th><th>Agent</th><th>Statut</th></tr></thead><tbody>${items}</tbody></table></div>
  <footer><button class="btn primary" data-trn-modal-close>Fermer</button></footer>
 </div></div>`
}
function cargoModal(t,w){
 const[nom,qte,nature]=w,total=parseInt(qte,10)||1,n=Math.min(12,total);
 const seedBase=hashStr(t.id+nom);
 const rows=Array.from({length:n},(_,i)=>{
  const r=mulberry32(seedBase+i*61+3);
  return `<tr><td class="ref">${t.id}-W${String(i+1).padStart(2,'0')}</td><td>${esc(nature)}</td><td>${(18+r()*22).toFixed(1)} t</td><td>Plombé · conforme</td></tr>`
 }).join('');
 const extra=total>n?`<p class="trn-car-more">+ ${total-n} autres wagons de composition identique</p>`:'';
 return `<div class="trn-modal-backdrop" data-trn-modal-close><div class="trn-modal trn-modal-wide" onclick="event.stopPropagation()">
  <header><div><span class="trn-modal-eyebrow">FICHE WAGONS · ${esc(t.id)}</span><h3>${esc(nom)}</h3><p>${qte} unités · ${esc(nature)}</p></div><button class="trn-modal-close" data-trn-modal-close>×</button></header>
  <div class="trn-car-table-wrap"><table class="trn-car-table"><thead><tr><th>N° wagon</th><th>Contenu</th><th>Poids</th><th>Statut</th></tr></thead><tbody>${rows}</tbody></table></div>
  ${extra}
  <footer><button class="btn primary" data-trn-modal-close>Fermer</button></footer>
 </div></div>`
}
function openCarDetail(trainId,code){
 const t=TRAINS.find(x=>x.id===trainId);
 if(!t)return;
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 if(t.pax){
  const v=t.voitures.find(x=>x[0]===code);
  if(!v)return;
  root.innerHTML=(v[3]||v[4])?passengerModal(t,v):techCarModal(t,v)
 }else{
  const w=t.wagons.find(x=>x[0]===code);
  if(!w)return;
  root.innerHTML=cargoModal(t,w)
 }
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-trn-modal-close]').forEach(x=>x.onclick=()=>{root.innerHTML=''});
 root.querySelectorAll('[data-block-car]').forEach(b=>b.onclick=()=>{
  const[tid,c]=b.dataset.blockCar.split(':'),tt=TRAINS.find(x=>x.id===tid),vv=tt&&tt.voitures.find(x=>x[0]===c);
  if(!vv)return;
  vv[7]=vv[7]?0:1;
  if(typeof toast==='function')toast(vv[7]?`Place bloquée · ${c} · motif consigné`:`Place débloquée · ${c}`);
  const wrap=document.getElementById('trnTableWrap');if(wrap){wrap.innerHTML=tableHtml();wireTable()}
  openCarDetail(tid,c)
 });
 if(!root.__trnModalStop){root.addEventListener('click',e=>e.stopPropagation());root.__trnModalStop=true}
}

/* ---------- circulations table ---------- */
function carCardHtml(t,v){
 const[code,classe,serie,assises,debout,rangees,colonnes,bloquees]=v;
 if(!assises&&!debout)return `<div class="trn-car" data-car-open="${t.id}:${code}"><b>${code} · ${classe}</b><small>${serie}</small><div class="meta"><span>Voiture technique</span></div></div>`;
 return `<div class="trn-car" data-car-open="${t.id}:${code}"><b>${code} · ${classe}</b><small>${serie} · ${rangees}×${colonnes}</small><div class="meta"><span>${assises} assises</span><span>${debout} debout</span></div><button data-block-car="${t.id}:${code}" class="${bloquees?'blocked':''}">${bloquees?bloquees+' place(s) bloquée(s) · débloquer':'Bloquer une place'}</button></div>`
}
function expandHtml(t){
 if(t.pax){
  return `<div class="trn-expand">
   <div class="trn-expand-head"><b>Composition détaillée · ${t.composition}</b><span>Livret horaire ${t.livret} · type ${typeLabel(t.type)} · cliquer une voiture pour la fiche détaillée</span></div>
   <div class="trn-consist">${t.voitures.map(v=>carCardHtml(t,v)).join('')}</div>
  </div>`
 }
 return `<div class="trn-expand">
  <div class="trn-expand-head"><b>Composition détaillée · ${t.composition}</b><span>Type ${typeLabel(t.type)} · cliquer un groupe de wagons pour le manifeste</span></div>
  <div class="trn-consist">${t.wagons.map(w=>`<div class="trn-car" data-car-open="${t.id}:${w[0]}"><b>${w[0]}</b><small>${w[2]}</small><div class="meta"><span>${w[1]} unités</span></div></div>`).join('')}</div>
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
    <div><h2>Réseau Transgabonais · Owendo ↔ Franceville</h2><p>648 km · 8 gares · 3 lignes schématiques (voyageurs / fret-mine / maintenance) · 12 signaux tricolores</p></div>
    <div class="trn-legend">
     <span><i class="line-pax"></i> Ligne voyageurs</span><span><i class="line-fret"></i> Ligne fret / mine</span><span><i class="line-maint"></i> Ligne maintenance</span>
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
 if(!root||!geo.pax)return;
 TRAINS.forEach((t,i)=>{
  const g=ref.trains&&ref.trains[t.id];
  if(!g)return;
  const p=trainPoint(t,i);
  g.el.style.transform=`translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
  const inner=g.el.querySelector('.consist');if(inner)inner.setAttribute('transform',`rotate(${p.angle.toFixed(1)})`);
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
 document.querySelectorAll('[data-car-open]').forEach(el=>el.onclick=e=>{if(e.target.closest('button'))return;e.stopPropagation();const[tid,code]=el.dataset.carOpen.split(':');openCarDetail(tid,code)});
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
 root.querySelectorAll('[data-trn-new]').forEach(b=>b.onclick=()=>newTrainModal());
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
