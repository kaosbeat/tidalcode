
 
 // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter


// /viewportconfig
rw = 1920
rh = 1080
setResolution(rw, rh)
ar = window.innerWidth/window.innerHeight
pr = 16/16
if (window.innerWidth > window.innerHeight) {sc = pr/ar} else {sc = ar/pr}


// audioconfig
a.show()
a.setBins(8)
a.setCutoff(1)
a.setScale(4)
a.beat.threshold = 10


await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })

//midi config
tidal = midi.input(0) // live code data
op1 = tidal // (no controller)

midi.show()


// webcam
s0.initCam()

// ascii
s1.initScreen()

// P5Synth
p = new P5({
	mode: "WEBGL"
})


p.hide()
s2.init({
	src: p.canvas
})
// await loadScript("iscian.js") // loads extra hydra functions 

/////// load synths
await loadScript("iscian/P5iscian.js") // loads p5 helpper functions
configP5(p)

await loadScript("iscian/P5cubes.js") // loads cubes
initCubes(p)

await loadScript("iscian/data.js") // loads text data
await loadScript("isciuan/P5textparticles.js") // loads text particles
initTextParts(p)

await loadScript("iscian/P5lines.js") // loads images
initLines(p)

await loadScript("iscian/P5rects.js") // loads rects	
initRects(p)


await loadScript("iscian/extraMidi.js") // loads midi
initMidi(p)


//////////////
/// config ///
//////////////
p.cam = p.createCamera();
p.updateit = false;
p.audioreact = false;
p.activeaudiobin = 0;

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
    updateLines(p);
    renderLines(p)
    updateRects(p);
    renderRects(p);
	p.push()
  }
  

await loadScript("iscian/iscianhydra.js") // loads extra hydra functions 

set1()

render(o3)	