//Hydravisuals 

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
await loadScript("osc.min.js")
await loadScript("images.js")


// render black
solid(0)
	.out(o0)
// //render code
// src(s2)
// 	.out(o0);
render(o0)

// /config
setResolution(1436,844)
a.show()
a.setBins(4)
a.setCutoff(4)
a.setScale(2)


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
t = 4;
f = 0;
xs = 50
margin = 100;
// a.onBeat = () => {
// 	b += 1;
// 	xs = Math.round((Math.random() * 1000));
// }


// synth0 - ascii art
s0.initScreen();
src(s0).scrollX(0.3,0.1).modulateRepeatX(osc(1), 1, ({time}) => Math.sin(time) * 1).out(o0);

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

p.draw = () => {
	f++;
	if (f > 100) {
		f = 0;
		b += 1;
	}
	//   console.log(b)
	p.background(0);
	p.normalMaterial();
	p.push();
  	p.translate(-0, 0, -500);
	p.rotateZ(1 + f / 1000);
	p.rotateX(1 + f / 1000);
	// 	p.rotateX(p.frameCount * 0.01);
	// 	p.rotateY(p.frameCount * 0.01);
	p.push();
  	p.translate(-(t * (xs+margin)) / 2, -(t * (xs+margin)) / 2, -(t * (xs+margin)) / 2);
	for (var x = 0; x < t; x++) {
		p.push();
		for (var y = 0; y < t; y++) {
			p.push();
			for (var z = 0; z < t; z++) {
				p.push();
				p.translate(x * (xs + margin), y * (xs + margin), z * (xs + margin));
				p.box(xs, xs, xs);
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
    case 'preset':
      preset =  m.args[1];
      subpreset = m.args[2];
      console.log("setting preset", preset);	
      if (preset == "out1") {
        if (subpreset == 1) {
			src(s0).scrollX(0.3,0.1).modulateRepeatX(osc(1), 1, ({time}) => Math.sin(time) * 1).out(o0);
        } else if (subpreset == 2) {
        	src(s0).posterize(()=> a.fft[0]*32, 1).blend(src(s1)).out(o0);
        } else {
          src(s0).out(o0);
		}
      	render(o0);
      } else if (preset == "out2") {
        if (subpreset == 1) {
			src(s1).color(0,1,0).out(o1);
       } else if (subpreset == 2) {
			src(s1).blend(src(s1).pixelate(()=> a.fft[0]*32, 20)).out(o1)
        } else {
			src(s1).out(o1)
        }
      	render(o1);
      } else if (preset == "out3") {
        if (subpreset == 1) {
			osc(5, 0.9, 0.001)
              .kaleid(() => shapesize)
              .color(0.8, 0.7)
              .colorama(0.1).rotate(0.9,()=>Math.sin(time)* -0.001)
              .modulateRotate(o0,()=>Math.sin(time) * 0.03)
              .modulate(src(s0), ()=> a.fft[3] *10)
              .scale(0.9)
              .out(o2)
          src(s0).kaleid(() => shapesize).color(0.8, 0.7).colorama(0.1).rotate(0.2,()=>Math.sin(time)* -0.001).modulateRotate(o0,()=>Math.sin(time) * 0.03).modulate(src(s0), ()=> a.fft[3] *10).scale(0.9).out(o2)   
        } else if (subpreset == 2) {
        	src(s2).blend(solid(0,1,0)).blend(src(s0)).out(o2);
        } else {
          src(s2).blend(src(s0)).out(o2);
		}
        render(o2);
      } else if (preset == "out4") {
        if (subpreset == 1) {
			osc(() => (a.fft[1]*0)+2).modulate(src(s1),1).color(1,0.2,0.3).out(o3)
        } else if (subpreset == 2) {
        	src(o1).blend(o2).out(o2);
        } else {
          	src(s3).out(o0);
		}
        render(o3);
      } else if (preset == "all") {
        render();
      } else if (preset == "code"){
        render(o3);
        if (subpreset == 1) {
       		color(-1, 4).out(o3);
        } else if  (subpreset == 1) {
        	src(s3).blend(src(s1)).out(o2);
        }
      }
      
      
    break;
    default:
      console.log(m)
  }

})




render(o2);





