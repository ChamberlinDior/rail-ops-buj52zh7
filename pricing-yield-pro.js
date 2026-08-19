(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('fr-FR').format(Math.round(n));
function toastMsg(s){if(typeof toast==='function')toast(s);else if(window.toast)window.toast(s)}
function nowStamp(){const d=new Date();return d.toLocaleDateString('fr-FR')+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}

/* ---------- data ---------- */
let seq=1;
function mk(code,produit,famille,perimetre,regle,statut,version,extra){
 return Object.assign({code,produit,famille,perimetre,regle,statut,version,
  validFrom:'2026-01-01',validTo:'2026-12-31',franchise:produit==='Bagage'?'30 kg':'—',
  journal:[{date:'02/01/2026 09:14',user:'MOBIRAIL',action:'Création du tarif'},
   {date:'03/01/2026 11:02',user:'Finance',action:'Contrôle financier validé'},
   {date:'05/01/2026 08:40',user:'MOBIRAIL',action:'Activation en catalogue'}]
 },extra||{})
}
let TARIFFS=[
 mk('T-GEN-EXP','Billet','Général','EXPRESS · VIP','62,16 F/km','actif','1.3'),
 mk('T-GEN-OMN','Billet','Général','OMNIBUS · 1re','42,89 F/km','actif','1.2'),
 mk('T-AUT-2C','Billet','Général','AUTORAIL · 2e','34,31 F/km','actif','1.1'),
 mk('ENF-4-11','Billet','Réduit','4–11 ans','−50 %','actif','1.0'),
 mk('GRP-10-49','Billet','Réduit','10–49 personnes','−30 %','actif','1.0'),
 mk('GRP-50+','Billet','Réduit','50 personnes et +','−45 %','actif','1.0'),
 mk('MIL-OM','Billet','Réduit','Militaire + ordre mission','−10 %','actif','1.0'),
 mk('BAG-0-190','Bagage','Bagages','0–190 km · 0–30 kg','490 F HT','actif','1.0'),
 mk('BAG-200+','Bagage','Bagages','≥ 200 km · 0–30 kg','700 F HT','actif','1.0'),
 mk('COL-Z1','Colis express','Colis','Zone 0–99 · palier 10 kg','Grille + TVA','actif','1.0'),
 mk('COL-Z7','Colis express','Colis','7 zones · >500 kg','Poids × tarif + TVA','actif','1.0'),
 mk('ABO-AN','Abonnement','Abonnements','Plein tarif · 1 an','Billet × coefficient','actif','1.0'),
 mk('ABO-6M','Abonnement','Abonnements','Plein tarif · 6 mois','Annuel −40 %','actif','1.0'),
 mk('ABO-3M','Abonnement','Abonnements','Plein tarif · 3 mois','Annuel −60 %','actif','1.0'),
 mk('ABO-DEMI','Abonnement','Abonnements','Demi-tarif · 1 an','Annuel −2/3','actif','1.0'),
 mk('PROMO-WE','Billet','Promotions','Week-end','X % paramétrable','planifie','1.0',{validFrom:'2026-09-01'}),
 mk('PROMO-ETU','Billet','Promotions','Étudiant','Y % paramétrable','brouillon','0.1'),
 mk('PROMO-3A','Billet','Promotions','Troisième âge','Z % paramétrable','a_valider','0.2'),
 mk('AFF-SIMPLE','Affrètement','Général','Voiture train régulier','Tarif groupe','actif','1.0'),
 mk('AFF-SPECIAL','Affrètement','Général','Train complet','Barème matériel','planifie','1.0',{validFrom:'2026-10-01'})
];
const RULES=[['OMNIBUS · 0–99 km','1re 46,93 · 2e 37,54'],['OMNIBUS · ≥100 km','1re 42,89 · 2e 34,31'],['EXPRESS · 0–99 km','VIP 72,38 · 1re 60,10 · 2e 47,51'],['EXPRESS · ≥100 km','VIP 62,16 · 1re 54,93 · 2e 43,42'],['AUTORAIL · 0–99 km','1re 60,10 · 2e 37,54'],['AUTORAIL · ≥100 km','1re 54,93 · 2e 34,31'],['Arrondi · 0–99 km','10 F les plus proches'],['Arrondi · 100–299 km','50 F les plus proches'],['Arrondi · ≥300 km','100 F les plus proches']];
let QUOTAS=[
 {train:'EXP-620',classe:'VIP',alloue:40,vendu:33},
 {train:'EXP-620',classe:'1re classe',alloue:90,vendu:71},
 {train:'EXP-620',classe:'2e classe',alloue:180,vendu:132},
 {train:'OMN-218',classe:'1re classe',alloue:50,vendu:24},
 {train:'OMN-218',classe:'2e classe',alloue:220,vendu:178},
 {train:'SPE-551',classe:'1re classe',alloue:60,vendu:22}
];
let SIM_HISTORY=[];

const STATUT_META={
 brouillon:{label:'Brouillon',cls:''},
 a_valider:{label:'À valider',cls:'warn'},
 valide:{label:'Validé',cls:'info'},
 actif:{label:'Actif',cls:'good'},
 planifie:{label:'Planifié',cls:'warn'},
 expire:{label:'Expiré',cls:'bad'},
 rejete:{label:'Rejeté',cls:'bad'}
};
function statutChip(s){const m=STATUT_META[s]||{label:s,cls:''};return `<span class="pyx-chip ${m.cls}">${m.label}</span>`}
function actionsFor(t){
 const a=[{key:'consult',label:'Consulter la formule',icon:'file-text'}];
 if(t.statut==='brouillon')a.push({key:'submit',label:'Soumettre à validation',icon:'send'});
 if(t.statut==='a_valider'){a.push({key:'validate',label:'Valider',icon:'check'});a.push({key:'reject',label:'Rejeter',icon:'x'})}
 if(t.statut==='valide'||t.statut==='planifie')a.push({key:'activate',label:'Activer',icon:'play'});
 if(t.statut==='actif')a.push({key:'expire',label:'Expirer',icon:'clock'});
 a.push({key:'duplicate',label:'Dupliquer en brouillon',icon:'copy'});
 a.push({key:'audit',label:'Voir l’historique d’audit',icon:'history'});
 return a
}
function kpis(){
 const actifs=TARIFFS.filter(t=>t.statut==='actif').length;
 const planifies=TARIFFS.filter(t=>t.statut==='planifie').length;
 const promos=TARIFFS.filter(t=>t.famille==='Promotions').length;
 const quotaLibre=QUOTAS.reduce((s,q)=>s+(q.alloue-q.vendu),0);
 return[
  ['Tarifs actifs',actifs,`${planifies} planifiés`],
  ['Promotions',promos,'2 expirent bientôt'],
  ['Prix moyen/km','43 FCFA','stable'],
  ['Gain Yield','+6,8 %','simulation août'],
  ['Quotas disponibles',fmt(quotaLibre),'toutes circulations']
 ].map(x=>`<div class="pyx-kpi"><small>${x[0]}</small><b>${x[1]}</b><span>${x[2]}</span></div>`).join('')
}

/* ---------- catalogue table ---------- */
function tableRows(){
 return TARIFFS.map(t=>`<tr data-kind="${t.famille}" data-code="${t.code}">
  <td class="pyx-code">${esc(t.code)}</td><td>${esc(t.produit)}</td><td>${esc(t.famille)}</td>
  <td>${esc(t.perimetre)}</td><td>${esc(t.regle)}</td><td>v${t.version}</td>
  <td>${statutChip(t.statut)}</td>
  <td><div class="row-actions pyx-row-actions"><button class="pyx-menu-btn" data-pyx-menu="${esc(t.code)}">${I('more-vertical')}</button></div></td>
 </tr>`).join('')
}
function catalogHtml(){
 return `<table class="pyx-table"><thead><tr><th>Code</th><th>Produit</th><th>Type</th><th>Périmètre</th><th>Règle</th><th>Version</th><th>Statut</th><th>Actions</th></tr></thead><tbody>${tableRows()}</tbody></table>`
}

/* ---------- quotas ---------- */
function quotasHtml(){
 return `<table class="pyx-table pyx-quota-table"><thead><tr><th>Train</th><th>Classe</th><th>Alloué</th><th>Vendu</th><th>Restant</th><th>Ajuster</th></tr></thead><tbody>${QUOTAS.map((q,i)=>{
  const restant=q.alloue-q.vendu,pct=Math.round(q.vendu/q.alloue*100);
  return `<tr><td><b>${esc(q.train)}</b></td><td>${esc(q.classe)}</td><td>${q.alloue}</td><td>${q.vendu}</td>
   <td><div class="pyx-quota-bar"><i style="width:${pct}%"></i></div><small>${restant} restantes</small></td>
   <td class="pyx-quota-adjust"><div class="row-actions"><button data-pyx-quota="-:${i}">−</button><button data-pyx-quota="+:${i}">+</button></div></td></tr>`
 }).join('')}</tbody></table>`
}

/* ---------- workflow ---------- */
let workflow={finance:'Validé',validation:'pending',publication:'pending'};
function workflowHtml(){
 return `<div class="pyx-flow">
  <div class="pyx-step done"><b>Création</b><span>Terminée</span></div>
  <div class="pyx-step done"><b>Contrôle Finance</b><span>${workflow.finance}</span></div>
  <div class="pyx-step ${workflow.validation==='done'?'done':''}"><b>Validation MOBIRAIL</b>${workflow.validation==='done'?'<span>Validé ✓</span>':'<button data-pyx-validate>Valider</button>'}</div>
  <div class="pyx-step ${workflow.publication==='done'?'done':''}"><b>Publication</b>${workflow.publication==='done'?'<span>Publiée · '+workflow.pubTime+'</span>':workflow.validation==='done'?'<button data-pyx-publish-btn>Publier</button>':'<span>Bloquée</span>'}</div>
 </div>`
}

/* ---------- simulation ---------- */
function calc(){
 const l=+document.querySelector('[data-pyx-load]')?.value||82,
  d=+document.querySelector('[data-pyx-days]')?.value||1.08,
  p=+document.querySelector('[data-pyx-period]')?.value||1;
 const v=Math.round(18000*d*p*(1+(l-82)/250)/10)*10;
 const out=document.querySelector('[data-pyx-price]');if(out)out.textContent=fmt(v)+' FCFA';
 return v
}
function simHistoryHtml(){
 if(!SIM_HISTORY.length)return `<p class="pyx-empty">Aucune simulation enregistrée pour l’instant.</p>`;
 return SIM_HISTORY.slice(0,4).map(s=>`<div class="pyx-sim-row"><b>${fmt(s.price)} FCFA</b><span>${esc(s.relation)} · ${esc(s.classe)} · ${s.time}</span></div>`).join('')
}

/* ---------- page ---------- */
function render(){
 return `<div class="pyx-page">
 <div class="pyx-head">
  <div><small class="pyx-eyebrow">COUVERTURE CDC SETRAG · PAGE 7/16</small><h1>Tarification &amp; Yield Management</h1><p>Catalogue, calcul réglementaire, quotas et publication contrôlée</p></div>
  <div class="pyx-actions"><span class="pyx-live"><i></i> Catalogue synchronisé</span><button data-pyx-import>${I('upload')} Importer</button><button data-pyx-export>${I('download')} Exporter</button><button class="primary" data-pyx-new>${I('plus')} Nouveau tarif</button></div>
 </div>
 <div class="pyx-proof"><b>Exigence CDC visible :</b> général/réduit · validité · franchise · prix par relation · import/export · Valider / Rejeter / Activer / Expirer · prévision, quotas et ajustement temps réel.</div>
 <div class="pyx-kpis" id="pyxKpis">${kpis()}</div>

 <div class="pyx-section">
  <div class="pyx-card">
   <div class="pyx-card-head">
    <div><h2>Catalogue tarifaire</h2><p>Conforme au périmètre CDC — général, réduit, abonnements, bagages, colis, promotions, affrètement</p></div>
    <div class="pyx-tools"><input data-pyx-search placeholder="Rechercher code, produit, relation…"><button data-pyx-mass>${I('upload')} Import en masse</button></div>
   </div>
   <div class="pyx-tabs">${['Tous','Général','Réduit','Abonnements','Bagages','Colis','Promotions'].map((x,i)=>`<button class="${i?'':'active'}" data-pyx-tab="${x}">${x}</button>`).join('')}</div>
   <div class="pyx-table-wrap" id="pyxTableWrap">${catalogHtml()}</div>
  </div>
 </div>

 <div class="pyx-section pyx-2col">
  <div class="pyx-card"><h2>Barème kilométrique et règles d’arrondi</h2><div class="pyx-rules">${RULES.map(x=>`<div class="pyx-rule"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div>
  <div class="pyx-card"><h2>Quotas &amp; disponibilité par circulation</h2><p class="pyx-sub">Ajustement en temps réel de l’allocation par train et par classe</p><div id="pyxQuotaWrap">${quotasHtml()}</div></div>
 </div>

 <div class="pyx-section pyx-2col">
  <div class="pyx-card pyx-sim">
   <h2>Simulation Yield</h2>
   <div class="pyx-sim-grid">
    <label>Relation<select data-pyx-relation><option>Owendo → Franceville</option><option>Owendo → Booué</option><option>Owendo → Ndjolé</option></select></label>
    <label>Classe<select data-pyx-classe><option>VIP</option><option>1re classe</option><option>2e classe</option></select></label>
    <label>Remplissage<input type="range" min="20" max="100" value="82" data-pyx-load><span data-pyx-load-label>82 %</span></label>
    <label>Anticipation<select data-pyx-days><option value=".92">30 jours</option><option value="1.08" selected>10 jours</option><option value="1.25">Veille</option></select></label>
    <label>Période<select data-pyx-period><option value="1">Normale</option><option value="1.1">Week-end</option><option value="1.18">Vacances</option></select></label>
    <label>Segment<select data-pyx-segment><option>Loisirs</option><option>Professionnels</option></select></label>
   </div>
   <div class="pyx-price">Base 18 000 FCFA<br><strong data-pyx-price>19 440 FCFA</strong><br><small data-pyx-reco>Recommandation non publiée</small></div>
   <button class="primary pyx-full" data-pyx-sim>${I('refresh-cw')} Recalculer et enregistrer</button>
   <div class="pyx-sim-history"><b>Dernières simulations</b><div id="pyxSimHistory">${simHistoryHtml()}</div></div>
  </div>
  <div class="pyx-card">
   <h2>Workflow de publication</h2>
   <div id="pyxWorkflow">${workflowHtml()}</div>
   <h3 class="pyx-sub-h">Couverture fonctionnelle CDC</h3>
   <div class="pyx-coverage">
    <p>${I('check')} Demande : flux, pointes, événements</p>
    <p>${I('check')} Classes : bas prix, standard, flexible</p>
    <p>${I('check')} Quotas et remplissage par train</p>
    <p>${I('check')} Annulations et ajustement temps réel</p>
    <p>${I('check')} KPI : remplissage, recette/siège, revenu/trajet</p>
   </div>
  </div>
 </div>
 <input type="file" accept=".csv,.xlsx" hidden data-pyx-file>
 </div>`
}

/* ---------- wizard modal ---------- */
function wizardModal(){
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 let step=1;
 const v={
  wCode:`T-EXP-${2027+seq}`,wProduit:'Billet voyageur',wFamille:'Général',wType:'EXPRESS',wRelation:'Owendo → Franceville',wClasse:'VIP',
  wMode:'Prix fixe par relation',wPrice:16981,wTva:18,wCss:1,wFranchise:30,wReduc:0,wFrom:'2027-01-01',wTo:'2027-06-30',
  wOwner:'MOBIRAIL',wCircuit:'Finance → MOBIRAIL → Publication',wMotif:'Campagne tarifaire S1 2027',wFinal:'draft'
 };
 const opt=(field,val)=>`<option${v[field]===val?' selected':''}>${val}</option>`;
 const sel=(field,val,label)=>`<option value="${val}"${v[field]===val?' selected':''}>${label}</option>`;
 const preview=()=>{
  const price=+v.wPrice||0,tva=+v.wTva||0,css=+v.wCss||0;
  const taxes=Math.round(price*(tva+css)/100),ttc=Math.round((price+taxes)/10)*10;
  return `<span>HT <b>${fmt(price)} F</b></span><span>Taxes <b>${fmt(taxes)} F</b></span><span>TTC arrondi <strong>${fmt(ttc)} FCFA</strong></span>`
 };
 const html=()=>`<div class="pyx-modal-backdrop" data-pyx-modal-close><div class="pyx-modal" onclick="event.stopPropagation()">
  <header><div><span class="pyx-modal-eyebrow">ASSISTANT TARIFAIRE · CRÉATION CONTRÔLÉE</span><h3>Nouveau tarif SETRAG</h3><p>Définissez la règle, vérifiez son calcul puis choisissez son circuit de validation.</p></div><button class="pyx-modal-close" data-pyx-modal-close>×</button></header>
  <div class="pyx-progress"><span class="${step>=1?'active':''}">1 · Définition</span><span class="${step>=2?'active':''}">2 · Calcul &amp; validité</span><span class="${step>=3?'active':''}">3 · Gouvernance</span></div>
  <section class="pyx-wstep ${step!==1?'pyx-hidden':''}">
   <h4>Identification et périmètre commercial</h4>
   <div class="pyx-form">
    <label>Code tarif unique *<input id="wCode" value="${esc(v.wCode)}"></label>
    <label>Produit voyageur *<select id="wProduit">${['Billet voyageur','Bagage','Colis express','Transport Auto Accompagné','Transport funéraire'].map(x=>opt('wProduit',x)).join('')}</select></label>
    <label>Famille tarifaire<select id="wFamille">${['Général','Réduit','Promotions','Abonnements'].map(x=>opt('wFamille',x)).join('')}</select></label>
    <label>Type de train<select id="wType">${['EXPRESS','OMNIBUS','SPECIAL','AUTORAIL'].map(x=>opt('wType',x)).join('')}</select></label>
    <label>Relation<select id="wRelation">${['Owendo → Franceville','Owendo → Booué','Toutes les relations'].map(x=>opt('wRelation',x)).join('')}</select></label>
    <label>Classe<select id="wClasse">${['VIP','1re classe','2e classe'].map(x=>opt('wClasse',x)).join('')}</select></label>
   </div>
  </section>
  <section class="pyx-wstep ${step!==2?'pyx-hidden':''}">
   <h4>Calcul, franchise et période d’application</h4>
   <div class="pyx-form">
    <label>Mode de calcul<select id="wMode">${['Prix fixe par relation','Base kilométrique','Réduction en pourcentage','Palier de poids'].map(x=>opt('wMode',x)).join('')}</select></label>
    <label>Prix unitaire HT (FCFA)<input id="wPrice" type="number" value="${v.wPrice}"></label>
    <label>TVA (%)<input id="wTva" type="number" value="${v.wTva}"></label>
    <label>CSS (%)<input id="wCss" type="number" value="${v.wCss}"></label>
    <label>Franchise bagage (kg)<input id="wFranchise" type="number" value="${v.wFranchise}"></label>
    <label>Réduction (%)<input id="wReduc" type="number" value="${v.wReduc}"></label>
    <label>Date de début *<input id="wFrom" type="date" value="${v.wFrom}"></label>
    <label>Date de fin *<input id="wTo" type="date" value="${v.wTo}"></label>
   </div>
   <div class="pyx-preview" id="wPreview">${preview()}</div>
  </section>
  <section class="pyx-wstep ${step!==3?'pyx-hidden':''}">
   <h4>Contrôles et circuit d’approbation</h4>
   <div class="pyx-checks">
    <p>${I('check')} Code unique et produit renseigné</p>
    <p>${I('check')} Relation, train et classe compatibles</p>
    <p>${I('check')} Dates cohérentes, sans chevauchement bloquant</p>
    <p>${I('check')} Arrondi réglementaire appliqué selon la distance</p>
    <p>${I('check')} Simulation sans tarif négatif ni doublon</p>
   </div>
   <div class="pyx-form">
    <label>Propriétaire métier<select id="wOwner">${['MOBIRAIL','Direction commerciale'].map(x=>opt('wOwner',x)).join('')}</select></label>
    <label>Circuit<select id="wCircuit">${['Finance → MOBIRAIL → Publication','Finance → DSI → MOBIRAIL'].map(x=>opt('wCircuit',x)).join('')}</select></label>
    <label>Motif / référence<input id="wMotif" value="${esc(v.wMotif)}"></label>
    <label>Action finale<select id="wFinal">${sel('wFinal','draft','Enregistrer en brouillon')}${sel('wFinal','submit','Soumettre à validation')}</select></label>
   </div>
  </section>
  <footer><button class="ghost" data-pyx-prev ${step===1?'disabled':''}>Retour</button><span class="pyx-step-label">Étape ${step} sur 3</span>${step<3?'<button class="primary" data-pyx-next>Continuer</button>':'<button class="primary" data-pyx-save>Créer le tarif</button>'}</footer>
 </div></div>`;
 const capture=()=>{root.querySelectorAll('input[id],select[id]').forEach(el=>{if(el.id in v)v[el.id]=el.value})};
 const paint=()=>{
  root.innerHTML=html();
  if(window.lucide)lucide.createIcons();
  root.querySelectorAll('[data-pyx-modal-close]').forEach(x=>x.onclick=()=>{root.innerHTML=''});
  const prev=root.querySelector('[data-pyx-prev]'),next=root.querySelector('[data-pyx-next]'),save=root.querySelector('[data-pyx-save]');
  if(prev)prev.onclick=()=>{capture();step=Math.max(1,step-1);paint()};
  if(next)next.onclick=()=>{capture();step=Math.min(3,step+1);paint()};
  if(save)save.onclick=()=>{capture();submit()};
 };
 const submit=()=>{
  const code=(v.wCode||'').trim().toUpperCase();
  if(!code||TARIFFS.some(t=>t.code===code)){toastMsg('Code tarif invalide ou déjà utilisé');return}
  const produit=v.wProduit==='Billet voyageur'?'Billet':v.wProduit;
  const famille=v.wFamille,type=v.wType,classe=v.wClasse,relation=v.wRelation;
  const price=+v.wPrice||0,reduc=+v.wReduc||0;
  const finalAction=v.wFinal;
  const perimetre=relation==='Toutes les relations'?`${type} · ${classe}`:`${relation} · ${classe}`;
  const regle=reduc>0?`−${reduc} %`:`${fmt(price)} F HT`;
  seq++;
  const t=mk(code,produit,famille,perimetre,regle,finalAction==='submit'?'a_valider':'brouillon','0.1',{validFrom:v.wFrom,validTo:v.wTo,franchise:produit==='Bagage'?(+v.wFranchise||30)+' kg':'—'});
  t.journal=[{date:nowStamp(),user:'Vous',action:`Création du tarif · ${v.wMotif||'—'}`}];
  if(finalAction==='submit')t.journal.push({date:nowStamp(),user:'Vous',action:'Soumission au circuit de validation'});
  TARIFFS.unshift(t);
  root.innerHTML='';
  refreshTable();
  const kpisEl=document.getElementById('pyxKpis');if(kpisEl)kpisEl.innerHTML=kpis();
  toastMsg(`${code} créé · ${finalAction==='submit'?'soumis à validation':'enregistré en brouillon'} · piste d’audit créée`)
 };
 paint();
 if(!root.__pyxModalStop){root.addEventListener('click',e=>e.stopPropagation());root.__pyxModalStop=true}
 root.addEventListener('input',e=>{
  if(!e.target.id||!(e.target.id in v))return;
  v[e.target.id]=e.target.value;
  if(['wPrice','wTva','wCss'].includes(e.target.id)){
   const prevBox=root.querySelector('#wPreview');
   if(prevBox)prevBox.innerHTML=preview()
  }
 });
}

/* ---------- detail / audit modals ---------- */
function detailModal(code){
 const t=TARIFFS.find(x=>x.code===code);
 if(!t)return;
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.innerHTML=`<div class="pyx-modal-backdrop" data-pyx-modal-close><div class="pyx-modal pyx-modal-wide" onclick="event.stopPropagation()">
  <header><div><span class="pyx-modal-eyebrow">FICHE TARIF · v${t.version}</span><h3>${esc(t.code)}</h3><p>${esc(t.produit)} · ${esc(t.famille)} · ${esc(t.perimetre)}</p></div><button class="pyx-modal-close" data-pyx-modal-close>×</button></header>
  <div class="pyx-detail-grid">
   <div class="pyx-field"><small>Statut</small><b>${statutChip(t.statut)}</b></div>
   <div class="pyx-field"><small>Règle / formule</small><b>${esc(t.regle)}</b></div>
   <div class="pyx-field"><small>Franchise</small><b>${esc(t.franchise)}</b></div>
   <div class="pyx-field"><small>Validité</small><b>${esc(t.validFrom)} → ${esc(t.validTo)}</b></div>
   <div class="pyx-field"><small>Version courante</small><b>v${t.version}</b></div>
   <div class="pyx-field"><small>Circuit</small><b>Finance → MOBIRAIL → Publication</b></div>
  </div>
  <h4 class="pyx-sub-h">Journal d’audit</h4>
  <div class="pyx-journal">${t.journal.slice().reverse().map(j=>`<div class="pyx-journal-row"><i></i><div><b>${esc(j.action)}</b><span>${esc(j.date)} · ${esc(j.user)}</span></div></div>`).join('')}</div>
  <footer><button class="ghost" data-pyx-modal-close>Fermer</button><button class="primary" data-pyx-dup="${esc(t.code)}">${I('copy')} Dupliquer en brouillon</button></footer>
 </div></div>`;
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-pyx-modal-close]').forEach(x=>x.onclick=()=>{root.innerHTML=''});
 const dup=root.querySelector('[data-pyx-dup]');
 if(dup)dup.onclick=()=>{doAction('duplicate',t.code);root.innerHTML=''};
 if(!root.__pyxModalStop){root.addEventListener('click',e=>e.stopPropagation());root.__pyxModalStop=true}
}
function auditModal(code){
 const t=TARIFFS.find(x=>x.code===code);
 if(!t)return;
 const root=document.querySelector('#modalRoot');
 if(!root)return;
 root.innerHTML=`<div class="pyx-modal-backdrop" data-pyx-modal-close><div class="pyx-modal" onclick="event.stopPropagation()">
  <header><div><span class="pyx-modal-eyebrow">HISTORIQUE D’AUDIT</span><h3>${esc(t.code)}</h3><p>Toutes les actions horodatées sur ce tarif</p></div><button class="pyx-modal-close" data-pyx-modal-close>×</button></header>
  <div class="pyx-journal">${t.journal.slice().reverse().map(j=>`<div class="pyx-journal-row"><i></i><div><b>${esc(j.action)}</b><span>${esc(j.date)} · ${esc(j.user)}</span></div></div>`).join('')}</div>
  <footer><button class="primary" data-pyx-modal-close>Fermer</button></footer>
 </div></div>`;
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-pyx-modal-close]').forEach(x=>x.onclick=()=>{root.innerHTML=''});
 if(!root.__pyxModalStop){root.addEventListener('click',e=>e.stopPropagation());root.__pyxModalStop=true}
}

/* ---------- row actions ---------- */
function refreshTable(){
 const wrap=document.getElementById('pyxTableWrap');
 if(wrap){wrap.innerHTML=catalogHtml();wireTable()}
 if(window.lucide)lucide.createIcons()
}
function doAction(key,code){
 const t=TARIFFS.find(x=>x.code===code);
 if(!t)return;
 const log=a=>t.journal.push({date:nowStamp(),user:'Vous',action:a});
 if(key==='consult'){detailModal(code);return}
 if(key==='audit'){auditModal(code);return}
 if(key==='submit'){t.statut='a_valider';log('Soumission au circuit de validation');toastMsg(`${code} soumis à validation`)}
 else if(key==='validate'){t.statut='valide';log('Validation MOBIRAIL');toastMsg(`${code} validé`)}
 else if(key==='reject'){t.statut='rejete';log('Rejet · motif consigné');toastMsg(`${code} rejeté`)}
 else if(key==='activate'){t.statut='actif';log('Activation en catalogue');toastMsg(`${code} activé`)}
 else if(key==='expire'){t.statut='expire';log('Expiration manuelle');toastMsg(`${code} expiré`)}
 else if(key==='duplicate'){
  seq++;
  const copy=JSON.parse(JSON.stringify(t));
  copy.code=t.code+'-COPIE'+seq;copy.statut='brouillon';copy.version='0.1';
  copy.journal=[{date:nowStamp(),user:'Vous',action:`Dupliqué depuis ${t.code}`}];
  TARIFFS.unshift(copy);
  toastMsg(`${copy.code} créé en brouillon`)
 }
 refreshTable();
 const kpisEl=document.getElementById('pyxKpis');if(kpisEl)kpisEl.innerHTML=kpis()
}
function rowMenu(code,anchor){
 document.querySelectorAll('.pyx-row-menu').forEach(x=>x.remove());
 const t=TARIFFS.find(x=>x.code===code);
 if(!t)return;
 const box=anchor.getBoundingClientRect();
 const el=document.createElement('div');
 el.className='pyx-row-menu';
 el.style.left=Math.min(box.left,window.innerWidth-235)+'px';
 el.style.top=Math.min(box.bottom+6,window.innerHeight-280)+'px';
 el.innerHTML=actionsFor(t).map(a=>`<button data-pyx-act="${a.key}">${I(a.icon)} ${a.label}</button>`).join('');
 document.body.appendChild(el);
 if(window.lucide)lucide.createIcons();
 el.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();doAction(b.dataset.pyxAct,code);el.remove()});
}
document.addEventListener('click',e=>{if(!e.target.closest('.pyx-row-menu')&&!e.target.closest('[data-pyx-menu]'))document.querySelectorAll('.pyx-row-menu').forEach(x=>x.remove())});

/* ---------- wiring ---------- */
function wireTable(){
 document.querySelectorAll('[data-pyx-menu]').forEach(b=>b.onclick=e=>{e.stopPropagation();rowMenu(b.dataset.pyxMenu,b)});
}
function wire(){
 if(typeof current!=='undefined'&&current!=='pricing')return;
 const root=document.querySelector('.pyx-page');
 if(!root)return;
 if(!root.__pyxStop){root.addEventListener('click',e=>e.stopPropagation());root.__pyxStop=true}
 wireTable();
 if(window.lucide)lucide.createIcons();
 root.querySelectorAll('[data-pyx-tab]').forEach(b=>b.onclick=()=>{
  root.querySelectorAll('[data-pyx-tab]').forEach(x=>x.classList.toggle('active',x===b));
  root.querySelectorAll('.pyx-table tbody tr').forEach(r=>r.classList.toggle('pyx-hidden',b.dataset.pyxTab!=='Tous'&&r.dataset.kind!==b.dataset.pyxTab))
 });
 const search=root.querySelector('[data-pyx-search]');
 if(search)search.oninput=()=>{
  const q=search.value.toLowerCase();
  root.querySelectorAll('.pyx-table tbody tr').forEach(r=>r.classList.toggle('pyx-hidden',!r.textContent.toLowerCase().includes(q)))
 };
 root.querySelectorAll('[data-pyx-new]').forEach(b=>b.onclick=()=>wizardModal());
 root.querySelectorAll('[data-pyx-import],[data-pyx-mass]').forEach(b=>b.onclick=()=>root.querySelector('[data-pyx-file]').click());
 const fileInput=root.querySelector('[data-pyx-file]');
 if(fileInput)fileInput.onchange=()=>{
  const f=fileInput.files[0];
  if(!f)return;
  toastMsg(`${f.name} en cours de contrôle…`);
  setTimeout(()=>{
   const n=2+Math.floor(Math.random()*2);
   for(let i=0;i<n;i++){
    seq++;
    const t=mk(`IMPORT-${100+seq}`,'Billet','Général',`Import · ligne ${i+1}`,'À calculer','brouillon','0.1');
    t.journal=[{date:nowStamp(),user:'Import',action:`Importé depuis ${f.name}`}];
    TARIFFS.unshift(t)
   }
   refreshTable();
   const kpisEl=document.getElementById('pyxKpis');if(kpisEl)kpisEl.innerHTML=kpis();
   toastMsg(`${n} tarif(s) importé(s) en brouillon · prêts pour validation`);
   fileInput.value=''
  },700)
 };
 root.querySelectorAll('[data-pyx-export]').forEach(b=>b.onclick=()=>{
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['Code;Produit;Type;Regle;Version;Statut\n'+TARIFFS.map(t=>[t.code,t.produit,t.famille,t.regle,'v'+t.version,STATUT_META[t.statut]?.label||t.statut].join(';')).join('\n')],{type:'text/csv'}));
  a.download='tarifs-setrag.csv';a.click();
  toastMsg('Catalogue tarifaire exporté')
 });
 const loadInput=root.querySelector('[data-pyx-load]');
 if(loadInput)loadInput.oninput=()=>{root.querySelector('[data-pyx-load-label]').textContent=loadInput.value+' %';calc()};
 root.querySelectorAll('[data-pyx-days],[data-pyx-period]').forEach(s=>s.onchange=calc);
 root.querySelectorAll('[data-pyx-sim]').forEach(b=>b.onclick=()=>{
  const price=calc();
  const relation=root.querySelector('[data-pyx-relation]')?.value||'—',classe=root.querySelector('[data-pyx-classe]')?.value||'—';
  SIM_HISTORY.unshift({price,relation,classe,time:nowStamp()});
  const hist=document.getElementById('pyxSimHistory');if(hist)hist.innerHTML=simHistoryHtml();
  const reco=root.querySelector('[data-pyx-reco]');if(reco)reco.textContent='Recommandation enregistrée · '+nowStamp();
  toastMsg('Simulation Yield enregistrée sans publication automatique')
 });
 root.querySelectorAll('[data-pyx-validate]').forEach(b=>b.onclick=()=>{
  workflow.validation='done';
  const wf=document.getElementById('pyxWorkflow');if(wf)wf.innerHTML=workflowHtml();
  toastMsg('Validation MOBIRAIL tracée · publication autorisée')
 });
 root.addEventListener('click',e=>{
  const pb=e.target.closest('[data-pyx-publish-btn]');
  if(!pb)return;
  workflow.publication='done';workflow.pubTime=nowStamp();
  const wf=document.getElementById('pyxWorkflow');if(wf)wf.innerHTML=workflowHtml();
  toastMsg('Publication effectuée · catalogue et quotas mis à jour')
 });
 wireQuota();
}
function wireQuota(){
 document.querySelectorAll('[data-pyx-quota]').forEach(b=>b.onclick=()=>{
  const[op,idx]=b.dataset.pyxQuota.split(':'),q=QUOTAS[+idx];
  if(!q)return;
  if(op==='+')q.alloue+=5;else q.alloue=Math.max(q.vendu,q.alloue-5);
  const qw=document.getElementById('pyxQuotaWrap');if(qw)qw.innerHTML=quotasHtml();
  wireQuota();
  const kpisEl=document.getElementById('pyxKpis');if(kpisEl)kpisEl.innerHTML=kpis();
  toastMsg(`Quota ${q.train} · ${q.classe} ajusté en temps réel`)
 })
}

const install=()=>{
 if(!window.pages||typeof pages!=='object')return setTimeout(install,25);
 pages.pricing=render;
 if(typeof bind==='function'&&!bind.__pyxWrapped){
  const old=bind;
  const enhanced=function(){old();wire()};
  enhanced.__pyxWrapped=true;
  bind=enhanced;
  window.bind=enhanced;
 }
 const requested=new URLSearchParams(location.search).get('page');
 const active=document.querySelector('[data-page="pricing"].active')||document.querySelector('.pyx-page');
 if(requested==='pricing'||active){
  const content=document.querySelector('#content');
  if(content){content.innerHTML=render();wire()}
 }
};
install();
})();
