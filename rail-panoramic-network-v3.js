(() => {
 const NS='http://www.w3.org/2000/svg', routes=[
  ['main','M-40 138 L170 138 C235 138 250 178 310 178 L520 178 C590 178 610 120 680 120 L930 120 C1000 120 1025 158 1100 158 L1390 158 C1480 158 1510 110 1590 110 L1980 110','main'],
  ['return','M-40 208 L210 208 C275 208 290 248 350 248 L610 248 C680 248 705 195 770 195 L1030 195 C1095 195 1110 225 1180 225 L1460 225 C1535 225 1560 178 1640 178 L1980 178','main2'],
  ['port','M170 138 C155 105 130 82 92 65 L-50 65','blue'],
  ['wood-a','M350 248 C375 290 400 330 455 346 L720 346','wood'],
  ['wood-b','M455 346 C490 375 520 402 575 414 L790 414','wood'],
  ['mine-a','M680 120 C715 83 750 62 810 62 L1080 62','mineral'],
  ['mine-b','M810 62 C850 32 900 22 960 22 L1220 22','mineral'],
  ['yard','M770 195 C810 245 850 282 915 290 L1210 290 C1280 290 1305 325 1370 325 L1570 325','cyan'],
  ['depot','M1100 158 C1135 112 1170 88 1230 88 L1450 88','amber'],
  ['forest','M1180 225 C1215 270 1250 365 1330 385 L1600 385 C1680 385 1710 430 1790 446 L1990 446','wood'],
  ['terminal','M1460 225 C1510 265 1540 280 1600 280 L1980 280','violet'],
  ['maintenance','M915 290 C940 335 985 455 1060 475 L1390 475','grey']
 ], fleet=[
  ['EXP-620','main',8,176000,.04,'passenger'],['EXP-773','return',7,184000,.31,'passenger'],['MIN-641','mine-a',10,150000,.18,'mineral'],['MIN-642','mine-b',9,162000,.49,'mineral'],['BOIS-204','wood-a',8,132000,.12,'wood'],['BOIS-312','forest',9,190000,.38,'wood'],['HC-118','port',7,122000,.22,'cargo'],['FRET-332','terminal',8,166000,.55,'cargo'],['TECH-07','maintenance',5,142000,.09,'service'],['MAN-017','yard',6,148000,.67,'service']
 ];
 let installed,raf;const E=(n,a={})=>{const x=document.createElementNS(NS,n);Object.entries(a).forEach(([k,v])=>x.setAttribute(k,v));return x};
 function unit(i,t){return `<g class="pan-unit ${i?'wagon':'loco'} ${t}" data-u="${i}">${i?'<rect x="-10" y="-5" width="20" height="10" rx="2"/>':'<path d="M-10-6H8l7 5v7h-25z"/><rect x="3" y="-4" width="6" height="4" rx="1"/>'}<circle cx="-6" cy="7" r="2"/><circle cx="6" cy="7" r="2"/></g>`}
 function phase(now,a){const leg=now/a.duration+a.offset,rev=Math.floor(leg)%2>0,q=leg%1;let p,stop=false,green=q>.56;if(q<.07)p=0;else if(q<.45)p=(q-.07)/.38*.48;else if(q<.53){p=.48;stop=true}else if(q<.94)p=.48+(q-.53)/.41*.52;else p=1;return{p:rev?1-p:p,dir:rev?-1:1,stop,green}}
 function install(){const stage=document.querySelector('.rail-stage[data-interlocking-v5]'),svg=stage?.querySelector('.interlocking-svg');if(!stage||!svg||stage===installed)return;installed=stage;cancelAnimationFrame(raf);stage.dataset.panoramic='v3';svg.setAttribute('viewBox','0 0 1900 520');svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  const layer=E('g',{class:'pan-network'}),trains=E('g',{class:'pan-trains'}),signals=E('g',{class:'pan-signals'}),labels=E('g',{class:'pan-labels'});svg.append(layer,labels,trains,signals);const map={};
  routes.forEach(([id,d,c])=>{const halo=E('path',{d,class:`pan-rail-halo ${c}`}),bed=E('path',{d,class:`pan-rail ${c}`}),sleep=E('path',{d,class:'pan-sleepers'}),center=E('path',{d,class:'pan-center'});layer.append(halo,bed,sleep,center);map[id]=center});
  [['OWENDO / PORT',95,105],['NDJOLÉ',350,218],['LOPÉ',675,90],['BOOUÉ',930,90],['IVINDO',1100,130],['LASTOURVILLE',1385,128],['MOANDA',1590,80],['FRANCEVILLE',1810,80],['PARC À GRUMES',520,330],['TERMINAL MINIER',965,48],['ATELIER CENTRAL',1050,455],['FAISCEAU FRET',1640,260]].forEach(([n,x,y],i)=>{const g=E('g',{class:'pan-node',transform:`translate(${x} ${y})`});g.innerHTML=`<circle r="${i<8?7:5}"/><text x="12" y="3">${n}</text><small></small>`;labels.append(g)});
  const sigPos=[[190,132],[510,172],[670,114],[925,114],[1090,152],[1380,152],[1580,104],[1795,104],[600,340],[900,56],[1200,284],[1580,274],[1050,469],[1750,440]];sigPos.forEach(([x,y],i)=>{const g=E('g',{class:'pan-signal red',transform:`translate(${x} ${y})`});g.innerHTML=`<path d="M0 0v18"/><rect x="-5" y="-10" width="10" height="13" rx="3"/><circle cy="-6" r="3"/><text x="8" y="-3">S-${String(i+1).padStart(2,'0')}</text>`;signals.append(g)});
  const actors=fleet.map(([id,r,units,duration,offset,type])=>{const g=E('g',{class:'pan-consist','data-pan-train':id});g.innerHTML=Array.from({length:units},(_,i)=>unit(i,type)).join('')+`<g class="pan-tag"><rect x="-6" y="-27" width="66" height="18" rx="5"/><text x="3" y="-15">${id}</text></g>`;trains.append(g);return{id,path:map[r],duration,offset,units,parts:[...g.querySelectorAll('.pan-unit')],tag:g.querySelector('.pan-tag'),group:g}});
  stage.insertAdjacentHTML('beforeend','<div class="pan-scroll-hint"><span>←</span><b>RÉSEAU ÉTENDU · FAITES DÉFILER HORIZONTALEMENT</b><span>→</span></div><div class="pan-command"><small>POSTE DE COMMANDEMENT CENTRALISÉ</small><b>10 circulations · 12 itinéraires · 14 signaux</b><span>Protection automatique des cantons active</span></div>');
  const start=performance.now();function tick(t){actors.forEach((a,i)=>{const s=phase(t-start,a),L=a.path.getTotalLength(),space=19,margin=(a.units-1)*space+8,front=margin+(L-margin*2)*s.p;a.parts.forEach((u,j)=>{let d=Math.max(1,Math.min(L-1,front-j*space*s.dir)),p=a.path.getPointAtLength(d),p0=a.path.getPointAtLength(Math.max(0,d-2)),p1=a.path.getPointAtLength(Math.min(L,d+2)),ang=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI+(s.dir<0?180:0);u.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${ang})`)});const lead=a.path.getPointAtLength(front);a.tag.setAttribute('transform',`translate(${lead.x} ${lead.y})`);a.group.classList.toggle('stopped',s.stop);const sig=signals.children[i%sigPos.length];sig.classList.toggle('green',s.green);sig.classList.toggle('red',!s.green)});raf=requestAnimationFrame(tick)}tick(start);
 }
 new MutationObserver(install).observe(document.body,{childList:true,subtree:true});install();
})();
