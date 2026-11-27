import { makePatternData } from './ca.js';
const w = 6, hgt = 4;
const base = makePatternData(90, w, hgt);
const off = makePatternData(90, w, hgt, { offsetX: 1, offsetY: 2 });
console.log('--- base (row 0 = screen bottom) ---');
for (let g = 0; g < hgt; g++) {
  let s = '';
  for (let x = 0; x < w; x++) s += base[(g*w+x)*4+3] > 0 ? '#' : '.';
  console.log('row' + g + ': ' + s);
}
console.log('--- offsetX=1 offsetY=2 ---');
for (let g = 0; g < hgt; g++) {
  let s = '';
  for (let x = 0; x < w; x++) s += off[(g*w+x)*4+3] > 0 ? '#' : '.';
  console.log('row' + g + ': ' + s);
}
