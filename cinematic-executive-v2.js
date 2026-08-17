(function(){
 const refine=()=>{const film=document.querySelector('.rail-film');if(!film)return;const kicker=film.querySelector('.film-copy>span'),title=film.querySelector('.film-copy h2'),lead=film.querySelector('.film-copy p'),progress=film.querySelector('.film-progress span');if(kicker)kicker.textContent='SETRAG · CENTRE DE PILOTAGE NATIONAL';if(title)title.innerHTML='Le Transgabonais.<br>Sous contrôle.';if(lead)lead.textContent='648 kilomètres de réseau. Une vision unifiée des circulations, des voyageurs et de la performance.';if(progress)progress.textContent='OUVERTURE DE L’ENVIRONNEMENT SÉCURISÉ';};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refine);else refine();
})();
