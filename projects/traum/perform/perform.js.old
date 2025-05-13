// P5 + hydracode, run in local p5live server

let libs = [
	'includes/libs/hydra-synth.js',
	'includes/libs/hy5.js',
	"performjs/globals.js",
	"performjs/midifunctions.js",
	"performjs/p5functions.js",
	"performjs/P5setup.js",
	"performjs/P5cubes.js",
	"performjs/P5lines.js",
	"performjs/P5rects.js",
	"performjs/P5textparticles.js",
	"performjs/metadatafunctions.js",
	"performjs/hydrafunctions.js",
// 	"performjs/sql.js",
// 	"performjs/database.js",
]

// let debugIn, devqbugOut

// Load the JSON and create an object.
function preload() {
	// console.log("loading performancedata")
	// db = initDB("performjs", "performdata.json")
	// db = initDB()
	font = loadFont('/includes/fonts/PressStart2P-Regular.otf', fontisloaded);
	// obj = loadModel('/dmgdata/comfy3Dout/LID_test.obj', true)
	// obj3Ddataset[0] = obj
	// textr = loadImage('/dmgdata/comfy3Dout/LID_test.obj.tex.png')
	// objtexdataset[0] = textr
	// img = loadImage("/dmgdata/performsets/LID_GF_0943_0-2_GIDImg_0.png")
	// imgdataset[0] = img
	// console.log(imgdataset)

}


///when setting up midi do not use sdame midiobject twice, it cancels callback!@@

function setup() {
	// loginfo("setting up canvas " + window.innerWidth + ", " + window.innerHeight)
	// console.log(ww, wh)
	createCanvas(ww, wh, WEBGL)
	textFont(font);
	textSize(36);
	background(25)
	// imgbuffer = createGraphics(ww, wh) // s0
	// obj3Dbuffer = createGraphics(ww, wh, WEBGL) // s1
	// p5buffer = obj3Dbuffer
	p5buffer = createGraphics(ww,wh,WEBGL) //s2
	configP5(p5buffer)
	initCubes(p5buffer)
	createCubes(p5buffer) 
	initTextParts(p5buffer, font)
	initLines(p5buffer)
	initRects(p5buffer)
	// setupMidi(0, 0, false, "tidal")
	// initMidi(p5buffer, tidal)
	// metadatabuffer = createGraphics(ww, wh) // s3
	// metadatabuffer.textFont(font);
	// sandbox - start
	H.pixelDensity(1) // 2x = retina, set <= 1 if laggy
	// setResolution(1920, 1080)
	// H.audio()
	// setResolution(720,576)
	// P5.toggle(1) 
	H.toggle(1)
	// sandbox - end
	// P5.init(s0, imgbuffer)
	// P5.init(s1, obj3Dbuffer)
	P5.init(s2, p5buffer)
	// s2.initCam() // code
	// P5.init(s3, metadatabuffer)





	// // debug
	// debugA = createElement('textarea')
	// debugBox(debugA, 'data', 10, 0, width / 3, 50)
	// debugB = createElement('textarea')
	// debugBox(debugB, 'data out', 2* width / 3, 0, width / 3-25, 50)

}




// // sandbox - start
// a.show()
// src(s1).out(o2)
render()
// imageonly()
osc(() => a.fft[0]*6).modulate(src(s0), 10).blend(src(s0)).out()
// // sandbox - stop




// src(s0).add(src(s1)).add(src(s2)).add(src(s3)).out()

src(s2).out()



function draw() {
	background(2)
	p5buffer.background(255)
	createCubes(p5buffer)
	// image(metadatabuffer, -width/2 + width/4,-height/2, width, height)
	// texture(imgbuffer)
	// plane(ww,wh) // fill screen w/ texture
	// renderImgbuffer(imgbuffer)
	renderP5buffer(p5buffer)
	// render3DBuffer(obj3Dbuffer)
	// fxpipe[0]()
	// push()
	// translate(0,0,0)
	// drawMetadata(metadatabuffer)
	// pop()
}