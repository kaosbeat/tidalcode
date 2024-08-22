//////////////
/// config ///
//////////////

p.viewportconf = {
                  "rotSpeedX": 0.001,
                  "rotSpeedY": 0.001,
                  "rotSpeedZ": 0.001
}

//////////////
/// helpers //
//////////////


function random() {
    var x = Math.sin(p.cubesconfig.seed++) * 10000;
    return x - Math.floor(x);
}


/////////////
/// cubes ///
/////////////

p.cubes = [];
p.cubesconfig = {"cubesize":1, 
                  "size":100, 
                  "margin":10, 
                  "mode":"random", 
                  "freq": 1, 
                  "decay":0.9, 
                  "seed": 1,"savedseed": 1,
                  "fill": "normal",
                  "fillC": [255,0,0],
                  "stroke": [255,255,255],
                  "strokeweight":0.5,
                  "controlmode": "midi", 
                  "decaymode": "time"}


function createCubes(cubesize, size, margin) 
{
     // "mode" = "random"
  	// console.log("creating cubes")
	p.cubes = [];
  p.cubesconfig["cubesize"] = cubesize
  p.cubesconfig["size"] = size
  p.cubesconfig["margin"] = margin
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
    if (p.cubesconfig['decaymode'] == 'time' ){
      p.cubes.forEach(cube => {
          let xs = cube.xs*p.cubesconfig.decay 
          if (xs < 0.1) {
            xs = 0.1
          }
          cube.xs = xs
      });
    } 
    if (p.cubesconfig['decaymode'] == 'rms' ) {
      p.cubes.forEach(cube => {
        let xs = 100*rmsdata 
        if (xs > 150) {
          xs = 0.1
        }
        cube.xs = xs
    });
    }
    if (p.cubesconfig['controlmode'] == 'midi') {
      if (p.cubesconfig.savedseed != mididata["m0"]["v"]) {
        p.cubesconfig.savedseed = mididata["m0"]["v"] 
        createCubes(p.cubesconfig["cubesize"] , p.cubesconfig["size"], p.cubesconfig["margin"])
      }
    }

    // console.log(xs)
}

// function updateCubes() {

//   p.cubes.forEach(cube => {
//       let xs = cube.xs*p.cubesconfig.decay 
//       if (xs < 0.1) {
//         xs = 0.1
//       }
//       cube.xs = xs
//   });
//   // console.log(xs)
// }
// createCubes(2, 100, 10);

// createStandardCubes(4, 100, 10);

function renderCubes() {
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
  }
  let xoff = -p.cubesconfig.cubesize * (p.cubesconfig.size + p.cubesconfig.margin) / 2
//   xoff = 0
  let yoff = xoff
  let zoff = xoff
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
  	  p.translate(xoff, yoff, zoff)
      p.translate(x,y,z);
      if (random() < p.cubesconfig.freq){
        p.box(xs, ys , zs );
      }
      p.pop();
});
}


///////////
// lines //
///////////
           
p.lines = []
p.linesconfig = {}

function createLines(lines, min, max, size, margin) 
{
  let mn = Math.random()*min
  let mx = Math.random()*max
  let z = 0
  for (var i = 0; i < size; i++) {
    let line = {"x":i*margin,
                "y":mn, 
                "z":z,
                "x2":i*margin, 
                "y2":mx, 
                "z2":z
            }
    console.log("creating line", line)
    lines.push(line);
  }
}
   

function updateLines(lines) {
  // console.log("updating lines")
  let lll = 0
} 

function renderLines(lines) {
  p.strokeWeight(10)
  p.stroke(255)
  p.lines.forEach(line => {
    p.line(line.x,line.y,line.z,line.x2,line.y2,line.z2)
  });
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
      // 
      // 
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

startOSC = true