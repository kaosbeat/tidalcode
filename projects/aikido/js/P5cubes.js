


/////////////
/// cubes ///
/////////////
function initCubes(p5) {
  p5.cubes = [];
  p5.cubesconfig = {
                    "render": true,
                    "decaymode": "audio",  // time or audio or rms
                    "decay":0.9, 
                    "cubesize":1, 
                    "size":1, 
                    "margin":1, 
                    "mode":"random", 
                    "freq": 1, 
                    "seed": 1,
                    "savedseed": 1,
                    "fill": "normal",
                    "fillC": [255,0,0],
                    "stroke": [255,255,255],
                    "strokeweight":0.5,
                    "controlmode": "midi",  // midi or osc not yet implemented?
                  }
  p5.rmsdata = 0
}


function createCubes(p5) 
{ 
  p5.cubes = [];
  size =  p5.cubesconfig["size"] * 450 + 50
  rot = (p5.params.data[2])*3.14;
  cubesize = p5.cubesconfig["cubesize"] * 12
  // margin = ((p5.params.data[4])*500)+2;
     // "mode" = "random"
  	// console.log("creating cubes")
	
  // p5.cubesconfig["cubesize"] = cubesize
  margin = p5.cubesconfig["margin"] * 500
  if (p5.cubesconfig["mode"] == "random") {
    for (var i = 0; i < cubesize*cubesize*cubesize; i++) {
      let cube = {"x":Math.random()*(cubesize * (size + margin)), 
                    "y":Math.random()*(cubesize * (size + margin)), 
                    "z":Math.random()*(cubesize * (size + margin)),
                    "xs":Math.random()*size, 
                    "ys":Math.random()*size, 
                    "zs":Math.random()*size
      }
      // if (Math.random() < p5.cubesconfig.freq){}
        p5.cubes.push(cube);
      
    }
  }
  if (p5.cubesconfig["mode"] == "geom") {
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
          
            p5.cubes.push(cube);
          
        }
      }
    }
  }
}


function updateCubes(p5) {
  // console.log(rmsdata)
    size = p5.cubesconfig["size"]* 450 + 50
    if (p5.cubesconfig['decaymode'] == 'time' ){
      p5.cubes.forEach(cube => {
          let xs = cube.xs*p5.cubesconfig.decay 
          if (xs < 0.1) {
            xs = 0.1
          }
          cube.xs = xs
      });
    } else if (p5.cubesconfig['decaymode'] == 'rms' ) {
      p5.cubes.forEach(cube => {
        let xs = 100*p5.rmsdata 
        if (xs > 150) {
          xs = 0.1
        }
        cube.xs = xs
    });
    } else if (p5.cubesconfig['decaymode'] == 'audio' ) {
      p5.cubes.forEach(cube => {
        let xs = size * a.fft[0] 
        cube.xs = xs
    });
    } 
    else if (p5.cubesconfig['decaymode'] == 'offset' ) {
      p5.cubes.forEach(cube => {
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


function renderCubes(p5) {
  cubesize = p5.cubesconfig["cubesize"] * 10
  size = p5.cubesconfig["size"]* 450 + 50
  margin = p5.cubesconfig["margin"] *500
  if (p5.cubesconfig.render) {
    if (p5.cubesconfig.fill == "normal") {
        p5.normalMaterial();
        p5.strokeWeight(0);
    } else if (p5.cubesconfig.fill == "solid") {
        p5.ambientLight(255);
        p5.ambientMaterial(p5.cubesconfig.fillC[0],p5.cubesconfig.fillC[1],p5.cubesconfig.fillC[2]);
        p5.fill(p5.cubesconfig.fillC[0],p5.cubesconfig.fillC[1],p5.cubesconfig.fillC[2]);
        p5.strokeWeight(0);
    } else if (p5.cubesconfig.fill == "none") {
        p5.noFill();
        p5.strokeWeight(p5.cubesconfig.strokeweight);
        p5.stroke(p5.cubesconfig.stroke[0],p5.cubesconfig.stroke[1],p5.cubesconfig.stroke[2]);
    } else if (p5.cubesconfig.fill == "texture") {
        p5.texture(img);
      } 
      
      

    let xoff = -cubesize * (size + margin) / 2
    let yoff = xoff
    let zoff = xoff
    
    p5.push();
    
    p5.translate(xoff, yoff, zoff)
    p5.cubesconfig.seed = p5.cubesconfig.savedseed  
    p5.cubes.forEach(cube => {
        // if (debug) { console.log(cube.xs)}
        // console.log(cube)
        let x=cube.x
        let y=cube.y  
        let z=cube.z
        let xs=cube.xs
        let ys=cube.ys
        let zs=cube.zs
        p5.push();
        
        
        p5.translate(x,y,z);
        
        if (p5random(p5) < p5.cubesconfig.freq){
          
          p5.box(xs, ys , zs );
        }
        p5.pop();
    });
    p5.pop();
  }
}

