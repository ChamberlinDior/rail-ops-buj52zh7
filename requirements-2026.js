(function(){
  const add=(section,id,label,icon)=>{
    icons[id]=`<i data-lucide="${icon}"></i>`;
    const group=menu.find(g=>g[0]===section); if(group&&!group[1].some(x=>x[0]===id))group[1].push([id,label]);
  };
  for(let i=menu.length-1;i>=0;i--)if(menu[i][0]==='MODULES MÉTIER')menu.splice(i,1);
  add('PILOTAGE','monitoring','Monitoring technique','activity');
  add('EXPLOITATION','stations','Gares','warehouse');
  add('EXPLOITATION','schedules','Horaires & livrets','calendar-clock');
  add('RELATION VOYAGEUR','bags','Bagages','luggage');
  add('RELATION VOYAGEUR','parcels','Colis express','package-check');
  add('RELATION VOYAGEUR','taa','Transport Auto Accompagné','car-front');
  add('RELATION VOYAGEUR','funeral','Transport funéraire','shield-check');
  add('RELATION VOYAGEUR','agencies','Agences','building-2');
  add('RELATION VOYAGEUR','pos','Points de vente','store');
  add('FINANCE','cancellations','Annulations','ticket-x');
  add('FINANCE','refunds','Remboursements','receipt-text');
  add('FINANCE','accounting','Comptabilité','calculator');
  add('FINANCE','sage','Sage X3','database-zap');
  add('ADMINISTRATION','roles','Rôles & permissions','key-round');

  const blockData=[
    ['Activité commerciale','sales','shopping-cart','78,45 M','4 892 ventes','Panier moyen 16 037 FCFA','+12,6 %'],
    ['Billets & voyageurs','customers','users-round','86 420','24 812 fidèles','96,4 % consentements','+1 248'],
    ['Produits voyageurs','bags','luggage','841 bagages','314 colis','29 TAA · 18 funéraires','98,7 % tracés'],
    ['Trains & exploitation','tracking','train-front','18 actifs','91 % ponctualité','2 retards · 1 incident','Direct · 8 s'],
    ['Ventes par canal','pos','store','38 % Agences','31 % Mobile Money','19 % Web · 12 % TPE','12 sites'],
    ['Paiements & caisses','payments','credit-card','78,45 M TTC','4,50 M en attente','1,80 M d’écarts','91,9 % rapproché'],
    ['Contrôle & fraude','control','scan-line','12 468 scans','481 irrégularités','6 alertes actives','96,1 % valides'],
    ['Comptabilité & Sage X3','accounting','landmark','65,42 M HT','11,78 M TVA','1,25 M CSS','2 lots à exporter'],
    ['Terminaux & TPE','devices','tablet-smartphone','84 / 91 en ligne','4 batteries faibles','7 hors ligne','92,3 % disponibles'],
    ['Monitoring technique','monitoring','activity','99,98 %','42 ms API','Sage X3 en vigilance','0 interruption'],
    ['Intelligence locale','analytics','brain-circuit','12 anomalies','94,2 % confiance','+18,4 % demande','3 recommandations']
  ];
  const oldDashboard=pages.dashboard;
  pages.dashboard=()=>`${oldDashboard()}<section class="neo-command-center"><header><div><span class="neo-live"><i></i> SYNTHÈSE EXÉCUTIVE 2026</span><h2>Vision unifiée du réseau</h2><p>Lecture consolidée commerciale, ferroviaire, financière et technique.</p></div><div class="neo-context"><button>National</button><button>Aujourd’hui</button><button>Tous produits</button><button>Tous canaux</button></div></header><div class="neo-domain-grid">${blockData.map((b,i)=>`<button class="neo-domain" data-go="${b[1]}" style="--delay:${i*35}ms"><span class="neo-domain-icon"><i data-lucide="${b[2]}"></i></span><small>${b[0]}</small><strong>${b[3]}</strong><div><span>${b[4]}</span><span>${b[5]}</span></div><em>${b[6]}</em><i class="neo-arrow" data-lucide="arrow-up-right"></i></button>`).join('')}</div><footer><span><i data-lucide="shield-check"></i> Données souveraines · dernière consolidation il y a 8 secondes</span><button data-go="reports">Ouvrir le cockpit Direction <i data-lucide="arrow-right"></i></button></footer></section>`;

  const oldNavigate=navigate;
  navigate=function(id){oldNavigate(id);document.body.dataset.page=id;setTimeout(()=>{document.querySelectorAll('.content>.page-head,.content>.op-header,.content>.capacity-premium').forEach(x=>x.classList.add('neo-enter'));if(window.lucide)lucide.createIcons()},0)};
  const oldBind2026=bind;
  bind=function(){oldBind2026();document.querySelectorAll('.neo-domain,[data-go]').forEach(x=>x.onclick=()=>navigate(x.dataset.go));};
  renderNav(); if(window.lucide)lucide.createIcons();
})();
