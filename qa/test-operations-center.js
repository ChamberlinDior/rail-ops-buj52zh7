const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
(async()=>{
  const server=http.createServer((req,res)=>{const p=decodeURIComponent(new URL(req.url,'http://x').pathname),f=path.resolve(root,p==='/'?'index.html':p.slice(1));fs.readFile(f,(e,d)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(d)})});
  await new Promise(r=>server.listen(4174,'127.0.0.1',r));
  const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true});
  const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('http://127.0.0.1:4174/?page=tracking',{waitUntil:'networkidle'});await page.waitForTimeout(2200);
  const checks={branches:await page.locator('.ocx-track.ocx-branch').count(),signals:await page.locator('.ocx-signal').count(),redSignals:await page.locator('.ocx-signal.red').count(),trains:await page.locator('.ocx-train').count()};
  for(const view of ['passagers','bagages','agents','gares','incidents','ressources','circulations']){await page.locator(`.ocx-tabs [data-ocx-view="${view}"]`).click();checks[view]=(await page.locator('[data-ocx-body]').innerText()).length>80}
  await page.locator('.ocx-tabs [data-ocx-view="passagers"]').click();await page.locator('[data-ocx-ticket]').first().click();
  checks.ticket=await page.locator('.ocx-ticket').count();const ticketText=(await page.locator('.ocx-ticket').innerText()).toLowerCase();
  checks.money=['prix unitaire ht','tva','css','total ttc','montant perçu','montant restant'].every(x=>ticketText.includes(x));
  checks.baggage=ticketText.includes('bag-');checks.route=/départ|dÃ©part/.test(ticketText)&&/arrivée|arrivÃ©e/.test(ticketText)&&ticketText.includes('648 km');
  await page.screenshot({path:'qa/tracking-ticket-premium.png',fullPage:true});await page.locator('[data-ocx-close]').click();
  await page.locator('[data-ocx-zoom]').click();checks.zoom=await page.locator('.ocx-map.zoom').count();
  await page.locator('[data-ocx-signals]').click();checks.signalToggle=await page.locator('.ocx-signal').first().evaluate(x=>x.style.display==='none');await page.locator('[data-ocx-signals]').click();
  await page.locator('[data-ocx-branches]').click();checks.branchToggle=await page.locator('.ocx-branch').first().evaluate(x=>x.style.opacity==='0');
  await page.locator('[data-ocx-refresh]').click();await page.screenshot({path:'qa/tracking-premium.png',fullPage:true});
  const passed=checks.branches>=5&&checks.signals>=10&&checks.redSignals>=3&&checks.trains>=5&&Object.entries(checks).filter(([k])=>!['branches','signals','redSignals','trains'].includes(k)).every(([,v])=>v===true||v===1)&&errors.length===0;
  console.log(JSON.stringify({checks,errors,passed},null,2));await browser.close();server.close();if(!passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
