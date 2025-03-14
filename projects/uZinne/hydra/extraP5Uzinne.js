h
/////////////
/// images //
/////////////


// index = Math.floor((Math.abs(Math.sin(m.args[2]) * seed))) % img.length;
// curimg = "img/" + img[index];

p.imgconfig ={

  "render": true,
  "curImg": {},
  "seed": 0,
  "mode": "cube" //  cube, center
}

function preloadImg(img) { 
  img.forEach(im => {
    let imobj = p.loadImage("img/" + im);
    p.imgs.push(imobj) 
  });
  p.imgconfig.curImg = p.imgs[2]
} 

function updateImgs(){
  p.imgconfig.curImg =  p.imgs[p.imgconfig.seed % p.imgs.length]; 
}


function renderImgs() {
  if (p.imgconfig.render) {
    if (p.imgconfig.mode == "cube") {
      p.texture(p.imgconfig.curImg)
      p.box( 256 + 512 * a.fft[0])
    }
    if (p.imgconfig.mode == "center") {
    p.image(p.imgconfig.curImg, -p.imgconfig.curImg.width/2, -p.imgconfig.curImg.height/2, p.imgconfig.curImg.width, p.imgconfig.curImg.width)
    }
  }
  // aallelua = 1;
}
  



/////////////
/// cubes ///
/////////////

p.cubes = [];
p.cubesconfig = {
                  "render": true,
                  "decaymode": "time",  // time or audio or rms
                  "decay":0.9, 
                  "cubesize":1, 
                  "size":1, 
                  "margin":1, 
                  "mode":"random", 
                  "freq": 1, 
                  "seed": 1,"savedseed": 1,
                  "fill": "normal",
                  "fillC": [255,0,0],
                  "stroke": [255,255,255],
                  "strokeweight":0.5,
                  "controlmode": "midi",  // midi or osc not yet implemented?

                }

function createCubes() 
{ 
  p.cubes = [];
  size =  p.cubesconfig["size"] * 450 + 50
  rot = (p.params.data[2])*3.14;
  cubesize = p.cubesconfig["cubesize"] * 12
  // margin = ((p.params.data[4])*500)+2;
     // "mode" = "random"
  	// console.log("creating cubes")
	
  // p.cubesconfig["cubesize"] = cubesize
  margin = p.cubesconfig["margin"] * 500
  if (p.cubesconfig["mode"] == "random") {
    for (var i = 0; i < cubesize*cubesize*cubesize; i++) {
      let cube = {"x":Math.random()*(cubesize * (size + margin)), 
                    "y":Math.random()*(cubesize * (size + margin)), 
                    "z":Math.random()*(cubesize * (size + margin)),
                    "xs":Math.random()*size, 
                    "ys":Math.random()*size, 
                    "zs":Math.random()*size
      }
      // if (Math.random() < p.cubesconfig.freq){}
        p.cubes.push(cube);
      
    }
  }
  if (p.cubesconfig["mode"] == "geom") {
  	for (var x = 0; x < cubesize; x++) {
      for (var y = 0; y < cubesize; y++) {
        for (var z = 0; z < cubesize; z++) {
    	    let cube = {"x":x*(size+margin), 
                    "y":y*(size+margin), 
                    "z":z*(size+margin), 
                    "xs":size, 
                    "ys":size, 
                    "zs":size
					}
          
            p.cubes.push(cube);
          
        }
      }
    }
  }
}


function updateCubes(rmsdata) {
  // console.log(rmsdata)
    size = p.cubesconfig["size"]* 450 + 50
    if (p.cubesconfig['decaymode'] == 'time' ){
      p.cubes.forEach(cube => {
          let xs = cube.xs*p.cubesconfig.decay 
          if (xs < 0.1) {
            xs = 0.1
          }
          cube.xs = xs
      });
    } else if (p.cubesconfig['decaymode'] == 'rms' ) {
      p.cubes.forEach(cube => {
        let xs = 100*rmsdata 
        if (xs > 150) {
          xs = 0.1
        }
        cube.xs = xs
    });
    } else if (p.cubesconfig['decaymode'] == 'audio' ) {
      p.cubes.forEach(cube => {
        let xs = size * a.fft[0] 
        cube.xs = xs
    });
    } 
    else if (p.cubesconfig['decaymode'] == 'offset' ) {
      p.cubes.forEach(cube => {
        let r = Math.floor(random()*3)
        if (r == 0){ 
          cube.x = cube.x + a.fft[0]*10 
        } else if ( r == 1){
          cube.y = cube.y + a.fft[0]*10
        } else if ( r == 2){
          cube.z = cube.z + a.fft[0]*10
        }
    });
    }
}


function renderCubes() {
  cubesize = p.cubesconfig["cubesize"] * 10
  size = p.cubesconfig["size"]* 450 + 50
  margin = p.cubesconfig["margin"] *500
  
  if (p.cubesconfig.render) {
    if (p.cubesconfig.fill == "normal") {
        p.normalMaterial();
        p.strokeWeight(0);
    } else if (p.cubesconfig.fill == "solid") {
        p.ambientLight(255);
        p.ambientMaterial(p.cubesconfig.fillC[0],p.cubesconfig.fillC[1],p.cubesconfig.fillC[2]);
        p.fill(p.cubesconfig.fillC[0],p.cubesconfig.fillC[1],p.cubesconfig.fillC[2]);
        p.strokeWeight(0);
    } else if (p.cubesconfig.fill == "none") {
        p.noFill();
        p.strokeWeight(p.cubesconfig.strokeweight);
        p.stroke(p.cubesconfig.stroke[0],p.cubesconfig.stroke[1],p.cubesconfig.stroke[2]);
    } else if (p.cubesconfig.fill == "texture") {
        p.texture(p.imgconfig.curImg);
      } 

    let xoff = -cubesize * (size + margin) / 2
    let yoff = xoff
    let zoff = xoff
    p.push();
    p.translate(xoff, yoff, zoff)
    p.cubesconfig.seed = p.cubesconfig.savedseed  
    p.cubes.forEach(cube => {
        // if (debug) { console.log(cube.xs)}
        let x=cube.x
        let y=cube.y  
        let z=cube.z
        let xs=cube.xs
        let ys=cube.ys
        let zs=cube.zs
        p.push();
        
        p.translate(x,y,z);
        if (random() < p.cubesconfig.freq){
          
          p.box(xs, ys , zs );
        }
        p.pop();
    });
    p.pop();
  }
}


///////////
// lines //
///////////
p.lines = []
p.linesconfig = { "render":true,
                  "linemode": "ortho", //"random", // "ortho",
                  "min":-500, 
                  "max":500,
                  "ttl":255,
                  "strokeweight": 5,
                  "ttlspeed": 0.95,
                  "ttlup":100,
                  "ttldown":50,
                  "size":20, 
                  "seed" : 1337,
                  "margin":100
                }

function createLines() 
{
  p.lines = []
  let min = p.linesconfig.min
  let max = p.linesconfig.max
  let ttlup =  p.linesconfig.ttlup;
  let ttldown =  p.linesconfig.ttldown;
  let ttl =  p.linesconfig.ttl;
  let size =  p.linesconfig.size;
  let margin =  p.linesconfig.margin;
  let seed = p.linesconfig.seed

  let mx = Math.random()*(max-min)+min
  let my =  Math.random()*(max-min)+min
  let mz =  (Math.random()*(max-min)+min)
  let z = 0
  if (p.linesconfig.linemode == "random"){
    for (var i = 0; i < size; i++) {
      x2 = Math.random()*(max-min)+min
      y2 = Math.random()*(max-min)+min
      z2 = (Math.random()*(max-min)+min)
      let l = {"x":mx,
                  "y":my, 
                  "z":mz,
                  "x2":x2, 
                  "y2":y2, 
                  "z2":z2,
                  "ttl":ttl,
              }
      // console.log("creating line", line)
      p.lines.push(l);
      mx = x2;
      my = y2;
      mz = z2;
      ttl--;
    }
  } else  if  (p.linesconfig.linemode == "ortho"){
    for (var i = 0; i < size; i++) {
      if (i%3 == 0) {x2 =  Math.random()*(max-min)+min} else { x2 = mx}
      if (i%3 == 1) {y2 =  Math.random()*(max-min)+min} else { y2 = my}
      if (i%3 == 2) {z2 =  (Math.random()*(max-min)+min)} else { z2 = mz}
      let l = {"x":mx,
                  "y":my, 
                  "z":mz,
                  "x2":x2, 
                  "y2":y2, 
                  "z2":z2,
                  "ttl":ttl,
              }
      // console.log("creating line", line)
      p.lines.push(l);
      mx = x2;
      my = y2;
      mz = z2;
      ttl--;
    }
  }
}
   

function updateLines() {
  if (p.linesconfig.render) {
    // console.log("updating lines")
    p.lines.forEach(l => {
      l.ttl = l.ttl*p.linesconfig.ttlspeed;
      if (l.ttl < 0 ) { l.ttl = 0 }  
    })
  }
} 

function renderLines() {
  p.normalMaterial();
  // p.line(-500, -500, 100, 500,500,0);
  if (p.linesconfig.render) {
  // console.log("printinglines")
    // p.line(-500, -500, 100, 500,500,0);
    p.strokeWeight(p.linesconfig.strokeweight)
    // p.stroke(255)
    p.lines.forEach(l => {
      p.stroke(l.ttl)
      // p.stroke(255)
      p.line(l.x,l.y,l.z,l.x2,l.y2,l.z2)
    });
  }
}

/////////////
// strings //
/////////////

p.violindata = {"ch3":{"pitch":0.5, "amp": 0, "count":0}, 
                "ch4":{"pitch":0.5, "amp": 0, "count":0},
                "ch5":{"pitch":0.5, "amp": 0, "count":0},
                "ch6":{"pitch":0.5, "amp": 0, "count":0}}


p.stringsconfig = {"voicesize":4, 
                   "colors":{"ch3":p.color(255, 204, 0), "ch4":p.color(2, 204, 90),"ch5":p.color(255, 24, 23),"ch6":p.color(255, 204, 255)},
                   "stringsize":500,
                   "seedoffset":0,
                   "stringwidth": 2
}


function createStrings(min, max, size, seedoffset) 
{
  console.log("creating strings")
  p.stringsconfig.seedoffset = seedoffset
  p.strings = {"ch3":[],"ch4":[],"ch5":[],"ch6":[]}
  // p.initstrings = {"v1":[],"v2":[],"v3":[],"v4":[]}
  let z = 0
  let voiceindex = 0
  let stringwidth = p.stringsconfig['stringwidth']
  for (var voice in p.strings){
    for (var i = 0; i < size; i++) {
      let Xoffset = i*stringwidth*p.stringsconfig['voicesize'] + voiceindex*stringwidth
      p.noiseSeed(voiceindex+seedoffset);
      let string = {"x":Xoffset,
                  "y": p.noise(Xoffset*0.01)*p.stringsconfig['stringsize'], 
                  "z":z,
                  "x2":Xoffset, 
                  "y2":p.noise(Xoffset*0.02)*(-p.stringsconfig['stringsize']),
                  "z2":z
              }
      
      p.strings[voice].push(string);
      // p.initstrings[voice].push(string); 

    }
    voiceindex++;
  } 
}

function updateStrings() {
  // console.log(p.initstrings["v1"][0])
  // console.log("updating lines")
  let lll = 0
  let voiceindex = 0
  let stringwidth = p.stringsconfig['stringwidth']
  for (var voice in p.strings){
    p.noiseSeed(voiceindex+p.stringsconfig.seedoffset);
    // console.log(p.violindata, voice)
    // console.log(p.initstrings[String(voice)][0].y)
    for (var i = 0; i < p.strings[voice].length; i++) {
      let Xoffset = i*stringwidth*p.stringsconfig['voicesize'] + voiceindex*stringwidth
      p.strings[voice][i].y = p.violindata[voice]["amp"] * p.noise(Xoffset*0.01)*p.stringsconfig['stringsize']
    }
  }
  voiceindex++;
} 

function renderStrings() {
  p.strokeWeight(1)
  for (var voice in p.strings){
    p.stroke(p.stringsconfig.colors[voice])
    for (var i = 0; i < p.strings[voice].length; i++) {
      let coor = p.strings[voice]
      // console.log(coor)
      p.line(coor[i].x,coor[i].y,coor[i].z,coor[i].x2,coor[i].y2,coor[i].z2)
    }
  }
}



p.rects = [];

p.rectsconfig = {
  "render": true,
  "changemode": "random", // "random", "sequential", "seed", "shift", "swap"
  "rot": 0,
  "quantity": 5,
  "mode":"free",  // "preset or free"
  "trigger": "note",
  "update": "clock",  //"counter, "clock", "link"
  "preset": 0,
  "seed": 1337,
  "xoff": 10,
  "yoff" : 10,
  "zoff" : -500,
  "sqsizeX" : 500,
  "sqsizeY" : 250,
  "fieldsizeX": rw/2,
  "fieldsizeY": rh/2,
  "counter" : 0,
  "counterreset": 100,
}



function createRects(){
  p.rects = []
  // p.rectsconfig.quantity = (p.params.data[1])*100+1;
  // p.rectsconfig.rot = (p.params.data[2])*3.14;
  p.rectsconfig.sqsizeX = ((p.params.data[3])*500)+2;
  p.rectsconfig.sqsizeY = ((p.params.data[4])*500)+2;
  for (let index = 0; index < p.rectsconfig.quantity; index++) {
    p.rectsconfig.seed+=6;
    p.rects.push({"x" : fakeRandom(p.rectsconfig.seed+1)*p.rectsconfig.fieldsizeX - p.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p.rectsconfig.seed+2)*p.rectsconfig.fieldsizeY - p.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p.rectsconfig.seed+3)*p.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p.rectsconfig.seed+4)*p.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p.rectsconfig.seed+5)*p.rectsconfig.rot,
                })
  }
}


function updateRects() {
  p.updateit = false;
  if (p.rectsconfig.update == "counter") {
    p.rectsconfig.counter++;
  }
  /// sizedconfig
  // p.rectsconfig.quantity = (p.params.data[1])*100+1;
  // p.rectsconfig.rot = (p.params.data[2])*3.14;
  // p.rectsconfig.sqsizeX = ((p.params.data[3])*500)+2;
  // p.rectsconfig.sqsizeY = ((p.params.data[4])*500)+2;

  if (p.rects.length == 0) {
    createRects()
  }
  if (p.rectsconfig.counter > p.rectsconfig.counterreset) {
      // console.log("ready to uipdate")
      p.rectsconfig.counter = 0;
      p.updateit = true
  }

  if (p.clockupdate){
    p.updateit = true;
    p.clockupdate = false;
  }

  if (p.updateit) {
    p.updateit = false;
    if (p.rectsconfig.changemode == "none") {}
    if (p.rectsconfig.changemode =="random") {
        p.rects[Math.floor(Math.random() * p.rects.length)] = {  
                  "x" : fakeRandom(p.rectsconfig.seed+1)*p.rectsconfig.fieldsizeX - p.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p.rectsconfig.seed+2)*p.rectsconfig.fieldsizeY - p.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p.rectsconfig.seed+3)*p.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p.rectsconfig.seed+4)*p.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p.rectsconfig.seed+5)*p.rectsconfig.rot,
                }
        p.rectsconfig.seed = p.rectsconfig.seed + 8
    }
    if (p.rectsconfig.changemode == "shift") {

        p.rects.shift();
        p.rects.push({
                  "x" : fakeRandom(p.rectsconfig.seed+1)*p.rectsconfig.fieldsizeX - p.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p.rectsconfig.seed+2)*p.rectsconfig.fieldsizeY - p.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p.rectsconfig.seed+3)*p.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p.rectsconfig.seed+4)*p.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p.rectsconfig.seed+5)*p.rectsconfig.rot,
                  });
        p.rectsconfig.seed = p.rectsconfig.seed + 6
        
    } 
    if (p.rectsconfig.mode == "sequential") {

    } 
  }
  // / "random", "sequential", "seed", "shift","swap"
  
  // if (p.rectsconfig.mode == "seed") {}
    // fakeRandom(seed)

}



function renderRects(){
  if (p.rectsconfig.render) {
    p.push();
    p.strokeWeight(3)
    index = 0;
    for (var rectangle in p.rects){
      if (index%2 == 0){
        p.fill(255)
        p.stroke(0)
      }
      else{
        p.fill(0)
        p.stroke(255)
      }
      p.translate(0,0,0.1)
      p.push()
      p.rotateZ(p.rects[rectangle].rot)
      p.rect(p.rects[rectangle].x,p.rects[rectangle].y,p.rects[rectangle].xs,p.rects[rectangle].ys);
      p.pop()
      index++;
    }
    p.pop();
  }
}


p.piramidsconfig = {"piramidtrans":0, 
                  "size":100, 
}


function modulate(mode, steps, globalsteps){
  let currentstep = globalsteps
  if (mode == "saw") {
    currentstep = globalsteps+1
    globalsteps = currentstep
    if (currentstep > steps) {
      globalsteps = 0
    }
  }
  // console.log(globalstep)
  return currentstep / steps
}
function piramids(){
  p.fill(255,0,0)
  p.push();
  p.cone(500,500*1.414,4,1,true);
  // p.rotateY(3.14/2);
  transY = modulate("saw",100,p.piramidsconfig.piramidtrans)*500
  p.translate(0,-500*0.707 + transY ,0)
  p.rotateZ(3.14);
  p.cone(500,500*1.414,4,1,true);
  p.pop();

}





// startOSC = true