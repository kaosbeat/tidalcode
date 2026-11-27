import {
  CC, CC_DEFAULTS, WIDTH_RANGE, RULE_REG,
  makePatternData, ccWidthCells, ccSpeedMultiplier, ccBrightness, ccSizePercent,
  ccOffsetCells, registerName, randomRule, selectRule, ruleRegister,
  pitchToHue, clamp, randomSquare, scaleSize, heldFadeIn, decayAlpha,
  CH2_CC, CH2_CC_DEFAULTS,
  ccKickShake, ccKickScale, ccKickBlur, ccKickRotation, ccKickFormula,
  ccKickColor, ccKickDecay, advanceRule,
} from './ca.js';

const TEXTURE_HEIGHT = 96;
const MAX_SQUARES = 40;
const SYSTEM_FPS = 60;

const canvasEl = document.getElementById('canvas');

/* ---------- scene setup ---------- */
let width = window.innerWidth;
let height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true, premultipliedAlpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
renderer.autoClear = true;

const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 10);
camera.position.set(0, 0, 5);

const scene = new THREE.Scene();
const planeGeo = new THREE.PlaneGeometry(1, 1);

/* ---------- state ---------- */
const state = {
  cc: Object.fromEntries(Object.entries(CC_DEFAULTS)),
  blendMode: 'additive',
  autoplay: false,
  lastSpawnAt: 0,
  lastTime: performance.now(),
  squares: [],
  copies: [],
  dirtyTextures: false,
  ch2: { enabled: true, cc: { ...CH2_CC_DEFAULTS } },
  ch3: { enabled: true, decay: 0.25, copies: 6, scaleFactor: 0.75, direction: 'random' },
};

/* ---------- materials ---------- */
function makeSquareMaterial(hue) {
  const color = new THREE.Color().setHSL(hue, 0.85, 0.62);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uPattern: { value: null },
      uColor: { value: color },
      uFade: { value: 1 },
      uIntensity: { value: 1 },
      uMode: { value: 0 },
      uBlur: { value: 0 },
      uTexel: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uPattern;
      uniform vec3 uColor;
      uniform float uFade;
      uniform float uIntensity;
      uniform float uMode;
      uniform float uBlur;
      uniform vec2 uTexel;
      void main() {
        float a;
        if (uBlur < 0.1) {
          a = texture2D(uPattern, vUv).a;
        } else {
          // horizontal box blur (9 taps), one tap spans uBlur/4 texels per side
          float sum = 0.0;
          for (int i = -4; i <= 4; i++) {
            float off = (float(i) / 4.0) * uBlur * uTexel.x;
            vec2 uv2 = vec2(clamp(vUv.x + off, 0.0, 1.0), vUv.y);
            sum += texture2D(uPattern, uv2).a;
          }
          a = sum / 9.0;
        }
        a = a * uFade * uIntensity;
        vec3 rgb;
        if (uMode > 1.5) {
          rgb = mix(vec3(1.0), uColor, clamp(a, 0.0, 1.0));
        } else {
          rgb = uColor * a;
        }
        gl_FragColor = vec4(rgb, a);
      }`,
  });
  return mat;
}

function applyBlendingTo(m, mode) {
  m.blending = THREE.CustomBlending;
  m.blendEquation = THREE.AddEquation;
  m.blendSrcAlpha = THREE.OneFactor;
  m.blendDstAlpha = THREE.OneFactor;
  if (mode === 'normal') {
    m.blendSrc = THREE.OneFactor;
    m.blendDst = THREE.OneMinusSrcAlphaFactor;
    m.blendSrcAlpha = THREE.OneFactor;
    m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
    m.uniforms.uMode.value = 0;
  } else if (mode === 'additive') {
    m.blendSrc = THREE.OneFactor;
    m.blendDst = THREE.OneFactor;
    m.uniforms.uMode.value = 0;
  } else if (mode === 'multiply') {
    m.blendSrc = THREE.ZeroFactor;
    m.blendDst = THREE.SrcColorFactor;
    m.blendSrcAlpha = THREE.ZeroFactor;
    m.blendDstAlpha = THREE.OneFactor;
    m.uniforms.uMode.value = 2;
  } else if (mode === 'subtract') {
    m.blendEquation = THREE.SubtractEquation;
    m.blendSrc = THREE.OneFactor;
    m.blendDst = THREE.OneFactor;
    m.uniforms.uMode.value = 0;
  } else {
    throw new Error('unknown blending mode: ' + mode);
  }
}

function applyBlending(mode) {
  for (const s of state.squares) applyBlendingTo(s.material, mode);
  for (const c of state.copies) applyBlendingTo(c.material, mode);
}

/* ---------- square lifecycle ---------- */
function makePatternFor(rule, width, opts) {
  const rgba = makePatternData(rule, width, TEXTURE_HEIGHT, opts);
  const tex = new THREE.DataTexture(rgba, width, TEXTURE_HEIGHT, THREE.RGBAFormat);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createSquare({ note, velocity }) {
  const reg = ruleRegister(state.cc[CC.RULE_REG]);
  const rule = reg === RULE_REG.RANDOM
    ? randomRule()
    : selectRule(state.cc[CC.RULE_LOW], reg);
  const cfg = randomSquare(Math.random, rule);
  const sizeFactor = scaleSize(cfg.baseSizeFactor, velocity);
  const speedBase = cfg.baseVelocity;
  const hues = pitchToHue(note);

  const w = ccWidthCells(state.cc[CC.WIDTH]);
  const offX = ccOffsetCells(state.cc[CC.OFFSET_LEFT], w);
  const offY = ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT);
  const tex = makePatternFor(cfg.rule, w, { offsetX: offX, offsetY: offY });
  const material = makeSquareMaterial(hues);
  material.uniforms.uPattern.value = tex;
  material.uniforms.uFade.value = 0;
  material.uniforms.uIntensity.value = ccBrightness(state.cc[CC.BRIGHTNESS]);
  material.uniforms.uTexel.value.set(1 / w, 1 / TEXTURE_HEIGHT);
  applyBlendingTo(material, state.blendMode);

  const mesh = new THREE.Mesh(planeGeo, material);
  const initialSide = Math.min(100, ccSizePercent(state.cc[CC.SIZE]) * sizeFactor) / 100 * Math.min(width, height);
  mesh.scale.set(initialSide, initialSide, 1);
  const posX = (Math.random() * 0.8 - 0.4) * width;
  const posY = (Math.random() * 0.8 - 0.4) * height;
  mesh.position.set(posX, posY, 0);
  mesh.rotation.z = cfg.horizontal ? 0 : Math.PI / 2;
  mesh.renderOrder = 1;
  mesh.frustumCulled = false;
  mesh.visible = true;

  scene.add(mesh);
  const square = {
    mesh, material, texture: tex,
    axis: cfg.axis, sign: cfg.sign, horizontal: cfg.horizontal,
    sizeFactor, baseVelocity: speedBase, rule: cfg.rule,
    note, held: true, decayingAt: null,
    offsetX: offX, offsetY: offY,
    hue: hues, widthCells: w,
    logicalX: posX, logicalY: posY,
    baseRotationZ: mesh.rotation.z,
    spawnedAt: performance.now(),
    kick: null,
  };
  state.squares.push(square);
  if (state.squares.length > MAX_SQUARES) {
    const oldest = state.squares.shift();
    destroyMaster(oldest);
  }
  return square;
}

function destroySquare(s) {
  scene.remove(s.mesh);
  s.texture.dispose();
  s.material.dispose();
}

// Remove a master square and every copy tied to it (they share its texture).
function destroyMaster(s) {
  for (let i = state.copies.length - 1; i >= 0; i--) {
    const c = state.copies[i];
    if (c.master === s) {
      scene.remove(c.mesh);
      c.material.dispose();
      state.copies.splice(i, 1);
    }
  }
  destroySquare(s);
}

function refreshTextures() {
  const w = ccWidthCells(state.cc[CC.WIDTH]);
  const offX = ccOffsetCells(state.cc[CC.OFFSET_LEFT], w);
  const offY = ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT);
  const reg = ruleRegister(state.cc[CC.RULE_REG]);
  const rule = reg === RULE_REG.RANDOM ? null : selectRule(state.cc[CC.RULE_LOW], reg);
  for (const s of state.squares) {
    if (rule !== null) s.rule = rule; // in random mode each square keeps its own rule
    const oldTex = s.texture;
    const newTex = makePatternFor(s.rule, w, { offsetX: offX, offsetY: offY });
    s.texture = newTex;
    s.material.uniforms.uPattern.value = newTex;
    s.material.uniforms.uTexel.value.set(1 / w, 1 / TEXTURE_HEIGHT);
    for (const c of state.copies) {
      if (c.texture === oldTex) c.texture = newTex;
    }
    s.widthCells = w;
    s.offsetX = offX;
    s.offsetY = offY;
    oldTex.dispose();
  }
}

function clearSquares() {
  for (const s of [...state.squares]) destroyMaster(s);
  state.squares = [];
  for (const c of state.copies) { scene.remove(c.mesh); c.material.dispose(); }
  state.copies = [];
}

/* ---------- animation ---------- */
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - state.lastTime) / 1000);
  state.lastTime = now;

  if (state.dirtyTextures) {
    refreshTextures();
    state.dirtyTextures = false;
  }

  const speed = ccSpeedMultiplier(state.cc[CC.SPEED]);
  const bright = ccBrightness(state.cc[CC.BRIGHTNESS]);
  const sizePct = ccSizePercent(state.cc[CC.SIZE]);
  const minDim = Math.min(width, height);

  if (state.autoplay && now - state.lastSpawnAt > 600) {
    const sq = spawnNote(pickRandomNote(), 100);
    if (sq) setTimeout(() => decaySquare(sq), 450);
    state.lastSpawnAt = now;
  }

  for (let i = state.squares.length - 1; i >= 0; i--) {
    const s = state.squares[i];
    const t = (now - s.spawnedAt) / 1000;

    // size: percent of the screen's smaller dimension (100% = as big as the screen)
    const pct = Math.min(100, sizePct * s.sizeFactor);
    const sz = pct / 100 * minDim;
    let scaleMult = 1;
    let rotDelta = 0;
    let blur = 0;
    let shakeX = 0;
    let shakeY = 0;

    if (s.kick) {
      const k = s.kick;
      const ageMs = now - k.t0;
      if (ageMs >= k.decay * 1000) {
        s.kick = null;
        s.material.uniforms.uBlur.value = 0;
        s.mesh.rotation.z = s.baseRotationZ;
        blur = 0;
      } else {
        const age = ageMs / 1000;
        const alpha = 1 - ageMs / (k.decay * 1000);
        const tSec = age;
        shakeX = Math.sin(tSec * 9 + k.phase) * k.ampX * sz * alpha;
        shakeY = Math.sin(tSec * 7.3 + k.phase * 1.3) * k.ampY * sz * alpha;
        scaleMult = 1 + k.scaleAmt * alpha;
        rotDelta = alpha * k.rotAmt * Math.sin(tSec * 5 + k.phase);
        blur = k.blurAmt * alpha;
      }
    }

    s.mesh.scale.set(sz * scaleMult, sz * scaleMult, 1);

    // drift + tile: a square exiting one side re-enters from the opposite side
    const half = sz / 2;
    const v = s.baseVelocity * speed;
    if (s.horizontal) {
      s.logicalX += s.sign * v * dt;
      if (s.sign > 0 && s.logicalX - half > width / 2) s.logicalX = -width / 2 - half;
      else if (s.sign < 0 && s.logicalX + half < -width / 2) s.logicalX = width / 2 + half;
    } else {
      s.logicalY += s.sign * v * dt;
      if (s.sign > 0 && s.logicalY - half > height / 2) s.logicalY = -height / 2 - half;
      else if (s.sign < 0 && s.logicalY + half < -height / 2) s.logicalY = height / 2 + half;
    }

    s.mesh.position.set(s.logicalX + shakeX, s.logicalY + shakeY, 0);
    s.mesh.rotation.z = s.baseRotationZ + rotDelta;
    s.material.uniforms.uBlur.value = blur;

    // fade in while held, fade out once note-off arrives
    let alpha;
    if (s.held) {
      alpha = heldFadeIn(t);
    } else {
      const tOff = (now - s.decayingAt) / 1000;
      alpha = decayAlpha(tOff);
      if (tOff >= 1.3) {
        destroyMaster(s);
        state.squares.splice(i, 1);
        continue;
      }
    }

    s.material.uniforms.uFade.value = alpha;
    s.material.uniforms.uIntensity.value = bright;
  }

  // channel 3 (hats): drifting copies of the master square
  for (let i = state.copies.length - 1; i >= 0; i--) {
    const c = state.copies[i];
    if (!state.squares.includes(c.master)) {
      scene.remove(c.mesh);
      c.material.dispose();
      state.copies.splice(i, 1);
      continue;
    }
    const age = (now - c.t0) / 1000;
    const t = age / c.decay;
    if (t >= 1) {
      scene.remove(c.mesh);
      c.material.dispose();
      state.copies.splice(i, 1);
      continue;
    }
    const eased = 1 - Math.pow(1 - t, 2); // ease-out: fast drift, slow tail
    const alpha = 1 - t;
    const scale = c.startScale * (1 + (c.endScaleFactor - 1) * eased);
    c.mesh.scale.set(scale, scale, 1);
    c.mesh.position.set(
      c.startPosX + c.dirX * c.speed * age,
      c.startPosY + c.dirY * c.speed * age,
      0
    );
    c.material.uniforms.uFade.value = Math.max(0, 0.95 * alpha);
    c.material.uniforms.uIntensity.value = bright;
  }

  renderer.render(scene, camera);
}

/* ---------- MIDI ---------- */
let midiAccess = null;
const subscribedInputs = new Set();

function pickRandomNote() {
  return 48 + Math.floor(Math.random() * 48); // C3..C7
}

async function connectMidi() {
  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    midiAccess.onstatechange = handleMidiStateChange;
    subscribeToMidiInputs();
    setMidiStatus('connected', midiAccess.inputs.size);
  } catch (err) {
    setMidiStatus('unavailable: ' + (err && err.message ? err.message : 'not allowed'));
  }
}

function subscribeToMidiInputs() {
  if (!midiAccess) return;
  for (const input of midiAccess.inputs.values()) {
    if (subscribedInputs.has(input)) continue;
    input.onmidimessage = onMidiMessage;
    input.onstatechange = handleMidiStateChange;
    subscribedInputs.add(input);
  }
}

function handleMidiStateChange() {
  subscribeToMidiInputs();
  setMidiStatus(midiAccess && midiAccess.inputs.size > 0 ? 'connected' : 'no MIDI inputs', midiAccess ? midiAccess.inputs.size : 0);
}

function onMidiMessage(e) {
  const [status, d1, d2] = e.data;
  const cmd = status & 0xf0;
  const channel = status & 0x0f;

  if (channel === 1) { // channel 2: kick (shake)
    if (cmd === 0x90 && d2 > 0) { // note on
      applyKick();
    } else if (cmd === 0xB0) { // control change
      const val = clamp(d2, 0, 127);
      if (d1 in state.ch2.cc) {
        state.ch2.cc[d1] = val;
        saveEffectsConfig();
        setReadout('ch2 CC ' + d1 + ' = ' + val);
      }
    }
    return;
  }
  if (channel === 2) { // channel 3: hihats (square copies)
    if (cmd === 0x90 && d2 > 0) {
      spawnCopies();
    }
    return;
  }
  if (channel !== 0) return;

  if (cmd === 0x90 && d2 > 0) { // note on
    spawnNote(d1, d2);
  } else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) { // note off (or velocity-0 note-on)
    decayNote(d1);
  } else if (cmd === 0xB0) { // control change
    const val = clamp(d2, 0, 127);
    if (val === undefined) return;
    if (d1 in CC_DEFAULTS) {
      const v = d1 === CC.RULE_REG ? clamp(val, 0, 4) : val;
      state.cc[d1] = v;
      if (d1 === CC.WIDTH || d1 === CC.OFFSET_LEFT || d1 === CC.OFFSET_DOWN) state.dirtyTextures = true;
      else if (d1 === CC.RULE_LOW || d1 === CC.RULE_REG) {
        if (ruleRegister(state.cc[CC.RULE_REG]) !== RULE_REG.RANDOM) state.dirtyTextures = true;
      }
      syncControlsFromState();
      setReadout('CC ' + d1 + ' = ' + v);
    }
  }
}

/* ---------- spawning ---------- */
function spawnNote(note, velocity) {
  const square = createSquare({ note, velocity });
  setReadout('note ' + note + ' (v' + velocity + ')');
  return square;
}

/* ---------- note-off / decay ---------- */
function decaySquare(sq, quiet = false) {
  if (!sq || !state.squares.includes(sq) || !sq.held) return;
  sq.held = false;
  sq.decayingAt = performance.now();
  if (!quiet && sq.note !== undefined) setReadout('note ' + sq.note + ' off');
}

function decayNote(note) {
  for (let i = state.squares.length - 1; i >= 0; i--) {
    const sq = state.squares[i];
    if (sq.note === note && sq.held) {
      decaySquare(sq);
      return;
    }
  }
}

/* ---------- channel 2 (kick): shake effect ---------- */
function applyKick() {
  if (!state.ch2.enabled) return;
  const visible = state.squares.filter(s => s.mesh.visible !== false && s.material.uniforms.uFade.value > 0.01);
  if (visible.length === 0) { setReadout('kick — no visible square'); return; }
  const now = performance.now();
  const ampY = ccKickShake(state.ch2.cc[CH2_CC.Y]);
  const ampX = ccKickShake(state.ch2.cc[CH2_CC.X]);
  const scaleAmt = ccKickScale(state.ch2.cc[CH2_CC.SCALE]) - 1;
  const blurAmt = ccKickBlur(state.ch2.cc[CH2_CC.BLUR]);
  const rotAmt = ccKickRotation(state.ch2.cc[CH2_CC.ROTATION]);
  const formulaSteps = ccKickFormula(state.ch2.cc[CH2_CC.FORMULA]);
  const hueShift = ccKickColor(state.ch2.cc[CH2_CC.COLOR]);
  const decay = ccKickDecay(state.ch2.cc[CH2_CC.DECAY]);
  const reg = ruleRegister(state.cc[CC.RULE_REG]);
  const w = ccWidthCells(state.cc[CC.WIDTH]);
  const offX = ccOffsetCells(state.cc[CC.OFFSET_LEFT], w);
  const offY = ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT);

  for (const s of visible) {
    s.kick = { t0: now, decay, ampY, ampX, scaleAmt, blurAmt, rotAmt, phase: Math.random() * Math.PI * 2 };
    if (hueShift > 0) {
      s.hue = (s.hue + hueShift) % 1;
      s.material.uniforms.uColor.value = new THREE.Color().setHSL(s.hue, 0.85, 0.62);
    }
    if (formulaSteps > 0) {
      s.rule = advanceRule(s.rule, reg, formulaSteps);
      const oldTex = s.texture;
      const newTex = makePatternFor(s.rule, w, { offsetX: offX, offsetY: offY });
      s.texture = newTex;
      s.material.uniforms.uPattern.value = newTex;
      s.material.uniforms.uTexel.value.set(1 / w, 1 / TEXTURE_HEIGHT);
      for (const c of state.copies) {
        if (c.texture === oldTex) c.texture = newTex;
      }
      s.widthCells = w;
      s.offsetX = offX;
      s.offsetY = offY;
      oldTex.dispose();
    }
  }
  saveEffectsConfig();
  setReadout('kick — ' + visible.length + ' square' + (visible.length === 1 ? '' : 's'));
}

/* ---------- channel 3 (hats): square copies ---------- */
function spawnCopies() {
  if (!state.ch3.enabled) return;
  const master = state.squares[state.squares.length - 1];
  if (!master) { setReadout('hats — no visible square'); return; }
  const now = performance.now();
  const count = Math.max(1, Math.min(12, Math.round(state.ch3.copies)));
  const decay = Math.min(0.6, Math.max(0.05, state.ch3.decay));
  const scaleFactor = Math.min(0.99, Math.max(0.5, state.ch3.scaleFactor));
  const direction = state.ch3.direction;
  const speedMul = ccSpeedMultiplier(state.cc[CC.SPEED]);
  const minDim = Math.min(width, height);
  const pct = Math.min(100, ccSizePercent(state.cc[CC.SIZE]) * master.sizeFactor);
  const startScale = pct / 100 * minDim;

  for (let i = 0; i < count; i++) {
    const material = makeSquareMaterial(master.hue);
    material.uniforms.uPattern.value = master.texture; // shared, not disposed
    material.uniforms.uFade.value = 1;
    material.uniforms.uIntensity.value = ccBrightness(state.cc[CC.BRIGHTNESS]);
    material.uniforms.uTexel.value.copy(master.material.uniforms.uTexel.value);
    applyBlendingTo(material, state.blendMode);

    const mesh = new THREE.Mesh(planeGeo, material);
    let dirX, dirY;
    if (direction === 'same') {
      if (master.horizontal) { dirX = master.sign; dirY = 0; }
      else { dirX = 0; dirY = master.sign; }
    } else if (direction === 'inverse') {
      if (master.horizontal) { dirX = -master.sign; dirY = 0; }
      else { dirX = 0; dirY = -master.sign; }
    } else {
      const angle = Math.random() * Math.PI * 2;
      dirX = Math.cos(angle);
      dirY = Math.sin(angle);
    }
    const speed = master.baseVelocity * 2.4 * speedMul * (0.8 + Math.random() * 0.4);
    // drift direction follows the master's movement axis for "same"/"inverse";
    // it must be normalized to a unit vector for the random case
    const mag = Math.hypot(dirX, dirY) || 1;
    dirX /= mag; dirY /= mag;

    mesh.scale.set(startScale, startScale, 1);
    mesh.position.set(master.mesh.position.x, master.mesh.position.y, 0);
    mesh.rotation.z = master.mesh.rotation.z;
    mesh.renderOrder = 1;
    mesh.frustumCulled = false;
    scene.add(mesh);

    state.copies.push({
      mesh, material, texture: master.texture, master,
      dirX, dirY, speed,
      t0: now, decay,
      startScale, endScaleFactor: scaleFactor,
      startPosX: master.mesh.position.x,
      startPosY: master.mesh.position.y,
    });
  }
  setReadout('hats — ' + count + ' copies');
}

/* ---------- effects config (localStorage) ---------- */
const CONFIG_KEY = 'visualiser-effects-config';

function loadEffectsConfig() {
  let cfg = null;
  try { cfg = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null'); } catch (e) { cfg = null; }
  if (!cfg || typeof cfg !== 'object') return;
  if (cfg.ch2 && typeof cfg.ch2 === 'object') {
    if (typeof cfg.ch2.enabled === 'boolean') state.ch2.enabled = cfg.ch2.enabled;
    if (cfg.ch2.cc && typeof cfg.ch2.cc === 'object') {
      for (const key of Object.keys(cfg.ch2.cc)) {
        const n = parseInt(key, 10);
        if (Object.prototype.hasOwnProperty.call(state.ch2.cc, n)) {
          const v = clamp(Math.round(Number(cfg.ch2.cc[key]) || 0), 0, 127);
          state.ch2.cc[n] = v;
        }
      }
    }
  }
  if (cfg.ch3 && typeof cfg.ch3 === 'object') {
    if (typeof cfg.ch3.enabled === 'boolean') state.ch3.enabled = cfg.ch3.enabled;
    if (typeof cfg.ch3.decay === 'number') state.ch3.decay = Math.min(0.6, Math.max(0.05, cfg.ch3.decay));
    if (typeof cfg.ch3.copies === 'number') state.ch3.copies = Math.min(12, Math.max(1, Math.round(cfg.ch3.copies)));
    if (typeof cfg.ch3.scaleFactor === 'number') state.ch3.scaleFactor = Math.min(0.99, Math.max(0.5, cfg.ch3.scaleFactor));
    if (typeof cfg.ch3.direction === 'string' && ['random', 'inverse', 'same'].includes(cfg.ch3.direction)) state.ch3.direction = cfg.ch3.direction;
  }
}

function saveEffectsConfig() {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      ch2: { enabled: state.ch2.enabled, cc: state.ch2.cc },
      ch3: state.ch3,
    }));
  } catch (e) { /* ignore */ }
}

loadEffectsConfig();
window.addEventListener('storage', (e) => {
  if (e.key !== CONFIG_KEY) return;
  loadEffectsConfig();
});

/* ---------- UI ---------- */
const ui = {
  panel: document.getElementById('panel'),
  toggle: document.getElementById('toggle'),
  btnMidi: document.getElementById('btn-midi'),
  btnNote: document.getElementById('btn-note'),
  btnKick: document.getElementById('btn-kick'),
  btnHats: document.getElementById('btn-hats'),
  btnClear: document.getElementById('btn-clear'),
  autoplay: document.getElementById('autoplay'),
  blend: document.getElementById('blend'),
  blendValue: document.getElementById('blend-value'),
  sliderWidth: document.getElementById('slider-width'),
  sliderSize: document.getElementById('slider-size'),
  sliderSpeed: document.getElementById('slider-speed'),
  sliderBright: document.getElementById('slider-bright'),
  sliderOffsetX: document.getElementById('slider-offset-x'),
  sliderOffsetY: document.getElementById('slider-offset-y'),
  sliderRule: document.getElementById('slider-rule'),
  sliderReg: document.getElementById('slider-reg'),
  widthValue: document.getElementById('value-width'),
  sizeValue: document.getElementById('value-size'),
  speedValue: document.getElementById('value-speed'),
  brightValue: document.getElementById('value-bright'),
  offsetXValue: document.getElementById('value-offset-x'),
  offsetYValue: document.getElementById('value-offset-y'),
  ruleValue: document.getElementById('value-rule'),
  regValue: document.getElementById('value-reg'),
  midiStatus: document.getElementById('midi-status'),
  readout: document.getElementById('readout'),
  live: document.getElementById('live'),
};

function setMidiStatus(text, count) {
  let msg = text;
  if (typeof count === 'number' && text === 'connected') {
    msg = 'connected (' + count + ' input' + (count === 1 ? '' : 's') + ')';
  }
  ui.midiStatus.textContent = 'MIDI: ' + msg;
}

function updateLiveReadout() {
  ui.live.textContent =
    'CC 7 (width): ' + state.cc[CC.WIDTH] + ' → ' + ccWidthCells(state.cc[CC.WIDTH]) + ' cells' +
    ' · CC 14 (size): ' + state.cc[CC.SIZE] + ' → ' + ccSizePercent(state.cc[CC.SIZE]).toFixed(0) + '% of screen' +
    ' · CC 10 (speed): ' + state.cc[CC.SPEED] + ' → ' + ccSpeedMultiplier(state.cc[CC.SPEED]).toFixed(2) + 'x' +
    ' · CC 11 (bright): ' + state.cc[CC.BRIGHTNESS] + ' → ' + ccBrightness(state.cc[CC.BRIGHTNESS]).toFixed(2) + 'x' +
    ' · CC 15 (left): ' + state.cc[CC.OFFSET_LEFT] + ' → ' + ccOffsetCells(state.cc[CC.OFFSET_LEFT], ccWidthCells(state.cc[CC.WIDTH])) + ' cells' +
    ' · CC 16 (down): ' + state.cc[CC.OFFSET_DOWN] + ' → ' + ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT) + ' cells' +
    ' · CC 17 (rule): ' + state.cc[CC.RULE_LOW] + ' → ' + formulaMapped(state.cc[CC.RULE_LOW], ruleRegister(state.cc[CC.RULE_REG])) +
    ' · CC 18 (reg): ' + state.cc[CC.RULE_REG] + ' (' + registerName(ruleRegister(state.cc[CC.RULE_REG])) + ')';
}

function setReadout(text) {
  ui.readout.textContent = text || '–';
  window.clearTimeout(setReadout.timeout);
  setReadout.timeout = window.setTimeout(() => { ui.readout.textContent = '–'; }, 1200);
}

function syncControlsFromState() {
  ui.blend.value = state.blendMode;
  ui.blendValue.textContent = state.blendMode;
  ui.sliderWidth.value = state.cc[CC.WIDTH];
  ui.sliderSpeed.value = state.cc[CC.SPEED];
  ui.sliderBright.value = state.cc[CC.BRIGHTNESS];
  ui.sliderSize.value = state.cc[CC.SIZE];
  ui.sliderOffsetX.value = state.cc[CC.OFFSET_LEFT];
  ui.sliderOffsetY.value = state.cc[CC.OFFSET_DOWN];
  ui.sliderRule.value = state.cc[CC.RULE_LOW];
  ui.sliderReg.value = state.cc[CC.RULE_REG];
  ui.widthValue.textContent = state.cc[CC.WIDTH] + ' (' + ccWidthCells(state.cc[CC.WIDTH]) + ' cells)';
  ui.sizeValue.textContent = state.cc[CC.SIZE] + ' (' + ccSizePercent(state.cc[CC.SIZE]).toFixed(0) + '%)';
  ui.speedValue.textContent = state.cc[CC.SPEED] + ' (' + ccSpeedMultiplier(state.cc[CC.SPEED]).toFixed(2) + 'x)';
  ui.brightValue.textContent = state.cc[CC.BRIGHTNESS] + ' (' + ccBrightness(state.cc[CC.BRIGHTNESS]).toFixed(2) + 'x)';
  ui.offsetXValue.textContent = state.cc[CC.OFFSET_LEFT] + ' (' + ccOffsetCells(state.cc[CC.OFFSET_LEFT], ccWidthCells(state.cc[CC.WIDTH])) + ' cells)';
  ui.offsetYValue.textContent = state.cc[CC.OFFSET_DOWN] + ' (' + ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT) + ' cells)';
  const reg = ruleRegister(state.cc[CC.RULE_REG]);
  ui.ruleValue.textContent = state.cc[CC.RULE_LOW] + ' (' + formulaMapped(state.cc[CC.RULE_LOW], reg) + ')';
  ui.regValue.textContent = reg + ' (' + registerName(reg) + ')';
  updateLiveReadout();
}

function formulaMapped(low, reg) {
  return reg === RULE_REG.RANDOM ? 'random' : 'rule ' + selectRule(low, reg);
}

function wireSlider(slider, valueBox, ccEdit, formatter, opts = {}) {
  slider.addEventListener('input', () => {
    const max = opts.max ?? 127;
    const v = clamp(parseInt(slider.value, 10) || 0, 0, max);
    state.cc[ccEdit] = v;
    if (opts.markDirty && opts.markDirty()) state.dirtyTextures = true;
    valueBox.textContent = v + ' (' + formatter(v) + ')';
    updateLiveReadout();
  });
}

const ruleMarkDirty = () => ruleRegister(state.cc[CC.RULE_REG]) !== RULE_REG.RANDOM;

wireSlider(ui.sliderWidth, ui.widthValue, CC.WIDTH, v => ccWidthCells(v) + ' cells', { markDirty: () => true });
wireSlider(ui.sliderSize, ui.sizeValue, CC.SIZE, v => ccSizePercent(v).toFixed(0) + '% of screen');
wireSlider(ui.sliderSpeed, ui.speedValue, CC.SPEED, v => ccSpeedMultiplier(v).toFixed(2) + 'x');
wireSlider(ui.sliderBright, ui.brightValue, CC.BRIGHTNESS, v => ccBrightness(v).toFixed(2) + 'x');
wireSlider(ui.sliderOffsetX, ui.offsetXValue, CC.OFFSET_LEFT,
  v => ccOffsetCells(v, ccWidthCells(state.cc[CC.WIDTH])) + ' cells', { markDirty: () => true });
wireSlider(ui.sliderOffsetY, ui.offsetYValue, CC.OFFSET_DOWN,
  v => ccOffsetCells(v, TEXTURE_HEIGHT) + ' cells', { markDirty: () => true });
wireSlider(ui.sliderRule, ui.ruleValue, CC.RULE_LOW,
  v => formulaMapped(v, ruleRegister(state.cc[CC.RULE_REG])), { markDirty: ruleMarkDirty });
wireSlider(ui.sliderReg, ui.regValue, CC.RULE_REG,
  v => registerName(ruleRegister(v)), { max: 4, markDirty: ruleMarkDirty });

ui.btnNote.addEventListener('click', () => {
  const sq = spawnNote(pickRandomNote(), 90 + Math.floor(Math.random() * 38));
  if (sq) setTimeout(() => decaySquare(sq), 800);
});
if (ui.btnKick) ui.btnKick.addEventListener('click', () => applyKick());
if (ui.btnHats) ui.btnHats.addEventListener('click', () => spawnCopies());
ui.btnClear.addEventListener('click', () => { clearSquares(); setReadout('cleared'); });
ui.btnMidi.addEventListener('click', () => { connectMidi(); setReadout('connecting…'); });
ui.autoplay.addEventListener('change', () => { state.autoplay = ui.autoplay.checked; });
ui.blend.addEventListener('change', () => {
  state.blendMode = ui.blend.value;
  ui.blendValue.textContent = state.blendMode;
  applyBlending(state.blendMode);
  setReadout('blend: ' + state.blendMode);
});

ui.toggle.addEventListener('click', () => {
  const hidden = ui.panel.classList.toggle('hidden');
  ui.toggle.textContent = hidden ? '◀ Show controls' : 'Hide controls';
});

window.addEventListener('resize', onResize);
function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.left = -width / 2; camera.right = width / 2;
  camera.top = height / 2; camera.bottom = -height / 2;
  camera.updateProjectionMatrix();
}

/* ---------- boot ---------- */
window.__viz = {
  getState: () => state,
  applyKick,
  spawnCopies,
  spawnNote,
  clearSquares,
  saveEffectsConfig,
  _debug: () => ({
    renderer, scene, camera,
    info: renderer.info,
    squares: state.squares.map(s => ({
      visible: s.mesh.visible, scale: [s.mesh.scale.x, s.mesh.scale.y], pos: [s.mesh.position.x, s.mesh.position.y],
      fade: s.material.uniforms.uFade.value, intensity: s.material.uniforms.uIntensity.value,
      color: s.material.uniforms.uColor.value.toArray(),
      texImg: s.texture.image, texImageWidth: s.texture.image ? s.texture.image.width : null,
    })),
    copies: state.copies.length,
  }),
  renderNow: () => { renderer.render(scene, camera); },
};

window.addEventListener('load', async () => {
  syncControlsFromState();
  requestAnimationFrame(animate);
  connectMidi();
});
