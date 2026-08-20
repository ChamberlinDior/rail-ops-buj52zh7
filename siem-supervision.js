(function(){'use strict';
const I=n=>`<i data-lucide="${n}"></i>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// Neutralizes upgrade.js's global enhanceTables(), which rewrites any table's
// first/last cell (fake avatar, generic "···" menu) unless these markers exist.
const noAvatar='<span class="avatar-cell" style="display:none" aria-hidden="true"></span>';
const noDots='<span class="row-actions" style="display:none" aria-hidden="true"></span>';

const SEV={
 bad:{label:'Critique',cls:'bad'},
 warn:{label:'Élevée',cls:'warn'},
 info:{label:'Moyenne',cls:'info'}
};
const STATUS_CLS={Ouverte:'warn',Résolue:'',Clôturée:''};

let nextId=5;
let alerts=[
 {id:4,ts:'19/08/2026 · 22:47:03',user:'ctrl.franceville02',src:'Poste contrôle Franceville · 10.14.22.61',rule:'Accès administrateur hors horaires',sev:'warn',status:'Résolue',action:'MFA renforcée exigée · confirmée par l’agent'},
 {id:3,ts:'18/08/2026 · 14:12:41',user:'agent.owendo07',src:'Guichet Owendo 3 · 10.14.4.18',rule:'Échecs MFA répétés',sev:'info',status:'Résolue',action:'Notification utilisateur · déblocage automatique'},
 {id:2,ts:'17/08/2026 · 09:03:16',user:'admin.reseau',src:'Bastion admin · 10.14.1.5',rule:'Modification de la configuration de sécurité',sev:'bad',status:'Clôturée',action:'Changement validé a posteriori par le RSSI'},
 {id:1,ts:'15/08/2026 · 03:21:57',user:'svc.export-kpi',src:'API Reporting · 10.14.9.44',rule:'Export massif de données',sev:'warn',status:'Résolue',action:'Validation manuelle confirmée par le contrôle'}
];

const RULES=[
 ['Authentification par force brute','Échecs de connexion consécutifs sur un même compte','10 échecs / 5 min','bad','Verrouillage du compte 15 min + alerte SIEM + notification RSSI'],
 ['Élévation de privilège suspecte','Modification d’un rôle ou droit administrateur','1 occurrence hors fenêtre validée','bad','Blocage de l’action + ouverture d’un ticket d’incident'],
 ['Accès administrateur hors horaires','Connexion à un compte à privilèges','Hors plage 6h–22h','warn','Notification immédiate + MFA renforcée exigée'],
 ['Export massif de données','Téléchargement ou export volumineux ou répété','> 5000 lignes ou 3 exports / 10 min','warn','Alerte + validation manuelle avant transmission'],
 ['Échecs MFA répétés','Refus ou échecs du second facteur d’authentification','5 échecs consécutifs','info','Notification à l’utilisateur + alerte sécurité'],
 ['Modification de la configuration de sécurité','Changement de règle RBAC, pare-feu ou WAF','1 occurrence','bad','Alerte immédiate + traçabilité horodatée complète'],
 ['Anomalie API / infrastructure','Pic de requêtes ou taux d’erreur anormal','Seuil dynamique (référence + écart-type)','info','Alerte monitoring + corrélation SIEM']
];

const LOGS=[
 ['Authentification (AD / SSO / MFA)','Connexions, échecs, déconnexions, changements de mot de passe','Utilisateur, IP, poste, horodatage, résultat, méthode MFA','Temps réel'],
 ['Habilitations (RBAC)','Création, modification, suppression de rôle ou droit, déprovisionnement','Acteur, cible, ancien/nouveau rôle, horodatage','Temps réel'],
 ['Transactions métier','Émission, annulation, remboursement, réimpression de titre','Opérateur, poste, opération, montant, horodatage','Temps réel'],
 ['API & intégrations','Appels REST, erreurs, latences, connecteurs Sage X3 / AD / COLIRAIL','Endpoint, code retour, latence, appelant','Temps réel'],
 ['Infrastructure','Pare-feu, bastion, WAF, disponibilité serveurs et API','Source, cible, action, horodatage','Continu'],
 ['Administration système','Accès admin, changement de configuration, sauvegardes','Compte, action, horodatage, résultat','Temps réel']
];

const SPECS=[
 ['Protocole & format','Syslog RFC 5424 / CEF ou JSON, transport TLS 1.2+'],
 ['Rétention','12 mois en ligne + archivage légal étendu'],
 ['SLA de détection','&lt; 1 minute pour les règles critiques'],
 ['Compatibilité','Splunk, IBM QRadar, Wazuh, Microsoft Sentinel'],
 ['Journalisation','Horodatée, centralisée, non répudiable — §8-9 du CDC']
];

function pipelineHtml(){
 const steps=[
  ['user-x','Tentative de connexion','Un utilisateur échoue 10 fois à s’authentifier (mot de passe ou MFA).'],
  ['server-cog','Détection backend','Le service d’authentification horodate l’événement, l’identifiant, l’IP et le poste.'],
  ['send','Envoi au SIEM','Log structuré transmis en temps réel (Syslog CEF/JSON) via TLS vers le SIEM.'],
  ['shield-alert','Alerte de sécurité','Le SIEM corrèle l’événement à la règle « force brute », ouvre une alerte et notifie le RSSI.']
 ];
 return steps.map((s,i)=>`${i?'<div class="siem-arrow">'+I('arrow-right')+'</div>':''}<div class="siem-step" data-siem-step="${i+1}"><i>${I(s[0])}</i><b>${i+1}. ${s[1]}</b><span>${s[2]}</span></div>`).join('')
}

function alertsRowsHtml(){
 return alerts.slice(0,8).map(a=>`<tr data-alert-row="${a.id}">
  <td>${noAvatar}<b>${a.ts}</b></td>
  <td>${esc(a.user)}</td>
  <td>${esc(a.src)}</td>
  <td>${esc(a.rule)}</td>
  <td><span class="status ${SEV[a.sev].cls}">${SEV[a.sev].label}</span></td>
  <td><span class="status ${STATUS_CLS[a.status]||''}">${a.status}</span></td>
  <td>${esc(a.action)}</td>
  <td>${noDots}${a.status==='Ouverte'?`<button class="btn ghost siem-resolve-btn" data-siem-resolve="${a.id}">Marquer résolue</button>`:'—'}</td>
 </tr>`).join('')
}

function rulesRowsHtml(){
 return RULES.map(r=>`<tr><td>${noAvatar}<b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="status ${SEV[r[3]].cls}">${SEV[r[3]].label}</span></td><td>${noDots}${r[4]}</td></tr>`).join('')
}
function logsRowsHtml(){
 return LOGS.map(l=>`<tr><td>${noAvatar}<b>${l[0]}</b></td><td>${l[1]}</td><td>${l[2]}</td><td>${noDots}${l[3]}</td></tr>`).join('')
}
function specsHtml(){
 return SPECS.map(s=>`<div class="siem-spec"><small>${s[0]}</small><b>${s[1]}</b></div>`).join('')
}

function siemSectionHtml(){
 return `<div class="card siem-card">
 <div class="siem-head">
  <div><h3>${I('shield-alert')} Supervision SIEM · détection et alerte de sécurité <span class="siem-tag">CONFORME CDC · §8-9</span></h3><p>Journalisation complète et horodatée, centralisée dans le SIEM, avec corrélation automatique des événements de sécurité et notification de l’équipe cybersécurité.</p></div>
  <button class="btn primary" id="siemSimulate">${I('play')} Simuler 10 tentatives de connexion échouées</button>
 </div>

 <div class="siem-flow" id="siemFlow">${pipelineHtml()}</div>

 <div class="siem-sub"><h4>${I('bell-ring')} Alertes SIEM récentes</h4><p>Générées automatiquement par le moteur de corrélation à partir des journaux transmis par le back office.</p></div>
 <div class="siem-table-wrap"><table class="siem-table">
  <thead><tr><th>Horodatage</th><th>Compte</th><th>Poste / IP source</th><th>Règle déclenchée</th><th>Sévérité</th><th>Statut</th><th>Action automatique</th><th>Action</th></tr></thead>
  <tbody id="siemAlertsBody">${alertsRowsHtml()}</tbody>
 </table></div>

 <div class="siem-sub"><h4>${I('list-tree')} Catalogue des règles de corrélation SIEM</h4><p>Seuils et actions automatiques configurés pour les scénarios de sécurité les plus sensibles du back office.</p></div>
 <div class="siem-table-wrap"><table class="siem-table">
  <thead><tr><th>Règle</th><th>Déclencheur</th><th>Seuil</th><th>Sévérité</th><th>Action automatique</th></tr></thead>
  <tbody>${rulesRowsHtml()}</tbody>
 </table></div>

 <div class="siem-sub"><h4>${I('database')} Journaux transmis au SIEM</h4><p>Sources et champs journalisés, exportés en continu depuis chaque brique du back office.</p></div>
 <div class="siem-table-wrap"><table class="siem-table">
  <thead><tr><th>Source</th><th>Type d’événement</th><th>Champs journalisés</th><th>Fréquence</th></tr></thead>
  <tbody>${logsRowsHtml()}</tbody>
 </table></div>

 <div class="siem-specs">${specsHtml()}</div>
 </div>`
}

function markStep(n,cls){
 const el=document.querySelector(`[data-siem-step="${n}"]`);
 if(el)el.classList.add(cls)
}
function resetSteps(){
 document.querySelectorAll('[data-siem-step]').forEach(el=>el.classList.remove('active','done'))
}

async function runSimulation(){
 const btn=document.getElementById('siemSimulate');
 if(!btn||btn.disabled)return;
 btn.disabled=true;
 const original=btn.innerHTML;
 btn.innerHTML=`${I('loader-2')} Simulation en cours…`;
 if(window.lucide)lucide.createIcons();
 resetSteps();
 if(typeof toast==='function')toast('Simulation démarrée · 10 tentatives de connexion échouées détectées');

 for(let i=1;i<=4;i++){
  markStep(i,'active');
  await wait(650);
  markStep(i,'done');
  document.querySelector(`[data-siem-step="${i}"]`)?.classList.remove('active')
 }

 const users=['agent.owendo12','ctrl.libreville04','agent.moanda09','vente.franceville01'];
 const postes=['Guichet Owendo 3','Poste contrôle Libreville','Guichet Moanda 1','Guichet Franceville 2'];
 const idx=Math.floor(Math.random()*users.length);
 const now=new Date();
 const pad=n=>String(n).padStart(2,'0');
 const ts=`${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} · ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
 alerts.unshift({
  id:nextId++,ts,user:users[idx],
  src:`${postes[idx]} · 10.14.${Math.floor(Math.random()*30)}.${Math.floor(Math.random()*250)}`,
  rule:'Authentification par force brute',sev:'bad',status:'Ouverte',
  action:'Compte verrouillé 15 min · RSSI notifié'
 });
 const body=document.getElementById('siemAlertsBody');
 if(body){body.innerHTML=alertsRowsHtml();wireAlertActions()}
 if(window.lucide)lucide.createIcons();
 if(typeof toast==='function')toast('Alerte SIEM créée · équipe sécurité notifiée en temps réel');

 await wait(1400);
 resetSteps();
 btn.disabled=false;
 btn.innerHTML=original;
 if(window.lucide)lucide.createIcons()
}

function wireAlertActions(){
 document.querySelectorAll('[data-siem-resolve]').forEach(b=>b.onclick=()=>{
  const id=Number(b.dataset.siemResolve);
  const a=alerts.find(x=>x.id===id);
  if(!a)return;
  a.status='Résolue';
  a.action+=' · clôturée manuellement par l’administrateur';
  const body=document.getElementById('siemAlertsBody');
  if(body){body.innerHTML=alertsRowsHtml();wireAlertActions()}
  if(window.lucide)lucide.createIcons();
  if(typeof toast==='function')toast(`Alerte SIEM #${id} marquée comme résolue`)
 })
}

function wireSiem(){
 const flow=document.getElementById('siemFlow');
 if(!flow)return;
 const btn=document.getElementById('siemSimulate');
 if(btn&&!btn.__siemWired){btn.onclick=runSimulation;btn.__siemWired=true}
 wireAlertActions()
}

const install=()=>{
 if(!window.pages||typeof pages.administration!=='function')return setTimeout(install,40);
 if(pages.administration.__siemWrapped)return;
 const old=pages.administration;
 const wrapped=()=>old()+siemSectionHtml();
 wrapped.__siemWrapped=true;
 pages.administration=wrapped;
 if(typeof bind==='function'&&!bind.__siemWrapped){
  const oldBind=bind;
  const enhanced=function(){oldBind();wireSiem()};
  enhanced.__siemWrapped=true;
  bind=enhanced;
  window.bind=enhanced
 }
 if(document.querySelector('[data-page="administration"].active')||new URLSearchParams(location.search).get('page')==='administration'){
  const content=document.querySelector('#content');
  if(content&&content.innerHTML){content.innerHTML=pages.administration();wireSiem();if(window.lucide)lucide.createIcons()}
 }
};
install();
})();
