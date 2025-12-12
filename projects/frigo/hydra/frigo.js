// screenconfig
rw = 1280 //window.innerWidth
rh = 720 //window.innerHeight
setResolution(rw, rh)

//audioconfig
a.show()
a.setBins(4)
a.setCutoff(1)
a.setScale(5)
a.beat.threshold = 10


s0.initScreen();
src(s0).out(o0);

s1.initScreen();
src(s1).out(o1);


s2.initCam()



await loadScript("hydra/extraHydra.js") // loads hydrapresets


set7()

   src(s0).invert()
    .modulateRepeatX(src(s2),3, 10)
    .modulateScale(src(s2),10,10)
    .pixelate(() => a.fft[0]*80,80)
    .mask(src(s0).invert(), 0.1)
//     src(s0).layer(src(o2))
    .out(o3)



render()