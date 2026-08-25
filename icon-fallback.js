(function(){'use strict';
 if(window.lucide&&typeof window.lucide.createIcons==='function')return;
 const NS='http://www.w3.org/2000/svg';
 const paths={
  check:'M20 6 9 17l-5-5',close:'M18 6 6 18M6 6l12 12',search:'m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  plus:'M12 5v14M5 12h14',minus:'M5 12h14',arrow:'M5 12h14m-5-5 5 5-5 5',download:'M12 3v12m-5-5 5 5 5-5M5 21h14',
  train:'M4 15.5V5c0-2 2-3 8-3s8 1 8 3v10.5M4 11h16M8 19l-2 3m10-3 2 3M7 16h.01M17 16h.01',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',user:'M20 21a8 8 0 0 0-16 0m12-11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  alert:'M10.3 2.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01',
  file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8M8 17h8',
  map:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15',settings:'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v3m0 13v3m9.5-9.5h-3m-13 0h-3m16.2-6.2-2.1 2.1M7.9 16.1l-2.1 2.1m12.4 0-2.1-2.1M7.9 7.9 5.8 5.8'
 };
 function pick(name){name=(name||'').toLowerCase();if(/check|badge|circle-check/.test(name))return paths.check;if(/(^x$|x-circle|x-square|close)/.test(name))return paths.close;if(/search|zoom/.test(name))return paths.search;if(/plus|add|create/.test(name))return paths.plus;if(/minus/.test(name))return paths.minus;if(/download|export|save/.test(name))return paths.download;if(/train|tram|rail/.test(name))return paths.train;if(/shield|lock|security/.test(name))return paths.shield;if(/user|person|crew/.test(name))return paths.user;if(/alert|warning|triangle/.test(name))return paths.alert;if(/file|document|report|ticket/.test(name))return paths.file;if(/map|route|navigation/.test(name))return paths.map;if(/setting|gear|sliders/.test(name))return paths.settings;if(/arrow|chevron|move/.test(name))return paths.arrow;return 'M4 12h16M12 4v16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7'}
 function createIcons(options={}){const root=options.root||document;root.querySelectorAll('[data-lucide]:not(svg)').forEach(node=>{const svg=document.createElementNS(NS,'svg');[...node.attributes].forEach(a=>{if(a.name!=='data-lucide')svg.setAttribute(a.name,a.value)});svg.setAttribute('data-lucide',node.dataset.lucide||'fallback');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','2');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(NS,'path');path.setAttribute('d',pick(node.dataset.lucide));svg.append(path);node.replaceWith(svg)})}
 window.lucide={createIcons,icons:{},__localFallback:true};
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>createIcons(),{once:true}):createIcons();
})();
