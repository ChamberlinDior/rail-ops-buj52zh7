(function(){
'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mulberry32(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=0;for(let i=0;i<s.length;i++){h=Math.imul(31,h)+s.charCodeAt(i)|0}return h>>>0}

const STB_STATIONS=[['OWE','Owendo'],['NTM','N’Toum'],['NDJ','Ndjolé'],['LOP','Lopé'],['BOU','Booué'],['LAS','Lastourville'],['MOA','Moanda'],['FCV','Franceville']];
const STB_TRAINS=[['620','EXPRESS'],['624','OMNIBUS'],['551','SPÉCIAL'],['773','EXPRESS'],['118','OMNIBUS']];
function stbStName(code){return(STB_STATIONS.find(s=>s[0]===code)||[,code])[1]}
function stbLine(originCode){
 const idx=STB_STATIONS.findIndex(s=>s[0]===originCode);
 return idx<=STB_STATIONS.length/2?STB_STATIONS.slice(idx+1):STB_STATIONS.slice(0,idx).reverse()
}

let stb={station:'OWE',now:new Date(),boards:{}};

function stbBuildBoard(originCode){
 const rand=mulberry32(hashStr(originCode+'-board-2026'));
 const line=stbLine(originCode);
 if(!line.length)return[];
 const offsets=[-52,-24,-8,6,17,31,48,69,94,124];
 return offsets.map((offMin,i)=>{
  const dest=line[Math.floor(rand()*line.length)];
  const train=STB_TRAINS[Math.floor(rand()*STB_TRAINS.length)];
  const voie=1+Math.floor(rand()*4);
  const base=new Date(Date.now()+offMin*60000);
  base.setSeconds(0,0);
  const delay=rand()<.24?[3,6,9,12,18,25][Math.floor(rand()*6)]:0;
  const cancelled=rand()<.04;
  return{id:`${originCode}-${i}`,ref:`${train[0]}-${Math.floor(600+rand()*380)}`,type:train[1],dest:dest[1],destCode:dest[0],voie,scheduled:base,delay,cancelled}
 }).sort((a,b)=>+a.scheduled-+b.scheduled+((a.delay-b.delay)*0))
}
function stbBuildArrivals(originCode){
 const rand=mulberry32(hashStr(originCode+'-arr-2026'));
 const line=stbLine(originCode);
 if(!line.length)return[];
 const offsets=[-38,-15,-4,9,22,40,63,88];
 return offsets.map((offMin,i)=>{
  const from=line[Math.floor(rand()*line.length)];
  const train=STB_TRAINS[Math.floor(rand()*STB_TRAINS.length)];
  const voie=1+Math.floor(rand()*4);
  const base=new Date(Date.now()+offMin*60000);
  base.setSeconds(0,0);
  const delay=rand()<.22?[4,7,10,15,20][Math.floor(rand()*5)]:0;
  return{id:`${originCode}-a${i}`,ref:`${train[0]}-${Math.floor(600+rand()*380)}`,type:train[1],from:from[1],voie,scheduled:base,delay}
 })
}
function stbBoard(originCode){
 if(!stb.boards[originCode])stb.boards[originCode]={dep:stbBuildBoard(originCode),arr:stbBuildArrivals(originCode)};
 return stb.boards[originCode]
}
function stbFmtHM(d){return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
function stbEffective(row){return new Date(+row.scheduled+row.delay*60000)}
function stbDepStatus(row){
 if(row.cancelled)return{label:'SUPPRIMÉ',cls:'bad'};
 const diffMin=(+stbEffective(row)-Date.now())/60000;
 if(diffMin<-3)return{label:'PARTI',cls:'muted'};
 if(diffMin<=0)return{label:'DÉPART',cls:'muted'};
 if(diffMin<=3)return{label:'DÉPART IMMINENT',cls:'urgent'};
 if(diffMin<=12)return{label:'EMBARQUEMENT',cls:'board'};
 if(row.delay>0)return{label:`RETARDÉ +${row.delay} MIN`,cls:'warn'};
 return{label:'À L’HEURE',cls:'ok'}
}
function stbArrStatus(row){
 const diffMin=(+stbEffective(row)-Date.now())/60000;
 if(diffMin<-4)return{label:'ARRIVÉ',cls:'muted'};
 if(diffMin<=1)return{label:'ARRIVÉE EN COURS',cls:'urgent'};
 if(row.delay>0)return{label:`RETARDÉ +${row.delay} MIN`,cls:'warn'};
 return{label:'À L’HEURE',cls:'ok'}
}
function stbNextDeparture(originCode){
 const rows=stbBoard(originCode).dep;
 return rows.filter(r=>!r.cancelled&&(+stbEffective(r)-Date.now())>-60000).sort((a,b)=>+stbEffective(a)-+stbEffective(b))[0]
}

function stbHeroHtml(originCode){
 const r=stbNextDeparture(originCode);
 if(!r)return `<div class="stb-hero empty">${I('moon-star')}<p>Aucun départ programmé pour l’instant depuis ${esc(stbStName(originCode))}.</p></div>`;
 const st=stbDepStatus(r);
 const diffMin=Math.max(0,Math.round((+stbEffective(r)-Date.now())/60000));
 return `<div class="stb-hero">
  <div class="stb-hero-top"><span>${I('train-front')} PROCHAIN DÉPART · ${esc(stbStName(originCode)).toUpperCase()}</span><b class="stb-hero-status ${st.cls}">${st.label}</b></div>
  <div class="stb-hero-main">
   <div class="stb-hero-time"><b>${stbFmtHM(stbEffective(r))}</b><small>${r.delay?`prévu ${stbFmtHM(r.scheduled)}`:'heure prévue'}</small></div>
   <div class="stb-hero-sep">${I('arrow-right')}</div>
   <div class="stb-hero-dest"><b>${esc(r.dest)}</b><small>${esc(r.type)} · ${esc(r.ref)}</small></div>
   <div class="stb-hero-voie"><small>VOIE</small><b>${r.voie}</b></div>
   <div class="stb-hero-countdown"><small>DÉPART DANS</small><b>${diffMin} MIN</b></div>
  </div>
 </div>`
}
function stbRowHtml(kind,r){
 const st=kind==='dep'?stbDepStatus(r):stbArrStatus(r);
 return `<div class="stb-row ${r.__flash?'flash':''}" data-stb-row="${r.id}">
  <span class="c-time">${stbFmtHM(stbEffective(r))}${r.delay?`<small>${stbFmtHM(r.scheduled)}</small>`:''}</span>
  <span class="c-train">${esc(r.type)}<small>${esc(r.ref)}</small></span>
  <span class="c-dest">${kind==='dep'?esc(r.dest):esc(r.from)}</span>
  <span class="c-voie">${r.voie}</span>
  <span class="c-status ${st.cls}">${st.label}</span>
 </div>`
}
function stbBoardPanelHtml(kind,originCode){
 const rows=stbBoard(originCode)[kind].slice(0,kind==='dep'?9:7);
 const title=kind==='dep'?'Départs':'Arrivées';
 const cols=kind==='dep'?['Heure','Train','Destination','Voie','Statut']:['Heure','Train','En provenance de','Voie','Statut'];
 return `<div class="stb-panel">
  <div class="stb-bracket"></div>
  <div class="stb-screen">
   <div class="stb-screen-bar"><span>${I(kind==='dep'?'plane-takeoff':'plane-landing')} ${title} · ${esc(stbStName(originCode))}</span><b class="stb-clock" id="stbClock${kind}">${stbFmtHM(new Date())}</b></div>
   <div class="stb-cols">${cols.map(c=>`<span>${c}</span>`).join('')}</div>
   <div class="stb-rows" id="stbRows${kind}">${rows.map(r=>stbRowHtml(kind,r)).join('')||`<p class="stb-empty">${I('inbox')} Aucune circulation.</p>`}</div>
  </div>
  <small class="stb-plate">SETRAG · SYSTÈME D’INFORMATION VOYAGEURS · ${esc(originCode)}</small>
 </div>`
}
function stbMapHtml(originCode){
 const r=stbNextDeparture(originCode);
 const activeVoie=r?r.voie:null;
 return `<div class="stb-card">
  <header><h3>${I('map')} Se repérer en gare · ${esc(stbStName(originCode))}</h3><p>Cheminement voyageur, du hall d’entrée jusqu’au quai de départ.</p></header>
  <div class="stb-wayfind">
   ${[['door-open','Entrée principale','Accès voyageurs et PMR'],['ticket','Billetterie & guichets','Achat, retrait, TAA, bagages, colis'],['sofa','Salle d’attente','Écrans d’information et sièges'],['scan-line','Contrôle d’accès','Scan QR / NFC avant embarquement']].map((x,i,arr)=>`<div class="stb-way-step"><i>${I(x[0])}</i><b>${x[1]}</b><span>${x[2]}</span></div>${i<arr.length-1?`<i class="stb-way-arrow">${I('chevron-right')}</i>`:''}`).join('')}
  </div>
  <div class="stb-platforms">
   ${[1,2,3,4].map(v=>`<div class="stb-platform ${v===activeVoie?'active':''}"><b>${I('train-front')} Voie ${v}</b>${v===activeVoie?`<span>${I('circle-dot')} Prochain train · ${r?esc(r.type)+' '+esc(r.ref):''}</span>`:`<span>${I('minus')} Aucun train imminent</span>`}</div>`).join('')}
  </div>
 </div>`
}
function stbStationPicker(){
 return `<div class="stb-picker">${STB_STATIONS.map(s=>`<button class="${s[0]===stb.station?'active':''}" data-stb-station="${s[0]}">${esc(s[1])}</button>`).join('')}</div>`
}
function stbSummaryHtml(originCode){
 const dep=stbBoard(originCode).dep.filter(r=>!r.cancelled);
 const onTime=dep.filter(r=>!r.delay&&!r.cancelled).length;
 const delayed=dep.filter(r=>r.delay>0).length;
 const cancelled=stbBoard(originCode).dep.filter(r=>r.cancelled).length;
 return `<div class="grid kpis" style="margin-top:16px">
  ${kpi('Départs affichés',dep.length,'Aujourd’hui','▤')}
  ${kpi('À l’heure',onTime,`${dep.length?Math.round(onTime/dep.length*100):0}% de la grille`,'✓','#eef8f3')}
  ${kpi('Retardés',delayed,'Recalcul automatique du panneau','◔','#fff4df')}
  ${kpi('Supprimés',cancelled,'Information relayée en gare','✕','#fff0f0')}
 </div>`
}
function stbPageHtml(){
 const o=stb.station;
 return `${pageHead('Écrans de gare','Panneaux d’affichage voyageurs — départs, arrivées, retards en temps réel et signalétique des quais, tels qu’installés en gare.')}
 ${stbStationPicker()}
 ${stbHeroHtml(o)}
 ${stbSummaryHtml(o)}
 <div class="stb-boards">
  ${stbBoardPanelHtml('dep',o)}
  ${stbBoardPanelHtml('arr',o)}
 </div>
 ${stbMapHtml(o)}
 <div class="stb-note"><i>${I('info')}</i><span>Panneaux à double diffusion : écran LED en salle d’attente et rappel sonore automatisé. Les statuts « Retardé », « Embarquement » et « Départ imminent » se recalculent chaque minute à partir de l’horaire théorique et de l’écart constaté.</span></div>`
}
function stbPaint(){
 const root=document.getElementById('stbRoot');
 if(!root)return;
 root.innerHTML=stbPageHtml();
 if(window.lucide)lucide.createIcons();
 stbWire()
}
function stbTickClocks(){
 ['dep','arr'].forEach(k=>{const el=document.getElementById('stbClock'+k);if(el)el.textContent=stbFmtHM(new Date())})
}
function stbRefreshRows(){
 if(!document.getElementById('stbRoot'))return;
 const o=stb.station;
 ['dep','arr'].forEach(kind=>{
  const host=document.getElementById('stbRows'+kind);
  if(!host)return;
  const rows=stbBoard(o)[kind].slice(0,kind==='dep'?9:7);
  host.innerHTML=rows.map(r=>stbRowHtml(kind,r)).join('')||`<p class="stb-empty">${I('inbox')} Aucune circulation.</p>`;
 });
 const hero=document.querySelector('.stb-hero');
 if(hero)hero.outerHTML=stbHeroHtml(o);
 if(window.lucide)lucide.createIcons()
}
function stbPerturb(){
 if(!document.getElementById('stbRoot'))return;
 const o=stb.station,dep=stbBoard(o).dep.filter(r=>!r.cancelled);
 const future=dep.filter(r=>(+stbEffective(r)-Date.now())>3*60000);
 if(!future.length)return;
 const r=future[Math.floor(Math.random()*future.length)];
 r.delay=Math.min(30,r.delay+[3,4,5,6][Math.floor(Math.random()*4)]);
 r.__flash=true;
 stbRefreshRows();
 setTimeout(()=>{r.__flash=false},1600)
}
function stbWire(){
 document.querySelectorAll('[data-stb-station]').forEach(b=>b.onclick=()=>{stb.station=b.dataset.stbStation;stbPaint()});
}
if(!window.__stbTimers){
 window.__stbTimers=true;
 setInterval(stbTickClocks,1000);
 setInterval(stbRefreshRows,15000);
 setInterval(stbPerturb,9000);
}
function stbRenderPage(){return `<div id="stbRoot">${stbPageHtml()}</div>`}
function install(){
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.boards=()=>`<div class="cdc16-scope"><div><b>COUVERTURE CDC SETRAG · PAGE 18/18</b><span>Affichage voyageurs en gare : horaires, retards, voies de départ et signalétique conformes aux standards des grandes gares.</span></div><em>EXIGENCE VISIBLE</em></div>${stbRenderPage()}`;
 if(typeof bind==='function'&&!bind.__stbWrapped){const old=bind;bind=function(){old();if(document.getElementById('stbRoot'))stbWire()};bind.__stbWrapped=true;window.bind=bind}
 const requested=new URLSearchParams(location.search).get('page');
 if(requested==='boards'){const content=document.getElementById('content');if(content&&!document.getElementById('stbRoot')){content.innerHTML=pages.boards();if(window.lucide)lucide.createIcons();if(typeof bind==='function')bind()}}
}
install();
})();
