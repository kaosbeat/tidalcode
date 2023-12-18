//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
await loadScript("osc.min.js")
await loadScript("midi.js")
await midi.start({ channel: '*', input: '*' })
midi.show()
op1 = midi.input(1).channel(0)

mididata = {  "m0":{"n":0, "v":0}}

//midivars



// /config
rw = 960
rh = 960
setResolution(rw, rh)

a.show()
a.setBins(4)
a.setCutoff(3)
a.setScale(10)
a.beat.threshold = 10

//vars
p1 = 0.5
p2 = 0.5


//OSC connectors
_osc = new OSC()
_osc.open()

// _osc.on("*", (m) => {
// 	console.log(m.address, m.args)
// })



// synth0 - ai viz
// s0.initScreen()
src(s0).out(o0)
code = s0


// synth1 - andrew code
// s1.initStream("andrew")
// s1.initScreen()

// src(s1).out(o1);

// synth2 - kaos tidal
// s2.initScreen()
src(s2).out(o2);

// synth3 - processing
p = new P5({
	mode: "WEBGL"
})


await loadScript("extraP5kmska.js") // loads extra p5 functions

// await new Promise(r => setTimeout(r, 2000));

p.hide()

s3.init({
	src: p.canvas
})
src(s3)
	.out(o3);

p.cubes = [];
p.lines = [];
p.rects = [];

p.render = "rects"
p.piramidtrans = 0
p.cubesconfig.seed = 12;

createLines(p.lines,400,20,1,2)

createCubes(4, 100, 10)
createRects()


render()

// p.draw = () => {}

f = 0


p.draw = () => {
op1.cc(1).value(v => f=v) 
  console.log(f)
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
//   piramids();
  
	p.pop();

}



// render black
solid(0)
	.out(o0)
// //render code
src(s1)
	.out(o0);
render(o0)
debug = false;

await loadScript("extraHydra.js") // loads extra hydra functions


src(s3).scroll(cc(2)).kaleid(cc(1).range(2,8)).add(src(o1).modulate(o1,0.09),.6).scrollY( ({time}) => Math.sin(time*0.05)*0.05 ).repeatX(2).color(1,1,.11).out(o1)

src(s3).scroll(cc(2)).kaleid(cc(1).range(2,8)).add(src(o1).modulate(o1,0.09),.6).scrollY(() => a.fft[0]*0.1).out(o1)

src(s3).modulateRepeatX(src(s3),300, 3.0).modulateScale(src(s3),10,3).pixelate(200,200).out(o1)

src(s0).modulate(src(s3),()=>a.fft[0]).blend(s2).out(o2)

src(s0).blend(s3,0.4).blend(src(s0).modulate(src(s3),10),0.8).blend(s2).out(o2)


render(o1)

