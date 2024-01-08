
await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })
midi.show()


op1 = midi.input(0).channel(0)
tidal = midi.input(2)
andrew = midi.input(3).channel(0)



await loadScript("extraMidiFlagey.js") // loads extra hydra functions

// /viewportconfig
rw = 1920
rh = 1080
setResolution(rw, rh)

ar = window.innerWidth/window.innerHeight
pr = 16/16
if (window.innerWidth > window.innerHeight) {sc = pr/ar} else {sc = ar/pr}

a.show()
a.setBins(8)
a.setCutoff(100)
a.setScale(10)
a.beat.threshold = 10


src(s3).out(o1)
src(s0).blend(s1, cc(1)).out(o1)

// AI infinite panorama
s0.initScreen()
// s0.initStream("corekaos")
src(s0).out(o0)


//Livecode display
s1.initStream("dago")
src(s1).out(o1)

//Livecode display andrew
s2.initStream("andrew")
src(s1).blend(src(s2)).out(o1)

// P5Synth
p = new P5({
	mode: "WEBGL"
})


p.hide()
s3.init({
	src: p.canvas
})

p.cubes = [];
p.lines = [];
p.rects = [];
p.updateit = false;
p.audioreact = false;
p.activeaudiobin = 0;

await loadScript("extraP5flagey.js") // loads extra p5 functions


p.render = "rects"
p.piramidtrans = 0
p.cubesconfig.seed = 12;

createLines(p.lines,400,20,1,2)
createCubes(4, 100, 10)
createRects()

p.draw = () => {
  	p.updateit = false;
	p.background(0);
	p.push();
	p.rotateX(params.viewportrot[5]*2*3.14);
	p.rotateY(params.viewportrot[6]*2*3.14);
	p.rotateZ(params.viewportrot[7]*2*3.14);
  	if (p.render == "cubes") {
		updateCubes();
		renderCubes();
	}
	if (p.render == "lines") {
		updateLines();
		renderLines();
	}
//   p.cubesconfig.seed = 153;
    if (p.render == "rects") {
      updateRects();
      renderRects();
    }
	p.pop();
}

await loadScript("extraHydraFlagey.js") // loads extra hydra functions

    src(s0)
    .modulateScale(osc(0.3,-0.5,0))
    .out(o1)


src(s3).out(o3)

render(o1)

set1()

