const http=require('http'),fs=require('fs'),path=require('path'),{chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
(async()=>{
 const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://x').pathname,f=path.resolve(root,p==='/'?'index.html':p.slice(1));fs.readFile(f,(e,d)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(d)})});
 await new Promise(r=>server.listen(4175,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true}),page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4175/?page=tracking',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
 await page.locator('.ocx-tabs [data-ocx-view="bagages"]').click();await page.locator('[data-ocx-bag]').first().click();
 const text=(await page.locator('.ocx-bag-ticket').innerText()).toLowerCase(),required=['propriétaire du bagage','nadia obame','n° d’étiquette','billet voyageur','gare de départ','gare d’arrivée','code tarifaire','expéditeur','destinataire','poids contrôlé','train / service','date de vente','date de départ','date d’arrivée','n° réservation','appareil émetteur','prix unitaire ht','tva','css','montant perçu','total ttc','qr bagage unique'];
 const checks={modal:await page.locator('.ocx-bag-ticket').count(),ownerLink:required.every(x=>text.includes(x)),ownerButton:await page.locator('[data-ocx-bag-owner]').count(),print:await page.locator('[data-ocx-print]').count(),download:await page.locator('[data-ocx-download]').count()};
 await page.screenshot({path:'qa/baggage-ticket-premium.png',fullPage:true});await page.locator('[data-ocx-bag-owner]').click();checks.passengerTicket=await page.locator('.ocx-ticket:not(.ocx-bag-ticket)').count();
 const passed=Object.values(checks).every(Boolean)&&!errors.length;console.log(JSON.stringify({checks,errors,passed},null,2));await browser.close();server.close();if(!passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
