(() => {
  const paths = {
    "EXP-620": "M235 62 L270 62 L300 118 L300 194 L310 194 L350 194 L372 174 L480 174 L545 174 L570 154 L685 154 L715 154 L735 125 L735 75 L925 85",
    "MIN-641": "M480 234 L375 234 L350 194 L310 194 L480 204 L545 204 L575 214 L685 214"
  };
  const events = [
    ["EXP-620", "Passage confirmé à Lopé", "Voie principale libérée · 72 km/h", "green"],
    ["MIN-641", "Itinéraire fret réservé", "Accès parc à grumes · priorité validée", "blue"],
    ["EXP-620", "Croisement sécurisé", "Signal S-LOP-E ouvert · aucun conflit", "green"],
    ["MIN-641", "Convoi minéral en circulation", "3 150 t · espacement nominal", "amber"]
  ];
  let frame = 0, installedStage, eventIndex = 0, eventTimer;
  function addTrack(svg, id, d) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d); path.setAttribute("class", "rail-motion-guide");
    svg.insertBefore(path, svg.querySelector(".inter-train")); return path;
  }
  function notify(stage) {
    const [train, title, detail, tone] = events[eventIndex++ % events.length];
    const box = stage.querySelector(".rail-motion-notification"); if (!box) return;
    box.classList.remove("is-visible");
    setTimeout(() => { if (!box.isConnected) return; box.className = `rail-motion-notification ${tone} is-visible`; box.innerHTML = `<span class="rail-notification-icon">✓</span><div><small>ÉVÉNEMENT RÉSEAU · À L’INSTANT</small><b>${train} — ${title}</b><em>${detail}</em></div>`; }, 180);
  }
  function install() {
    const stage = document.querySelector(".rail-stage[data-interlocking-v5]");
    const svg = stage?.querySelector(".interlocking-svg");
    if (!stage || !svg || stage === installedStage) return;
    installedStage = stage; cancelAnimationFrame(frame); clearInterval(eventTimer);
    stage.insertAdjacentHTML("beforeend", `<div class="rail-motion-status"><span><i></i><b>EXP-620</b> Ligne voyageurs</span><span><i class="freight"></i><b>MIN-641</b> Axe fret / parcs</span></div><div class="rail-motion-notification" role="status" aria-live="polite"></div>`);
    const moving = Object.entries(paths).map(([id,d], index) => ({ train: svg.querySelector(`[data-inter-train="${id}"]`), path:addTrack(svg,id,d), duration:index?96000:118000, offset:index?.31:.07, reverse:false })).filter(x=>x.train);
    const start=performance.now(), reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick(now){ moving.forEach(item=>{ let cycle=reduced?item.offset:((now-start)/item.duration+item.offset)%1; let p; if(cycle<.08)p=0; else if(cycle<.5)p=(cycle-.08)/.42; else if(cycle<.58)p=1; else p=1-(cycle-.58)/.42; const l=item.path.getTotalLength(), point=item.path.getPointAtLength(l*p); item.train.style.transform=`translate(${point.x}px, ${point.y}px)`; item.train.dataset.motionActive="true"; }); frame=requestAnimationFrame(tick); }
    tick(start); notify(stage); eventTimer=setInterval(()=>stage.isConnected&&notify(stage),5200);
  }
  new MutationObserver(install).observe(document.body,{childList:true,subtree:true}); install();
})();
