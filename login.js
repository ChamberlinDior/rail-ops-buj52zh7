(function(){
 const intro=document.querySelector("#intro"), form=document.querySelector("#loginForm"), submit=document.querySelector("#enterDemo");
 if(!intro||!form)return;
 const hero=intro.querySelector(".login-hero img");if(hero)hero.onerror=()=>hero.closest("picture").style.display="none";
 const enter=()=>{submit.classList.add("loading");submit.disabled=true;setTimeout(()=>{intro.classList.add("leaving");setTimeout(()=>{intro.remove();document.querySelector("#app").classList.remove("hidden");navigate("tracking")},400)},1700)};
 submit.onclick=e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}enter()};
 form.onsubmit=e=>{e.preventDefault();submit.click()};
 document.querySelector("#togglePassword").onclick=function(){let p=document.querySelector("#loginPassword"),show=p.type==="password";p.type=show?"text":"password";this.textContent=show?"Masquer":"Afficher"};
 document.querySelector("[data-sso]").onclick=()=>{submit.classList.add("loading");setTimeout(enter,500)};
 document.querySelector("[data-login-help]").onclick=()=>{let e=document.querySelector("#loginError");e.textContent="Une demande d’assistance a été préparée pour le support interne.";e.classList.add("show")};
})();
