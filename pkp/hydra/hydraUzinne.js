
await loadScript("images.js")

await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })

//midi config
tidal = midi.input(0) // live code data
op1 = tidal // (no controller)

midi.show()


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


await loadScript("extra/extraP5Uzinne.js") // loads extra p5 functions /load after midi init, after P5 init

p.render = "rects"
p.piramidtrans = 0
p.cubesconfig.seed = 12;

// createLines(p.lines,400,20,1,2)
createCubes()
createRects()
preloadImg(cyborgsmall)

p.draw = () => {
  	p.updateit = false;
	p.background(0);
  	updateCam();
	p.push();
  	updateViewport ()
 	p.rotateX(p.viewportconf.rotX*2*3.14);
	p.rotateY(p.viewportconf.rotY*2*3.14);
	p.rotateZ(p.viewportconf.rotZ*2*3.14);
  	// if (p.render == "cubes") {
		updateCubes();
		renderCubes();
	// }
	// if (p.render == "lines") {
	// 	updateLines();
	// 	renderLines();
	// }
//   p.cubesconfig.seed = 153;
    // if (p.render == "rects") {p.imgs[Math.floor(Math.abs(Math.sin(seed))) % p.imgs.length]; 
      updateRects();
      renderRects();
    // }
	p.pop();
  	updateImgs()
 	renderImgs()
}
await loadScript("extra/extraMidiUzinne.js") // loads extra hydra functions
await loadScript("extra/extraHydraUzinne.js") // loads extra hydra functionsp.imgs[Math.floor(Math.abs(Math.sin(seed))) % p.imgs.length]; 



src(s3).out(o3)

set1()

src(s3).out(o1)
src(s0).blend(s1, cc(1)).out(o1)


src(s0).out(o3)
src(s1).out(o3)
src(s2).out(o3)

render(o3)