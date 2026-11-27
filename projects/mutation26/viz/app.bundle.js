(() => {
  // ca.js
  function makeRuleTable(rule) {
    const out = new Uint8Array(8);
    for (let i = 0; i < 8; i++)
      out[i] = rule >> i & 1;
    return out;
  }
  function centerRow(width2, seedCell = Math.floor(width2 / 2)) {
    const row = new Uint8Array(width2);
    row[seedCell] = 1;
    return row;
  }
  function simulateCA(rule, width2, height2, seedRow) {
    if (!Number.isInteger(width2) || width2 < 2)
      throw new Error("width must be an integer >= 2");
    if (!Number.isInteger(height2) || height2 < 1)
      throw new Error("height must be an integer >= 1");
    const table = makeRuleTable(rule);
    const rows = [seedRow ? Uint8Array.from(seedRow) : centerRow(width2)];
    for (let g = 1; g < height2; g++) {
      const prev = rows[g - 1];
      const next = new Uint8Array(width2);
      for (let x = 0; x < width2; x++) {
        const l = prev[(x - 1 + width2) % width2];
        const c = prev[x];
        const r = prev[(x + 1) % width2];
        next[x] = table[l << 2 | c << 1 | r];
      }
      rows.push(next);
    }
    const data = new Uint8Array(width2 * height2);
    for (let g = 0; g < height2; g++)
      data.set(rows[g], g * width2);
    return data;
  }
  function makePatternData(rule, width2, height2, opts = {}) {
    const offsetX = Math.max(0, Math.floor(opts.offsetX || 0));
    const offsetY = Math.max(0, Math.floor(opts.offsetY || 0));
    const cells = simulateCA(rule, width2, height2);
    const rgba = new Uint8Array(width2 * height2 * 4);
    for (let g = 0; g < height2; g++) {
      for (let x = 0; x < width2; x++) {
        const srcX = (x + offsetX) % width2;
        const srcRow = g + offsetY;
        const idx = g * width2 + x;
        const v = srcRow < height2 ? cells[srcRow * width2 + srcX] : 0;
        rgba[idx * 4 + 0] = 255;
        rgba[idx * 4 + 1] = 255;
        rgba[idx * 4 + 2] = 255;
        rgba[idx * 4 + 3] = v ? 255 : 0;
      }
    }
    return rgba;
  }
  var CC = {
    WIDTH: 7,
    SPEED: 10,
    BRIGHTNESS: 11,
    SIZE: 14,
    OFFSET_LEFT: 15,
    OFFSET_DOWN: 16,
    RULE_LOW: 17,
    RULE_REG: 18
  };
  var CC_DEFAULTS = {
    [CC.WIDTH]: 64,
    [CC.SPEED]: 64,
    [CC.BRIGHTNESS]: 64,
    [CC.SIZE]: 64,
    [CC.OFFSET_LEFT]: 0,
    [CC.OFFSET_DOWN]: 0,
    [CC.RULE_LOW]: 64,
    [CC.RULE_REG]: 0
  };
  var WIDTH_RANGE = [4, 96];
  var SPEED_RANGE = [0.25, 2.5];
  var BRIGHT_RANGE = [0.1, 2];
  var SIZE_RANGE = [4, 100];
  function ccWidthCells(v) {
    const [lo, hi] = WIDTH_RANGE;
    return Math.round(lo + (hi - lo) * (clamp(v, 0, 127) / 127));
  }
  function ccSpeedMultiplier(v) {
    const [lo, hi] = SPEED_RANGE;
    return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
  }
  function ccBrightness(v) {
    const [lo, hi] = BRIGHT_RANGE;
    return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
  }
  function ccSizePercent(v) {
    const [lo, hi] = SIZE_RANGE;
    return lo + (hi - lo) * (clamp(v, 0, 127) / 127);
  }
  function ccOffsetCells(v, maxCells) {
    const t = clamp(v, 0, 127) / 127;
    return Math.round(t * Math.max(0, maxCells));
  }
  var RULE_REG = {
    RANGE_LOW: 0,
    // CC 17 value is itself the rule (0-127)
    RANGE_HIGH: 1,
    // 128 + CC 17 value (128-255)
    RANDOM: 2,
    // each spawn picks a uniformly random rule 0..255
    EVEN: 3,
    // even rules only: CC 17 value * 2 (0, 2, ... 254)
    ODD: 4
    // odd rules only: CC 17 value * 2 + 1 (1, 3, ... 255)
  };
  var RULE_REG_LABELS = [
    "0-127",
    "128-255",
    "random",
    "even-only (0,2,\u2026,254)",
    "odd-only (1,3,\u2026,255)"
  ];
  function ruleRegister(v) {
    return clamp(Math.round(clamp(v, 0, 127)), 0, 4);
  }
  function randomRule(rng = Math.random) {
    return Math.floor(rng() * 256);
  }
  function selectRule(low, register, rng = Math.random) {
    const reg = ruleRegister(register);
    const l = clamp(low, 0, 127);
    switch (reg) {
      case RULE_REG.RANGE_LOW:
        return l;
      case RULE_REG.RANGE_HIGH:
        return Math.min(255, 128 + l);
      case RULE_REG.RANDOM:
        return randomRule(rng);
      case RULE_REG.EVEN:
        return l * 2;
      case RULE_REG.ODD:
        return l * 2 + 1;
      default:
        return l;
    }
  }
  function pitchToHue(note) {
    return note * 0.618034 % 1;
  }
  function randomSquare(rng = Math.random, rule) {
    const axis = rng() < 0.5 ? "x" : "y";
    const sign = rng() < 0.5 ? -1 : 1;
    return {
      axis,
      sign,
      horizontal: axis === "x",
      baseSizeFactor: 0.8 + rng() * 0.4,
      // per-square size multiplier (0.80-1.20)
      baseVelocity: 28 + rng() * 55,
      rule: rule === void 0 ? randomRule(rng) : rule
    };
  }
  function scaleSize(baseFactor, noteVelocity) {
    const vel = clamp(noteVelocity, 1, 127) / 127;
    return baseFactor * (0.7 + 0.5 * vel);
  }
  function heldFadeIn(secondsSinceSpawn, fadeIn = 0.18) {
    return clamp(secondsSinceSpawn / fadeIn, 0, 1);
  }
  function decayAlpha(secondsSinceNoteOff, fadeOut = 1.3) {
    if (secondsSinceNoteOff < 0 || secondsSinceNoteOff >= fadeOut)
      return 0;
    return 1 - secondsSinceNoteOff / fadeOut;
  }
  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }
  function registerName(register) {
    const reg = ruleRegister(register);
    return RULE_REG_LABELS[reg] ?? "unknown";
  }

  // visualiser.js
  var TEXTURE_HEIGHT = 96;
  var MAX_SQUARES = 40;
  var canvasEl = document.getElementById("canvas");
  var width = window.innerWidth;
  var height = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true, premultipliedAlpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0, 0);
  renderer.autoClear = true;
  var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 10);
  camera.position.set(0, 0, 5);
  var scene = new THREE.Scene();
  var planeGeo = new THREE.PlaneGeometry(1, 1);
  var state = {
    cc: Object.fromEntries(Object.entries(CC_DEFAULTS)),
    blendMode: "additive",
    autoplay: false,
    lastSpawnAt: 0,
    lastTime: performance.now(),
    squares: [],
    dirtyTextures: false
  };
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
        uMode: { value: 0 }
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
      void main() {
        vec4 p = texture2D(uPattern, vUv);
        float a = p.a * uFade * uIntensity;
        vec3 rgb;
        if (uMode > 1.5) {
          rgb = mix(vec3(1.0), uColor, clamp(a, 0.0, 1.0));
        } else {
          rgb = uColor * a;
        }
        gl_FragColor = vec4(rgb, a);
      }`
    });
    return mat;
  }
  function applyBlendingTo(m, mode) {
    m.blending = THREE.CustomBlending;
    m.blendEquation = THREE.AddEquation;
    m.blendSrcAlpha = THREE.OneFactor;
    m.blendDstAlpha = THREE.OneFactor;
    if (mode === "normal") {
      m.blendSrc = THREE.OneFactor;
      m.blendDst = THREE.OneMinusSrcAlphaFactor;
      m.blendSrcAlpha = THREE.OneFactor;
      m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
      m.uniforms.uMode.value = 0;
    } else if (mode === "additive") {
      m.blendSrc = THREE.OneFactor;
      m.blendDst = THREE.OneFactor;
      m.uniforms.uMode.value = 0;
    } else if (mode === "multiply") {
      m.blendSrc = THREE.ZeroFactor;
      m.blendDst = THREE.SrcColorFactor;
      m.blendSrcAlpha = THREE.ZeroFactor;
      m.blendDstAlpha = THREE.OneFactor;
      m.uniforms.uMode.value = 2;
    } else if (mode === "subtract") {
      m.blendEquation = THREE.SubtractEquation;
      m.blendSrc = THREE.OneFactor;
      m.blendDst = THREE.OneFactor;
      m.uniforms.uMode.value = 0;
    } else {
      throw new Error("unknown blending mode: " + mode);
    }
  }
  function applyBlending(mode) {
    for (const s of state.squares)
      applyBlendingTo(s.material, mode);
  }
  function makePatternFor(rule, width2, opts) {
    const rgba = makePatternData(rule, width2, TEXTURE_HEIGHT, opts);
    const tex = new THREE.DataTexture(rgba, width2, TEXTURE_HEIGHT, THREE.RGBAFormat);
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
    const rule = reg === RULE_REG.RANDOM ? randomRule() : selectRule(state.cc[CC.RULE_LOW], reg);
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
    applyBlendingTo(material, state.blendMode);
    const mesh = new THREE.Mesh(planeGeo, material);
    const initialSide = Math.min(100, ccSizePercent(state.cc[CC.SIZE]) * sizeFactor) / 100 * Math.min(width, height);
    mesh.scale.set(initialSide, initialSide, 1);
    mesh.position.set(
      (Math.random() * 0.8 - 0.4) * width,
      (Math.random() * 0.8 - 0.4) * height,
      0
    );
    mesh.rotation.z = cfg.horizontal ? 0 : Math.PI / 2;
    mesh.renderOrder = 1;
    mesh.frustumCulled = false;
    mesh.visible = true;
    scene.add(mesh);
    const square = {
      mesh,
      material,
      texture: tex,
      axis: cfg.axis,
      sign: cfg.sign,
      horizontal: cfg.horizontal,
      sizeFactor,
      baseVelocity: speedBase,
      rule: cfg.rule,
      note,
      held: true,
      decayingAt: null,
      offsetX: offX,
      offsetY: offY,
      hue: hues,
      widthCells: w,
      spawnedAt: performance.now()
    };
    state.squares.push(square);
    if (state.squares.length > MAX_SQUARES) {
      const oldest = state.squares.shift();
      destroySquare(oldest);
    }
    return square;
  }
  function destroySquare(s) {
    scene.remove(s.mesh);
    s.texture.dispose();
    s.material.dispose();
  }
  function refreshTextures() {
    const w = ccWidthCells(state.cc[CC.WIDTH]);
    const offX = ccOffsetCells(state.cc[CC.OFFSET_LEFT], w);
    const offY = ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT);
    const reg = ruleRegister(state.cc[CC.RULE_REG]);
    const rule = reg === RULE_REG.RANDOM ? null : selectRule(state.cc[CC.RULE_LOW], reg);
    for (const s of state.squares) {
      if (rule !== null)
        s.rule = rule;
      const oldTex = s.texture;
      s.texture = makePatternFor(s.rule, w, { offsetX: offX, offsetY: offY });
      s.material.uniforms.uPattern.value = s.texture;
      s.widthCells = w;
      s.offsetX = offX;
      s.offsetY = offY;
      oldTex.dispose();
    }
  }
  function clearSquares() {
    for (const s of state.squares)
      destroySquare(s);
    state.squares = [];
  }
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - state.lastTime) / 1e3);
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
      if (sq)
        setTimeout(() => decaySquare(sq), 450);
      state.lastSpawnAt = now;
    }
    for (let i = state.squares.length - 1; i >= 0; i--) {
      const s = state.squares[i];
      const t = (now - s.spawnedAt) / 1e3;
      const pct = Math.min(100, sizePct * s.sizeFactor);
      const sz = pct / 100 * minDim;
      s.mesh.scale.set(sz, sz, 1);
      const half = sz / 2;
      const v = s.baseVelocity * speed;
      if (s.horizontal) {
        s.mesh.position.x += s.sign * v * dt;
        if (s.sign > 0 && s.mesh.position.x - half > width / 2)
          s.mesh.position.x = -width / 2 - half;
        else if (s.sign < 0 && s.mesh.position.x + half < -width / 2)
          s.mesh.position.x = width / 2 + half;
      } else {
        s.mesh.position.y += s.sign * v * dt;
        if (s.sign > 0 && s.mesh.position.y - half > height / 2)
          s.mesh.position.y = -height / 2 - half;
        else if (s.sign < 0 && s.mesh.position.y + half < -height / 2)
          s.mesh.position.y = height / 2 + half;
      }
      let alpha;
      if (s.held) {
        alpha = heldFadeIn(t);
      } else {
        const tOff = (now - s.decayingAt) / 1e3;
        alpha = decayAlpha(tOff);
        if (tOff >= 1.3) {
          destroySquare(s);
          state.squares.splice(i, 1);
          continue;
        }
      }
      s.material.uniforms.uFade.value = alpha;
      s.material.uniforms.uIntensity.value = bright;
    }
    renderer.render(scene, camera);
  }
  var midiAccess = null;
  var subscribedInputs = /* @__PURE__ */ new Set();
  function pickRandomNote() {
    return 48 + Math.floor(Math.random() * 48);
  }
  async function connectMidi() {
    try {
      midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      midiAccess.onstatechange = handleMidiStateChange;
      subscribeToMidiInputs();
      setMidiStatus("connected", midiAccess.inputs.size);
    } catch (err) {
      setMidiStatus("unavailable: " + (err && err.message ? err.message : "not allowed"));
    }
  }
  function subscribeToMidiInputs() {
    if (!midiAccess)
      return;
    for (const input of midiAccess.inputs.values()) {
      if (subscribedInputs.has(input))
        continue;
      input.onmidimessage = onMidiMessage;
      input.onstatechange = handleMidiStateChange;
      subscribedInputs.add(input);
    }
  }
  function handleMidiStateChange() {
    subscribeToMidiInputs();
    setMidiStatus(midiAccess && midiAccess.inputs.size > 0 ? "connected" : "no MIDI inputs", midiAccess ? midiAccess.inputs.size : 0);
  }
  function onMidiMessage(e) {
    const [status, d1, d2] = e.data;
    const cmd = status & 240;
    const channel = status & 15;
    if (channel === 1) {
      setReadout("channel 2 event (idle)");
      return;
    }
    if (channel !== 0)
      return;
    if (cmd === 144 && d2 > 0) {
      spawnNote(d1, d2);
    } else if (cmd === 128 || cmd === 144 && d2 === 0) {
      decayNote(d1);
    } else if (cmd === 176) {
      const val = clamp(d2, 0, 127);
      if (val === void 0)
        return;
      if (d1 in CC_DEFAULTS) {
        const v = d1 === CC.RULE_REG ? clamp(val, 0, 4) : val;
        state.cc[d1] = v;
        if (d1 === CC.WIDTH || d1 === CC.OFFSET_LEFT || d1 === CC.OFFSET_DOWN)
          state.dirtyTextures = true;
        else if (d1 === CC.RULE_LOW || d1 === CC.RULE_REG) {
          if (ruleRegister(state.cc[CC.RULE_REG]) !== RULE_REG.RANDOM)
            state.dirtyTextures = true;
        }
        syncControlsFromState();
        setReadout("CC " + d1 + " = " + v);
      }
    }
  }
  function spawnNote(note, velocity) {
    const square = createSquare({ note, velocity });
    setReadout("note " + note + " (v" + velocity + ")");
    return square;
  }
  function decaySquare(sq, quiet = false) {
    if (!sq || !state.squares.includes(sq) || !sq.held)
      return;
    sq.held = false;
    sq.decayingAt = performance.now();
    if (!quiet && sq.note !== void 0)
      setReadout("note " + sq.note + " off");
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
  var ui = {
    panel: document.getElementById("panel"),
    toggle: document.getElementById("toggle"),
    btnMidi: document.getElementById("btn-midi"),
    btnNote: document.getElementById("btn-note"),
    btnClear: document.getElementById("btn-clear"),
    autoplay: document.getElementById("autoplay"),
    blend: document.getElementById("blend"),
    blendValue: document.getElementById("blend-value"),
    sliderWidth: document.getElementById("slider-width"),
    sliderSize: document.getElementById("slider-size"),
    sliderSpeed: document.getElementById("slider-speed"),
    sliderBright: document.getElementById("slider-bright"),
    sliderOffsetX: document.getElementById("slider-offset-x"),
    sliderOffsetY: document.getElementById("slider-offset-y"),
    sliderRule: document.getElementById("slider-rule"),
    sliderReg: document.getElementById("slider-reg"),
    widthValue: document.getElementById("value-width"),
    sizeValue: document.getElementById("value-size"),
    speedValue: document.getElementById("value-speed"),
    brightValue: document.getElementById("value-bright"),
    offsetXValue: document.getElementById("value-offset-x"),
    offsetYValue: document.getElementById("value-offset-y"),
    ruleValue: document.getElementById("value-rule"),
    regValue: document.getElementById("value-reg"),
    midiStatus: document.getElementById("midi-status"),
    readout: document.getElementById("readout"),
    live: document.getElementById("live")
  };
  function setMidiStatus(text, count) {
    let msg = text;
    if (typeof count === "number" && text === "connected") {
      msg = "connected (" + count + " input" + (count === 1 ? "" : "s") + ")";
    }
    ui.midiStatus.textContent = "MIDI: " + msg;
  }
  function updateLiveReadout() {
    ui.live.textContent = "CC 7 (width): " + state.cc[CC.WIDTH] + " \u2192 " + ccWidthCells(state.cc[CC.WIDTH]) + " cells \xB7 CC 14 (size): " + state.cc[CC.SIZE] + " \u2192 " + ccSizePercent(state.cc[CC.SIZE]).toFixed(0) + "% of screen \xB7 CC 10 (speed): " + state.cc[CC.SPEED] + " \u2192 " + ccSpeedMultiplier(state.cc[CC.SPEED]).toFixed(2) + "x \xB7 CC 11 (bright): " + state.cc[CC.BRIGHTNESS] + " \u2192 " + ccBrightness(state.cc[CC.BRIGHTNESS]).toFixed(2) + "x \xB7 CC 15 (left): " + state.cc[CC.OFFSET_LEFT] + " \u2192 " + ccOffsetCells(state.cc[CC.OFFSET_LEFT], ccWidthCells(state.cc[CC.WIDTH])) + " cells \xB7 CC 16 (down): " + state.cc[CC.OFFSET_DOWN] + " \u2192 " + ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT) + " cells \xB7 CC 17 (rule): " + state.cc[CC.RULE_LOW] + " \u2192 " + formulaMapped(state.cc[CC.RULE_LOW], ruleRegister(state.cc[CC.RULE_REG])) + " \xB7 CC 18 (reg): " + state.cc[CC.RULE_REG] + " (" + registerName(ruleRegister(state.cc[CC.RULE_REG])) + ")";
  }
  function setReadout(text) {
    ui.readout.textContent = text || "\u2013";
    window.clearTimeout(setReadout.timeout);
    setReadout.timeout = window.setTimeout(() => {
      ui.readout.textContent = "\u2013";
    }, 1200);
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
    ui.widthValue.textContent = state.cc[CC.WIDTH] + " (" + ccWidthCells(state.cc[CC.WIDTH]) + " cells)";
    ui.sizeValue.textContent = state.cc[CC.SIZE] + " (" + ccSizePercent(state.cc[CC.SIZE]).toFixed(0) + "%)";
    ui.speedValue.textContent = state.cc[CC.SPEED] + " (" + ccSpeedMultiplier(state.cc[CC.SPEED]).toFixed(2) + "x)";
    ui.brightValue.textContent = state.cc[CC.BRIGHTNESS] + " (" + ccBrightness(state.cc[CC.BRIGHTNESS]).toFixed(2) + "x)";
    ui.offsetXValue.textContent = state.cc[CC.OFFSET_LEFT] + " (" + ccOffsetCells(state.cc[CC.OFFSET_LEFT], ccWidthCells(state.cc[CC.WIDTH])) + " cells)";
    ui.offsetYValue.textContent = state.cc[CC.OFFSET_DOWN] + " (" + ccOffsetCells(state.cc[CC.OFFSET_DOWN], TEXTURE_HEIGHT) + " cells)";
    const reg = ruleRegister(state.cc[CC.RULE_REG]);
    ui.ruleValue.textContent = state.cc[CC.RULE_LOW] + " (" + formulaMapped(state.cc[CC.RULE_LOW], reg) + ")";
    ui.regValue.textContent = reg + " (" + registerName(reg) + ")";
    updateLiveReadout();
  }
  function formulaMapped(low, reg) {
    return reg === RULE_REG.RANDOM ? "random" : "rule " + selectRule(low, reg);
  }
  function wireSlider(slider, valueBox, ccEdit, formatter, opts = {}) {
    slider.addEventListener("input", () => {
      const max = opts.max ?? 127;
      const v = clamp(parseInt(slider.value, 10) || 0, 0, max);
      state.cc[ccEdit] = v;
      if (opts.markDirty && opts.markDirty())
        state.dirtyTextures = true;
      valueBox.textContent = v + " (" + formatter(v) + ")";
      updateLiveReadout();
    });
  }
  var ruleMarkDirty = () => ruleRegister(state.cc[CC.RULE_REG]) !== RULE_REG.RANDOM;
  wireSlider(ui.sliderWidth, ui.widthValue, CC.WIDTH, (v) => ccWidthCells(v) + " cells", { markDirty: () => true });
  wireSlider(ui.sliderSize, ui.sizeValue, CC.SIZE, (v) => ccSizePercent(v).toFixed(0) + "% of screen");
  wireSlider(ui.sliderSpeed, ui.speedValue, CC.SPEED, (v) => ccSpeedMultiplier(v).toFixed(2) + "x");
  wireSlider(ui.sliderBright, ui.brightValue, CC.BRIGHTNESS, (v) => ccBrightness(v).toFixed(2) + "x");
  wireSlider(
    ui.sliderOffsetX,
    ui.offsetXValue,
    CC.OFFSET_LEFT,
    (v) => ccOffsetCells(v, ccWidthCells(state.cc[CC.WIDTH])) + " cells",
    { markDirty: () => true }
  );
  wireSlider(
    ui.sliderOffsetY,
    ui.offsetYValue,
    CC.OFFSET_DOWN,
    (v) => ccOffsetCells(v, TEXTURE_HEIGHT) + " cells",
    { markDirty: () => true }
  );
  wireSlider(
    ui.sliderRule,
    ui.ruleValue,
    CC.RULE_LOW,
    (v) => formulaMapped(v, ruleRegister(state.cc[CC.RULE_REG])),
    { markDirty: ruleMarkDirty }
  );
  wireSlider(
    ui.sliderReg,
    ui.regValue,
    CC.RULE_REG,
    (v) => registerName(ruleRegister(v)),
    { max: 4, markDirty: ruleMarkDirty }
  );
  ui.btnNote.addEventListener("click", () => {
    const sq = spawnNote(pickRandomNote(), 90 + Math.floor(Math.random() * 38));
    if (sq)
      setTimeout(() => decaySquare(sq), 800);
  });
  ui.btnClear.addEventListener("click", () => {
    clearSquares();
    setReadout("cleared");
  });
  ui.btnMidi.addEventListener("click", () => {
    connectMidi();
    setReadout("connecting\u2026");
  });
  ui.autoplay.addEventListener("change", () => {
    state.autoplay = ui.autoplay.checked;
  });
  ui.blend.addEventListener("change", () => {
    state.blendMode = ui.blend.value;
    ui.blendValue.textContent = state.blendMode;
    applyBlending(state.blendMode);
    setReadout("blend: " + state.blendMode);
  });
  ui.toggle.addEventListener("click", () => {
    const hidden = ui.panel.classList.toggle("hidden");
    ui.toggle.textContent = hidden ? "\u25C0 Show controls" : "Hide controls";
  });
  window.addEventListener("resize", onResize);
  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("load", async () => {
    syncControlsFromState();
    requestAnimationFrame(animate);
    connectMidi();
  });
})();
