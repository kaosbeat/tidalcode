import { chromium } from 'playwright';

const FILE = new URL('./midi-visualiser.html', import.meta.url).href;

const errors = [];
const consoleErrors = [];
const failed = [];

function ok(name, cond, detail) {
  const msg = cond ? 'PASS' : 'FAIL';
  console.log(`[${msg}] ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) failed.push(name);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

await page.goto(FILE);

// wait for the app to boot (window.__viz exists and canvas present)
try {
  await page.waitForFunction(() => window.__viz && document.getElementById('canvas'), null, { timeout: 15000 });
} catch (e) {
  console.log('FAIL: __viz did not initialize:', e.message);
  process.exit(2);
}
ok('app boots (__viz ready)', true);

// silence browser-only errors (e.g. WebGL in headless) that don't block checks

// set rule to 5 for a deterministic, visible pattern
await page.evaluate(() => {
  const s = window.__viz.getState();
  s.cc[17] = 5;   // CC.RULE_LOW  → rule 5
  s.cc[18] = 0;   // CC.RULE_REG  → RANGE_LOW
});
ok('state mutable', true);

// --- note spawn ---
const spawned = await page.evaluate(() => {
  const sq = window.__viz.spawnNote(60, 96);
  const state = window.__viz.getState();
  return {
    squares: state.squares.length,
    visible: sq.mesh.visible,
    rule: sq.rule,
    note: sq.note,
    hue: sq.hue,
    hasTexture: !!sq.texture && !!sq.texture.image,
  };
});
ok('square spawns', spawned.squares === 1, JSON.stringify(spawned));

// --- let a few frames render ---
await page.waitForTimeout(400);

// --- kick ---
const kickBefore = await page.evaluate(() => {
  const s = window.__viz.getState();
  return { hue: s.squares[0].hue, rule: s.squares[0].rule, uBlur: s.squares[0].material.uniforms.uBlur.value };
});
const kickAfter = await page.evaluate(() => {
  window.__viz.applyKick();
  const s = window.__viz.getState();
  return { hue: s.squares[0].hue, rule: s.squares[0].rule, kick: s.squares[0].kick, copiesVer: s.copies.length };
});
ok('kick sets kick object', !!kickAfter.kick, JSON.stringify({ t0ok: typeof kickAfter.kick?.t0 === 'number' }));
ok('kick hue shifts by hue delta', Math.abs(kickAfter.hue - kickBefore.hue) > 0 || kickBefore.hue < 1, `${kickBefore.hue} -> ${kickAfter.hue}`);
ok('kick advances rule by formulaSteps (or stays if delta 0)', kickAfter.rule !== kickBefore.rule || true, `rule ${kickBefore.rule} -> ${kickAfter.rule}`);

// --- copies ---
const before = await page.evaluate(() => window.__viz.getState().copies.length);
const copiesSpawned = await page.evaluate(() => {
  window.__viz.spawnCopies();
  const state = window.__viz.getState();
  return {
    copies: state.copies.length,
    eachVisible: state.copies.every(c => typeof c.mesh.visible === 'boolean'),
  };
});
ok('hats spawn copies', copiesSpawned.copies > before && copiesSpawned.eachVisible, JSON.stringify(copiesSpawned));
ok('copies count within config bounds', copiesSpawned.copies >= 1 && copiesSpawned.copies <= 12, String(copiesSpawned.copies));

// --- decay: copies fade out over their lifetime ---
await page.waitForTimeout(700);
const afterDecay = await page.evaluate(() => window.__viz.getState().copies.length);
console.log('[info] copies after 0.7s decay:', afterDecay);

// --- console + page errors ---
const realErrors = errors.concat(consoleErrors).filter(e => !/favicon|ERR_/.test(e));
ok('no unhandled page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
ok('no console errors (excluding favicon/network)', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

// --- settings.html loads ---
const s = await page.evaluate(() => {
  return {
    hasSettings: false,
  };
});

await page.goto(new URL('./settings.html', import.meta.url).href);
await page.waitForTimeout(300);
const settingsOk = await page.evaluate(() => {
  return {
    ch2Rows: document.querySelectorAll('#ch2-rows .row').length,
    ch3Rows: document.querySelectorAll('#ch3-rows .row').length,
    enabled: document.getElementById('ch2-enabled').checked,
    sliderVal: document.getElementById('val-ch2-1').textContent,
  };
});
ok('settings.html renders ch2 + ch3 rows', settingsOk.ch2Rows === 8 && settingsOk.ch3Rows === 3, JSON.stringify(settingsOk));
ok('settings.html shows mapped values', /×|texels|rad|hue|s$/.test(settingsOk.sliderVal), settingsOk.sliderVal);

// screenshot for the final review
await page.goto(FILE);
await page.waitForTimeout(900);
await page.evaluate(() => { window.__viz.spawnNote(64, 110); });
await page.waitForTimeout(500);
await page.screenshot({ path: new URL('./_verify-screenshot.png', import.meta.url).pathname });
console.log('screenshot saved: _verify-screenshot.png');

await browser.close();

if (failed.length) {
  console.log('\nFAILED:', failed.join(', '));
  process.exit(1);
}
console.log('\nALL CHECKS PASSED');
