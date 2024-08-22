//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
await loadScript("osc.min.js")
await loadScript("images.js")



// render black
solid(0)
	.out(o0)
// //render code
src(s1)
	.out(o0);
render(o0)
debug = false;

// /config
rw = 1436
rh = 844
setResolution(rw, rh)
a.show()
a.setBins(4)
a.setCutoff(4)
a.setScale(5)
a.beat.threshold = 10

//OSC connectors
_osc = new OSC()
_osc.open()
_osc.on("*", (m) => {
	console.log(m.address, m.args)
})


// vars
hue = 0
img = cyborg
seed = 16777215
shp = 5
shapesize = 5
b = 0;
cubesize = 8;

xs = 30;
margin = 100;
speed = 0;
value = 100;
par = "speed";
a.onBeat = () => {
	b += 1;
}




// synth0 - ascii art
s0.initScreen();
src(s0)
	.out(o0);

// synth1 - tidalcode
s1.initScreen();
src(s1)
	.out(o1);

// synth2 - images
s2.initImage("img/" + img[0]);
src(s2).out(o2);

// synth3 - processing
p = new P5({
	mode: "WEBGL"
})

p.hide()

s3.init({
	src: p.canvas


})

src(s3).out(o3);
p.cubes = [];
p.lines = [];
p.render = "cubes"

await loadScript("extraP5.js") // loads extra p5 functions


// p.draw = () => {}
f = 0
p.draw = () => {
	f++;
	p.background(0);
	p.push();
	p.rotateX(p.frameCount * p.viewportconf.rotSpeedX );
	p.rotateY(p.frameCount * p.viewportconf.rotSpeedY );
	p.rotateZ(p.frameCount * p.viewportconf.rotSpeedZ );
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



_osc.on("/hue", (m) => {
	hue = m.args[0] / 255
	shp = Math.floor(Math.random() * 5) + 3
})

_osc.on("/hydra", (m) => {
	hycmd = m.args[0]
	switch (hycmd) {
		case 'imgset':
			imgset = m.args[1];
			if (imgset == "cyborg") {
				img = cyborg;
			} else if (imgset == "masks") {
				img = masks;
			} else if (imgset == "frau") {
				img = frau;
			} else {
				img = dflt;
			}
			break;
		case 'newimg':
			index = Math.floor((Math.abs(Math.sin(m.args[2]) * seed))) % img.length;
			curimg = "img/" + img[index];
			s2.initImage(curimg);
			break;
		case 'shape':
// 			console.log(m);
			shapesize = m.args[2]
			break;
		case 'conf':
			//       console.log(m);
			par = m.args[1];
			value = m.args[2];
			if (par == "speed") {
				speed = value
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
        	if (cmd == "rotSpeedX"){ p.viewportconf.rotSpeedX = val1 }
        	if (cmd == "rotSpeedY"){ p.viewportconf.rotSpeedY = val1 }
        	if (cmd == "rotSpeedZ"){ p.viewportconf.rotSpeedZ = val1 }
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
		case 'preset':
			preset = m.args[1];
			subpreset = m.args[2];
			console.log("setting preset", preset);
			if (preset == "out1") {
				if (subpreset == 1) {
					src(s0)
						.blend(src(s1), 0.8)
						.saturate([0, 10])
						.out(o0)
				} else if (subpreset == 2) {
					src(s0)
						.scrollX(0.3, 0.1)
						.modulateRepeatX(osc(1), 1, ({
							time
						}) => Math.sin(time) * 1)
						.blend(src(s1), 0.8)
						.out(o0);
				} else if (subpreset == 3) {
					src(s0)
						.posterize(() => (2 + a.fft[0] * 32), 1)
						.blend(src(s1))
						.out(o0);
				} else if (subpreset == 4) {
					src(s1)
						.kaleid(() => shapesize)
						.colorama(1)
						.rotate(0.001, () => a.fft[0] * 0.000001)
						.modulateRotate(o0, () => Math.sin(time) * 0.0003)
						.modulate(src(s0), () => a.fft[3] * 1)
						.scale(2)
						.blend(src(s0))
						.out(o0)
				} else {
					src(s0)
						.out(o0);
				}
				render(o0);
			} else if (preset == "out2") {
				if (subpreset == 1) {
					src(s1)
						.color(0, 1, 0)
						.out(o1);
				} else if (subpreset == 2) {
					src(s1)
						.blend(src(s1)
							.pixelate(() => a.fft[0] * 32, 20))
						.out(o1)
				} else if (subpreset == 3) {
					src(s1)
						.add(src(s1)
							.pixelate(() => a.fft[0] * 32, 20))
						.out(o1)
				} else {
					src(s1)
						.out(o1)
				}
				render(o1);

			} else if (preset == "out3") {
				if (subpreset == 1) {
						src(s2).blend(src(s0)).out(o2);
				} else if (subpreset == 2) {
					src(s2)
						.blend(solid(0, 1, 0))
						.blend(src(s0))
						.blend(src(s1))
						.out(o2);
				} else {
					src(s2)
						.blend(src(s0))
						.out(o2);
				}
				render(o2);
			} else if (preset == "out4") {
				if (subpreset == 1) {
					osc(() => (a.fft[1] * 0) + 2)
						.modulate(src(s1), 1)
						.color(1, 0.2, 0.3)
						.add(src(s3))
						.out(o3)
				} else if (subpreset == 2) {
					src(s3)
						.pixelate(() => a.fft[0] * 100, 1000)
						.blend(o2)
						.out(o3);
				} else {
					src(s3).out(o3);
				}
				render(o3);
			} else if (preset == "all") {
				render();
			} else if (preset == "strobe") {
				solid(1, 1, 1)
					.diff(src(s1))
					.invert([0, 1])
					.out(o0)
				speed = subpreset;
				render(o0);
			} else if (preset == "code") {
				render(o1);
				if (subpreset == 1) {
					noise(10, 0.1 * (() => a.fft[3]))
						.color(-1, 4)
						.blend(src(s1), 0.9)
						.out(o1);
				} else if (subpreset == 1) {
					src(s3)
						.blend(src(s1))
						.out(o2);
				}
			}
			break;
		default:
			console.log(m)
	}

})




render();