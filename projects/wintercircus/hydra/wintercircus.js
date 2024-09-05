//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
// await loadScript("osc.min.js")


//midi config
await loadScript("miditest.js")
await midi.start({ channel: '*', input: '*' })
tidal = midi.input(0) // live code data
op1 = tidal // (no controller)
onc = midi.input(3) // modular data
midi.show()

// render black
solid(0)
	.out(o0)
// //render code
src(s1)
	.out(o0);
render(o0)
debug = false;

// /config
rw = 1920
rh = 1080
setResolution(rw, rh)

a.show()

a.setBins(4)
a.setCutoff(4)
a.setScale(5)
a.beat.threshold = 10


// // vars
// hue = 0
// seed = 16777215
// shp = 5
// shapesize = 5
// b = 0;
// cubesize = 8;

// xs = 30;
// margin = 100;
// speed = 0;
// value = 100;
// par = "speed";
// a.onBeat = () => {
// 	b += 1;
// }




// synth0 - ascii art
// s0.initScreen();
solid(244,34,123)
	.out(o0);
render()

// synth1 - tidalcode
// s1.initScreen();
// src(s1)
(244,255,0)
	.out(o1);

// synth2 - images
// s2.initImage("img/" + img[0]);
src(s2).out(o2);

// // synth3 - processing
p = new P5({
	height: rw, 
	width: rh, 
	mode: "WEBGL"
})

s3.init({
	src: p.canvas
})

p.hide()


// await loadScript("hydra/P5wintercircus.js") // loads p5 helpper functions
// await loadScript("hydra/P5cubes.js") // loads cubes 
// await loadScript("hydra/images.js") // loads images data
// await loadScript("hydra/P5images.js") // loads images
// await loadScript("hydra/P5lines.js") // loads images
// await loadScript("hydra/P5rects.js") // loads rects	
// await loadScript("hydra/data.js") // loads text data
// await loadScript("hydra/P5textparticles.js") // loads text particles
// await loadScript("hydra/extraHydra.js") // loads hydrapresets
// await loadScript("hydra/extraMidi.js") // loads midi




// p.preload = () => {
  
// }

// p.setup = () => {
//  console.log(p.myFont)
// }


configP5(p)
createCubes(p)
// initImgs(p)
// preloadImg(p,maskssmall)
// initRects(p)
// initLines(p)
// initTextParts(p)
// initMidi(p)

// p.draw = () => {}
// f = 0
p.draw = () => {
	p.background(0);
	p.push();
		updateViewport (p);
		updateCam(p);
		// updateParticles(p)
		// drawParticles(p)
		updateCubes(p);
		renderCubes(p);
		// updateLines(p);
		// renderLines(p)
		// updateImgs(p);
		// renderImgs(p);
		// updateRects(p);
		// renderRects(p);
  	p.pop();
}


// src(o2)
// // .mult(osc(1, -0.1).modulate(osc(2).rotate(()=> 4,1), 20))
// // .luma(1,0.1, (6, ()=> 1 + a.fft[3]))
// // .scale(0.7, ()=> 0.7 + a.fft[3])
// .color(1.04,0, -1.1).pixelate(200, 20).modulate(noise(() => a.fft[3]*2.5), () => 1.5 * Math.sin(0.08 * time))
// // .blend(s3, () => p.oncdata4/127)
// .blend(o2, 0.4)
// .kaleid(5)
// .out(o3);



// shape(2,0.1,0.1)
// //   .scale(() => Math.sin(time)*a.fft[0]*40)
// //   .repeat(() => Math.sin(time)*10)
// //   .repeat(() => 100)
//   .modulateRotate(o2)
//   .scale(() => p.oncdata1/127 + 0.1)
// //   .modulate(noise(2,({time}) => Math.sin(time*0.05)*0.05 ))
// //   .rotate(() => p.oncdata4/127 + 100, 0.9)
// //   .scrollY(0, ({time}) => Math.sin(time*0.05)*0.05 )
// .out(o0)

// src(o0)
// .modulate(osc(5,0,0))
// // .modulateRepeatX(osc(10), 5.0, ({time}) => Math.sin(time) * 5)
// // .modulateRepeatX(osc(12), 500.0, ({time}) => Math.sin(time) * 5)
// .out(o1)

// src(o1)
// // .modulateKaleid(voronoi(() => Math.sin(time)*3,	0.1,0.01),() => Math.sin(time)*3)
// .scale(() => Math.sin(time)*30)
// .out(o2)


// shape(20,0.1,0.01)
//   .scale(() => Math.sin(time)*2)
//   .modulate(noise(2,0))
// .out(o0)

// render(o2)

// src(o0)
// .blend(o2, () => p.oncdata4/255 - 0.1)
// .out(o3)



render(o3);	

render();
