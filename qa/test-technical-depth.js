const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };

(async () => {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
    const target = path.resolve(root, pathname === '/' ? 'index.html' : pathname.slice(1));
    if (!target.startsWith(root)) return response.writeHead(403).end();
    fs.readFile(target, (error, data) => {
      if (error) return response.writeHead(404).end();
      response.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
      response.end(data);
    });
  });
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless:true });
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/', { waitUntil:'domcontentloaded' });
  await page.evaluate(() => { document.querySelector('#intro')?.remove(); document.querySelector('#app')?.classList.remove('hidden'); });
  const ids = ['analytics','monitoring','manual','security'];
  const results = {};
  for (const id of ids) {
    await page.evaluate(value => navigate(value), id);
    await page.waitForTimeout(100);
    results[id] = { kpis:await page.locator('.pd-kpi').count(), text:(await page.locator('#content').innerText()).length };
  }
  const incomplete = ids.filter(id => results[id].kpis !== 5 || results[id].text < 1200);
  if (incomplete.length) throw new Error(`Écrans incomplets : ${incomplete.join(', ')} · ${JSON.stringify(results)}`);
  await page.evaluate(() => navigate('analytics'));
  await page.locator('[data-tcd-detail]').first().click();
  if (!await page.locator('.txd-dialog').count()) throw new Error('Explication analytique absente');
  await page.locator('[data-tcd-close]').click();
  for (const id of ['devices','control']) {
    await page.evaluate(value => navigate(value), id);
    await page.waitForTimeout(100);
    if (await page.locator('.tcd-command').count() !== 4) throw new Error(`Preuve ${id} absente`);
  }
  await page.setViewportSize({ width:390, height:844 });
  for (const id of [...ids,'devices','control']) {
    await page.evaluate(value => navigate(value), id);
    await page.waitForTimeout(50);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) throw new Error(`${id} déborde de ${overflow}px`);
  }
  console.log(JSON.stringify({ results, appendices:true, mobile:true, errors }, null, 2));
  await browser.close(); server.close();
  if (errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
