// screenconfig
rw = 1280 //window.innerWidth
rh = 720 //window.innerHeight
setResolution(rw, rh)

//audioconfig
a.show()
a.setBins(4)
a.setCutoff(4)
a.setScale(5)
a.beat.threshold = 10

//midi config
await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })
tidal = midi.input(0) // live code data
op1 = tidal // (no controller)
onc = midi.input(1) // modular data

midi.show()


// midi.hide()

//Create P5-WEBGL canvas
p = new P5( {
  height: rh, width: rw, mode:  "WEBGL"})


p.hide()

s0.init({src: p.canvas})

/////// load synths
await loadScript("hydra/P5wintercircus.js") // loads p5 helpper functions
configP5(p)

await loadScript("hydra/P5cubes.js") // loads cubes
initCubes(p)
createCubes(p)


// await loadScript("hydra/images.js") // loads images data
// await loadScript("hydra/P5images.js") // loads images
// initImgs(p)
// preloadImg(p,maskssmall)

// await loadScript("hydra/P5lines.js") // loads images
// initLines(p)

// await loadScript("hydra/P5rects.js") // loads rects	
// initRects(p)

await loadScript("hydra/data.js") // loads text data
await loadScript("hydra/P5textparticles.js") // loads text particles
initTextParts(p)


await loadScript("hydra/extraHydra.js") // loads hydrapresets

await loadScript("hydra/extraMidi.js") // loads midi
initMidi(p)

/// p5Draw
p.draw = () => {
  p.background(0);
  p.pop()
  updateViewport (p);
  updateCam(p);
  updateParticles(p)
  drawParticles(p)
  updateCubes(p);
  renderCubes(p);
//   updateLines(p);
//   renderLines(p)
//   updateImgs(p);
//   renderImgs(p);
//   updateRects(p);
//   renderRects(p);
  p.push()
}

// hydraops
shape(2,0.1,0.1)
  .scale(() => p.oncdata1/127 + 1)
.out(o0)

src(o0)
  .rotate(3.14/2)
  .repeat(() => p.oncdata2/127 + 3)
  .scale(5)
  .out(o1)



src(s0).out(o0)

src(s0).diff(o1).color(1,0,1).out(o3)

src(o0).blend(src(s0).color(0.1,0.3,0.5)).out(o3)

    src(s0)
//       .repeat(1).kaleid(1)
//     .mult(osc(10,0.1,()=>Math.sin(time)*3).saturate(3).kaleid(200))
//     .modulate(o1,0.5)
    .add(src(s2),0.9)
    .scrollY( ()=>Math.sin(time)*0.03 + 0)
    .luma(0.7).out(o3)


render(o3)