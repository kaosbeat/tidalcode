import { chromium } from 'playwright';
const FILE = new URL('./midi-visualiser.html', import.meta.url).href;
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => console.log('[pageerror]', String(e)));
page.on('console', m => console.log('[console]', m.type(), m.text()));
await page.goto(FILE);
await page.waitForFunction(() => window.__viz, null, { timeout: 15000 });
await page.evaluate(() => { window.__viz.spawnNote(60, 120); });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const canvas = document.getElementById('canvas');
  const cs = getComputedStyle(canvas);
  const body = getComputedStyle(document.body);
  return {
    canvasCss: { position: cs.position, zIndex: cs.zIndex, display: cs.display, opacity: cs.opacity, width: cs.width, height: cs.height },
    canvasSize: { attrW: canvas.width, attrH: canvas.height, cssW: canvas.clientWidth, cssH: canvas.clientHeight },
    bodyBg: body.backgroundImage ? body.backgroundImage.slice(0, 120) : null,
    parentZ: canvas.parentNode.id,
    rect: canvas.getBoundingClientRect().toJSON(),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: '_probe-dbg.png' });
await browser.close();
