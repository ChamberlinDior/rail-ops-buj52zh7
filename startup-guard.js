(function(){'use strict';
function unlock(){document.querySelectorAll('.rail-film,.op-loading').forEach(x=>x.remove());let enter=document.querySelector('#enterDemo');if(enter){enter.disabled=false;enter.classList.add('ready');enter.removeAttribute('aria-busy')}document.documentElement.classList.add('startup-ready')}
document.addEventListener('DOMContentLoaded',()=>setTimeout(unlock,8500));
window.addEventListener('error',e=>{if(String(e.filename||'').includes('unpkg.com'))unlock()});
})();
