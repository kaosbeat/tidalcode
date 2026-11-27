import { chromium } from 'playwright';
const FILE = new URL('./midi-visualiser.html', import.meta.url).href;
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => console.log('[pageerror]', String(e)));
page.on('console', m => console.log('[console]', m.type(), m.text()));
await page.goto(FILE);
await page.waitForFunction(() => window.__viz, null, { timeout: 15000 });
await page.evaluate(() => { const s = window.__viz.getState(); s.cc[17] = 5; s.cc[18] = 0; window.__viz.spawnNote(60, 120); });
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  window.__viz.renderNow();
  const d = window.__viz._debug();
  const info2 = window.__viz._debug();
  return { rendererInfo: d.info.render, squares: d.squares, copies: d.copies };
});
console.log(JSON.stringify(info, (k, v) => typeof v === 'object' && v && v.isColor ? v.getHex() : v, 2).slice(0, 4000));
await page.screenshot({ path: '_probe-dbg2.png' });
await browser.close();
