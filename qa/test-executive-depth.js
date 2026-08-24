const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const port = 4181;
const limits = { audit: 1500, users: 1300, dashboard: 1500, rfid: 1400, architecture: 1600, jury: 1100 };

(async () => {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
    const target = path.resolve(root, pathname === '/' ? 'index.html' : pathname.slice(1));
    if (!target.startsWith(root)) return response.writeHead(403).end();
    fs.readFile(target, (error, data) => {
      if (error) return response.writeHead(404).end();
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
      response.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
      response.end(data);
    });
  });
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('#intro,.cinematic-intro,.intro-overlay,.login-screen').forEach(node => node.remove());
    const app = document.querySelector('#app,.app');
    if (app) { app.style.display = ''; app.classList.remove('hidden'); }
  });
  const results = {};
  for (const [name, minimum] of Object.entries(limits)) {
    await page.evaluate(pageName => navigate(pageName), name);
    await page.waitForTimeout(120);
    const textLength = await page.locator('#content').innerText().then(text => text.trim().length);
    const evidence = await page.locator('#content .exd, #content .exd-append').count();
    results[name] = { textLength, minimum, evidence };
    if (textLength < minimum || evidence < 1) throw new Error(`${name}: profondeur insuffisante (${textLength}, preuve ${evidence})`);
  }
  await page.evaluate(() => navigate('audit'));
  await page.locator('#content [data-exd-row]').first().click();
  const dialog = await page.locator('.txd-dialog').count();
  if (!dialog) throw new Error('Le détail de preuve audit ne s’ouvre pas');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => navigate('jury'));
  const mobileOverflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth));
  if (mobileOverflow > 2) throw new Error(`Débordement mobile: ${mobileOverflow}px`);
  if (errors.length) throw new Error(`Erreurs runtime: ${errors.join(' | ')}`);
  console.log(JSON.stringify({ results, dialog: !!dialog, mobileOverflow, errors }, null, 2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
