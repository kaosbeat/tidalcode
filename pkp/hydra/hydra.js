//Hydravisuals 

await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
// await loadScript("osc.min.js")
await loadScript("images.js")
cyborg = []

// render black
solid(0).out(o0)
// //render code
src(s1).out(o0);
render(o0)

// /config
setResolution(1436,844)
a.show()
a.setBins(4)
a.setCutoff(4)
a.setScale(5)
a.beat.threshold= 10

//OSC connectors
_osc = new OSC()
_osc.open()
_osc.on("*", (m) => { console.log(m.address, m.args)})


// vars
hue = 0
img = cyborg
seed = 16777215
shp = 5
shapesize = 5
b = 0;
cubesize = 8 ;

xs = 30;
margin = 100;
speed = 0;
value = 100;
par = "speed";
a.onBeat = () => {
  	f = 30;
	b += 1;
	xs = Math.round((Math.random() * 100)) + 20;
  	ys = Math.round((Math.random() * 100)) + 20;
  	zs = Math.round((Math.random() * 100)) + 20;
  
}




// synth0 - ascii art
s0.initScreen();
src(s0).out(o0);

// synth1 - tidalcode
s1.initScreen();
src(s1).out(o1);

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

function createCubes(cubesize) {
	p.cubes = [];
  	for (var i = 0; i < cubesize; i++) {
    	let cube = {"x":Math.random(1000), 
                    "y":Math.random(1000), 
                    "z":Math.random(1000),
                    "xs":Math.random(100), 
                    "ys":Math.random(100), 
                    "zs":Math.random(100)
		}
		p.cubes.push(cube);
    }
	console.log(p.cubes);
}


p.draw = () => {
	f--;
	if (f < 0) {
		f = 30;
		b += 1;
      	createCubes(10)
	}
	//   console.log(b)
	p.background(0);
	p.normalMaterial();
	p.push();
  	p.translate(-0, 0, -500);
	p.rotateZ(1 + f / 10000);
	p.rotateX(1 + f / 10000);
  	p.rotateY(b)
	// 	p.rotateX(p.frameCount * 0.01);
	// 	p.rotateY(p.frameCount * 0.01);
	p.push();
  	p.translate(-(t * (xs+margin)) / 2, -(t * (xs+margin)) / 2, -(t * (xs+margin)) / 2);
	for (var x = 0; x < cubesize; x++) {
		p.push();
		for (var y = 0; y < cubesize; y++) {
			p.push();
			for (var z = 0; z < cubesize; z++) {
				p.push();
				p.translate(x * (xs + margin), y * (xs + margin), z * (xs + margin));
				p.box(xs+f, ys+f, zs+f);
				p.pop();
			}
			p.pop();
		}
		p.pop();
	}
	p.pop();
  p.pop();
}



_osc.on("/hue", (m) => {
  //console.log(m)
  hue = m.args[0]/255
  shp = Math.floor(Math.random()*5)+3
})

_osc.on("/hydra", (m) => {
  hycmd = m.args[0]
  switch (hycmd){
    case 'imgset':
      imgset =  m.args[1];
//       console.log("setting set: ",imgset);
      if (imgset == "cyborg") { img = cyborg; }
      else if (imgset == "masks") { img = masks; }
      else if (imgset == "frau") { img = frau; }
      else { img = dflt; }
      break;
    case 'newimg':
  	  index =  Math.floor((Math.abs(Math.sin(m.args[2]) * seed)))%img.length;
      curimg = "img/" + img[index];
  	  s2.initImage(curimg);
      break;
    case 'shape':
      console.log(m);
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
      par = m.args[1];
      value = m.args[2];
      if (par == "cubesize") {
      	cubesize = int(value * 10)
      }
      break;
    case 'preset':
      preset =  m.args[1];
      subpreset = m.args[2];
      console.log("setting preset", preset);	
      if (preset == "out1") {
        if (subpreset == 1) {
              src(s0).blend(src(s1), 0.8).saturate([0,10]).out(o0)        	
        } else if (subpreset == 2) {
			src(s0).scrollX(0.3,0.1).modulateRepeatX(osc(1), 1, ({time}) => Math.sin(time) * 1).blend(src(s1), 0.8).out(o0);
        } else if (subpreset == 3) {
        	src(s0).posterize(()=> (2 + a.fft[0]*32), 1).blend(src(s1)).out(o0);
        } else if (subpreset ==4) {
          src(s1).kaleid(() => shapesize).colorama(1).rotate(0.001,()=>a.fft[0]*0.000001).modulateRotate(o0,()=>Math.sin(time) * 0.0003).modulate(src(s0), ()=> a.fft[3] *1).scale(2).blend(src(s0)).out(o0)   
          
        } else {
          src(s0).out(o0);
		    }
      	render(o0);
      } else if (preset == "out2") {
        if (subpreset == 1) {
			src(s1).color(0,1,0).out(o1);
       } else if (subpreset == 2) {
			src(s1).blend(src(s1).pixelate(()=> a.fft[0]*32, 20)).out(o1)
       } else if (subpreset == 3) {
			src(s1).add(src(s1).pixelate(()=> a.fft[0]*32, 20)).out(o1)
        } else {
			src(s1).out(o1)
        }
      	render(o1);
      
      } else if (preset == "out3") {
        if (subpreset == 1) {

        } else if (subpreset == 2) {
        	src(s2).blend(solid(0,1,0)).blend(src(s0)).blend(src(s1)).out(o2);
        } else {
          src(s2).blend(src(s0)).out(o2);
		}
        render(o2);
      } else if (preset == "out4") {
        if (subpreset == 1) {
			osc(() => (a.fft[1]*0)+2).modulate(src(s1),1).color(1,0.2,0.3).add(src(s3)).out(o3)
        } else if (subpreset == 2) {
        	src(s3).pixelate(() => a.fft[0]*1000).blend(o2).out(o3);
        } else {
          	src(s3).out(o3);
		}
        render(o3);
      } else if (preset == "all") {
        render();
      } else if (preset == "strobe") {
        solid(1,1,1).diff(src(s1)).invert([0,1]).out(o0)
        speed = subpreset;
        render(o0);
      } else if (preset == "code"){
        render(o1);
        if (subpreset == 1) {
       		noise(10,0.1*(() => a.fft[3])).color(-1, 4).blend(src(s1),0.9).out(o1);
        } else if  (subpreset == 1) {
        	src(s3).blend(src(s1)).out(o2);
        }
      }
    break;
    default:
      console.log(m)
  }

})




render();




