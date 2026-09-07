// {"P5LIVE":{"name":"enta","mod":1773785558383}} 

let vid;
let vid1;
let vid2;
let vid1s = 0
let vid1d = 40
let vid2s = 3
let vid2d = 10
let vids = [[0,40],[3,10],[6,80]]
let playing = false;
let completion;
let idx=0

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
		]



let hc = document.createElement('canvas')
hc.width = window.innerWidth
hc.height = window.innerHeight
// hc.width=2560/2
// hc.height=1024/2
document.body.appendChild(hc)
let hydra = new Hydra({ detectAudio: true, canvas: hc })
// hydra.setResolution(window.innerWidth*2, window.innerHeight*2) // retina res
noize = noise // use noize() since noise() is taken by p5js
a.show()

let pg // store hydra texture
// sandbox - start
// a.show()
src(s0)
	// .kaleid(4)
	// .diff(src(s0))
	// .scale(()=>a.fft[0]*0+.996)
	// .modulateScale(src(s0).pixelate(()=>Math.round((a.fft[2]*15))+1, 10), .5)
	// .scrollY(1.03)
	// .rotate( ()=>sin(frameCount*.01)*.1 ) // use p5 vars!
	// .modulateScale(osc(5, .1), .56)
	// .blend(src(o0).scale(0.8))
	.out(o0)
	
	

// sandbox - stop

function preload() {
		font = loadFont('/includes/fonts/PressStart2P-Regular.otf', fontisloaded);
}


			            
			          


function setup() {
  createCanvas(2560, 1024, WEBGL);
  setupMidi(1, 0)
  
  pg = createGraphics(hc.width, hc.height)
  s0.init({src: drawingContext.canvas })
  //midi5.debug = ['note', 'controlchange'] 
  vid1 = createVideo("vid/hand1.mp4", VIDEO);
  //vid = createVideo("img/hand.mp4");
  vid1.size(1080, 1080);
  vid1.hide()
  vid1.play();
  vid1.volume(0);
  
  vid2 = createVideo("img/allhands.mp4", VIDEO);
  //vid = createVideo("vid/hand2.mp4");
  vid2.size(1080, 1080);
  vid2.hide()
  vid2.play();
  vid2.volume(0);
  
	vid = 1;
  //handPose.detectStart(vid, gotHands);
  
  
  	// set custom functions
	midi5.noteOn = (note) => {
		print(note)
		// fill(note.velocity)
		// noStroke()
		// circle(random(width), random(height), note.number * note.octave)
		if (note.type=="noteon"){
			if (note.number == 42) {vid.play(); vid.time(0); }
			if (note.number == 43) {vid.play(); vid.time(2); }
			if (note.number == 44) {vid.play(); vid.time(5 ); }
		} 
		// 
	}
	midi5.noteOff = (note) => {
			vid.pause(); 
		}
	
}



function draw() {
	updateMidi()
	// pg.drawingContext.drawImage(hc, 0, 0, pg.width, pg.height)
  //background(vid.volume()*255);
  //console.log()
  //if (frameCount % 40 == 0) {
  //   vid.pause();
  //}
 // if (frameCount % vids[idx][1] == 0) {
 // 	frameCount = 0
	// vid.time(vids[idx][0]);
	
 // }
  //ellipse((vid.time()/vid.duration())*width,
  //  50, 20, 20);
   push()
   scale(1)
  translate(-540,-540)
	if (vid == 1) {
	image(vid1,0,0)
	}
	if (vid == 2) {
	image(vid2,0,0)
	}
   pop()
   


}
	

/* 
P5LIVE - Midi
If using outside P5LIVE, include p5live-midi.js 
https://cdn.jsdelivr.net/gh/ffd8/P5LIVE/includes/utils/p5live-midi.js
*/