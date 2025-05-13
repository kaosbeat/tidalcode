//////////////
/// config ///
//////////////


function configP5(p5) {

    // p5.lines = [];
    // p5.rects = [];
    // p5.imgs = [];

    p5.cam = p5.createCamera();

    // p5.updateit = false;
    // p5.audioreact = false;
    // p5.activeaudiobin = 0;
 
    p5.viewportconf = {
                      "rotX": 0,
                      "rotY": 0,
                      "rotZ":0,
                      "rotSpeedX": 0, // 0.001,
                      "rotSpeedY": 0, //0.001,
                      "rotSpeedZ": 0, //0.0001,
                      "offX":0,
                      "offY":0,
                      "offZ":0,
                      "offSpeedX":0,
                      "offSpeedY":0,
                      "offSpeedZ":0,
                      "cammode": "fixed", ///, "fixed" , "orbit","bigorbit"
                      "audioCutoff": 1,
                      "audioScale": 1,
    }

    p5.params = {  "data": {1:0.5,2:0.5,3:0.5,4:0.5}, 
    "processed": {1:0.5,2:0.5,3:0.5,4:0.5}, 
    "mask": {1:0,2:0,3:0,4:0},
    "black": {1:0,2:0,3:0,4:0}, 
    "audio":{1:0,2:0.8,3:0.6,4:0},
    "viewportrot": {5:0.4,6:0.3,7:0.4}
    }


}

function updateViewport(p5){
  p5.frameCount += 1
  p5.viewportconf.rotX += p5.viewportconf.rotSpeedX;
  p5.viewportconf.rotY += p5.viewportconf.rotSpeedY;
  p5.viewportconf.rotZ += p5.viewportconf.rotSpeedZ;
}

function updateCam(p5) {
  // console.log("framecount =  " + p5.frameCount)
  if (p5.viewportconf.cammode == "fixed") {
    p5.cam.camera(0, 0, 1000, 0, 0, 0, 0, 1, 0);
  } else if (p5.viewportconf.cammode == "orbit") {
    p5.cam.camera(p5.cos(p5.frameCount * 0.01) * 500, p5.sin(p5.frameCount * 0.01) * 500, p5.sin(p5.frameCount * 0.0029) * 300, 0, 0, 0, 0, 1, 0);
  } else if (p5.viewportconf.cammode == "bigorbit") {
    p5.cam.camera(p5.cos(p5.frameCount * 0.01) * 1000, p5.sin(p5.frameCount * 0.01) * 1000, p5.sin(p5.frameCount * 0.0029) * 1000, 0, 0, 0, 0, 1, 0);
  }
}

//////////////
/// helpers //
//////////////

function p5random(p5) {
  p5.cubesconfig.seed = p5.cubesconfig.seed +1
  var x = Math.sin(p5.cubesconfig.seed++) * 10000;
  return x - Math.floor(x);
}

function fakeRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x)
}

function localrandom(localseed) {
  localseed = localseed +1
  var x = Math.sin(localseed++) * 10000;
  return x - Math.floor(x);
}


////////////////
// do the init//
////////////////
function initExtraP5(p5){
  p5.cam = p5.createCamera();
  p5.updateit = false;
  p5.audioreact = false;
  p5.activeaudiobin = 0;
}





