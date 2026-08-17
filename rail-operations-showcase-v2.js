(() => {
  const NS = "http://www.w3.org/2000/svg";
  const routes = [
    { id:"voyageurs", d:"M235 62 L270 62 L300 118 L300 194 L310 194 L350 194 L372 174 L480 174 L545 174 L570 154 L685 154 L715 154 L735 125 L735 75 L925 85", color:"green" },
    { id:"fret", d:"M925 145 L810 145 L790 115 L770 75 L735 75 L735 125 L715 154 L685 154 L570 154 L545 174 L480 174 L372 174 L350 194 L375 234 L480 234", color:"violet" },
    { id:"bois", d:"M310 194 L350 194 C360 206 365 224 375 234 L480 234 C520 234 535 263 575 263 L690 263", color:"amber" },
    { id:"hydro", d:"M235 122 L95 122 C82 122 76 104 68 88 L20 88", color:"blue" },
    { id:"manganese", d:"M735 75 L770 75 C782 83 786 105 795 115 L925 115", color:"violet" },
    { id:"atelier", d:"M480 204 L545 204 C560 212 564 244 580 276 L735 276 C770 276 784 248 810 244", color:"cyan" }
  ];
  const fleet = [
    {id:"EXP-620", route:"voyageurs", units:7, duration:112000, offset:.04, type:"passenger"},
    {id:"MIN-641", route:"fret", units:8, duration:138000, offset:.27, type:"mineral"},
    {id:"BOIS-312", route:"bois", units:6, duration:96000, offset:.10, type:"wood"},
    {id:"HC-118", route:"hydro", units:5, duration:88000, offset:.32, type:"cargo"},
    {id:"MIN-642", route:"manganese", units:7, duration:104000, offset:.16, type:"mineral"},
    {id:"TECH-07", route:"atelier", units:4, duration:82000, offset:.42, type:"service"}
  ];
  let installed, frame;
  const el=(name,attrs={})=>{const n=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n};
  function vehicle(i,type){
    const loco=i===0;
    return `<g class="follow-unit ${loco?'loco':'wagon'} ${type}" data-unit="${i}">${loco?'<path d="M-9 -6 H8 L13 -2 V6 H-9 Z"/><rect x="4" y="-4" width="5" height="4" rx="1"/><path class="nose" d="M13 -2 L17 1 L13 4 Z"/>':'<rect x="-9" y="-5" width="18" height="10" rx="2"/>'}<circle cx="-5" cy="7" r="2"/><circle cx="6" cy="7" r="2"/></g>`;
  }
  function phaseAt(now,item){
    const leg=(now/item.duration)+item.offset, reverse=Math.floor(leg)%2===1, q=leg%1;
    let p, stopped=false, green=q>=.55;
    if(q<.08)p=0; else if(q<.48)p=(q-.08)/.40*.52; else if(q<.58){p=.52;stopped=true}else if(q<.92)p=.52+(q-.58)/.34*.48; else p=1;
    return {p:reverse?1-p:p,direction:reverse?-1:1,stopped,green};
  }
  function install(){
    const stage=document.querySelector('.rail-stage[data-interlocking-v5]'), svg=stage?.querySelector('.interlocking-svg');
    if(!stage||!svg||stage===installed)return; installed=stage; cancelAnimationFrame(frame);
    svg.setAttribute('viewBox','0 0 1000 320'); svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    stage.querySelectorAll('.rail-motion-status,.rail-motion-notification,.rail-motion-guide').forEach(x=>x.remove());
    svg.querySelectorAll('.inter-train').forEach(x=>x.classList.add('legacy-consist-hidden'));
    const routeLayer=el('g',{class:'showcase-route-layer'}), trainLayer=el('g',{class:'showcase-train-layer'}), signalLayer=el('g',{class:'showcase-signal-layer'});
    svg.insertBefore(routeLayer,svg.querySelector('.platform-bars')); svg.append(trainLayer,signalLayer);
    const routeMap={}; routes.forEach(r=>{const bed=el('path',{d:r.d,class:`showcase-rail-bed ${r.color}`}), sleepers=el('path',{d:r.d,class:'showcase-sleepers'}), guide=el('path',{d:r.d,class:'showcase-centerline'});routeLayer.append(bed,sleepers,guide);routeMap[r.id]=guide});
    const signals=[['SIG-OWE',300,187],['SIG-NDJ',472,167],['SIG-LOP',677,147],['SIG-MDA',727,68],['SIG-BOIS',470,227],['SIG-ATELIER',570,268]];
    signals.forEach(([id,x,y],i)=>{const g=el('g',{class:'showcase-signal red',transform:`translate(${x} ${y})`,'data-showcase-signal':id});g.innerHTML=`<path d="M0 0v20M-4 20h8"/><rect x="-5" y="-10" width="10" height="13" rx="3"/><circle cx="0" cy="-6" r="3"/><text x="8" y="-3">${id}</text>`;signalLayer.append(g)});
    const actors=fleet.map(item=>{const g=el('g',{class:'follow-consist','data-follow-train':item.id});g.innerHTML=Array.from({length:item.units},(_,i)=>vehicle(i,item.type)).join('')+`<g class="follow-label"><rect x="-5" y="-26" width="58" height="17" rx="5"/><text x="3" y="-15">${item.id}</text></g>`;trainLayer.append(g);return {...item,path:routeMap[item.route],group:g,parts:[...g.querySelectorAll('.follow-unit')],label:g.querySelector('.follow-label')}});
    stage.insertAdjacentHTML('beforeend','<div class="showcase-live"><b>SUPERVISION TEMPS RÉEL</b><span><i></i> 6 circulations suivies</span><span>6 itinéraires actifs</span><em data-traffic-message>Signalisation automatique opérationnelle</em></div>');
    const message=stage.querySelector('[data-traffic-message]'), start=performance.now(); let lastState='';
    function tick(now){
      actors.forEach((a,idx)=>{const state=phaseAt(now-start,a), length=a.path.getTotalLength(), spacing=18, margin=(a.units-1)*spacing+5, front=margin+(length-margin*2)*state.p;
        a.parts.forEach((part,i)=>{let d=front-i*spacing*state.direction;d=Math.max(1,Math.min(length-1,d));const p=a.path.getPointAtLength(d),p0=a.path.getPointAtLength(Math.max(0,d-1.5)),p1=a.path.getPointAtLength(Math.min(length,d+1.5));let angle=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI;if(state.direction<0)angle+=180;part.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`)});
        const lead=a.path.getPointAtLength(front);a.label.setAttribute('transform',`translate(${lead.x} ${lead.y})`);a.group.classList.toggle('is-stopped',state.stopped);
        const sig=signalLayer.children[idx];sig?.classList.toggle('green',state.green);sig?.classList.toggle('red',!state.green);
        if(idx===0){const key=state.stopped?'stop':state.green?'go':'approach';if(key!==lastState){lastState=key;message.textContent=key==='stop'?'EXP-620 arrêté au signal · itinéraire en contrôle':key==='go'?'Voie libérée · EXP-620 autorisé au départ':'Approche contrôlée · cantons surveillés'}}
      }); frame=requestAnimationFrame(tick)
    } tick(start);
  }
  new MutationObserver(install).observe(document.body,{childList:true,subtree:true});install();
})();
