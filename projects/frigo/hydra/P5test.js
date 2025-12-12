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
onc = midi.input(3) // modular data
midi.show()

//Create P5-WEBGL canvas
p = new P5( {
  height: rh, width: rw, mode:  "WEBGL"})

p.draw = () => {
  p.background(0);
  p.pop()
  p.rotateX(45)
  p.box(500)
  p.push()
}
p.hide()

s0.init({src: p.canvas})

/////// load synths
await loadScript("hydra/P5wintercircus.js") // loads p5 helpper functions
configP5(p)

await loadScript("hydra/P5cubes.js") // loads cubes
initCubes(p)
createCubes(p)

// initImgs(p)
// preloadImg(p,maskssmall)
// initRects(p)
// initLines(p)
// initTextParts(p)
// initMidi(p)


// await loadScript("hydra/images.js") // loads images data
// await loadScript("hydra/P5images.js") // loads images
// await loadScript("hydra/P5lines.js") // loads images
// await loadScript("hydra/P5rects.js") // loads rects	
// await loadScript("hydra/data.js") // loads text data
// await loadScript("hydra/P5textparticles.js") // loads text particles
// await loadScript("hydra/extraHydra.js") // loads hydrapresets
// await loadScript("hydra/extraMidi.js") // loads midi





// hydraops


src(s0).kaleid(4).out(o3)

render()