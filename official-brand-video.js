(function(){
 const logo='public/images/setrag-logo-official.jpg';
 const shell=(cls='')=>`<span class="official-logo ${cls}"><img src="${logo}" alt="SETRAG — Société d’Exploitation du Transgabonais"></span>`;
 const film=document.querySelector('.rail-film');if(film){const video=document.createElement('video');video.className='setrag-brand-video';video.autoplay=true;video.muted=true;video.playsInline=true;video.preload='auto';video.poster='public/images/setrag-cinematic-hero-v2.png';video.innerHTML='<source src="public/videos/setrag-brand-film-v1.mp4" type="video/mp4">';film.prepend(video);video.play().catch(()=>{});const mark=document.createElement('div');mark.className='film-official-brand';mark.innerHTML=shell('official-logo-film');film.append(mark);const heart=document.createElement('div');heart.className='africa-heartbeat';heart.innerHTML=`<svg viewBox="0 0 180 92" aria-hidden="true"><path class="africa-contour" d="M62 8c22-9 57-3 71 12 7 8 8 20 16 28-7 8-17 13-22 23-6 12-9 22-21 17-11-5-12-18-23-25-9-6-20-9-24-20-5-13-17-19-14-34 1-8-9-12-3-21z"/><path class="heart-line" d="M12 52h31l7-12 8 25 10-41 12 36 8-8h27l8-12 8 24 8-12h29"/></svg><div><small>LE CŒUR DU RÉSEAU GABONAIS</small><b>648 km · OWENDO — FRANCEVILLE</b></div>`;film.append(heart)}
 function applyLogos(root=document){
  root.querySelectorAll('.brand-mark:not([data-official])').forEach(x=>{x.dataset.official='1';x.innerHTML=shell('official-logo-sidebar')});
  root.querySelectorAll('.login-brand>span:not([data-official])').forEach(x=>{x.dataset.official='1';x.innerHTML=shell('official-logo-login')});
  root.querySelectorAll('.ticket-head>b:not([data-official]),.ut-brand>strong:not([data-official])').forEach(x=>{x.dataset.official='1';x.innerHTML=shell('official-logo-document')});
  root.querySelectorAll('.badge-brand>b:not([data-official])').forEach(x=>{x.dataset.official='1';x.innerHTML=`${shell('official-logo-badge')}<em>CARTE PROFESSIONNELLE</em>`});
 }
 applyLogos();new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)applyLogos(n.matches?.('.brand-mark,.login-brand,.ticket-head,.ut-brand,.badge-brand')?n.parentElement||n:n)}))).observe(document.body,{childList:true,subtree:true});
})();
