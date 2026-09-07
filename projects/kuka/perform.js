// P5 + hydracode, run in local p5live server

let libs = [
	'includes/libs/hydra-synth.js',
	'includes/libs/hy5.js',
	"performjs/globals.js",
	"performjs/midifunctions.js",
	"performjs/p5functions.js",
	"performjs/P5setup.js",
	"performjs/P5cubes.js",
	"performjs/P5images.js",
	"performjs/P5videos.js",
	"performjs/P5lines.js",
	"performjs/P5rects.js",
	"performjs/P5textparticles.js",
	"performjs/hydrafunctions.js",
]

function preload() {
	font = loadFont('/includes/fonts/PressStart2P-Regular.otf', fontisloaded);

}


///when setting up midi do not use sdame midiobject twice, it cancels callback!@@

function setup() {
	// loginfo("setting up canvas " + window.innerWidth + ", " + window.innerHeight)
	// console.log(ww, wh)
	createCanvas(ww, wh, WEBGL)
	textFont(font);
	textSize(36);
	background(25)
	p5buffer = createGraphics(ww, wh, WEBGL) //s2
	configP5(p5buffer)
	initCubes(p5buffer) //channel 2
	createCubes(p5buffer)
	initRects(p5buffer) // channel 3
	initLines(p5buffer) //channel 4
	initTextParts(p5buffer, font) // channel 5
	initImages(p5buffer) //channel  6
	initVideos(p5buffer) //channel 7
	setupMidi(0, 0, false, "tidal")
	initMidi(p5buffer, tidal)
	// sandbox - start
	H.pixelDensity(1) // 2x = retina, set <= 1 if laggy
	// setResolution(1920, 1080)
	// H.audio()
	setResolution(720, 576)
	// P5.toggle(1) 
	H.toggle(1)
	// sandbox - end
	P5.init(s2, p5buffer)
	s0.initScreen()  // code
	s1.initCam()  // cam
}




// // sandbox - start
a.show() 
// s3.initCam()
// src(s1).out(o2)
render(o3)
// imageonly()
osc(() => a.fft[0] * 6).modulate(src(s0), 10).blend(src(s0)).out()
// // sandbox - stop




// src(s0).add(src(s1)).add(src(s2)).add(src(s3)).out()
src(s1).out()
//src(o1).diff(src(s0),()=> 0.2 + p5.p1)



function draw() {

	renderP5buffer(p5buffer)

} 