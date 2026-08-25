(function(){'use strict';
 const clean=value=>(value||'').replace(/\s+/g,' ').trim();
 const labelFor=element=>clean(element.getAttribute('title')||element.dataset.label||element.dataset.action||element.dataset.page||element.name||element.id||'Action disponible');
 function enhance(root=document){
  document.documentElement.lang='fr';
  const content=document.querySelector('#content');
  if(content){content.setAttribute('role','main');content.setAttribute('tabindex','-1');content.setAttribute('aria-label','Contenu principal SETRAG PILOTAGE')}
  root.querySelectorAll?.('nav').forEach((nav,index)=>{if(!nav.hasAttribute('aria-label'))nav.setAttribute('aria-label',index?'Navigation contextuelle':'Navigation principale')});
  root.querySelectorAll?.('button,a[href],[role="button"]').forEach(control=>{
   if(!clean(control.getAttribute('aria-label'))&&!clean(control.textContent))control.setAttribute('aria-label',labelFor(control));
   if(control.tagName==='BUTTON'&&!control.hasAttribute('type'))control.setAttribute('type','button');
  });
  root.querySelectorAll?.('img').forEach(image=>{if(!image.hasAttribute('alt'))image.alt=''});
  root.querySelectorAll?.('input,select,textarea').forEach(field=>{
   if(field.hasAttribute('aria-label')||field.id&&document.querySelector(`label[for="${CSS.escape(field.id)}"]`)||field.closest('label'))return;
   field.setAttribute('aria-label',clean(field.placeholder||field.name||field.type||'Champ de saisie'));
  });
  root.querySelectorAll?.('table').forEach(table=>{
   if(table.hasAttribute('aria-label')||table.querySelector('caption'))return;
   const area=table.closest('section,.pd-card,.pyx-section,.trn-section,.trk-card')||table.parentElement;
   table.setAttribute('aria-label',clean(area?.querySelector('h1,h2,h3')?.textContent)||'Données opérationnelles');
  });
  root.querySelectorAll?.('.txd-dialog,.pd-dialog,.capx-dialog,.doc-center,.apx-panel,[aria-modal="true"]').forEach(dialog=>{
   dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
   if(!dialog.hasAttribute('aria-label'))dialog.setAttribute('aria-label',clean(dialog.querySelector('h1,h2,h3')?.textContent)||'Fenêtre de dialogue');
  });
  root.querySelectorAll?.('tr[data-exd-row],tr[data-row],tr[onclick]').forEach(row=>{
   row.tabIndex=0;row.dataset.a11yKeyboard='true';
   if(!row.hasAttribute('aria-label'))row.setAttribute('aria-label',clean(row.textContent));
  });
 }
 function install(){
  if(!document.querySelector('.a11y-skip')){const skip=document.createElement('a');skip.className='a11y-skip';skip.href='#content';skip.textContent='Aller au contenu principal';document.body.prepend(skip)}
  enhance();
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)enhance(node)}))).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('keydown',event=>{
   if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-a11y-keyboard]')){event.preventDefault();event.target.click()}
   if(event.key==='Escape'){const close=[...document.querySelectorAll('[data-exd-close],[data-txd-close],[data-close],.doc-close,.drawer-x')].filter(x=>x.offsetParent!==null).pop();if(close)close.click()}
  });
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install,{once:true}):install();
})();
