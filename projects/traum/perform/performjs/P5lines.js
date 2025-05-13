///////////
// lines //
///////////

function initLines(p5){
    p5.lines = []
    p5.linesconfig = { "render":true,
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
    
}


function createLines(p5)
{
  p5.lines = []
  let min = p5.linesconfig.min
  let max = p5.linesconfig.max
  let ttlup =  p5.linesconfig.ttlup;
  let ttldown =  p5.linesconfig.ttldown;
  let ttl =  p5.linesconfig.ttl;
  let size =  p5.linesconfig.size;
  let margin =  p5.linesconfig.margin;
  let seed = p5.linesconfig.seed

  let mx = Math.random()*(max-min)+min
  let my =  Math.random()*(max-min)+min
  let mz =  (Math.random()*(max-min)+min)
  let z = 0
  if (p5.linesconfig.linemode == "random"){
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
      p5.lines.push(l);
      mx = x2;
      my = y2;
      mz = z2;
      ttl--;
    }
  } else  if  (p5.linesconfig.linemode == "ortho"){
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
      p5.lines.push(l);
      mx = x2;
      my = y2;
      mz = z2;
      ttl--;
    }
  }
}
   

function updateLines(p5) {
  if (p5.linesconfig.render) {
    // console.log("updating lines")
    p5.lines.forEach(l => {
      l.ttl = l.ttl*p5.linesconfig.ttlspeed;
      if (l.ttl < 0 ) { l.ttl = 0 }  
    })
  }
} 

function renderLines(p5) {
  p5.normalMaterial();
  // p5.line(-500, -500, 100, 500,500,0);
  if (p5.linesconfig.render) {
  // console.log("printinglines")
    // p5.line(-500, -500, 100, 500,500,0);
    p5.strokeWeight(p5.linesconfig.strokeweight)
    // p5.stroke(255)
    p5.lines.forEach(l => {
      p5.stroke(l.ttl)
      // p5.stroke(255)
      p5.line(l.x,l.y,l.z,l.x2,l.y2,l.z2)
    });
  }
}