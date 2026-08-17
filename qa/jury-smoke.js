const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4' };

(async () => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    const target = path.resolve(root, pathname === '/' ? 'index.html' : pathname.slice(1));
    if (!target.startsWith(root)) return res.writeHead(403).end();
    fs.readFile(target, (error, data) => {
      if (error) return res.writeHead(404).end();
      res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless:true });
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.stack || error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`); });
  const response = await page.goto('http://127.0.0.1:4173/?page=jury', { waitUntil:'domcontentloaded' });
  if (await page.locator('#enterDemo').count()) await page.locator('#enterDemo').click({ timeout:5000 });
  else if (!await page.locator('#app:not(.hidden)').count()) throw new Error(`Application absente HTTP ${response?.status()} ${await page.title()}`);
  await page.locator('#app:not(.hidden)').waitFor({ timeout:10000 });
  await page.waitForTimeout(1800);
  const ids = await page.evaluate(() => menu.flatMap(group => group[1].map(item => item[0])));
  const results = [];
  for (const id of ids) {
    const start = errors.length;
    await page.evaluate(value => navigate(value), id);
    await page.waitForTimeout(60);
    results.push({ id, text:(await page.locator('#content').innerText()).trim().length, errors:errors.slice(start) });
  }
  const selectors = ['[data-modal="sale"]','[data-modal="train"]','[data-modal="tariff"]','[data-modal="customer"]','[data-modal="rfid"]','[data-modal="cash"]','[data-modal="mission"]','[data-modal="user"]','[data-quota-new]','[data-schedule-new]','[data-tariff-new]','[data-manual-new]','[data-product-new]','[data-cancel-new]','[data-refund-new]'];
  const flows = [];
  for (const id of ids) {
    await page.evaluate(value => navigate(value), id);
    for (const selector of selectors) {
      const button = page.locator(`#content ${selector}`).first();
      if (!await button.count()) continue;
      await button.click({ timeout:2000 });
      flows.push({ id, selector, opened:!!await page.locator('.jr-modal').count() });
      await page.keyboard.press('Escape');
    }
  }
  console.log(JSON.stringify({ pageCount:ids.length, empty:results.filter(x=>x.text<40), pageErrors:results.filter(x=>x.errors.length), failedFlows:flows.filter(x=>!x.opened), flowCount:flows.length, errors:[...new Set(errors)] }, null, 2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); process.exit(1); });
