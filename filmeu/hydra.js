
 
 // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter
 await loadScript("https://unpkg.com/hydra-superdirt")
 rmsConnect()
 
 solid(() => rms(0)).out()
 
 shape(30,() => rms(0)).scrollX(()=>rms(2)).out()
 
 
 //Hydravisuals 
 
 
 
 
 // render black
 solid(0)
     .out(o0)
 // //render code
 src(s1)
     .out(o0);
 render(o0)
 debug = false;
 
 // /config
 rw = 1436
 rh = 844
 setResolution(rw, rh)
 
 
 
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
 s0.initScreen();
 src(s0)
     .out(o0);
 
 // synth1 - tidalcode
 s1.initScreen();
 src(s1)
     .out(o1);
 
 // // synth2 - images
 // s2.initImage("img/" + img[0]);
 // src(s2).out(o2);
 
 src(s1).out(s2);
 
 // synth3 - processing
 p = new P5({
     mode: "WEBGL"
 })
 
 p.hide()
 
 s3.init({
     src: p.canvas
 })
 
 src(s3).out(o3);
 p.cubes = [];
 p.lines = [];
 p.render = "cubes"
 
 await loadScript("extraP5.js") // loads extra p5 functions
 
 
 // p.draw = () => {}
 f = 0
 p.draw = () => {
     f++;
     p.background(0);
     p.push();
     p.rotateX(p.frameCount * p.viewportconf.rotSpeedX );
     p.rotateY(p.frameCount * p.viewportconf.rotSpeedY );
     p.rotateZ(p.frameCount * p.viewportconf.rotSpeedZ );
     if (p.render == "cubes") {
         updateCubes(() => rms(2));
         renderCubes();
     }
     if (p.render == "lines") {
         updateLines();
           renderLines();
     }
   
     p.pop();
 }
 
 
 p.hide();
 
 createCubes(4, 30, 3)
 
 p.cubesconfig['decaymode'] = 'time'
 p.render = "cubes"
 
 
 render();