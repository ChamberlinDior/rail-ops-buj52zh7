(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtNum=n=>new Intl.NumberFormat('fr-FR').format(Math.round(n));
// Neutralizes upgrade.js's global enhanceTables(), which rewrites any table's
// first/last cell (fake avatar, generic "···" menu) unless these markers exist.
const noAvatar='<span class="avatar-cell" style="display:none" aria-hidden="true"></span>';
const noDots='<span class="row-actions" style="display:none" aria-hidden="true"></span>';
function csvDownload(name,head,rows){
 const csv='﻿'+[head,...rows].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(a.href),500)
}

const AGENCIES=[
 {code:'AG-OWE-01',name:'Owendo · Gare',gare:'Owendo',type:'Premium',superviseur:'Grace Mavoungou',guichetsActifs:6,guichetsTotal:6,capacite:520},
 {code:'AG-OWE-02',name:'Owendo · Marché',gare:'Owendo',type:'Accréditée',superviseur:'Paul Ndong',guichetsActifs:3,guichetsTotal:4,capacite:180},
 {code:'AG-OWE-03',name:'Owendo · Port',gare:'Owendo',type:'Accréditée',superviseur:'Hermann Okomo',guichetsActifs:2,guichetsTotal:3,capacite:140},
 {code:'AG-NTM-01',name:'N’Toum · Gare',gare:'N’Toum',type:'Accréditée',superviseur:'Sylvie Boussamba',guichetsActifs:2,guichetsTotal:2,capacite:110},
 {code:'AG-NDJ-01',name:'Ndjolé · Gare',gare:'Ndjolé',type:'Accréditée',superviseur:'Jean Mba',guichetsActifs:2,guichetsTotal:3,capacite:120},
 {code:'AG-LOP-01',name:'Lopé · Gare',gare:'Lopé',type:'Accréditée',superviseur:'Alice Ogandaga',guichetsActifs:1,guichetsTotal:2,capacite:90},
 {code:'AG-BOU-01',name:'Booué · Gare',gare:'Booué',type:'Premium',superviseur:'Serge Obame',guichetsActifs:5,guichetsTotal:5,capacite:360},
 {code:'AG-BOU-02',name:'Booué · Centre',gare:'Booué',type:'Accréditée',superviseur:'Odile Mintsa',guichetsActifs:2,guichetsTotal:3,capacite:130},
 {code:'AG-LAS-01',name:'Lastourville · Gare',gare:'Lastourville',type:'Accréditée',superviseur:'Marc Ivanga',guichetsActifs:2,guichetsTotal:2,capacite:100},
 {code:'AG-MOA-01',name:'Moanda · Gare',gare:'Moanda',type:'Premium',superviseur:'Christelle Boukandou',guichetsActifs:4,guichetsTotal:4,capacite:300},
 {code:'AG-MOA-02',name:'Moanda · Manganèse',gare:'Moanda',type:'Accréditée',superviseur:'Fabrice Mihindou',guichetsActifs:2,guichetsTotal:3,capacite:150},
 {code:'AG-FCV-01',name:'Franceville · Gare',gare:'Franceville',type:'Premium',superviseur:'Patrick Biyoghe',guichetsActifs:6,guichetsTotal:6,capacite:480},
 {code:'AG-FCV-02',name:'Franceville · Centre',gare:'Franceville',type:'Accréditée',superviseur:'Nadia Raponda',guichetsActifs:3,guichetsTotal:4,capacite:170},
 {code:'AG-FCV-03',name:'Franceville · Université',gare:'Franceville',type:'Accréditée',superviseur:'Diane Assoumou',guichetsActifs:2,guichetsTotal:2,capacite:120},
 {code:'AG-LBV-01',name:'Libreville · Siège commercial',gare:'Libreville',type:'Premium',superviseur:'Mireille Agondjo',guichetsActifs:5,guichetsTotal:5,capacite:400},
 {code:'AG-LBV-02',name:'Libreville · Nord',gare:'Libreville',type:'Accréditée',superviseur:'Louis Nziengui',guichetsActifs:4,guichetsTotal:5,capacite:220},
 {code:'AG-LBV-03',name:'Libreville · Sud',gare:'Libreville',type:'Accréditée',superviseur:'Aline Lekabi',guichetsActifs:3,guichetsTotal:4,capacite:190},
 {code:'AG-LBV-04',name:'Libreville · Aéroport',gare:'Libreville',type:'Accréditée',superviseur:'Christian Mabika',guichetsActifs:3,guichetsTotal:3,capacite:200}
];
const agencyByCode=c=>AGENCIES.find(a=>a.code===c);

const TRAINS_Q=[
 {id:'EXP-620',label:'Express voyageurs',segments:['Owendo → Franceville','Owendo → Booué','Booué → Franceville','Owendo → N’Toum']},
 {id:'OMN-624',label:'Omnibus voyageurs',segments:['Franceville → Owendo','Franceville → Booué','Booué → Owendo']},
 {id:'SPE-551',label:'Spécial voyageurs',segments:['Owendo → N’Toum']}
];
const trainById=id=>TRAINS_Q.find(t=>t.id===id);
const CLASSES=['1re','2e','VIP'];

let nextId=15;
let allocations=[
 {id:1,agence:'AG-OWE-01',train:'EXP-620',segment:'Owendo → Franceville',classe:'1re',date:'20/08/2026',quota:40,vendu:34,cancelled:false},
 {id:2,agence:'AG-LBV-04',train:'EXP-620',segment:'Owendo → Booué',classe:'VIP',date:'20/08/2026',quota:18,vendu:18,cancelled:false},
 {id:3,agence:'AG-FCV-01',train:'OMN-624',segment:'Franceville → Owendo',classe:'2e',date:'20/08/2026',quota:60,vendu:41,cancelled:false},
 {id:4,agence:'AG-NTM-01',train:'SPE-551',segment:'Owendo → N’Toum',classe:'2e',date:'21/08/2026',quota:30,vendu:9,cancelled:false},
 {id:5,agence:'AG-BOU-01',train:'EXP-620',segment:'Owendo → Franceville',classe:'VIP',date:'21/08/2026',quota:12,vendu:12,cancelled:false},
 {id:6,agence:'AG-MOA-02',train:'OMN-624',segment:'Franceville → Owendo',classe:'1re',date:'21/08/2026',quota:25,vendu:20,cancelled:false},
 {id:7,agence:'AG-LBV-01',train:'EXP-620',segment:'Owendo → Franceville',classe:'1re',date:'22/08/2026',quota:45,vendu:12,cancelled:false},
 {id:8,agence:'AG-FCV-02',train:'EXP-620',segment:'Owendo → Franceville',classe:'2e',date:'22/08/2026',quota:50,vendu:47,cancelled:false},
 {id:9,agence:'AG-LAS-01',train:'OMN-624',segment:'Franceville → Owendo',classe:'2e',date:'22/08/2026',quota:22,vendu:22,cancelled:false},
 {id:10,agence:'AG-NDJ-01',train:'SPE-551',segment:'Owendo → N’Toum',classe:'VIP',date:'23/08/2026',quota:10,vendu:3,cancelled:false},
 {id:11,agence:'AG-LOP-01',train:'EXP-620',segment:'Owendo → Franceville',classe:'2e',date:'23/08/2026',quota:28,vendu:19,cancelled:false},
 {id:12,agence:'AG-OWE-02',train:'EXP-620',segment:'Owendo → Franceville',classe:'1re',date:'23/08/2026',quota:20,vendu:20,cancelled:false},
 {id:13,agence:'AG-LBV-02',train:'OMN-624',segment:'Franceville → Owendo',classe:'VIP',date:'23/08/2026',quota:15,vendu:0,cancelled:true},
 {id:14,agence:'AG-FCV-03',train:'SPE-551',segment:'Owendo → N’Toum',classe:'1re',date:'20/08/2026',quota:16,vendu:10,cancelled:false}
];

function statusOf(a){
 if(a.cancelled)return 'Annulé';
 const restant=a.quota-a.vendu;
 if(restant<=0)return 'Épuisé';
 if(a.vendu>0&&a.vendu/a.quota<0.35)return 'Sous-utilisé';
 return 'Actif'
}
function statusCls(s){return s==='Sous-utilisé'?'warn':s==='Annulé'?'bad':s==='Épuisé'?'info':''}

let filter='all';
let search='';
const FILTERS=[['all','Toutes'],['actif','Actives'],['sous-utilise','Sous-utilisées'],['epuise','Épuisées'],['annule','Annulées']];

function filteredAllocations(){
 const q=search.trim().toLowerCase();
 return allocations.filter(a=>{
  const st=statusOf(a);
  if(filter==='actif'&&st!=='Actif')return false;
  if(filter==='sous-utilise'&&st!=='Sous-utilisé')return false;
  if(filter==='epuise'&&st!=='Épuisé')return false;
  if(filter==='annule'&&st!=='Annulé')return false;
  if(q){
   const ag=agencyByCode(a.agence);
   const hay=`${ag?ag.code:''} ${ag?ag.name:''} ${ag?ag.type:''} ${a.train} ${a.segment} ${a.classe}`.toLowerCase();
   if(!hay.includes(q))return false
  }
  return true
 })
}

function kpisHtml(){
 const live=allocations.filter(a=>!a.cancelled);
 const accreditees=AGENCIES.filter(a=>a.type==='Accréditée').length;
 const premium=AGENCIES.filter(a=>a.type==='Premium').length;
 const guichetsActifs=AGENCIES.reduce((s,a)=>s+a.guichetsActifs,0);
 const guichetsTotal=AGENCIES.reduce((s,a)=>s+a.guichetsTotal,0);
 const placesAffectees=live.reduce((s,a)=>s+a.quota,0);
 const circulations=new Set(live.map(a=>a.train+'·'+a.date)).size;
 const tauxMoyen=live.length?Math.round(live.reduce((s,a)=>s+a.vendu/a.quota,0)/live.length*100):0;
 const epuises=live.filter(a=>statusOf(a)==='Épuisé').length;
 const sousUtilises=live.filter(a=>statusOf(a)==='Sous-utilisé').length;
 return [
  ['Agences actives',AGENCIES.length,`${accreditees} accréditées · ${premium} Premium`,'building-2',''],
  ['Guichets actifs',guichetsActifs,`sur ${guichetsTotal} guichets homologués`,'monitor-check',guichetsActifs<guichetsTotal?'warn':'good'],
  ['Places affectées',fmtNum(placesAffectees),`sur ${circulations} circulations suivies`,'armchair','#edf5ff'],
  ['Taux d’utilisation moyen',tauxMoyen+' %',`${epuises} épuisées · ${sousUtilises} sous-utilisées`,'gauge',sousUtilises?'warn':'good']
 ].map(k=>`<div class="card kpi" style="--tint:${k[4].startsWith('#')?k[4]:'#e8f6ef'}"><span class="icon">${I(k[3])}</span><label>${k[0]}</label><strong>${k[1]}</strong><span class="trend ${k[4]==='warn'?'down':''}">${k[2]}</span></div>`).join('')
}

function rowsHtml(){
 const list=filteredAllocations();
 if(!list.length)return `<tr><td colspan="9" class="aq-empty">${I('inbox')} Aucune affectation ne correspond à ces critères.</td></tr>`;
 return list.map(a=>{
  const ag=agencyByCode(a.agence);
  const st=statusOf(a);
  const restant=Math.max(0,a.quota-a.vendu);
  const pct=a.quota?Math.round(a.vendu/a.quota*100):0;
  const t=trainById(a.train);
  return `<tr class="${a.cancelled?'aq-row-cancelled':''}" data-alloc-row="${a.id}">
   <td>${noAvatar}<div class="aq-stack"><b>${ag.code}</b><small>${esc(ag.name)}</small></div></td>
   <td><span class="aq-type-pill ${ag.type==='Premium'?'premium':''}">${ag.type}</span></td>
   <td><div class="aq-stack"><b>${a.train}</b><small>${esc(t?t.label:'')} · ${a.date}</small></div></td>
   <td>${esc(a.segment)}</td>
   <td>${a.classe}</td>
   <td>${a.quota}</td>
   <td>${a.vendu}</td>
   <td><div class="progress" title="${pct}% vendu"><i style="width:${pct}%"></i></div>${restant}</td>
   <td><span class="status ${statusCls(st)}">${st}</span></td>
   <td>${noDots}<div class="aq-row-actions">
    <button class="btn ghost" data-alloc-detail="${a.id}" title="Détails">${I('eye')}</button>
    ${a.cancelled
     ?`<button class="btn ghost" data-alloc-reassign="${a.id}">Réaffecter</button>`
     :`<button class="btn ghost" data-alloc-edit="${a.id}">Modifier</button><button class="btn ghost aq-cancel-btn" data-alloc-cancel="${a.id}">Annuler</button>`}
   </div></td>
  </tr>`
 }).join('')
}

function scopeBanner(){
 return `<div class="cdc16-scope"><div><b>COUVERTURE CDC SETRAG · PAGE 10/19</b><span>22 gares, agences accréditées/Premium, 89 postes, guichets, affectations et quotas.</span></div><em>EXIGENCE VISIBLE</em></div>`
}

function segmentOptions(trainId,selected){
 const t=trainById(trainId);
 return t.segments.map(s=>`<option value="${esc(s)}" ${s===selected?'selected':''}>${esc(s)}</option>`).join('')
}

function quotaModalHtml(mode,alloc){
 const isEdit=mode==='edit';
 const a=alloc||{};
 const ag=isEdit?agencyByCode(a.agence):null;
 const t=isEdit?trainById(a.train):TRAINS_Q[0];
 return `<div class="modal-backdrop" data-aq-modal-overlay><div class="modal">
  <div class="modal-head"><div><span class="subtle">${isEdit?'MODIFIER LE QUOTA':'NOUVELLE AFFECTATION'}</span><h2>${isEdit?`${ag.code} · ${esc(ag.name)}`:'Affecter un quota'}</h2></div><button class="icon-btn" data-aq-modal-close>×</button></div>
  <div class="modal-body">
   <form id="aqForm" data-alloc-id="${isEdit?a.id:''}">
   <div class="form-grid">
    <div class="field"><label>Agence / point de vente</label>${isEdit
     ?`<input class="input" value="${ag.code} · ${esc(ag.name)}" disabled>`
     :`<select id="aqAgence">${AGENCIES.map(x=>`<option value="${x.code}">${x.code} · ${esc(x.name)} · ${x.type}</option>`).join('')}</select>`}
    </div>
    <div class="field"><label>Train</label>${isEdit
     ?`<input class="input" value="${a.train} · ${esc(t.label)}" disabled>`
     :`<select id="aqTrain">${TRAINS_Q.map(x=>`<option value="${x.id}">${x.id} · ${esc(x.label)}</option>`).join('')}</select>`}
    </div>
    <div class="field"><label>Trajet / segment</label>${isEdit
     ?`<input class="input" value="${esc(a.segment)}" disabled>`
     :`<select id="aqSegment">${segmentOptions(TRAINS_Q[0].id)}</select>`}
    </div>
    <div class="field"><label>Classe</label>${isEdit
     ?`<input class="input" value="${a.classe}" disabled>`
     :`<select id="aqClasse">${CLASSES.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>`}
    </div>
    <div class="field"><label>Date de départ</label>${isEdit
     ?`<input class="input" value="${a.date}" disabled>`
     :`<select id="aqDate"><option>20/08/2026</option><option>21/08/2026</option><option>22/08/2026</option><option>23/08/2026</option><option>24/08/2026</option></select>`}
    </div>
    <div class="field"><label>Quota de places${isEdit?` (déjà vendu : ${a.vendu})`:''}</label><input class="input" type="number" id="aqQuota" min="${isEdit?a.vendu:1}" value="${isEdit?a.quota:20}"></div>
   </div>
   <p class="aq-hint">${I('info')} Un quota peut porter sur le trajet complet ou un segment (ex. Owendo → Booué), conformément à la disponibilité calculée par segment. La place est réservée temporairement pendant le paiement pour éviter toute double vente.</p>
   </form>
  </div>
  <div class="modal-foot"><button class="btn ghost" data-aq-modal-close>Annuler</button><button class="btn primary" data-aq-modal-submit>${isEdit?'Enregistrer le nouveau quota':'Affecter le quota'}</button></div>
 </div></div>`
}

function openQuotaModal(mode,allocId){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 const alloc=allocId?allocations.find(x=>x.id===allocId):null;
 root.innerHTML=quotaModalHtml(mode,alloc);
 wireModal(mode,alloc);
 if(window.lucide)lucide.createIcons()
}
function closeModal(){
 const root=document.querySelector('#modalRoot');
 if(root&&root.querySelector('#aqForm'))root.innerHTML=''
}
function wireModal(mode,alloc){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.querySelectorAll('[data-aq-modal-close]').forEach(b=>b.onclick=closeModal);
 const overlay=root.querySelector('[data-aq-modal-overlay]');
 if(overlay){
  overlay.addEventListener('click',e=>e.stopPropagation());
  overlay.onclick=e=>{if(e.target===overlay)closeModal()}
 }
 const trainSel=root.querySelector('#aqTrain');
 if(trainSel)trainSel.onchange=()=>{
  const segSel=root.querySelector('#aqSegment');
  if(segSel)segSel.innerHTML=segmentOptions(trainSel.value)
 };
 root.querySelector('[data-aq-modal-submit]').onclick=()=>{
  const quotaInput=root.querySelector('#aqQuota');
  const quota=Number(quotaInput.value);
  if(mode==='edit'){
   if(!quota||quota<alloc.vendu){
    if(typeof toast==='function')toast(`Le quota ne peut pas être inférieur aux ${alloc.vendu} places déjà vendues`);
    return
   }
   alloc.quota=quota;
   closeModal();
   refreshTable();
   if(typeof toast==='function')toast(`Quota mis à jour · ${agencyByCode(alloc.agence).code} · ${alloc.train} · nouveau quota ${quota} places`);
   return
  }
  if(!quota||quota<1){
   if(typeof toast==='function')toast('Merci de saisir un quota valide (minimum 1 place)');
   return
  }
  const agence=root.querySelector('#aqAgence').value;
  const train=root.querySelector('#aqTrain').value;
  const segment=root.querySelector('#aqSegment').value;
  const classe=root.querySelector('#aqClasse').value;
  const date=root.querySelector('#aqDate').value;
  allocations.unshift({id:nextId++,agence,train,segment,classe,date,quota,vendu:0,cancelled:false});
  closeModal();
  filter='all';
  refreshTable();
  const ag=agencyByCode(agence);
  if(typeof toast==='function')toast(`Quota affecté · ${ag.code} · ${train} (${segment}) · ${classe} · ${quota} places`)
 }
}

function drawerContentHtml(a){
 const ag=agencyByCode(a.agence);
 const t=trainById(a.train);
 const st=statusOf(a);
 const restant=Math.max(0,a.quota-a.vendu);
 const pct=a.quota?Math.round(a.vendu/a.quota*100):0;
 return `<header><div><small>FICHE AFFECTATION</small><h2>${ag.code}</h2><span class="status ${statusCls(st)}">${st}</span></div><button data-aq-drawer-close>×</button></header>
 <p class="sub">${esc(ag.name)} · ${ag.gare} · ${ag.type}</p>
 <div class="trk-detail-grid">
  <span><small>Superviseur</small><b>${esc(ag.superviseur)}</b></span>
  <span><small>Guichets</small><b>${ag.guichetsActifs} / ${ag.guichetsTotal} actifs</b></span>
  <span><small>Capacité indicative</small><b>${fmtNum(ag.capacite)} places/mois</b></span>
  <span><small>Train / départ</small><b>${a.train} · ${a.date}</b></span>
  <span><small>Trajet / segment</small><b>${esc(a.segment)}</b></span>
  <span><small>Classe</small><b>${a.classe}</b></span>
  <span><small>Quota affecté</small><b>${a.quota} places</b></span>
  <span><small>Vendu / Restant</small><b>${a.vendu} / ${restant}</b></span>
 </div>
 <div class="progress" style="width:100%;height:8px;margin:4px 0 14px"><i style="width:${pct}%"></i></div>
 <div class="trk-detail-actions">
  ${a.cancelled?`<button data-aq-reassign="${a.id}">${I('rotate-ccw')} Réaffecter ce quota</button>`:`<button data-aq-edit="${a.id}">${I('pencil')} Modifier le quota</button><button data-aq-cancel="${a.id}">${I('circle-x')} Annuler l’affectation</button>`}
  <button data-aq-export="${a.id}">${I('download')} Exporter la fiche</button>
 </div>
 <p class="aq-trace">${I('shield-check')} Traçabilité : agent, date, heure, train, classe et motif enregistrés pour toute action sur cette affectation.</p>`
}
function openDrawer(id){
 const root=document.querySelector('#modalRoot');
 const a=allocations.find(x=>x.id===id);
 if(!root||!a)return;
 root.innerHTML=`<div class="trk-drawer-overlay" data-aq-drawer-overlay><div class="trk-drawer">${drawerContentHtml(a)}</div></div>`;
 wireDrawer();
 if(window.lucide)lucide.createIcons()
}
function closeDrawer(){
 const root=document.querySelector('#modalRoot');
 if(root&&root.querySelector('.trk-drawer'))root.innerHTML=''
}
function wireDrawer(){
 const root=document.querySelector('#modalRoot');
 if(!root||!root.querySelector('.trk-drawer'))return;
 const overlay=root.querySelector('[data-aq-drawer-overlay]');
 if(overlay){
  overlay.addEventListener('click',e=>e.stopPropagation());
  overlay.onclick=e=>{if(e.target===overlay)closeDrawer()}
 }
 root.querySelectorAll('[data-aq-drawer-close]').forEach(b=>b.onclick=closeDrawer);
 const editBtn=root.querySelector('[data-aq-edit]');
 if(editBtn)editBtn.onclick=()=>{const id=Number(editBtn.dataset.aqEdit);closeDrawer();openQuotaModal('edit',id)};
 const reassignBtn=root.querySelector('[data-aq-reassign]');
 if(reassignBtn)reassignBtn.onclick=()=>{closeDrawer();openQuotaModal('create')};
 const cancelBtn=root.querySelector('[data-aq-cancel]');
 if(cancelBtn)cancelBtn.onclick=()=>{const id=Number(cancelBtn.dataset.aqCancel);cancelAllocation(id);closeDrawer()};
 const exportBtn=root.querySelector('[data-aq-export]');
 if(exportBtn)exportBtn.onclick=()=>{
  const id=Number(exportBtn.dataset.aqExport);
  const a=allocations.find(x=>x.id===id);
  const ag=agencyByCode(a.agence);
  csvDownload(`SETRAG-quota-${ag.code}-${a.train}.csv`,['Champ','Valeur'],[
   ['Agence',`${ag.code} · ${ag.name}`],['Type',ag.type],['Superviseur',ag.superviseur],
   ['Train',a.train],['Trajet / segment',a.segment],['Classe',a.classe],['Date',a.date],
   ['Quota',a.quota],['Vendu',a.vendu],['Restant',Math.max(0,a.quota-a.vendu)],['Statut',statusOf(a)]
  ]);
  if(typeof toast==='function')toast('Fiche affectation exportée')
 }
}

function cancelAllocation(id){
 const a=allocations.find(x=>x.id===id);
 if(!a||a.cancelled)return;
 a.cancelled=true;
 refreshTable();
 const ag=agencyByCode(a.agence);
 if(typeof toast==='function')toast(`Affectation annulée · ${ag.code} · ${a.train} · ${a.quota} places libérées`)
}

function refreshTable(){
 const body=document.getElementById('aqTableBody');
 if(body){body.innerHTML=rowsHtml();wireRows()}
 const kpis=document.getElementById('aqKpis');
 if(kpis)kpis.innerHTML=kpisHtml();
 if(window.lucide)lucide.createIcons()
}

let cancelArm=null;
function wireRows(){
 document.querySelectorAll('[data-alloc-detail]').forEach(b=>b.onclick=()=>openDrawer(Number(b.dataset.allocDetail)));
 document.querySelectorAll('[data-alloc-edit]').forEach(b=>b.onclick=()=>openQuotaModal('edit',Number(b.dataset.allocEdit)));
 document.querySelectorAll('[data-alloc-reassign]').forEach(b=>b.onclick=()=>openQuotaModal('create'));
 document.querySelectorAll('[data-alloc-cancel]').forEach(b=>b.onclick=()=>{
  const id=Number(b.dataset.allocCancel);
  if(cancelArm===id){cancelArm=null;cancelAllocation(id);return}
  cancelArm=id;
  const original=b.textContent;
  b.textContent='Confirmer ?';
  b.classList.add('confirm');
  setTimeout(()=>{if(cancelArm===id){cancelArm=null;b.textContent=original;b.classList.remove('confirm')}},3000)
 })
}

function render(){
 return `<div class="aq-page">
 ${scopeBanner()}
 <div class="page-head"><div><h1>Points de vente & agences</h1><p>Réseau commercial, guichets homologués et quotas de places par agence, train et segment.</p></div><div class="actions"><button class="btn ghost" data-aq-import>${I('upload')} Importer les guichets</button><button class="btn primary" data-aq-new>${I('plus')} Affecter un quota</button></div></div>
 <div class="grid kpis" id="aqKpis">${kpisHtml()}</div>
 <div class="card aq-table-card">
  <div class="aq-table-head">
   <div><h3>${I('store')} Affectations de quotas</h3><p class="sub">${allocations.filter(a=>!a.cancelled).length} affectations actives sur ${AGENCIES.length} agences accréditées et Premium</p></div>
   <div class="aq-toolbar">
    <div class="aq-filters" id="aqFilters">${FILTERS.map(f=>`<button class="${filter===f[0]?'active':''}" data-aq-filter="${f[0]}">${f[1]}</button>`).join('')}</div>
    <label class="aq-search">${I('search')}<input id="aqSearch" placeholder="Rechercher une agence, un train, un segment…"></label>
    <button class="btn ghost" data-aq-export-all>${I('download')} Exporter</button>
   </div>
  </div>
  <div class="aq-table-scroll"><table class="aq-table">
   <thead><tr><th>Agence</th><th>Type</th><th>Train / départ</th><th>Trajet / segment</th><th>Classe</th><th>Quota</th><th>Vendu</th><th>Restant</th><th>Statut</th><th>Actions</th></tr></thead>
   <tbody id="aqTableBody">${rowsHtml()}</tbody>
  </table></div>
 </div>
 <div class="card aq-note">${I('shield-check')}<div><small>GOUVERNANCE DES QUOTAS</small><h3>Disponibilité par segment et prévention des doubles ventes</h3><p>Une place vendue sur un segment (ex. Owendo → Booué) reste disponible pour un segment ultérieur du même train si elle est libre. Toute affectation, modification ou annulation de quota est journalisée : agent, date, heure, train, classe et motif.</p></div></div>
 </div>`
}

function wire(){
 if(typeof current!=='undefined'&&current!=='agencies')return;
 const root=document.querySelector('.aq-page');
 if(!root)return;
 if(!root.__aqStop){root.addEventListener('click',e=>e.stopPropagation());root.__aqStop=true}
 if(window.lucide)lucide.createIcons();
 wireRows();
 const newBtn=root.querySelector('[data-aq-new]');
 if(newBtn)newBtn.onclick=()=>openQuotaModal('create');
 const importBtn=root.querySelector('[data-aq-import]');
 if(importBtn)importBtn.onclick=()=>{if(typeof toast==='function')toast(`Import terminé · ${AGENCIES.reduce((s,a)=>s+a.guichetsTotal,0)} guichets synchronisés sur ${AGENCIES.length} agences`)};
 root.querySelectorAll('[data-aq-filter]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.aqFilter;
  root.querySelectorAll('[data-aq-filter]').forEach(x=>x.classList.toggle('active',x.dataset.aqFilter===filter));
  refreshTable()
 });
 const searchInput=root.querySelector('#aqSearch');
 if(searchInput)searchInput.oninput=()=>{search=searchInput.value;refreshTable()};
 const exportAllBtn=root.querySelector('[data-aq-export-all]');
 if(exportAllBtn)exportAllBtn.onclick=()=>{
  csvDownload('SETRAG-quotas-agences.csv',['Agence','Type','Superviseur','Train','Trajet','Classe','Date','Quota','Vendu','Restant','Statut'],
   filteredAllocations().map(a=>{const ag=agencyByCode(a.agence);return [ag.code+' · '+ag.name,ag.type,ag.superviseur,a.train,a.segment,a.classe,a.date,a.quota,a.vendu,Math.max(0,a.quota-a.vendu),statusOf(a)]}));
  if(typeof toast==='function')toast('Affectations exportées en CSV')
 }
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.agencies=render;
 if(typeof bind==='function'&&!bind.__aqWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__aqWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="agencies"].active')||document.querySelector('.aq-page');
 if(requested==='agencies'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
