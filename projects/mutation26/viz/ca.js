/* Pure logic for the MIDI visualiser - no browser/DOM dependencies.
   This file is imported both by the page and by node for tests. */

/* ---------- cellular automata ---------- */

// Standard Wolfram rule table: table[left*4 + center*2 + right] = next cell.
export function makeRuleTable(rule) {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i++) out[i] = (rule >> i) & 1;
  return out;
}

export function centerRow(width, seedCell = Math.floor(width / 2)) {
  const row = new Uint8Array(width);
  row[seedCell] = 1;
  return row;
}

// Simulate G generations of a 1D CA (cell wrapping). Returns a flat row-major
// Uint8Array of length width*height, index = g*width + x, value 0|1.
// Generation 0 = seed row (this ends up at the BOTTOM of the on-screen square:
// see visualiser.js where the DataTexture row 0 maps to uv.y = 0).
export function simulateCA(rule, width, height, seedRow) {
  if (!Number.isInteger(width) || width < 2) throw new Error('width must be an integer >= 2');
  if (!Number.isInteger(height) || height < 1) throw new Error('height must be an integer >= 1');
  const table = makeRuleTable(rule);
  const rows = [seedRow ? Uint8Array.from(seedRow) : centerRow(width)];
  for (let g = 1; g < height; g++) {
    const prev = rows[g - 1];
    const next = new Uint8Array(width);
    for (let x = 0; x < width; x++) {
      const l = prev[(x - 1 + width) % width];
      const c = prev[x];
      const r = prev[(x + 1) % width];
      next[x] = table[(l << 2) | (c << 1) | r];
    }
    rows.push(next);
  }
  const data = new Uint8Array(width * height);
  for (let g = 0; g < height; g++) data.set(rows[g], g * width);
  return data;
}

// RGBA texture data for a square: rgb = white (tinted by material color), alpha = cell.
// offsetX: cells of pattern shift to the LEFT (wrapping around the width).
// offsetY: cells of pattern shift DOWNWARD (blank rows appear at the top).
export function makePatternData(rule, width, height, opts = {}) {
  const offsetX = Math.max(0, Math.floor(opts.offsetX || 0));
  const offsetY = Math.max(0, Math.floor(opts.offsetY || 0));
  const cells = simulateCA(rule, width, height);
  const rgba = new Uint8Array(width * height * 4);
  for (let g = 0; g < height; g++) {
    for (let x = 0; x < width; x++) {
      const srcX = (x + offsetX) % width;        // pattern moved LEFT by offsetX cells
      const srcRow = g + offsetY;                  // pattern moved DOWN by offsetY rows
      const idx = g * width + x;
      const v = srcRow < height ? cells[srcRow * width + srcX] : 0;
      rgba[idx * 4 + 0] = 255;
      rgba[idx * 4 + 1] = 255;
      rgba[idx * 4 + 2] = 255;
      rgba[idx * 4 + 3] = v ? 255 : 0;
    }
  }
  return rgba;
}

/* ---------- MIDI CC mappings ---------- */

export const CC = {
  WIDTH: 7,
  SPEED: 10,
  BRIGHTNESS: 11,
  SIZE: 14,
  OFFSET_LEFT: 15,
  OFFSET_DOWN: 16,
  RULE_LOW: 17,
  RULE_REG: 18,
};

export const CC_DEFAULTS = {
  [CC.WIDTH]: 64,
  [CC.SPEED]: 64,
  [CC.BRIGHTNESS]: 64,
  [CC.SIZE]: 64,
  [CC.OFFSET_LEFT]: 0,
  [CC.OFFSET_DOWN]: 0,
  [CC.RULE_LOW]: 5,
  [CC.RULE_REG]: 0,
};

export const WIDTH_RANGE = [4, 96];
export const SPEED_RANGE = [0.25, 2.5];
export const BRIGHT_RANGE = [0.1, 2.0];
// Square size is expressed as a percentage of the screen's smaller dimension,
// so a 100% square is as big as the total screen, whatever the aspect ratio.
export const SIZE_RANGE = [4, 100];

export function ccWidthCells(v) {
  const [lo, hi] = WIDTH_RANGE;
  return Math.round(lo + (hi - lo) * (clamp(v, 0, 127) / 127));
}

export function ccSpeedMultiplier(v) {
  const [lo, hi] = SPEED_RANGE;
  return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
}

export function ccBrightness(v) {
  const [lo, hi] = BRIGHT_RANGE;
  return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
}

// Linear mapping: CC 64 (mid) lands near the middle of the range.
export function ccSizePercent(v) {
  const [lo, hi] = SIZE_RANGE;
  return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
}

// Offsets in cells: raw CC 0..127 maps linearly onto 0..maxCells.
export function ccOffsetCells(v, maxCells) {
  const t = clamp(v, 0, 127) / 127;
  return Math.round(t * Math.max(0, maxCells));
}

/* ---------- formula (rule) selection ---------- */

// Registers for CC 18 (formula selector).
export const RULE_REG = {
  RANGE_LOW: 0,   // CC 17 value is itself the rule (0-127)
  RANGE_HIGH: 1,  // 128 + CC 17 value (128-255)
  RANDOM: 2,      // each spawn picks a uniformly random rule 0..255
  EVEN: 3,        // even rules only: CC 17 value * 2 (0, 2, ... 254)
  ODD: 4,         // odd rules only: CC 17 value * 2 + 1 (1, 3, ... 255)
};

export const RULE_REG_LABELS = [
  '0-127',
  '128-255',
  'random',
  'even-only (0,2,…,254)',
  'odd-only (1,3,…,255)',
];

export function ruleRegister(v) {
  return clamp(Math.round(clamp(v, 0, 127)), 0, 4);
}

export function randomRule(rng = Math.random) {
  return Math.floor(rng() * 256);
}

// Resolve the current formula. `low` is the raw CC 17 value (0..127);
// `register` is CC 18 value (clamped to the 0..4 register). In RANDOM mode a
// fresh rule is rolled; other modes are deterministic.
export function selectRule(low, register, rng = Math.random) {
  const reg = ruleRegister(register);
  const l = clamp(low, 0, 127);
  switch (reg) {
    case RULE_REG.RANGE_LOW: return l;
    case RULE_REG.RANGE_HIGH: return Math.min(255, 128 + l);
    case RULE_REG.RANDOM: return randomRule(rng);
    case RULE_REG.EVEN: return l * 2;
    case RULE_REG.ODD: return l * 2 + 1;
    default: return l;
  }
}

export function ruleLabel(low, register) {
  const reg = ruleRegister(register);
  if (reg === RULE_REG.RANDOM) return 'random';
  return 'rule ' + selectRule(low, reg);
}

/* ---------- square spawning ---------- */

export function pitchToHue(note) {
  return ((note * 0.618034) % 1.0);
}

export function randomSquare(rng = Math.random, rule) {
  const axis = rng() < 0.5 ? 'x' : 'y';
  const sign = rng() < 0.5 ? -1 : 1;
  return {
    axis,
    sign,
    horizontal: axis === 'x',
    baseSizeFactor: 0.8 + rng() * 0.4, // per-square size multiplier (0.80-1.20)
    baseVelocity: 28 + rng() * 55,
    rule: rule === undefined ? randomRule(rng) : rule,
  };
}

export function scaleSize(baseFactor, noteVelocity) {
  const vel = clamp(noteVelocity, 1, 127) / 127;
  return baseFactor * (0.7 + 0.5 * vel);
}


/* fade in / decay lifecycle */

// Held squares fade in over FADE_IN seconds, then stay at full intensity.
export function heldFadeIn(secondsSinceSpawn, fadeIn = 0.18) {
  return clamp(secondsSinceSpawn / fadeIn, 0, 1);
}

// Decaying squares (note-off arrived) fade out over fadeOut seconds.
export function decayAlpha(secondsSinceNoteOff, fadeOut = 1.3) {
  if (secondsSinceNoteOff < 0 || secondsSinceNoteOff >= fadeOut) return 0;
  return 1 - secondsSinceNoteOff / fadeOut;
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// Human-readable name for a formula register (0..4).
export function registerName(register) {
  const reg = ruleRegister(register);
  return RULE_REG_LABELS[reg] ?? 'unknown';
}

/* ---------- channel 2 (kick) — effect mappings ----------
   The 8 effect CCs (1..8) on MIDI channel 2. Values are linearized onto
   effect parameters. The "shake" is envelope-driven: it peaks at the kick
   and decays linearly over the decay time. */

export const CH2_CC = {
  Y: 1,          // noise amplitude on the Y axis
  X: 2,          // decaying noise amplitude on the X axis
  SCALE: 3,      // extra scale bump
  BLUR: 4,       // texture blur (in texels)
  ROTATION: 5,   // extra rotation amplitude (radians, oscillating)
  FORMULA: 6,    // rule advance on kick
  COLOR: 7,      // hue shift per kick
  DECAY: 8,      // shake decay time
};

export const CH2_CC_DEFAULTS = {
  [CH2_CC.Y]: 55,      // ~0.26 of the square side
  [CH2_CC.X]: 45,      // ~0.21
  [CH2_CC.SCALE]: 40,  // ~1.19x
  [CH2_CC.BLUR]: 40,   // ~3.8 texels
  [CH2_CC.ROTATION]: 40, // ~0.38 rad
  [CH2_CC.FORMULA]: 22,  // 1 step
  [CH2_CC.COLOR]: 30,    // ~0.12 hue
  [CH2_CC.DECAY]: 62,    // ~1.55 s (long decay)
};

export function ccKickShake(v) {
  return clamp(v, 0, 127) / 127 * 0.6;
}

export function ccKickScale(v) {
  return 1 + clamp(v, 0, 127) / 127 * 0.6;
}

export function ccKickBlur(v) {
  return clamp(v, 0, 127) / 127 * 12;
}

export function ccKickRotation(v) {
  return clamp(v, 0, 127) / 127 * 1.2;
}

export function ccKickFormula(v) {
  return Math.round(clamp(v, 0, 127) / 127 * 8);
}

export function ccKickColor(v) {
  return clamp(v, 0, 127) / 127 * 0.5;
}

export function ccKickDecay(v) {
  return 0.4 + clamp(v, 0, 127) / 127 * 2.6;
}

/* Resolve the rule after a kick: advance the current formula by `steps`
   respecting the active register. RANDOM picks a fresh rule. */
export function advanceRule(rule, register, steps) {
  const n = Math.round(steps);
  const reg = ruleRegister(register);
  const r = clamp(Math.round(rule), 0, 255);
  if (reg === RULE_REG.RANDOM) return randomRule();
  if (reg === RULE_REG.RANGE_LOW) return ((r + n) % 128 + 128) % 128;
  if (reg === RULE_REG.RANGE_HIGH) return 128 + ((((r - 128) + n) % 128 + 128) % 128);
  if (reg === RULE_REG.EVEN) return (r + 2 * n) % 256;
  if (reg === RULE_REG.ODD) return (r + 2 * n) % 256;
  return r;
}

/* ---------- channel 3 (hats) — square copies effect ----------
   The 4 effect CCs (1..4) on MIDI channel 3. Values are linearized onto
   the four tunables. */

export const CH3_CC = {
  DECAY: 1,
  COPIES: 2,
  SCALE: 3,
  DIRECTION: 4,
};

export const CH3_DIRECTION_NAMES = ['random', 'inverse', 'same'];

export const CH3_CC_DEFAULTS = {
  [CH3_CC.DECAY]: 46,   // ~0.28 s
  [CH3_CC.COPIES]: 58,  // ~6 copies
  [CH3_CC.SCALE]: 65,   // ~0.78
  [CH3_CC.DIRECTION]: 0, // random
};

export function ccHatsDecay(v) {
  return 0.05 + clamp(v, 0, 127) / 127 * 0.55;
}

export function ccHatsCopies(v) {
  return 1 + Math.round(clamp(v, 0, 127) / 127 * 11);
}

export function ccHatsScaleFactor(v) {
  return 0.5 + clamp(v, 0, 127) / 127 * 0.49;
}

export function ccHatsDirection(v) {
  const i = Math.round(clamp(v, 0, 127) / 127 * (CH3_DIRECTION_NAMES.length - 1));
  return CH3_DIRECTION_NAMES[i] || CH3_DIRECTION_NAMES[0];
}

export function ccHatsDirectionIndex(name) {
  const i = CH3_DIRECTION_NAMES.indexOf(name);
  return i < 0 ? 0 : i;
}

/* ---------- channel 4 — square transform effect ----------
   The 6 effect CCs (1..6) on MIDI channel 4. On note-on, the active effects
   are applied to every square on screen. */

export const CH4_CC = {
  MODE: 1,
  ANGLE_SOURCE: 2,
  ANGLE: 3,
  SIZE: 4,
  COLOR: 5,
  FORMULA: 6,
};

export const CH4_MODE_NAMES = ['same', 'different', 'plus90'];
export const CH4_ANGLE_SOURCE_NAMES = ['random', 'fixed'];

export const CH4_CC_DEFAULTS = {
  [CH4_CC.MODE]: 0,      // same
  [CH4_CC.ANGLE_SOURCE]: 0, // random
  [CH4_CC.ANGLE]: 16,    // ~45 deg
  [CH4_CC.SIZE]: 64,     // ~1.25x
  [CH4_CC.COLOR]: 30,    // ~0.12 hue shift
  [CH4_CC.FORMULA]: 32,  // 4 steps
};

export function ccChannel4Mode(v) {
  const i = Math.round(clamp(v, 0, 127) / 127 * (CH4_MODE_NAMES.length - 1));
  return CH4_MODE_NAMES[i] || CH4_MODE_NAMES[0];
}

export function ccChannel4AngleSource(v) {
  const i = Math.round(clamp(v, 0, 127) / 127 * (CH4_ANGLE_SOURCE_NAMES.length - 1));
  return CH4_ANGLE_SOURCE_NAMES[i] || CH4_ANGLE_SOURCE_NAMES[0];
}

export function ccChannel4Angle(v) {
  return clamp(v, 0, 127) / 127 * 360; // degrees
}

export function ccChannel4Size(v) {
  return 0.5 + clamp(v, 0, 127) / 127 * 1.5; // 0.5x .. 2.0x
}

export function ccChannel4Color(v) {
  return clamp(v, 0, 127) / 127 * 0.5; // 0 .. 0.5 hue shift
}

export function ccChannel4Formula(v) {
  return Math.round(clamp(v, 0, 127) / 127 * 16); // 0 .. 16 steps
}

export function ccChannel4ModeIndex(name) {
  const i = CH4_MODE_NAMES.indexOf(name);
  return i < 0 ? 0 : i;
}

export function ccChannel4AngleSourceIndex(name) {
  const i = CH4_ANGLE_SOURCE_NAMES.indexOf(name);
  return i < 0 ? 0 : i;
}
