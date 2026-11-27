import {
  CC, CC_DEFAULTS, WIDTH_RANGE, RULE_REG,
  makePatternData, ccWidthCells, ccSpeedMultiplier, ccBrightness, ccSizePercent,
  ccOffsetCells, registerName, randomRule, selectRule, ruleRegister,
  pitchToHue, clamp, randomSquare, scaleSize, heldFadeIn, decayAlpha,
  CH2_CC, CH2_CC_DEFAULTS,
  ccKickShake, ccKickScale, ccKickBlur, ccKickRotation, ccKickFormula,
  ccKickColor, ccKickDecay, advanceRule,
  CH3_CC, CH3_CC_DEFAULTS, CH3_DIRECTION_NAMES,
  ccHatsDecay, ccHatsCopies, ccHatsScaleFactor, ccHatsDirection,
  CH4_CC, CH4_CC_DEFAULTS, CH4_MODE_NAMES, CH4_ANGLE_SOURCE_NAMES,
  ccChannel4Mode, ccChannel4AngleSource, ccChannel4Angle, ccChannel4Size,
  ccChannel4Color, ccChannel4Formula,
  CH5_CC, CH5_CC_DEFAULTS, CH5_FONTS, CH5_WORDS_FALLBACK,
  ccWordDrift, ccNoisyAmplitude, ccNoisySpeed, ccScatterSpeed, ccScatterSize,
  ccSizeSpread, ccSizeBase, normalizeWordList,
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
  ch3: { enabled: true, cc: { ...CH3_CC_DEFAULTS } },
  ch4: {
    enabled: true,
    effects: { direction: true, size: false, color: false, formula: true },
    cc: { ...CH4_CC_DEFAULTS },
  },
  ch5: {
    enabled: true,
    effects: { noisy: true, fallApart: false, letterSizes: true },
    cc: { ...CH5_CC_DEFAULTS },
    font: 'system',
    words: [...CH5_WORDS_FALLBACK],
    nextIndex: 0,
    listSource: 'default',
    listName: 'embedded default',
  },
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
    dirX: cfg.horizontal ? cfg.sign : 0,
    dirY: cfg.horizontal ? 0 : cfg.sign,
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

/* ---------- words layer (channel 5) ---------- */

const wordsLayer = document.getElementById('words-layer');
const activeWords = [];
let ch5WordSeq = 0;
const fontsLoaded = new Set();
const CH5_FADE_SECONDS = 2.8;
const CH5_FADE_START = 0.55;
const CH5_MAX_WORDS = 14;

function ensureFontLoaded(fontId) {
  const font = CH5_FONTS.find(f => f.id === fontId);
  if (!font || !font.css || fontsLoaded.has(font.id)) return;
  fontsLoaded.add(font.id);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=' + font.css + '&display=swap';
  document.head.appendChild(link);
  if (document.fonts && document.fonts.load) {
    document.fonts.load((font.weight || 700) + ' 32px "' + font.label + '"').catch(() => {});
  }
}

function currentCh5Font() {
  return CH5_FONTS.find(f => f.id === state.ch5.font) || CH5_FONTS[0];
}

function spawnWord() {
  if (!state.ch5.enabled) { setReadout('ch5 disabled'); return null; }
  const words = state.ch5.words;
  if (!words || words.length === 0) { setReadout('ch5 — no words in list'); return null; }

  const ch5 = state.ch5;
  const text = words[ch5.nextIndex % words.length];
  ch5.nextIndex = (ch5.nextIndex + 1) % words.length;

  const hue = Math.random() * 360;
  const angle = Math.random() * Math.PI * 2;
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);
  const speed = ccWordDrift(ch5.cc[CH5_CC.DRIFT]);
  const basePx = ccSizeBase(ch5.cc[CH5_CC.SIZE_BASE]);
  const spread = ccSizeSpread(ch5.cc[CH5_CC.SIZE_SPREAD]);
  const noisy = ch5.effects.noisy;
  const fallApart = ch5.effects.fallApart;
  const letterSizes = ch5.effects.letterSizes;
  const noisyAmp = ccNoisyAmplitude(ch5.cc[CH5_CC.NOISE_AMP]);
  const noisySpeed = ccNoisySpeed(ch5.cc[CH5_CC.NOISE_SPEED]);
  const scatterSpeed = ccScatterSpeed(ch5.cc[CH5_CC.SCATTER_SPEED]);
  const scatterSize = ccScatterSize(ch5.cc[CH5_CC.SCATTER_SIZE]);

  const font = currentCh5Font();
  ensureFontLoaded(font.id);

  const x = (Math.random() * 0.6 - 0.3) * width;
  const y = (Math.random() * 0.6 - 0.3) * height;

  const wrap = document.createElement('div');
  wrap.className = 'word-token';
  wrap.style.position = 'absolute';
  wrap.style.left = (width / 2 + x) + 'px';
  wrap.style.top = (height / 2 + y) + 'px';
  wrap.style.fontFamily = font.stack;
  wrap.style.fontSize = basePx + 'px';
  wrap.style.color = 'hsl(' + hue + ' 85% 68%)';
  wrap.style.textShadow = '0 0 22px hsl(' + hue + ' 90% 60% / 0.55)';
  wrap.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'rad)';

  const letters = [];
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const span = document.createElement('span');
    span.className = 'word-letter';
    span.textContent = chars[i];
    const v = Math.random();
    const sizeFactor = letterSizes ? (1 + (v - 0.5) * 2 * spread) : 1;
    let scatter = null;
    if (fallApart) {
      const sAng = Math.random() * Math.PI * 2;
      const randFactor = 0.5 + Math.random() * 0.9;
      scatter = { dx: Math.cos(sAng) * randFactor, dy: Math.sin(sAng) * randFactor, scale: scatterSize };
    }
    let noise = null;
    if (noisy) {
      noise = { amp: noisyAmp, speed: noisySpeed * (0.6 + Math.random() * 0.8), phase: Math.random() * Math.PI * 2 };
    }
    span.style.transform = 'scale(' + sizeFactor.toFixed(3) + ')';
    wrap.appendChild(span);
    letters.push({ el: span, sizeFactor, scatter, noise, phase: noise ? noise.phase : 0 });
  }

  wordsLayer.appendChild(wrap);

  while (activeWords.length >= CH5_MAX_WORDS) {
    const oldest = activeWords.shift();
    if (oldest && oldest.element && oldest.element.parentNode) oldest.element.parentNode.removeChild(oldest.element);
  }

  const word = {
    id: ++ch5WordSeq,
    text,
    hue,
    x,
    y,
    dirX,
    dirY,
    speed,
    angle,
    age: 0,
    fadeDuration: CH5_FADE_SECONDS,
    letters,
    element: wrap,
  };
  activeWords.push(word);

  setReadout('ch5: "' + text + '"');
  return word;
}

function updateWords(dt) {
  for (let i = activeWords.length - 1; i >= 0; i--) {
    const w = activeWords[i];
    w.age += dt;
    if (w.age >= w.fadeDuration) {
      if (w.element && w.element.parentNode) w.element.parentNode.removeChild(w.element);
      activeWords.splice(i, 1);
      continue;
    }
    const t = w.age;
    w.x += w.dirX * w.speed * dt;
    w.y += w.dirY * w.speed * dt;

    const fadeStart = w.fadeDuration * CH5_FADE_START;
    const opacity = t < fadeStart ? 1 : Math.max(0, 1 - (t - fadeStart) / (w.fadeDuration - fadeStart));
    w.element.style.left = (width / 2 + w.x) + 'px';
    w.element.style.top = (height / 2 + w.y) + 'px';
    w.element.style.opacity = opacity.toFixed(3);

    for (const l of w.letters) {
      let tx = 0, ty = 0, grow = 1;
      if (l.scatter) {
        tx = l.scatter.dx * t * ccScatterSpeed(state.ch5.cc[CH5_CC.SCATTER_SPEED]);
        ty = l.scatter.dy * t * ccScatterSpeed(state.ch5.cc[CH5_CC.SCATTER_SPEED]);
        grow = 1 + (l.scatter.scale - 1) * Math.min(1, t / 1.2);
      }
      if (l.noise) {
        ty = ty + Math.sin(t * l.noise.speed + l.phase) * l.noise.amp;
      }
      l.el.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + (l.sizeFactor * grow).toFixed(3) + ')';
    }
  }
}

function clearWords() {
  for (const w of activeWords) {
    if (w.element && w.element.parentNode) w.element.parentNode.removeChild(w.element);
  }
  activeWords.length = 0;
}

function ch5WordListSummary() {
  const w = state.ch5.words;
  return w.length + ' words · ' + state.ch5.listName;
}

async function loadCh5WordList() {
  // If the user uploaded a list earlier, it wins — don't refetch the default.
  if (state.ch5.listSource === 'uploaded') return;
  if (location.protocol === 'file:') return; // cannot fetch over file:// — keep embedded default
  try {
    const res = await fetch('words.json', { cache: 'no-cache' });
    if (!res.ok) return; // file:// or offline — keep embedded default
    const data = await res.json();
    const norm = normalizeWordList(data);
    if (norm.length === 0) return;
    state.ch5.words = norm;
    state.ch5.listSource = 'json';
    state.ch5.listName = 'words.json';
    syncControlsFromState();
  } catch (e) { /* offline — embedded default stays */ }
}

function handleCh5WordFile(file) {
  if (!file) return Promise.resolve();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const norm = normalizeWordList(data);
        if (norm.length === 0) {
          setReadout('ch5 — invalid word list');
          resolve();
          return;
        }
        state.ch5.words = norm;
        state.ch5.listSource = 'uploaded';
        state.ch5.listName = file.name;
        state.ch5.nextIndex = 0;
        saveEffectsConfig();
        syncControlsFromState();
        setReadout('ch5 — loaded ' + norm.length + ' words from ' + file.name);
      } catch (e) {
        setReadout('ch5 — could not parse ' + file.name);
      }
      resolve();
    };
    reader.onerror = () => { setReadout('ch5 — could not read ' + file.name); resolve(); };
    reader.readAsText(file);
  });
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

    // drift + tile: a square exiting one side re-enters from the opposite side.
    // Movement follows the square's current unit direction (dirX, dirY).
    const half = sz / 2;
    const v = s.baseVelocity * speed;
    s.logicalX += s.dirX * v * dt;
    s.logicalY += s.dirY * v * dt;
    if (s.dirX > 1e-4 && s.logicalX - half > width / 2) s.logicalX = -width / 2 - half;
    else if (s.dirX < -1e-4 && s.logicalX + half < -width / 2) s.logicalX = width / 2 + half;
    if (s.dirY > 1e-4 && s.logicalY - half > height / 2) s.logicalY = -height / 2 - half;
    else if (s.dirY < -1e-4 && s.logicalY + half < -height / 2) s.logicalY = height / 2 + half;

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

  updateWords(dt);

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
    } else if (cmd === 0xB0) {
      const val = clamp(d2, 0, 127);
      if (d1 in state.ch3.cc) {
        state.ch3.cc[d1] = val;
        syncControlsFromState();
        saveEffectsConfig();
        setReadout('ch3 CC ' + d1 + ' = ' + val);
      }
    }
    return;
  }
  if (channel === 3) { // channel 4: square transform
    if (cmd === 0x90 && d2 > 0) {
      applyChannel4Effect();
    } else if (cmd === 0xB0) {
      const val = clamp(d2, 0, 127);
      if (d1 in state.ch4.cc) {
        state.ch4.cc[d1] = val;
        syncControlsFromState();
        saveEffectsConfig();
        setReadout('ch4 CC ' + d1 + ' = ' + val);
      }
    }
    return;
  }
  if (channel === 4) { // channel 5: words
    if (cmd === 0x90 && d2 > 0) {
      spawnWord();
    } else if (cmd === 0xB0) {
      const val = clamp(d2, 0, 127);
      if (d1 in state.ch5.cc) {
        state.ch5.cc[d1] = val;
        syncControlsFromState();
        saveEffectsConfig();
        setReadout('ch5 CC ' + d1 + ' = ' + val);
      }
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

/* ---------- channel 4 (motion): square transform effect ---------- */
function setSquareDirection(s, dirX, dirY) {
  const mag = Math.hypot(dirX, dirY);
  if (mag < 1e-6) return;
  s.dirX = dirX / mag;
  s.dirY = dirY / mag;
  s.horizontal = Math.abs(s.dirX) >= Math.abs(s.dirY);
  s.sign = s.horizontal ? (s.dirX > 0 ? 1 : -1) : (s.dirY > 0 ? 1 : -1);
  s.axis = s.horizontal ? 'x' : 'y';
  s.baseRotationZ = Math.atan2(s.dirY, s.dirX);
}

function rotate90Clockwise(s) {
  // screen-space rotation by +90deg (right -> down, down -> left, left -> up, up -> right)
  setSquareDirection(s, s.dirY, -s.dirX);
}

function applyChannel4Effect() {
  if (!state.ch4.enabled) return;
  const eff = state.ch4.effects;
  const active = ['direction', 'size', 'color', 'formula'].filter(k => eff[k]);
  if (active.length === 0) { setReadout('ch4 — no effects selected'); return; }
  let applied = 0;
  const w = ccWidthCells(state.cc[CC.WIDTH]);
  const offX = ccOffsetCells(state.cc[CC.OFFSET_LEFT], w);
  const offY = ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT);
  const reg = ruleRegister(state.cc[CC.RULE_REG]);

  for (const s of state.squares) {
    if (s.mesh.visible === false) continue;
    if (eff.direction) {
      const mode = ccChannel4Mode(state.ch4.cc[CH4_CC.MODE]);
      const src = ccChannel4AngleSource(state.ch4.cc[CH4_CC.ANGLE_SOURCE]);
      if (mode === 'same') {
        const deg = src === 'fixed' ? ccChannel4Angle(state.ch4.cc[CH4_CC.ANGLE]) : Math.random() * 360;
        const rad = deg * Math.PI / 180;
        setSquareDirection(s, Math.cos(rad), Math.sin(rad));
      } else if (mode === 'different') {
        const rad = Math.random() * Math.PI * 2;
        setSquareDirection(s, Math.cos(rad), Math.sin(rad));
      } else {
        rotate90Clockwise(s);
      }
    }
    if (eff.size) {
      s.sizeFactor = Math.min(4, Math.max(0.5, s.sizeFactor * ccChannel4Size(state.ch4.cc[CH4_CC.SIZE])));
    }
    if (eff.color) {
      const hueShift = ccChannel4Color(state.ch4.cc[CH4_CC.COLOR]);
      if (hueShift > 0) {
        s.hue = (s.hue + hueShift) % 1;
        s.material.uniforms.uColor.value = new THREE.Color().setHSL(s.hue, 0.85, 0.62);
      }
    }
    if (eff.formula) {
      const steps = ccChannel4Formula(state.ch4.cc[CH4_CC.FORMULA]);
      if (steps > 0) {
        s.rule = advanceRule(s.rule, reg, steps);
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
    applied++;
  }
  saveEffectsConfig();
  setReadout('ch4 — ' + active.join('+') + ' on ' + applied + ' square' + (applied === 1 ? '' : 's'));
}

/* ---------- channel 3 (hats): square copies ---------- */
function spawnCopies() {
  if (!state.ch3.enabled) return;
  const master = state.squares[state.squares.length - 1];
  if (!master) { setReadout('hats — no visible square'); return; }
  const now = performance.now();
  const count = ccHatsCopies(state.ch3.cc[CH3_CC.COPIES]);
  const decay = ccHatsDecay(state.ch3.cc[CH3_CC.DECAY]);
  const scaleFactor = ccHatsScaleFactor(state.ch3.cc[CH3_CC.SCALE]);
  const direction = ccHatsDirection(state.ch3.cc[CH3_CC.DIRECTION]);
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
      dirX = master.dirX; dirY = master.dirY;
    } else if (direction === 'inverse') {
      dirX = -master.dirX; dirY = -master.dirY;
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
    if (cfg.ch3.cc && typeof cfg.ch3.cc === 'object') {
      for (const key of Object.keys(cfg.ch3.cc)) {
        const n = parseInt(key, 10);
        if (Object.prototype.hasOwnProperty.call(state.ch3.cc, n)) {
          const v = clamp(Math.round(Number(cfg.ch3.cc[key]) || 0), 0, 127);
          state.ch3.cc[n] = v;
        }
      }
    } else {
      // legacy raw-value shape — inverse-map onto CC values
      if (typeof cfg.ch3.decay === 'number') state.ch3.cc[CH3_CC.DECAY] = clamp(Math.round((cfg.ch3.decay - 0.05) / 0.55 * 127), 0, 127);
      if (typeof cfg.ch3.copies === 'number') state.ch3.cc[CH3_CC.COPIES] = clamp(Math.round((clamp(cfg.ch3.copies, 1, 12) - 1) / 11 * 127), 0, 127);
      if (typeof cfg.ch3.scaleFactor === 'number') state.ch3.cc[CH3_CC.SCALE] = clamp(Math.round((clamp(cfg.ch3.scaleFactor, 0.5, 0.99) - 0.5) / 0.49 * 127), 0, 127);
      if (typeof cfg.ch3.direction === 'string') {
        const i = CH3_DIRECTION_NAMES.indexOf(cfg.ch3.direction);
        if (i >= 0) state.ch3.cc[CH3_CC.DIRECTION] = clamp(Math.round(i / (CH3_DIRECTION_NAMES.length - 1) * 127), 0, 127);
      }
    }
  }
  if (cfg.ch4 && typeof cfg.ch4 === 'object') {
    if (typeof cfg.ch4.enabled === 'boolean') state.ch4.enabled = cfg.ch4.enabled;
    if (cfg.ch4.effects && typeof cfg.ch4.effects === 'object') {
      for (const k of ['direction', 'size', 'color', 'formula']) {
        if (typeof cfg.ch4.effects[k] === 'boolean') state.ch4.effects[k] = cfg.ch4.effects[k];
      }
    }
    if (cfg.ch4.cc && typeof cfg.ch4.cc === 'object') {
      for (const key of Object.keys(cfg.ch4.cc)) {
        const n = parseInt(key, 10);
        if (Object.prototype.hasOwnProperty.call(state.ch4.cc, n)) {
          const v = clamp(Math.round(Number(cfg.ch4.cc[key]) || 0), 0, 127);
          state.ch4.cc[n] = v;
        }
      }
    }
  }
  if (cfg.ch5 && typeof cfg.ch5 === 'object') {
    if (typeof cfg.ch5.enabled === 'boolean') state.ch5.enabled = cfg.ch5.enabled;
    if (cfg.ch5.effects && typeof cfg.ch5.effects === 'object') {
      for (const k of ['noisy', 'fallApart', 'letterSizes']) {
        if (typeof cfg.ch5.effects[k] === 'boolean') state.ch5.effects[k] = cfg.ch5.effects[k];
      }
    }
    if (cfg.ch5.cc && typeof cfg.ch5.cc === 'object') {
      for (const key of Object.keys(cfg.ch5.cc)) {
        const n = parseInt(key, 10);
        if (Object.prototype.hasOwnProperty.call(state.ch5.cc, n)) {
          const v = clamp(Math.round(Number(cfg.ch5.cc[key]) || 0), 0, 127);
          state.ch5.cc[n] = v;
        }
      }
    }
    if (typeof cfg.ch5.font === 'string' && CH5_FONTS.some(f => f.id === cfg.ch5.font)) {
      state.ch5.font = cfg.ch5.font;
    }
    if (Array.isArray(cfg.ch5.words)) {
      const norm = normalizeWordList(cfg.ch5.words);
      if (norm.length > 0) {
        state.ch5.words = norm;
        if (typeof cfg.ch5.listSource === 'string') state.ch5.listSource = cfg.ch5.listSource;
        if (typeof cfg.ch5.listName === 'string') state.ch5.listName = cfg.ch5.listName;
      }
    }
  }
}

function saveEffectsConfig() {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      ch2: { enabled: state.ch2.enabled, cc: state.ch2.cc },
      ch3: { enabled: state.ch3.enabled, cc: state.ch3.cc },
      ch4: { enabled: state.ch4.enabled, effects: state.ch4.effects, cc: state.ch4.cc },
      ch5: {
        enabled: state.ch5.enabled,
        effects: { ...state.ch5.effects },
        cc: { ...state.ch5.cc },
        font: state.ch5.font,
        words: [...state.ch5.words],
        listSource: state.ch5.listSource,
        listName: state.ch5.listName,
      },
    }));
  } catch (e) { /* ignore */ }
}

loadEffectsConfig();

/* ---------- UI ---------- */
const ui = {
  panel: document.getElementById('panel'),
  toggle: document.getElementById('toggle'),
  btnMidi: document.getElementById('btn-midi'),
  btnNote: document.getElementById('btn-note'),
  btnKick: document.getElementById('btn-kick'),
  btnHats: document.getElementById('btn-hats'),
  btnKickReset: document.getElementById('btn-ch2-reset'),
  btnHatsReset: document.getElementById('btn-ch3-reset'),
  ch2Enabled: document.getElementById('ch2-enabled'),
  ch3Enabled: document.getElementById('ch3-enabled'),
  ch3Direction: document.getElementById('ch3-direction'),
  ch3DirectionValue: document.getElementById('val-ch3-4'),
  ch4Enabled: document.getElementById('ch4-enabled'),
  ch4Mode: document.getElementById('ch4-mode'),
  ch4AngleSource: document.getElementById('ch4-angle-source'),
  ch4Size: document.getElementById('ch4-size'),
  ch4Color: document.getElementById('ch4-color'),
  ch4Formula: document.getElementById('ch4-formula'),
  ch4Angle: document.getElementById('ch4-angle'),
  ch4SizeValue: document.getElementById('val-ch4-size'),
  ch4ColorValue: document.getElementById('val-ch4-color'),
  ch4FormulaValue: document.getElementById('val-ch4-formula'),
  ch4AngleValue: document.getElementById('val-ch4-angle'),
  ch4ModeValue: document.getElementById('val-ch4-mode'),
  ch4AngleSourceValue: document.getElementById('val-ch4-angle-source'),
  ch4Effects: {
    direction: document.getElementById('ch4-fx-direction'),
    size: document.getElementById('ch4-fx-size'),
    color: document.getElementById('ch4-fx-color'),
    formula: document.getElementById('ch4-fx-formula'),
  },
  ch4ModeRow: document.getElementById('row-ch4-mode'),
  ch4AngleRow: document.getElementById('row-ch4-angle'),
  ch4AngleSourceRow: document.getElementById('row-ch4-angle-source'),
  ch4SizeRow: document.getElementById('row-ch4-size'),
  ch4ColorRow: document.getElementById('row-ch4-color'),
  ch4FormulaRow: document.getElementById('row-ch4-formula'),
  btnCh4Reset: document.getElementById('btn-ch4-reset'),
  btnCh4Test: document.getElementById('btn-ch4-test'),
  ch5Enabled: document.getElementById('ch5-enabled'),
  ch5Effects: {
    noisy: document.getElementById('ch5-fx-noisy'),
    fallApart: document.getElementById('ch5-fx-fallApart'),
    letterSizes: document.getElementById('ch5-fx-letterSizes'),
  },
  ch5Drift: document.getElementById('ch5-1'),
  ch5DriftValue: document.getElementById('val-ch5-1'),
  ch5NoisyAmpRow: document.getElementById('row-ch5-noisy-amp'),
  ch5NoisyAmp: document.getElementById('ch5-2'),
  ch5NoisyAmpValue: document.getElementById('val-ch5-2'),
  ch5NoisySpeedRow: document.getElementById('row-ch5-noisy-speed'),
  ch5NoisySpeed: document.getElementById('ch5-3'),
  ch5NoisySpeedValue: document.getElementById('val-ch5-3'),
  ch5ScatterSpeedRow: document.getElementById('row-ch5-scatter-speed'),
  ch5ScatterSpeed: document.getElementById('ch5-4'),
  ch5ScatterSpeedValue: document.getElementById('val-ch5-4'),
  ch5ScatterSizeRow: document.getElementById('row-ch5-scatter-size'),
  ch5ScatterSize: document.getElementById('ch5-5'),
  ch5ScatterSizeValue: document.getElementById('val-ch5-5'),
  ch5SizeSpreadRow: document.getElementById('row-ch5-size-spread'),
  ch5SizeSpread: document.getElementById('ch5-6'),
  ch5SizeSpreadValue: document.getElementById('val-ch5-6'),
  ch5SizeBaseRow: document.getElementById('row-ch5-size-base'),
  ch5SizeBase: document.getElementById('ch5-7'),
  ch5SizeBaseValue: document.getElementById('val-ch5-7'),
  ch5Font: document.getElementById('ch5-font'),
  ch5FontValue: document.getElementById('val-ch5-font'),
  ch5ListStatus: document.getElementById('val-ch5-list'),
  btnCh5WordsFile: document.getElementById('btn-ch5-words-file'),
  ch5WordsFile: document.getElementById('ch5-words-file'),
  btnCh5WordsRestore: document.getElementById('btn-ch5-words-restore'),
  btnCh5Test: document.getElementById('btn-ch5-test'),
  btnCh5Reset: document.getElementById('btn-ch5-reset'),
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
  syncChEffects();
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

let hideTimer = null;

function setFloatHidden(hidden) {
  ui.live.classList.toggle('float-hidden', hidden);
  ui.toggle.classList.toggle('float-hidden', hidden);
}

function armHideTimer() {
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => {
    if (ui.panel.classList.contains('hidden')) setFloatHidden(true);
  }, 2500);
}

function cancelHideTimer() {
  window.clearTimeout(hideTimer);
  hideTimer = null;
  setFloatHidden(false);
}

function updateToggleText() {
  const hidden = ui.panel.classList.contains('hidden');
  ui.toggle.textContent = hidden ? '◀ Show controls' : 'Hide controls';
}

ui.toggle.addEventListener('click', () => {
  const hidden = ui.panel.classList.toggle('hidden');
  updateToggleText();
  if (hidden) {
    setFloatHidden(true);
  } else {
    cancelHideTimer();
  }
});

document.addEventListener('mousemove', () => {
  if (!ui.panel.classList.contains('hidden')) return;
  if (ui.toggle.matches(':hover') || ui.live.matches(':hover')) {
    cancelHideTimer();
    return;
  }
  setFloatHidden(false);
  armHideTimer();
});

ui.toggle.addEventListener('mouseenter', () => { window.clearTimeout(hideTimer); setFloatHidden(false); });
ui.toggle.addEventListener('mouseleave', () => { if (ui.panel.classList.contains('hidden')) armHideTimer(); });
ui.live.addEventListener('mouseenter', () => { window.clearTimeout(hideTimer); setFloatHidden(false); });
ui.live.addEventListener('mouseleave', () => { if (ui.panel.classList.contains('hidden')) armHideTimer(); });


/* ---------- tabbed settings: ch1 / ch2 / ch3 / ch4 ---------- */
const CH2_ROWS = [
  { id: 1, fmt: v => ccKickShake(v).toFixed(2) + ' \u00d7 side' },
  { id: 2, fmt: v => ccKickShake(v).toFixed(2) + ' \u00d7 side' },
  { id: 3, fmt: v => '\u00d7 ' + ccKickScale(v).toFixed(2) },
  { id: 4, fmt: v => ccKickBlur(v).toFixed(1) + ' texels' },
  { id: 5, fmt: v => ccKickRotation(v).toFixed(2) + ' rad' },
  { id: 6, fmt: v => { const s = ccKickFormula(v); return s + ' step' + (s === 1 ? '' : 's'); } },
  { id: 7, fmt: v => ccKickColor(v).toFixed(2) + ' hue' },
  { id: 8, fmt: v => ccKickDecay(v).toFixed(2) + ' s' },
];

const CH3_ROWS = [
  { id: CH3_CC.DECAY, fmt: v => ccHatsDecay(v).toFixed(2) + ' s' },
  { id: CH3_CC.COPIES, fmt: v => String(ccHatsCopies(v)) },
  { id: CH3_CC.SCALE, fmt: v => '\u00d7 ' + ccHatsScaleFactor(v).toFixed(2) },
];

const CH5_ROWS = [
  { id: CH5_CC.DRIFT, fmt: v => ccWordDrift(v).toFixed(0) + ' px/s', input: 'ch5Drift', label: 'ch5DriftValue', row: null },
  { id: CH5_CC.NOISE_AMP, fmt: v => ccNoisyAmplitude(v).toFixed(1) + ' px', input: 'ch5NoisyAmp', label: 'ch5NoisyAmpValue', row: 'ch5NoisyAmpRow' },
  { id: CH5_CC.NOISE_SPEED, fmt: v => ccNoisySpeed(v).toFixed(2) + ' rad/s', input: 'ch5NoisySpeed', label: 'ch5NoisySpeedValue', row: 'ch5NoisySpeedRow' },
  { id: CH5_CC.SCATTER_SPEED, fmt: v => ccScatterSpeed(v).toFixed(0) + ' px/s', input: 'ch5ScatterSpeed', label: 'ch5ScatterSpeedValue', row: 'ch5ScatterSpeedRow' },
  { id: CH5_CC.SCATTER_SIZE, fmt: v => '\u00d7 ' + ccScatterSize(v).toFixed(2), input: 'ch5ScatterSize', label: 'ch5ScatterSizeValue', row: 'ch5ScatterSizeRow' },
  { id: CH5_CC.SIZE_SPREAD, fmt: v => '+\u2212' + (ccSizeSpread(v) * 100).toFixed(0) + '%', input: 'ch5SizeSpread', label: 'ch5SizeSpreadValue', row: 'ch5SizeSpreadRow' },
  { id: CH5_CC.SIZE_BASE, fmt: v => ccSizeBase(v).toFixed(0) + ' px', input: 'ch5SizeBase', label: 'ch5SizeBaseValue', row: 'ch5SizeBaseRow' },
];

function syncChEffects() {
  ui.ch2Enabled.checked = state.ch2.enabled;
  for (const row of CH2_ROWS) {
    const input = document.getElementById('ch2-' + row.id);
    const label = document.getElementById('val-ch2-' + row.id);
    if (!input || !label) continue;
    const v = state.ch2.cc[row.id];
    input.value = v;
    label.textContent = row.fmt(v);
  }
  for (const r of document.querySelectorAll('#page-ch2 .row')) r.classList.toggle('disabled', !state.ch2.enabled);

  ui.ch3Enabled.checked = state.ch3.enabled;
  for (const row of CH3_ROWS) {
    const input = document.getElementById('ch3-' + row.id);
    const label = document.getElementById('val-ch3-' + row.id);
    if (!input || !label) continue;
    const v = state.ch3.cc[row.id];
    input.value = v;
    label.textContent = row.fmt(v);
  }
  const ch3Dir = ccHatsDirection(state.ch3.cc[CH3_CC.DIRECTION]);
  ui.ch3Direction.value = ch3Dir;
  if (ui.ch3DirectionValue) ui.ch3DirectionValue.textContent = ch3Dir;
  for (const r of document.querySelectorAll('#page-ch3 .row')) r.classList.toggle('disabled', !state.ch3.enabled);

  // channel 4
  ui.ch4Enabled.checked = state.ch4.enabled;
  for (const [key, checkbox] of Object.entries(ui.ch4Effects)) {
    checkbox.checked = state.ch4.effects[key];
  }
  const mode = ccChannel4Mode(state.ch4.cc[CH4_CC.MODE]);
  const angleSrc = ccChannel4AngleSource(state.ch4.cc[CH4_CC.ANGLE_SOURCE]);
  ui.ch4Mode.value = mode;
  ui.ch4AngleSource.value = angleSrc;
  ui.ch4Angle.value = state.ch4.cc[CH4_CC.ANGLE];
  ui.ch4AngleValue.textContent = Math.round(ccChannel4Angle(state.ch4.cc[CH4_CC.ANGLE])) + '\u00b0';
  ui.ch4Size.value = state.ch4.cc[CH4_CC.SIZE];
  ui.ch4SizeValue.textContent = '\u00d7 ' + ccChannel4Size(state.ch4.cc[CH4_CC.SIZE]).toFixed(2);
  ui.ch4Color.value = state.ch4.cc[CH4_CC.COLOR];
  ui.ch4ColorValue.textContent = ccChannel4Color(state.ch4.cc[CH4_CC.COLOR]).toFixed(2) + ' hue';
  ui.ch4Formula.value = state.ch4.cc[CH4_CC.FORMULA];
  ui.ch4FormulaValue.textContent = ccChannel4Formula(state.ch4.cc[CH4_CC.FORMULA]) + ' step' + (ccChannel4Formula(state.ch4.cc[CH4_CC.FORMULA]) === 1 ? '' : 's');
  ui.ch4ModeValue.textContent = mode;
  ui.ch4AngleSourceValue.textContent = angleSrc;
  const dirOn = state.ch4.effects.direction;
  ui.ch4ModeRow.hidden = !dirOn;
  ui.ch4AngleSourceRow.hidden = !(dirOn && mode === 'same');
  ui.ch4AngleRow.hidden = !(dirOn && mode === 'same' && angleSrc === 'fixed');
  ui.ch4SizeRow.hidden = !state.ch4.effects.size;
  ui.ch4ColorRow.hidden = !state.ch4.effects.color;
  ui.ch4FormulaRow.hidden = !state.ch4.effects.formula;
  for (const r of document.querySelectorAll('#page-ch4 .row')) r.classList.toggle('disabled', !state.ch4.enabled);

  // channel 5
  ui.ch5Enabled.checked = state.ch5.enabled;
  for (const [key, checkbox] of Object.entries(ui.ch5Effects)) {
    checkbox.checked = state.ch5.effects[key];
  }
  for (const row of CH5_ROWS) {
    const input = ui[row.input];
    const label = ui[row.label];
    if (!input || !label) continue;
    const v = state.ch5.cc[row.id];
    input.value = v;
    label.textContent = row.fmt(v);
  }
  ui.ch5NoisyAmpRow.hidden = !state.ch5.effects.noisy;
  ui.ch5NoisySpeedRow.hidden = !state.ch5.effects.noisy;
  ui.ch5ScatterSpeedRow.hidden = !state.ch5.effects.fallApart;
  ui.ch5ScatterSizeRow.hidden = !state.ch5.effects.fallApart;
  ui.ch5SizeSpreadRow.hidden = !state.ch5.effects.letterSizes;
  ui.ch5SizeBaseRow.hidden = !state.ch5.effects.letterSizes;
  const font = currentCh5Font();
  ui.ch5Font.value = font.id;
  ui.ch5FontValue.textContent = font.label;
  ui.ch5ListStatus.textContent = ch5WordListSummary();
  for (const r of document.querySelectorAll('#page-ch5 .row')) r.classList.toggle('disabled', !state.ch5.enabled);
}

function wireSettingsTabs() {
  const tabs = document.querySelectorAll('.tab');
  const pages = document.querySelectorAll('.panel-page');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      pages.forEach(p => { p.hidden = p.id !== 'page-' + tab.dataset.tab; });
    });
  });
}

function wireCh2Controls() {
  for (const row of CH2_ROWS) {
    const input = document.getElementById('ch2-' + row.id);
    const label = document.getElementById('val-ch2-' + row.id);
    if (!input || !label) continue;
    input.addEventListener('input', () => {
      const v = clamp(parseInt(input.value, 10) || 0, 0, 127);
      state.ch2.cc[row.id] = v;
      label.textContent = row.fmt(v);
      saveEffectsConfig();
    });
  }
  ui.ch2Enabled.addEventListener('change', () => {
    state.ch2.enabled = ui.ch2Enabled.checked;
    syncChEffects();
    saveEffectsConfig();
    setReadout(state.ch2.enabled ? 'ch2 enabled' : 'ch2 disabled');
  });
  ui.btnKickReset.addEventListener('click', () => {
    state.ch2.enabled = true;
    state.ch2.cc = { ...CH2_CC_DEFAULTS };
    saveEffectsConfig();
    syncChEffects();
    setReadout('kick defaults reset');
  });
}

function wireCh3Controls() {
  for (const row of CH3_ROWS) {
    const input = document.getElementById('ch3-' + row.id);
    const label = document.getElementById('val-ch3-' + row.id);
    if (!input || !label) continue;
    input.addEventListener('input', () => {
      const v = clamp(parseInt(input.value, 10) || 0, 0, 127);
      state.ch3.cc[row.id] = v;
      label.textContent = row.fmt(v);
      saveEffectsConfig();
    });
  }
  ui.ch3Direction.addEventListener('change', () => {
    const i = CH3_DIRECTION_NAMES.indexOf(ui.ch3Direction.value);
    state.ch3.cc[CH3_CC.DIRECTION] = i >= 0 ? clamp(Math.round(i / (CH3_DIRECTION_NAMES.length - 1) * 127), 0, 127) : 0;
    if (ui.ch3DirectionValue) ui.ch3DirectionValue.textContent = ui.ch3Direction.value;
    saveEffectsConfig();
    setReadout('hats direction: ' + ui.ch3Direction.value);
  });
  ui.ch3Enabled.addEventListener('change', () => {
    state.ch3.enabled = ui.ch3Enabled.checked;
    syncChEffects();
    saveEffectsConfig();
    setReadout(state.ch3.enabled ? 'ch3 enabled' : 'ch3 disabled');
  });
  ui.btnHatsReset.addEventListener('click', () => {
    state.ch3.enabled = true;
    state.ch3.cc = { ...CH3_CC_DEFAULTS };
    saveEffectsConfig();
    syncChEffects();
    setReadout('hats defaults reset');
  });
}

function wireCh4Controls() {
  ui.ch4Enabled.addEventListener('change', () => {
    state.ch4.enabled = ui.ch4Enabled.checked;
    syncChEffects();
    saveEffectsConfig();
    setReadout(state.ch4.enabled ? 'ch4 enabled' : 'ch4 disabled');
  });
  for (const [key, checkbox] of Object.entries(ui.ch4Effects)) {
    checkbox.addEventListener('change', () => {
      state.ch4.effects[key] = checkbox.checked;
      syncChEffects();
      saveEffectsConfig();
      setReadout('ch4 ' + key + (checkbox.checked ? ' on' : ' off'));
    });
  }
  ui.ch4Mode.addEventListener('change', () => {
    const i = CH4_MODE_NAMES.indexOf(ui.ch4Mode.value);
    state.ch4.cc[CH4_CC.MODE] = i >= 0 ? clamp(Math.round(i / (CH4_MODE_NAMES.length - 1) * 127), 0, 127) : 0;
    syncChEffects();
    saveEffectsConfig();
    setReadout('ch4 mode: ' + ui.ch4Mode.value);
  });
  ui.ch4AngleSource.addEventListener('change', () => {
    const i = CH4_ANGLE_SOURCE_NAMES.indexOf(ui.ch4AngleSource.value);
    state.ch4.cc[CH4_CC.ANGLE_SOURCE] = i >= 0 ? clamp(Math.round(i / (CH4_ANGLE_SOURCE_NAMES.length - 1) * 127), 0, 127) : 0;
    syncChEffects();
    saveEffectsConfig();
    setReadout('ch4 angle source: ' + ui.ch4AngleSource.value);
  });
  ui.ch4Angle.addEventListener('input', () => {
    const v = clamp(parseInt(ui.ch4Angle.value, 10) || 0, 0, 127);
    state.ch4.cc[CH4_CC.ANGLE] = v;
    ui.ch4AngleValue.textContent = Math.round(ccChannel4Angle(v)) + '\u00b0';
    saveEffectsConfig();
  });
  ui.ch4Size.addEventListener('input', () => {
    const v = clamp(parseInt(ui.ch4Size.value, 10) || 0, 0, 127);
    state.ch4.cc[CH4_CC.SIZE] = v;
    ui.ch4SizeValue.textContent = '\u00d7 ' + ccChannel4Size(v).toFixed(2);
    saveEffectsConfig();
  });
  ui.ch4Color.addEventListener('input', () => {
    const v = clamp(parseInt(ui.ch4Color.value, 10) || 0, 0, 127);
    state.ch4.cc[CH4_CC.COLOR] = v;
    ui.ch4ColorValue.textContent = ccChannel4Color(v).toFixed(2) + ' hue';
    saveEffectsConfig();
  });
  ui.ch4Formula.addEventListener('input', () => {
    const v = clamp(parseInt(ui.ch4Formula.value, 10) || 0, 0, 127);
    state.ch4.cc[CH4_CC.FORMULA] = v;
    const steps = ccChannel4Formula(v);
    ui.ch4FormulaValue.textContent = steps + ' step' + (steps === 1 ? '' : 's');
    saveEffectsConfig();
  });
  ui.btnCh4Reset.addEventListener('click', () => {
    state.ch4.enabled = true;
    state.ch4.effects = { direction: true, size: false, color: false, formula: true };
    state.ch4.cc = { ...CH4_CC_DEFAULTS };
    saveEffectsConfig();
    syncChEffects();
    setReadout('ch4 defaults reset');
  });
  ui.btnCh4Test.addEventListener('click', () => applyChannel4Effect());
}

function wireCh5Controls() {
  ui.ch5Enabled.addEventListener('change', () => {
    state.ch5.enabled = ui.ch5Enabled.checked;
    syncChEffects();
    saveEffectsConfig();
    setReadout(state.ch5.enabled ? 'ch5 enabled' : 'ch5 disabled');
  });
  for (const [key, checkbox] of Object.entries(ui.ch5Effects)) {
    checkbox.addEventListener('change', () => {
      state.ch5.effects[key] = checkbox.checked;
      syncChEffects();
      saveEffectsConfig();
      setReadout('ch5 ' + key + (checkbox.checked ? ' on' : ' off'));
    });
  }
  for (const row of CH5_ROWS) {
    const input = ui[row.input];
    const label = ui[row.label];
    if (!input || !label) continue;
    input.addEventListener('input', () => {
      const v = clamp(parseInt(input.value, 10) || 0, 0, 127);
      state.ch5.cc[row.id] = v;
      label.textContent = row.fmt(v);
      saveEffectsConfig();
    });
  }
  ui.ch5Font.addEventListener('change', () => {
    state.ch5.font = ui.ch5Font.value;
    const font = currentCh5Font();
    ensureFontLoaded(font.id);
    ui.ch5FontValue.textContent = font.label;
    saveEffectsConfig();
    setReadout('ch5 font: ' + font.label);
  });
  ui.btnCh5WordsFile.addEventListener('click', () => ui.ch5WordsFile.click());
  ui.ch5WordsFile.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleCh5WordFile(file).finally(() => { e.target.value = ''; });
  });
  ui.btnCh5WordsRestore.addEventListener('click', () => {
    state.ch5.words = [...CH5_WORDS_FALLBACK];
    state.ch5.listSource = 'default';
    state.ch5.listName = 'embedded default';
    state.ch5.nextIndex = 0;
    saveEffectsConfig();
    syncChEffects();
    setReadout('ch5 — restored default word list');
  });
  ui.btnCh5Test.addEventListener('click', () => spawnWord());
  ui.btnCh5Reset.addEventListener('click', () => {
    state.ch5.enabled = true;
    state.ch5.effects = { noisy: true, fallApart: false, letterSizes: true };
    state.ch5.cc = { ...CH5_CC_DEFAULTS };
    state.ch5.font = 'system';
    state.ch5.nextIndex = 0;
    clearWords();
    saveEffectsConfig();
    syncChEffects();
    setReadout('ch5 defaults reset');
  });
}

wireSettingsTabs();
wireCh2Controls();
wireCh3Controls();
wireCh4Controls();
wireCh5Controls();
syncChEffects();

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
  applyChannel4Effect,
  spawnCopies,
  spawnNote,
  spawnWord,
  clearWords,
  clearSquares,
  saveEffectsConfig,
};

window.addEventListener('load', async () => {
  syncControlsFromState();
  requestAnimationFrame(animate);
  connectMidi();
  loadCh5WordList();
});
