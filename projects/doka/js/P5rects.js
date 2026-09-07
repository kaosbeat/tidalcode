function initRects(p5){
    p5.rects = [];
    p5.rectsconfig = {
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
    "fieldsizeX": ww/2,
    "fieldsizeY": wh/2,
    "counter" : 0,
    "counterreset": 100
    }
    createRects(p5)
}


function createRects(p5){
  p5.rects = []
  // p5.rectsconfig.quantity = (p5.params.data[1])*100+1;
  // p5.rectsconfig.rot = (p5.params.data[2])*3.14;
  p5.rectsconfig.sqsizeX = ((p5.params.data[3])*500)+2;
  p5.rectsconfig.sqsizeY = ((p5.params.data[4])*500)+2;
  for (let index = 0; index < p5.rectsconfig.quantity; index++) {
    p5.rectsconfig.seed+=6;
    p5.rects.push({"x" : fakeRandom(p5.rectsconfig.seed+1)*p5.rectsconfig.fieldsizeX - p5.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p5.rectsconfig.seed+2)*p5.rectsconfig.fieldsizeY - p5.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p5.rectsconfig.seed+3)*p5.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p5.rectsconfig.seed+4)*p5.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p5.rectsconfig.seed+5)*p5.rectsconfig.rot,
                })
  }
}


function updateRects(p5) {
  p5.updateit = false;
  if (p5.rectsconfig.update == "counter") {
    p5.rectsconfig.counter++;
  }
  /// sizedconfig
  // p5.rectsconfig.quantity = (p5.params.data[1])*100+1;
  // p5.rectsconfig.rot = (p5.params.data[2])*3.14;
  // p5.rectsconfig.sqsizeX = ((p5.params.data[3])*500)+2;
  // p5.rectsconfig.sqsizeY = ((p5.params.data[4])*500)+2;

  if (p5.rects.length == 0) {
    createRects(p5)
  }
  if (p5.rectsconfig.counter > p5.rectsconfig.counterreset) {
      // console.log("ready to uipdate")
      p5.rectsconfig.counter = 0;
      p5.updateit = true
  }

  if (p5.clockupdate){
    p5.updateit = true;
    p5.clockupdate = false;
  }

  if (p5.updateit) {
    p5.updateit = false;
    if (p5.rectsconfig.changemode == "none") {}
    if (p5.rectsconfig.changemode =="random") {
        p5.rects[Math.floor(Math.random() * p5.rects.length)] = {  
                  "x" : fakeRandom(p5.rectsconfig.seed+1)*p5.rectsconfig.fieldsizeX - p5.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p5.rectsconfig.seed+2)*p5.rectsconfig.fieldsizeY - p5.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p5.rectsconfig.seed+3)*p5.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p5.rectsconfig.seed+4)*p5.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p5.rectsconfig.seed+5)*p5.rectsconfig.rot,
                }
        p5.rectsconfig.seed = p5.rectsconfig.seed + 8
    }
    if (p5.rectsconfig.changemode == "shift") {

        p5.rects.shift();
        p5.rects.push({
                  "x" : fakeRandom(p5.rectsconfig.seed+1)*p5.rectsconfig.fieldsizeX - p5.rectsconfig.fieldsizeX/2,
                  "y" : fakeRandom(p5.rectsconfig.seed+2)*p5.rectsconfig.fieldsizeY - p5.rectsconfig.fieldsizeY/2,
                  "xs": fakeRandom(p5.rectsconfig.seed+3)*p5.rectsconfig.sqsizeX,
                  "ys" : fakeRandom(p5.rectsconfig.seed+4)*p5.rectsconfig.sqsizeY,
                  "rot": fakeRandom(p5.rectsconfig.seed+5)*p5.rectsconfig.rot,
                  });
        p5.rectsconfig.seed = p5.rectsconfig.seed + 6
        
    } 
    if (p5.rectsconfig.mode == "sequential") {

    } 
  }
  // / "random", "sequential", "seed", "shift","swap"
  
  // if (p5.rectsconfig.mode == "seed") {}
    // fakeRandom(seed)
    // createRects(p5)
}



function renderRects(p5){
  if (p5.rectsconfig.render) {
    p5.push();
    p5.strokeWeight(3)
    index = 0;
    for (var rectangle in p5.rects){
      if (index%2 == 0){
        p5.fill(255)
        p5.stroke(0)
      }
      else{
        p5.fill(0)
        p5.stroke(255)
      }
      p5.translate(0,0,0.1)
      p5.push()
      p5.rotateZ(p5.rects[rectangle].rot)
      p5.rect(p5.rects[rectangle].x,p5.rects[rectangle].y,p5.rects[rectangle].xs,p5.rects[rectangle].ys);
      p5.pop()
      index++;
    }
    p5.pop();
  }
}
