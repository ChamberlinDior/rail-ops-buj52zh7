const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};

(async()=>{
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  const target=path.resolve(root,pathname==='/'?'index.html':pathname.slice(1));
  if(!target.startsWith(root))return res.writeHead(403).end();
  fs.readFile(target,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(data)})
 });
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://127.0.0.1:4173/?page=intelligence',{waitUntil:'domcontentloaded'});
 await page.locator('#enterDemo').click({force:true});await page.locator('#app:not(.hidden)').waitFor();await page.waitForTimeout(700);
 await page.evaluate(()=>navigate('intelligence'));await page.locator('.oi').waitFor();
 const tabs=await page.locator('[data-oi-tab]').count();
 if(tabs!==5)throw new Error(`5 onglets attendus, ${tabs} trouvés`);
 await page.waitForTimeout(100);const simulationDebug=await page.locator('[data-oi-simulate]').evaluate(button=>({hasHandler:!!button.onclick,content:document.querySelector('#oiResult')?.innerText}));await page.locator('[data-oi-simulate]').evaluate(button=>button.click());await page.waitForTimeout(50);
 if(!(await page.locator('#oiResult').innerText()).includes('7'))throw new Error('Résultat de simulation absent · '+JSON.stringify({errors,simulationDebug}));
 await page.locator('[data-oi-validate]').click();
 if(!await page.getByText('Décision validée').count())throw new Error('Validation humaine absente');
 await page.locator('[data-oi-tab="crisis"]').click();
 await page.locator('[data-oi-incident]').click();
 if(!await page.getByText('824').count())throw new Error('Continuité voyageurs non calculée');
 await page.locator('[data-oi-offline]').click();
 if(!await page.locator('.oi-offline-banner').count())throw new Error('Mode hors ligne absent');
 await page.locator('[data-oi-message]').click();
 if(!await page.locator('.oi-dialog').count())throw new Error('Prévisualisation multicanale absente');
 await page.locator('[data-oi-close]').first().click();
 for(const tab of ['assets','capacity','governance']){await page.locator(`[data-oi-tab="${tab}"]`).click();if((await page.locator('#oiPanel').innerText()).length<500)throw new Error(`Onglet ${tab} incomplet`)}
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>navigate('intelligence'));await page.waitForTimeout(120);
 const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 if(mobileOverflow>2)throw new Error(`Débordement mobile du cockpit : ${mobileOverflow}px`);
 console.log(JSON.stringify({tabs,simulation:true,humanValidation:true,crisis:true,offline:true,multichannel:true,mobileOverflow,errors},null,2));
 await browser.close();server.close();if(errors.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1)});
