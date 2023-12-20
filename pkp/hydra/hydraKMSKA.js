//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
// await loadScript("osc.min.js")

await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })
midi.show()
op1 = midi.input(1).channel(0)
await loadScript("extraMidiKMSKA.js") // loads extra hydra functions


// /viewportconfig
rw = 1920
rh = 1080
setResolution(rw, rh)

setResolution(1920,1080);
ar = window.innerWidth/window.innerHeight
pr = 16/16
if (window.innerWidth > window.innerHeight) {sc = pr/ar} else {sc = ar/pr}

a.show()
a.setBins(4)
a.setCutoff(3)
a.setScale(10)
a.beat.threshold = 10


//vars
// var cc1,cc2,cc3,cc4 = 0



//OSC connectors
// _osc = new OSC()
// _osc.open()

// _osc.on("*", (m) => {
// 	console.log(m.address, m.args)
// })


// synth0 - ai viz
// s0.initScreen()
src(s0).out(o0)
code = s0

// synth3 - livecode
// s3.initStream("kaos")
// s3.initScreen()



// P5Synth
p = new P5({
	mode: "WEBGL"
})


p.hide()
s0.init({
	src: p.canvas
})

src(s0).out(o0);

p.cubes = [];
p.lines = [];
p.rects = [];

await loadScript("extraP5kmska.js") // loads extra p5 functions

p.render = "rects"
p.piramidtrans = 0
p.cubesconfig.seed = 12;

createLines(p.lines,400,20,1,2)
createCubes(4, 100, 10)
createRects()

p.draw = () => {
// 	f++;
	p.background(0);
	p.push();
// 	p.rotateX(p.frameCount * p.viewportconf.rotSpeedX);
// 	p.rotateY(p.frameCount * p.viewportconf.rotSpeedY);
// 	p.rotateZ(p.frameCount * p.viewportconf.rotSpeedZ);
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




await loadScript("extraHydraKMSKA.js") // loads extra hydra functions

src(s0).scroll(cc(2)).kaleid(cc(1).range(2,8)).add(src(o1).modulate(o1,0.09),.6).scrollY( ({time}) => Math.sin(time*0.05)*0.05 ).repeatX(2).color(1,1,1).scale(sc,1,ar/pr).out(o1)

src(s0).scroll(cc(2)).kaleid(cc(1).range(2,8)).add(src(o1).modulate(o1,0.09),.6).scrollY(() => a.fft[0]*0.1).scale(sc,1,ar/pr).out(o1)

src(s0).scroll(cc(2)).kaleid(cc(1).range(2,8)).scrollY(() => a.fft[0]*0).scale(sc,1,ar/pr).out(o1)

src(s0).modulateRepeatX(src(s3),300, 3.0).modulateScale(src(s3),10,3).pixelate(cc(1).range(20,200),200).out(o1)

src(s0).modulate(src(s0).invert(0.8),()=>a.fft[0]).out(o1)

src(s0).blend(s3,0.4).blend(src(s0).modulate(src(s3),10),0.8).blend(s2).out(o2)

src(o1).mask(shape(100,0.5,0.0011).scale(1,1,rw/rh)).out(o2)


render(o0)




