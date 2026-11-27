import { chromium } from 'playwright';
const FILE = new URL('./midi-visualiser.html', import.meta.url).href;
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => console.log('[pageerror]', String(e)));
page.on('console', m => { if (m.type() === 'error') console.log('[console.error]', m.text()); });
await page.goto(FILE);
await page.waitForFunction(() => window.__viz, null, { timeout: 15000 });
await page.evaluate(() => {
  const st = window.__viz.getState();
  st.cc[11] = 127; // max brightness
  window.__viz.spawnNote(60, 120);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: '_probe3.png' });
console.log('screenshot saved');
await browser.close();
