const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const port = 4182;
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
(async()=>{
 const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);const target=path.resolve(root,pathname==='/'?'index.html':pathname.slice(1));if(!target.startsWith(root))return res.writeHead(403).end();fs.readFile(target,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(data)})});
 await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});await page.evaluate(()=>{document.querySelector('#intro')?.remove();document.querySelector('#app')?.classList.remove('hidden')});
 const ids=['dashboard','capacity','trains','tracking','control','sales','audit','users','frontoffice','boards','jury'];const results={};
 for(const id of ids){await page.evaluate(value=>navigate(value),id);await page.waitForTimeout(80);results[id]=await page.evaluate(()=>{const visible=e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length);const controls=[...document.querySelectorAll('#content button,#content a[href],[role="button"]')].filter(visible);const unnamed=controls.filter(e=>!(e.getAttribute('aria-label')||e.textContent.trim()||e.getAttribute('title'))).length;const fields=[...document.querySelectorAll('#content input,#content select,#content textarea')].filter(visible);const unlabeled=fields.filter(e=>!(e.getAttribute('aria-label')||e.closest('label')||e.id&&document.querySelector(`label[for="${CSS.escape(e.id)}"]`))).length;return{controls:controls.length,unnamed,fields:fields.length,unlabeled,main:!!document.querySelector('#content[role="main"]')}});if(results[id].unnamed||results[id].unlabeled||!results[id].main)throw new Error(`${id}: accessibilité incomplète ${JSON.stringify(results[id])}`)}
 await page.evaluate(()=>navigate('audit'));await page.locator('[data-exd-row]').first().focus();await page.keyboard.press('Enter');if(!await page.locator('[role="dialog"][aria-modal="true"]').count())throw new Error('Activation clavier du dossier audit absente');await page.keyboard.press('Escape');if(await page.locator('[role="dialog"][aria-modal="true"]').count())throw new Error('Fermeture Échap absente');
 const reduced=await page.evaluate(()=>getComputedStyle(document.querySelector('.a11y-skip')).transitionDuration);if(errors.length)throw new Error(errors.join(' | '));console.log(JSON.stringify({pages:Object.keys(results).length,results,keyboard:true,escape:true,reducedMotion:reduced,errors},null,2));
 await browser.close();server.close();
})().catch(error=>{console.error(error);process.exitCode=1});
