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

let nextId=15;
let travelers=[
 {id:1,cl:'CL-009821',name:'Nadia Raponda',phone:'+241 06 45 22 19',urgence:'Rose Raponda',urgencePhone:'+241 06 22 11 04',ville:'Owendo',billets:18,upcoming:2,bagages:24,colis:2,taa:0,depenses:486000,remb:1,controle:'Valide',consentOk:true,consentDate:'12/06/2026',fidelite:'Or',assistance:false,assistanceNote:'',classe:'1re classe',place:'Fenêtre',nextTrip:'EXP-620 · 22/08/2026',ref:'SET-260812-5012'},
 {id:2,cl:'CL-009822',name:'Louis Nziengui',phone:'+241 07 78 11 04',urgence:'Marc Meye',urgencePhone:'+241 07 40 21 08',ville:'Franceville',billets:7,upcoming:0,bagages:8,colis:4,taa:0,depenses:146500,remb:0,controle:'À contrôler',consentOk:false,consentDate:'25/08/2026',fidelite:'Argent',assistance:false,assistanceNote:'',classe:'2e classe',place:'Couloir',nextTrip:null,ref:'SET-260802-4821'},
 {id:3,cl:'CL-009823',name:'Alice Andjoua',phone:'+241 06 90 32 44',urgence:'Paul Ndong',urgencePhone:'+241 06 88 14 09',ville:'Booué',billets:11,upcoming:1,bagages:6,colis:1,taa:0,depenses:92000,remb:0,controle:'Valide',consentOk:true,consentDate:'02/07/2026',fidelite:'Aucune',assistance:true,assistanceNote:'Fauteuil roulant · EXP-620',classe:'2e classe',place:'Accessible PMR',nextTrip:'EXP-620 · 22/08/2026',ref:'SET-260812-5104'},
 {id:4,cl:'CL-009824',name:'Marc Rombi',phone:'+241 06 12 44 87',urgence:'Julie Rombi',urgencePhone:'+241 06 55 90 12',ville:'Owendo',billets:4,upcoming:1,bagages:2,colis:0,taa:1,depenses:285000,remb:0,controle:'Valide',consentOk:true,consentDate:'18/05/2026',fidelite:'Argent',assistance:false,assistanceNote:'',classe:'VIP',place:'Salon',nextTrip:'EXP-773 · 23/08/2026',ref:'SET-260812-5210'},
 {id:5,cl:'CL-009825',name:'Christian Mabika',phone:'+241 06 20 04 00',urgence:'Odile Mabika',urgencePhone:'+241 06 77 30 21',ville:'Owendo',billets:32,upcoming:1,bagages:3,colis:0,taa:0,depenses:612000,remb:0,controle:'Valide',consentOk:true,consentDate:'04/03/2026',fidelite:'Platine',assistance:false,assistanceNote:'',classe:'1re classe',place:'Fenêtre',nextTrip:'OMN-624 · 21/08/2026',ref:'SET-260721-4402'},
 {id:6,cl:'CL-009826',name:'Sylvie Boussamba',phone:'+241 07 33 18 42',urgence:'Henri Boussamba',urgencePhone:'+241 07 90 11 56',ville:'N’Toum',billets:2,upcoming:0,bagages:1,colis:0,taa:0,depenses:36000,remb:0,controle:'Invalide',consentOk:false,consentDate:'—',fidelite:'Aucune',assistance:false,assistanceNote:'',classe:'2e classe',place:'Couloir',nextTrip:null,ref:'SET-260618-3390'},
 {id:7,cl:'CL-009827',name:'Paul Ndong',phone:'+241 06 88 14 09',urgence:'Alice Andjoua',urgencePhone:'+241 06 90 32 44',ville:'Booué',billets:9,upcoming:1,bagages:5,colis:2,taa:0,depenses:118000,remb:0,controle:'Valide',consentOk:true,consentDate:'22/04/2026',fidelite:'Argent',assistance:false,assistanceNote:'',classe:'2e classe',place:'Fenêtre',nextTrip:'OMN-624 · 21/08/2026',ref:'SET-260812-5231'},
 {id:8,cl:'CL-009828',name:'Grace Mavoungou',phone:'+241 06 14 00 82',urgence:'Serge Mavoungou',urgencePhone:'+241 06 44 09 51',ville:'Owendo',billets:6,upcoming:0,bagages:2,colis:0,taa:0,depenses:78000,remb:0,controle:'Valide',consentOk:true,consentDate:'30/01/2026',fidelite:'Or',assistance:false,assistanceNote:'',classe:'1re classe',place:'Fenêtre',nextTrip:null,ref:'SET-260512-2214'},
 {id:9,cl:'CL-009829',name:'Diane Assoumou',phone:'+241 07 21 65 30',urgence:'Eric Assoumou',urgencePhone:'+241 07 09 44 12',ville:'Franceville',billets:3,upcoming:1,bagages:0,colis:1,taa:0,depenses:54000,remb:0,controle:'À contrôler',consentOk:false,consentDate:'28/08/2026',fidelite:'Aucune',assistance:true,assistanceNote:'Déficience visuelle · chien guide · SPE-551',classe:'2e classe',place:'Prioritaire',nextTrip:'SPE-551 · 20/08/2026',ref:'SET-260812-5188'},
 {id:10,cl:'CL-009830',name:'Fabrice Mihindou',phone:'+241 06 66 12 09',urgence:'Nadia Mihindou',urgencePhone:'+241 06 71 88 40',ville:'Moanda',billets:14,upcoming:1,bagages:9,colis:3,taa:0,depenses:221000,remb:0,controle:'Valide',consentOk:true,consentDate:'09/06/2026',fidelite:'Or',assistance:false,assistanceNote:'',classe:'1re classe',place:'Couloir',nextTrip:'EXP-620 · 23/08/2026',ref:'SET-260812-5240'},
 {id:11,cl:'CL-009831',name:'Odile Mintsa',phone:'+241 07 55 30 18',urgence:'Jean Mintsa',urgencePhone:'+241 07 12 66 04',ville:'Booué',billets:5,upcoming:0,bagages:3,colis:0,taa:0,depenses:68000,remb:0,controle:'Valide',consentOk:true,consentDate:'11/02/2026',fidelite:'Aucune',assistance:false,assistanceNote:'',classe:'2e classe',place:'Fenêtre',nextTrip:null,ref:'SET-260410-1187'},
 {id:12,cl:'CL-009832',name:'Hermann Okomo',phone:'+241 06 40 77 15',urgence:'Christelle Okomo',urgencePhone:'+241 06 82 19 33',ville:'Owendo',billets:21,upcoming:1,bagages:11,colis:5,taa:1,depenses:398000,remb:1,controle:'Valide',consentOk:true,consentDate:'15/05/2026',fidelite:'Platine',assistance:false,assistanceNote:'',classe:'VIP',place:'Salon',nextTrip:'EXP-620 · 22/08/2026',ref:'SET-260812-5266'},
 {id:13,cl:'CL-009833',name:'Aline Lekabi',phone:'+241 07 60 24 88',urgence:'Michel Lekabi',urgencePhone:'+241 07 18 55 02',ville:'Libreville',billets:8,upcoming:1,bagages:4,colis:1,taa:0,depenses:132000,remb:0,controle:'Valide',consentOk:true,consentDate:'03/07/2026',fidelite:'Argent',assistance:true,assistanceNote:'Femme enceinte · priorité embarquement · EXP-620',classe:'1re classe',place:'Prioritaire',nextTrip:'EXP-620 · 20/08/2026',ref:'SET-260812-5091'},
 {id:14,cl:'CL-009834',name:'Serge Obame',phone:'+241 06 91 40 27',urgence:'Pauline Obame',urgencePhone:'+241 06 33 71 19',ville:'Booué',billets:16,upcoming:1,bagages:6,colis:2,taa:0,depenses:244000,remb:0,controle:'À contrôler',consentOk:true,consentDate:'20/03/2026',fidelite:'Or',assistance:false,assistanceNote:'',classe:'1re classe',place:'Fenêtre',nextTrip:'OMN-624 · 21/08/2026',ref:'SET-260812-5247'}
];

function statusCls(s){return s==='À contrôler'?'warn':s==='Invalide'?'bad':''}

let filter='all';
let search='';
const FILTERS=[['all','Tous'],['upcoming','Voyages à venir'],['assistance','Assistance'],['consent','Consentement à renouveler'],['loyalty','Fidélité']];

function filteredTravelers(){
 const q=search.trim().toLowerCase();
 return travelers.filter(t=>{
  if(filter==='upcoming'&&!t.nextTrip)return false;
  if(filter==='assistance'&&!t.assistance)return false;
  if(filter==='consent'&&t.consentOk)return false;
  if(filter==='loyalty'&&t.fidelite==='Aucune')return false;
  if(q){
   const hay=`${t.name} ${t.phone} ${t.urgence} ${t.ville} ${t.ref} ${t.controle}`.toLowerCase();
   if(!hay.includes(q))return false
  }
  return true
 })
}

function kpisHtml(){
 return [
  ['Voyageurs actifs','86 420','+1 248 ce mois','users-round',''],
  ['Consentements RGPD','96,4 %','Objectif 98 % · renouvellement auto sous 30 j','shield-check','good'],
  ['Assistances programmées','42','12 prochaines circulations','accessibility','#edf5ff'],
  ['Contacts d’urgence','98,7 %','Renseignés à l’émission du billet','phone-call','good']
 ].map(k=>`<div class="card kpi" style="--tint:${k[4].startsWith('#')?k[4]:'#e8f6ef'}"><span class="icon">${I(k[3])}</span><label>${k[0]}</label><strong>${k[1]}</strong><span class="trend">${k[2]}</span></div>`).join('')
}

function rowsHtml(){
 const list=filteredTravelers();
 if(!list.length)return `<tr><td colspan="8" class="aq-empty">${I('user-x')} Aucun voyageur ne correspond à ces critères.</td></tr>`;
 return list.map(t=>`<tr data-traveler-row="${t.id}">
  <td>${noAvatar}<div class="aq-stack"><b>${esc(t.name)}</b><small>${t.cl} · ${esc(t.ville)}</small></div></td>
  <td>${t.phone}</td>
  <td><div class="aq-stack"><b>${esc(t.urgence)}</b><small>${t.urgencePhone}</small></div></td>
  <td><b>${t.billets}</b>${t.upcoming?`<small class="aq-sub-line">${t.upcoming} à venir</small>`:''}</td>
  <td>${t.bagages} / ${t.colis}</td>
  <td>${fmtNum(t.depenses)} <small class="aq-sub-line">FCFA</small></td>
  <td><span class="status ${statusCls(t.controle)}">${t.controle}</span></td>
  <td>${noDots}<div class="aq-row-actions">
   <button class="btn ghost" data-traveler-detail="${t.id}" title="Détails">${I('eye')}</button>
   <button class="btn ghost" data-traveler-fiche="${t.id}">Fiche</button>
  </div></td>
 </tr>`).join('')
}

function scopeBanner(){
 return `<div class="cdc16-scope"><div><b>COUVERTURE CDC SETRAG · PAGE 9/19</b><span>Recherche et extraction par train, date, opération ; manifeste et fiche voyageur 360°.</span></div><em>EXIGENCE VISIBLE</em></div>`
}

function newTravelerModalHtml(){
 return `<div class="modal-backdrop" data-nt-modal-overlay><div class="modal">
  <div class="modal-head"><div><span class="subtle">RÉFÉRENTIEL VOYAGEURS</span><h2>Nouveau voyageur</h2></div><button class="icon-btn" data-nt-modal-close>×</button></div>
  <div class="modal-body">
   <form id="ntForm">
   <div class="form-grid">
    <div class="field"><label>Nom complet</label><input class="input" id="ntName" placeholder="Ex. Jeanne Okouyi"></div>
    <div class="field"><label>Téléphone</label><input class="input" id="ntPhone" placeholder="+241 06 00 00 00"></div>
    <div class="field"><label>Contact d’urgence</label><input class="input" id="ntUrgence" placeholder="Nom du contact"></div>
    <div class="field"><label>Téléphone d’urgence</label><input class="input" id="ntUrgencePhone" placeholder="+241 06 00 00 00"></div>
    <div class="field"><label>Gare / ville habituelle</label><select id="ntVille"><option>Owendo</option><option>N’Toum</option><option>Ndjolé</option><option>Lopé</option><option>Booué</option><option>Lastourville</option><option>Moanda</option><option>Franceville</option><option>Libreville</option></select></div>
    <div class="field"><label>Classe préférée</label><select id="ntClasse"><option>2e classe</option><option>1re classe</option><option>VIP</option></select></div>
   </div>
   <p class="aq-hint">${I('info')} Le consentement RGPD est recueilli lors de la première émission de billet ; il apparaît « à recueillir » jusqu’à confirmation du voyageur.</p>
   </form>
  </div>
  <div class="modal-foot"><button class="btn ghost" data-nt-modal-close>Annuler</button><button class="btn primary" data-nt-modal-submit>Créer le profil voyageur</button></div>
 </div></div>`
}
function openNewTravelerModal(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.innerHTML=newTravelerModalHtml();
 wireNewTravelerModal();
 if(window.lucide)lucide.createIcons()
}
function closeNewTravelerModal(){
 const root=document.querySelector('#modalRoot');
 if(root&&root.querySelector('#ntForm'))root.innerHTML=''
}
function wireNewTravelerModal(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.querySelectorAll('[data-nt-modal-close]').forEach(b=>b.onclick=closeNewTravelerModal);
 const overlay=root.querySelector('[data-nt-modal-overlay]');
 if(overlay){
  overlay.addEventListener('click',e=>e.stopPropagation());
  overlay.onclick=e=>{if(e.target===overlay)closeNewTravelerModal()}
 }
 root.querySelector('[data-nt-modal-submit]').onclick=()=>{
  const name=root.querySelector('#ntName').value.trim();
  const phone=root.querySelector('#ntPhone').value.trim();
  if(!name||!phone){
   if(typeof toast==='function')toast('Merci de renseigner au minimum le nom et le téléphone du voyageur');
   return
  }
  const urgence=root.querySelector('#ntUrgence').value.trim()||'—';
  const urgencePhone=root.querySelector('#ntUrgencePhone').value.trim()||'—';
  const ville=root.querySelector('#ntVille').value;
  const classe=root.querySelector('#ntClasse').value;
  const id=nextId++;
  travelers.unshift({id,cl:'CL-0098'+(35+id),name,phone,urgence,urgencePhone,ville,billets:0,upcoming:0,bagages:0,colis:0,taa:0,depenses:0,remb:0,controle:'Valide',consentOk:false,consentDate:'à recueillir',fidelite:'Aucune',assistance:false,assistanceNote:'',classe,place:'À définir',nextTrip:null,ref:'—'});
  closeNewTravelerModal();
  filter='all';
  refreshTable();
  if(typeof toast==='function')toast(`Profil voyageur créé · ${name} · consentement RGPD à recueillir à la première émission`)
 }
}

function drawerContentHtml(t){
 return `<header><div><small>FICHE VOYAGEUR 360°</small><h2>${esc(t.name)}</h2><span class="status ${statusCls(t.controle)}">${t.controle}</span></div><button data-cust-drawer-close>×</button></header>
 <p class="sub">${t.cl} · ${esc(t.ville)} · ${t.phone}</p>
 <div class="trk-detail-grid">
  <span><small>Billets</small><b>${t.billets} voyages${t.upcoming?` · ${t.upcoming} à venir`:''}</b></span>
  <span><small>Prestations</small><b>${t.bagages} bagages · ${t.colis} colis${t.taa?` · ${t.taa} TAA`:''}</b></span>
  <span><small>Finance</small><b>${fmtNum(t.depenses)} FCFA${t.remb?` · ${t.remb} remboursement`:''}</b></span>
  <span><small>Préférences</small><b>${t.classe} · ${t.place}</b></span>
  <span><small>Contact d’urgence</small><b>${esc(t.urgence)} · ${t.urgencePhone}</b></span>
  <span><small>Fidélité</small><b>${t.fidelite}</b></span>
  <span><small>Consentement RGPD</small><b>${t.consentOk?`Oui · ${t.consentDate}`:`À renouveler · ${t.consentDate}`}</b></span>
  <span><small>Prochain voyage</small><b>${t.nextTrip||'Aucun voyage programmé'}</b></span>
 </div>
 ${t.assistance?`<div class="aq-hint" style="margin-top:14px">${I('accessibility')} Assistance requise : ${esc(t.assistanceNote)}</div>`:''}
 <div class="trk-detail-actions">
  ${!t.consentOk?`<button data-cust-consent="${t.id}">${I('shield-check')} Renouveler le consentement</button>`:''}
  ${t.controle!=='Valide'?`<button data-cust-validate="${t.id}">${I('check-check')} Marquer le contrôle validé</button>`:''}
  <button data-cust-contact="${t.id}">${I('phone-call')} Contacter l’urgence</button>
  <button data-cust-export="${t.id}">${I('download')} Exporter la fiche</button>
 </div>
 <p class="aq-trace">${I('shield-check')} Traçabilité : consultation journalisée, données limitées selon le rôle de l’utilisateur connecté.</p>`
}
function openDrawer(id){
 const root=document.querySelector('#modalRoot');
 const t=travelers.find(x=>x.id===id);
 if(!root||!t)return;
 root.innerHTML=`<div class="trk-drawer-overlay" data-cust-drawer-overlay><div class="trk-drawer">${drawerContentHtml(t)}</div></div>`;
 wireDrawer();
 if(window.lucide)lucide.createIcons()
}
function closeDrawer(){
 const root=document.querySelector('#modalRoot');
 if(root&&root.querySelector('.trk-drawer'))root.innerHTML=''
}
function refreshDrawerIfOpen(id){
 const root=document.querySelector('#modalRoot');
 const drawer=root&&root.querySelector('.trk-drawer');
 if(!drawer)return;
 const t=travelers.find(x=>x.id===id);
 if(!t)return;
 drawer.innerHTML=drawerContentHtml(t);
 wireDrawer();
 if(window.lucide)lucide.createIcons()
}
function wireDrawer(){
 const root=document.querySelector('#modalRoot');
 if(!root||!root.querySelector('.trk-drawer'))return;
 const overlay=root.querySelector('[data-cust-drawer-overlay]');
 if(overlay){
  overlay.addEventListener('click',e=>e.stopPropagation());
  overlay.onclick=e=>{if(e.target===overlay)closeDrawer()}
 }
 root.querySelectorAll('[data-cust-drawer-close]').forEach(b=>b.onclick=closeDrawer);
 const consentBtn=root.querySelector('[data-cust-consent]');
 if(consentBtn)consentBtn.onclick=()=>{
  const id=Number(consentBtn.dataset.custConsent);
  const t=travelers.find(x=>x.id===id);
  if(!t)return;
  t.consentOk=true;
  const d=new Date();
  t.consentDate=`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  refreshDrawerIfOpen(id);
  refreshTable();
  if(typeof toast==='function')toast(`Consentement RGPD renouvelé · ${t.name}`)
 };
 const validateBtn=root.querySelector('[data-cust-validate]');
 if(validateBtn)validateBtn.onclick=()=>{
  const id=Number(validateBtn.dataset.custValidate);
  const t=travelers.find(x=>x.id===id);
  if(!t)return;
  t.controle='Valide';
  refreshDrawerIfOpen(id);
  refreshTable();
  if(typeof toast==='function')toast(`Dernier contrôle marqué comme validé · ${t.name}`)
 };
 const contactBtn=root.querySelector('[data-cust-contact]');
 if(contactBtn)contactBtn.onclick=()=>{
  const id=Number(contactBtn.dataset.custContact);
  const t=travelers.find(x=>x.id===id);
  if(t&&typeof toast==='function')toast(`Contact d’urgence appelé · ${t.urgence} · ${t.urgencePhone}`)
 };
 const exportBtn=root.querySelector('[data-cust-export]');
 if(exportBtn)exportBtn.onclick=()=>{
  const id=Number(exportBtn.dataset.custExport);
  const t=travelers.find(x=>x.id===id);
  if(!t)return;
  csvDownload(`SETRAG-voyageur-${t.cl}.csv`,['Champ','Valeur'],[
   ['Voyageur',t.name],['Identifiant',t.cl],['Téléphone',t.phone],['Ville',t.ville],
   ['Contact urgence',`${t.urgence} · ${t.urgencePhone}`],['Billets',t.billets],['Voyages à venir',t.upcoming],
   ['Bagages',t.bagages],['Colis',t.colis],['TAA',t.taa],['Dépenses (FCFA)',t.depenses],['Remboursements',t.remb],
   ['Dernier contrôle',t.controle],['Consentement RGPD',t.consentOk?'Oui · '+t.consentDate:'À renouveler'],
   ['Fidélité',t.fidelite],['Classe préférée',t.classe+' · '+t.place],['Prochain voyage',t.nextTrip||'Aucun']
  ]);
  if(typeof toast==='function')toast('Fiche voyageur exportée')
 }
}

function refreshTable(){
 const body=document.getElementById('custTableBody');
 if(body){body.innerHTML=rowsHtml();wireRows()}
 const sub=document.getElementById('custResultCount');
 if(sub)sub.textContent=`${filteredTravelers().length} profils affichés sur 86 420 voyageurs enregistrés`;
 if(window.lucide)lucide.createIcons()
}

function wireRows(){
 document.querySelectorAll('[data-traveler-detail]').forEach(b=>b.onclick=()=>openDrawer(Number(b.dataset.travelerDetail)));
 document.querySelectorAll('[data-traveler-fiche]').forEach(b=>b.onclick=()=>openDrawer(Number(b.dataset.travelerFiche)))
}

function render(){
 return `<div class="aq-page">
 ${scopeBanner()}
 <div class="page-head"><div><h1>Voyageurs</h1><p>Référentiel client, voyages, prestations et contrôles liés.</p></div><div class="actions"><button class="btn ghost" data-cust-export-all>${I('download')} Exporter</button><button class="btn primary" data-cust-new>${I('plus')} Nouveau voyageur</button></div></div>
 <div class="grid kpis">${kpisHtml()}</div>
 <div class="card aq-table-card">
  <div class="aq-table-head">
   <div><h3>${I('users')} Référentiel voyageurs</h3><p class="sub" id="custResultCount">${filteredTravelers().length} profils affichés sur 86 420 voyageurs enregistrés</p></div>
   <div class="aq-toolbar">
    <div class="aq-filters" id="custFilters">${FILTERS.map(f=>`<button class="${filter===f[0]?'active':''}" data-cust-filter="${f[0]}">${f[1]}</button>`).join('')}</div>
    <label class="aq-search">${I('search')}<input id="custSearch" placeholder="Nom, téléphone, billet, ville…"></label>
   </div>
  </div>
  <div class="aq-table-scroll"><table class="aq-table">
   <thead><tr><th>Voyageur</th><th>Contact</th><th>Urgence</th><th>Billets</th><th>Bagages / Colis</th><th>Dépenses</th><th>Dernier contrôle</th><th>Action</th></tr></thead>
   <tbody id="custTableBody">${rowsHtml()}</tbody>
  </table></div>
 </div>
 <div class="card aq-note">${I('shield-check')}<div><small>DONNÉES PERSONNELLES & ASSISTANCE</small><h3>Fiche 360° accessible sans changer de module</h3><p>Chaque fiche voyageur consolide billets, prestations, finances, contrôles, préférences et contact d’urgence. Le consentement RGPD est recueilli à l’émission du billet et renouvelable ici ; les besoins d’assistance sont signalés aux équipes de gare et de bord avant le départ.</p></div></div>
 </div>`
}

function wire(){
 if(typeof current!=='undefined'&&current!=='customers')return;
 const root=document.querySelector('.aq-page');
 if(!root)return;
 if(!root.__custStop){root.addEventListener('click',e=>e.stopPropagation());root.__custStop=true}
 if(window.lucide)lucide.createIcons();
 wireRows();
 const newBtn=root.querySelector('[data-cust-new]');
 if(newBtn)newBtn.onclick=openNewTravelerModal;
 root.querySelectorAll('[data-cust-filter]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.custFilter;
  root.querySelectorAll('[data-cust-filter]').forEach(x=>x.classList.toggle('active',x.dataset.custFilter===filter));
  refreshTable()
 });
 const searchInput=root.querySelector('#custSearch');
 if(searchInput)searchInput.oninput=()=>{search=searchInput.value;refreshTable()};
 const exportAllBtn=root.querySelector('[data-cust-export-all]');
 if(exportAllBtn)exportAllBtn.onclick=()=>{
  csvDownload('SETRAG-voyageurs.csv',['Voyageur','Identifiant','Téléphone','Ville','Urgence','Billets','Bagages','Colis','Dépenses','Dernier contrôle','Consentement','Fidélité'],
   filteredTravelers().map(t=>[t.name,t.cl,t.phone,t.ville,`${t.urgence} · ${t.urgencePhone}`,t.billets,t.bagages,t.colis,t.depenses,t.controle,t.consentOk?'Oui':'À renouveler',t.fidelite]));
  if(typeof toast==='function')toast('Référentiel voyageurs exporté en CSV')
 }
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.customers=render;
 if(typeof bind==='function'&&!bind.__custWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__custWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="customers"].active')||document.querySelector('.aq-page');
 if(requested==='customers'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
