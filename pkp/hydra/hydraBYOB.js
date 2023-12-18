//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
await loadScript("osc.min.js")

mididata = {  "m0":{"n":0, "v":0}}

// /config
rw = 960
rh = 540
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
s0.initScreen()
code = s0
src(code)
	p.background(0);
	p.push();
	p.rotateX(p.frameCount * p.viewportconf.rotSpeedX);
	p.rotateY(p).out(o0);

// synth1 - andrew code
// s1.initStream("andrew")
// s1.initScreen()

// src(s1).out(o1);

// synth2 - kaos tidal
s2.initScreen()
src(s2).out(o2);

// synth3 - processing
p = new P5({
	mode: "WEBGL"
})

p.hide()

s3.init({
	src: p.canvas
})
src(s3)
	.out(o3);

p.cubes = [];
p.lines = [];
p.render = "cubes"

await loadScript("extraP5.js") // loads extra p5 functions
createCubes(4, 100, 10)
render()

// p.draw = () => {}
f = 0
p.draw = () => {
	f++;
	p.background(0);
	p.push();
	p.rotateX(p.frameCount * p.viewportconf.rotSpeedX);
	p.rotateY(p.frameCount * p.viewportconf.rotSpeedY);
	p.rotateZ(p.frameCount * p.viewportconf.rotSpeedZ);
	if (p.render == "cubes") {
		updateCubes();
		renderCubes();
	}
	if (p.render == "lines") {
		updateLines();
		renderLines();
	}
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

//// osc code


_osc.on("/hydra", (m) => {
	hycmd = m.args[0]
	switch (hycmd) {
		case 'reload':
			loadScript("extraHydra.js") 
			loadScript("extraP5.js")
			break;
		case 'conf':
			//       console.log(m);
			par = m.args[1];
			value = m.args[2];
			if (par == "speed") {
				speed = value
			}
			if (par == "p1") {
				p1 = value
			}
			if (par == "p2") {
				p2 = value
			}
			if (par == "p2") {
				p2 = value
			}
			break;
		case 'p5':
			//       console.log(m);
			cmd = m.args[1];
			val1 = m.args[2];
			val2 = m.args[3];
			if (cmd == "render") {
				if (val1 == "0") {
					p.render = "cubes"
				} else if (val1 == "1") {
					p.render = "lines"
				}
			}
			if (cmd == "rotSpeedX") {
				p.viewportconf.rotSpeedX = val1
			}
			if (cmd == "rotSpeedY") {
				p.viewportconf.rotSpeedY = val1
			}
			if (cmd == "rotSpeedZ") {
				p.viewportconf.rotSpeedZ = val1
			}
			if (cmd == "gencubes") {
				let cubesize = Math.floor(val1 * 10)
				let cubescale = Math.floor(val2 * 100)
				createCubes(cubesize, cubescale, cubescale / 10)
			}
			if (cmd == "cubegeom") {
				if (val1 == "0") {
					p.cubesconfig.mode = "geom"
				} else if (val1 == "1") {
					p.cubesconfig.mode = "random"
				} else {
					p.cubesconfig.mode = "geom"
				}
			}
			if (cmd == "cubedecay") {
				p.cubesconfig.decay = val1
			}
			if (cmd == "cubefreq") {
				p.cubesconfig.freq = val1
			}
			if (cmd == "cubeseed") {
				p.cubesconfig.seed = val1
				p.cubesconfig.savedseed = val1
			}
			if (cmd == "cubestroke") {
				p.cubesconfig.strokeweight = val1
			}
			if (cmd == "cubefill") {
				if (val1 == "0") {
					p.cubesconfig.fill = "normal"
				} else if (val1 == "1") {
					p.cubesconfig.fill = "solid"
				} else if (val1 == "2") {
					p.cubesconfig.fill = "none"
				}
			}
			if (cmd == "genlines") {
				createLines(10, 10, 844, 100, 20)
				//               createLines(lines, min, max, size, margin) 
			}
			break;
		case 'coder':
			coder = m.args[1];
			if (coder == "dago") {
				code = s0;
			} else if (coder == "andrew") {
				code = s1;
			} else if (coder == "kasper" || coder == "kaotec") {
				code = s2;
			} else {
				code = s3;
			}
			break;
		case 'preset':
			preset = m.args[1];
			subpreset = m.args[2];
			console.log("setting preset", subpreset);
			if (preset == "code") {
				if (subpreset == 0) {
					src(code)
						.out(o0)
				}
				if (subpreset == 1) {
					set1();
				} else if (subpreset == 2) {
					set2();
				} else if (subpreset == 3) {
					set3();
				} else if (subpreset == 4) {
					set4();
				} else if (subpreset == 5) {
					set5();
				} else if (subpreset == 6) {
					set6();
				} else if (subpreset == 7) {
					set7();
				} else if (subpreset == 8) {
					set8();
				} else if (subpreset == 9) {
					set9();
				} else if (subpreset == 10) {
					set10();
				} else if (subpreset == 11) {
					set11();
				} else if (subpreset == 12) {
					set12();
				} else if (subpreset == 13) {
					set13();
				} else if (subpreset == 14) {
					set14();
				}
				render(o0);
			} else if (preset == "all") {
				render();
			} else if (preset == "strobe") {
				solid(1, 1, 1)
					.diff(src(code))
					.invert([0, 1])
					.out(o1)
				speed = subpreset;
				render(o1);
			} else if (preset == "black") {
				solid(0)
					.out(o0)
				render(o0);
			}
			break;
		default:
			// 			console.log(m)
	}
})




src(s0).modulate(src(s3),()=>a.fft[0]).blend(s2).out(o2)

src(s0).blend(s3,0.4).blend(src(s0).modulate(src(s3),10),0.8).blend(s2).out(o2)


render(o2)
