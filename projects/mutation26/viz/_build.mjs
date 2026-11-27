import fs from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;

// 1. ca.js: strip `export ` prefixes
const ca = fs.readFileSync(dir + 'ca.js', 'utf8').replace(/\bexport\s+/g, '');

// 2. visualiser.js: strip the import statement
let vis = fs.readFileSync(dir + 'visualiser.js', 'utf8');
vis = vis.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/ca\.js['"]\s*;/, '');

// safety: no `export` or `import` left in either file
if (/(^|[^\w.])\bimport\s/.test(vis) || /(^|[^\w.])\bexport\s/.test(vis) || /(^|[^\w.])\bexport\s/.test(ca)) {
  throw new Error('remaining module syntax found — inspect before building');
}

// 3. app bundle: IIFE
const app = `(() => {\n${ca}\n${vis}\n})();`;

// 4. rebuild midi-visualiser.html from shell.html + bundles
const shell = fs.readFileSync(dir + 'shell.html', 'utf8');
const three = fs.readFileSync(dir + 'three.iife.js', 'utf8');
const p1 = '<script src="__THREE_BUNDLE__"></script>';
const p2 = '<script src="__APP_BUNDLE__"></script>';
if (!shell.includes(p1) || !shell.includes(p2)) {
  throw new Error('placeholders not found in shell.html');
}
const html = shell
  .replace(p1, `<script>\n${three}\n</script>`)
  .replace(p2, `<script>\n${app}\n</script>`);
fs.writeFileSync(dir + 'midi-visualiser.html', html);
console.log('built midi-visualiser.html:', html.length, 'bytes');
