const { chromium } = require('playwright-core');
const fs = require('fs');

const base = process.argv[2] || 'http://127.0.0.1:4173/';
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const reportPath = process.argv[3] || 'qa/browser-audit-report.json';

(async () => {
  const browser = await chromium.launch({ executablePath: edge, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push({ type: 'pageerror', text: error.message }));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push({ type: 'console', text: message.text() });
  });
  page.on('requestfailed', request => runtimeErrors.push({
    type: 'requestfailed',
    text: `${request.url()} :: ${request.failure()?.errorText || 'unknown'}`
  }));

  await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('#enterDemo').click();
  await page.locator('#app:not(.hidden)').waitFor({ timeout: 15000 });
  await page.waitForTimeout(1200);

  const pageIds = await page.evaluate(() => Object.keys(window.pages || {}));
  const results = [];
  for (const id of pageIds) {
    const beforeErrors = runtimeErrors.length;
    await page.evaluate(pageId => window.navigate(pageId), id);
    await page.waitForTimeout(250);
    const title = await page.locator('#content h1, #content h2').first().textContent().catch(() => '');
    const textLength = await page.locator('#content').innerText().then(text => text.trim().length).catch(() => 0);
    const buttons = page.locator('#content button:visible');
    const count = await buttons.count();
    const buttonIndexes = await buttons.evaluateAll(nodes => {
      const seen = new Set();
      const indexes = [];
      nodes.forEach((node, index) => {
        const data = Object.keys(node.dataset).sort().map(key => `${key}:${node.dataset[key]}`).join('|');
        const signature = [node.tagName, node.className, data, node.textContent.trim().replace(/\d+/g, '#')].join('::');
        if (!seen.has(signature)) {
          seen.add(signature);
          indexes.push(index);
        }
      });
      return indexes.slice(0, Number(process.env.MAX_ACTIONS || 15));
    });
    const actions = [];
    for (const index of buttonIndexes) {
      await page.evaluate(() => {
        const modal = document.querySelector('#modalRoot');
        const toast = document.querySelector('#toastRoot');
        if (modal) modal.innerHTML = '';
        if (toast) toast.innerHTML = '';
        document.querySelectorAll('.apx-overlay,.guide-overlay,.be-modal').forEach(node => node.remove());
      });
      await page.evaluate(pageId => window.navigate(pageId), id);
      await page.waitForTimeout(80);
      const currentButtons = page.locator('#content button:visible');
      if (index >= await currentButtons.count()) break;
      const button = currentButtons.nth(index);
      const label = ((await button.innerText().catch(() => '')) || (await button.getAttribute('aria-label')) || '').trim().replace(/\s+/g, ' ');
      const disabled = await button.isDisabled().catch(() => false);
      if (disabled) {
        actions.push({ index, label, result: 'disabled' });
        continue;
      }
      const before = await page.evaluate(() => ({
        content: document.querySelector('#content')?.innerHTML,
        modal: document.querySelector('#modalRoot')?.innerHTML,
        toast: document.querySelector('#toastRoot')?.innerHTML,
        url: location.href
      }));
      let clickError = '';
      try { await button.click({ timeout: 300 }); } catch (error) { clickError = error.message.split('\n')[0]; }
      await page.waitForTimeout(60);
      const after = await page.evaluate(() => ({
        content: document.querySelector('#content')?.innerHTML,
        modal: document.querySelector('#modalRoot')?.innerHTML,
        toast: document.querySelector('#toastRoot')?.innerHTML,
        url: location.href
      }));
      const changed = before.content !== after.content || before.modal !== after.modal || before.toast !== after.toast || before.url !== after.url;
      actions.push({ index, label, result: clickError ? 'click-error' : changed ? 'changed' : 'no-visible-effect', error: clickError || undefined });
      await page.keyboard.press('Escape').catch(() => {});
    }
    results.push({
      id,
      title: (title || '').trim(),
      textLength,
      buttonCount: count,
      empty: textLength < 40,
      actions,
      errors: runtimeErrors.slice(beforeErrors)
    });
  }

  const report = {
    base,
    generatedAt: new Date().toISOString(),
    pageCount: pageIds.length,
    runtimeErrors,
    pages: results
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    pageCount: report.pageCount,
    runtimeErrors: runtimeErrors.length,
    emptyPages: results.filter(result => result.empty).map(result => result.id),
    noEffect: results.reduce((sum, result) => sum + result.actions.filter(action => action.result === 'no-visible-effect').length, 0),
    clickErrors: results.reduce((sum, result) => sum + result.actions.filter(action => action.result === 'click-error').length, 0)
  }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
