import { chromium } from 'playwright';
const FILE = new URL('./midi-visualiser.html', import.meta.url).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(FILE);
await page.waitForFunction(() => window.__viz && document.getElementById('canvas'), null, { timeout: 20000 });
await page.evaluate(() => { const s = window.__viz.getState(); s.cc[17] = 5; s.cc[18] = 0; });
await page.waitForTimeout(400);
await page.evaluate(() => window.__viz.spawnNote(60, 96));
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  const s = window.__viz.getState();
  const sq = s.squares[0];
  if (!sq) return { squares: 0 };
  return {
    squares: s.squares.length,
    sizePercent: s.cc[14],
    meshScaleX: sq.mesh.scale.x,
    meshScaleY: sq.mesh.scale.y,
    meshVisible: sq.mesh.visible,
    uFade: sq.material.uniforms.uFade.value,
    meshPos: { x: sq.mesh.position.x, y: sq.mesh.position.y },
    meshRotZ: sq.mesh.rotation.z,
  };
});
console.log(JSON.stringify(info));
await page.screenshot({ path: '_probe-shot.png' });
await browser.close();
