//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
// await loadScript("osc.min.js")
await loadScript("extra/data.js")



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


// vars
hue = 0
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
// s0.initScreen();
src(solid(244,34,123))
	.out(o0);

// synth1 - tidalcode
// s1.initScreen();
// src(s1)
src(solid(244,255,0))
	.out(o1);

// synth2 - images
// s2.initImage("img/" + img[0]);
src(s2).out(o2);

// synth3 - processing
p = new P5({
	mode: "WEBGL"
})

p.hide()

s3.init({
	src: p.canvas
})
p.myFont = p.loadFont('extra/PressStart2P-Regular.otf');
p.textFont(p.myFont);
p.particles = [];


await loadScript("extra/P5wintercircus.js") // loads extra p5 functions

// p.preload = () => {
  
// }

// p.setup = () => {
//  console.log(p.myFont)
// }


// p.draw = () => {}
f = 0
p.draw = () => {
  	
 	p.background(0);
  	
  	if (p.particles.length < 50){
    // Add new particles
      for (let i = 0; i < 2; i++) {
        f++;
        let x = width;
        let y = (f%50)*36;
        let z = 0-(f%50)*y/144;
        if (f%50 < 25) {
        	z = (f%50)*36;
        }
        let txt = techTerms[Math.floor(Math.random() * techTerms.length)];
        let part = new Particle(x, y, z, txt, p);
        p.particles.push(part);
      }
    }
  	p.textSize(36);
	p.push();
    for (var i = 0; i < techTerms.length; i++) {
//       p.text(techTerms[i], 10, 20*i);
	}
// 	p.rotateX(p.frameCount * 0.1 );
//   	p.translate(0,p.frameCount%height )
// 	p.rotateY(p.frameCount * 0.01 );
// 	p.rotateZ(p.frameCount * 0.031 );
// 	p.box(300)
//     p.fill('#ED225D');
  p.translate(-width/2, -height -100 )
  	drawParticles(p.particles)
//   	
//   	p.text('DMG - museumnacht', 10, 50);
  	p.pop();
}


src(s3)
// .mult(osc(1, -0.1).modulate(osc(2).rotate(()=> 4,1), 20))
// .luma(1,0.1, (6, ()=> 1 + a.fft[3]))
// .scale(0.7, ()=> 0.7 + a.fft[3])
.color(1.04,0, -1.1).pixelate(200, 20).modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time))
.blend(s3)
.out(o3);



render(o3);


