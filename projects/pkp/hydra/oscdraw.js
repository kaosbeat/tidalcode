 
 // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter

// await loadScript("https://cdn.jsdelivr.net/gh/ojack/hydra-osc/lib/osc.min.js")
await loadScript("osc.min.js")
await loadScript("images.js")

a.show()

_osc = new OSC()
_osc.open()
// _osc.on("*", (m) => { console.log(m.address, m.args)})
hue = 0
img = cyborg
seed = 16777215


_osc.on("/hue", (m) => {
  console.log(m)
  hue = m.args[0]/2 + 0.2
  shp = Math.floor(Math.random()*5)+3
})

_osc.on("/newimg", (m) => {
  index =  Math.floor((Math.abs(Math.sin(m.args[0]) * seed)))%img.length;
//   console.log("index = ", index);
  curimg = "img/" + img[index]
//   console.log("curimg = ", curimg);
  s0.initImage(curimg);
  
})


// // default

osc(() => (a.fft[1]*100)+2).modulate(src(s0),1).out(o1)


shape(() => shp).color(-1, 1).hue(() => hue).out()



bpm = 252
osc(2,0.5).modulate(noise()).color(()=>a.fft[0]*2,0,0)
  .layer(osc().mask(shape(5,[0.45, 0.5,0.40],0.3).scale(() => hue).rotate(1,0.5)))
  .out(o2)



src(o0).blend(o1).diff(o2).out(o3)

render(o3)

