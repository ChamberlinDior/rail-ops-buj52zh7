(function(){
  if(window.BUSINESS_PARTNERSHIP_V2)return;
  const economicPage=window.pages&&pages.business;
  let activePage=new URLSearchParams(location.search).get('page')||window.current||'dashboard';
  document.addEventListener('click',event=>{
    const navigation=event.target.closest('[data-page]');
    if(navigation)activePage=navigation.dataset.page;
  },true);
  function keepEconomicModule(){
    if(window.BUSINESS_PARTNERSHIP_V2)return;
    if(!window.menu||!economicPage)return setTimeout(keepEconomicModule,100);
    pages.business=economicPage;
    if(typeof renderNav==='function'&&!menu.some(group=>group[1].some(item=>item[0]==='business'))){
      menu.push(['MODÈLE ÉCONOMIQUE',[['business','17 · Modèle économique']]]);
      renderNav();
    }
    if(activePage==='business'&&!document.querySelector('.eco')){
      const content=document.querySelector('#content');
      if(content){window.current='business';content.innerHTML=economicPage();if(typeof bind==='function')bind()}
    }
    setTimeout(keepEconomicModule,1200);
  }
  keepEconomicModule();
})();
