await loadScript('https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js')
await loadscript('https://kaosfury.local:5002/js/anoebishydra.js')

// Use midi messages from all channels of all inputs.
await midi.start().show()
a.show()

gsm = midi.input(2).channel(0)



gsm.onNote('*', ({ note, velocity, channel }) => {
  switch (note) {
    case 0: { basictrip(); break; }
    case 33: { scene2(); break; }
    case 34: { ojack(); break; }
    case 35: { crazysquares(); break; }
    case 68: { nessoclouds (); break; }
    case 69: { purnama (); break; }
    case 70: { CNDSD(); break; }
    case 71: { rangga(); break; }
    case 72: { khoparzi(); break; }
    case 74: { eye (); break; }
    case 76: { krall(); break; }
  }
})

function basictrip () {
 					osc(13,0,1)
                  .modulate(osc(() => a.fft[0]*21,0.25,0))
                  .modulateScale(osc(34))
                  .modulateKaleid(osc(55),0.1,1)
                  .out()
					}

function scene2() {
				osc(13,0,1)
  					.kaleid(() => cc(73).scale(0.02))
                .mask(shape(4,0.3,1))
                .modulateRotate(shape(10,0.1,1))
                .modulateRotate(shape(4,0.1,0.9))
                .modulateRotate(shape(4,0.1,0.8))
                .scale(() => a.fft[0]*2)
//                 .add(shape(4,0.2,1).color(() => cc(73).range(10,100) ,.3,1,1,0.5))
                .rotate(()=>time)
                .out()
}


function nessoclouds () {
  // licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/

//clouds of passage
//by Nesso
//www.nesso.xyz

  shape([4,5,6].fast(0.1).smooth(1),0.000001,[0.2,0.7].smooth(1))
  .color(0.2,0.4,0.3)
  .scrollX(()=>Math.sin(time*0.27))
  .add(
    shape([4,5,6].fast(0.1).smooth(1),0.000001,[0.2,0.7,0.5,0.3].smooth(1))
    .color(0.6,0.2,0.5)
    .scrollY(0.35)
    .scrollX(()=>Math.sin(time*0.33)))
  .add(
    shape([4,5,6].fast(0.1).smooth(1),0.000001,[0.2,0.7,0.3].smooth(1))
    .color(0.2,0.4,0.6)
    .scrollY(()=>-0.35)
    .scrollX(()=>Math.sin(time*0.41)*-1))
  .add(
        src(o0).shift(0.001,0.01,0.001)
        .scrollX([0.05,-0.05].fast(0.1).smooth(1))
        .scale([1.05,0.9].fast(0.3).smooth(1),[1.05,0.9,1].fast(0.29).smooth(1))
        ,0.85)
  .modulate(voronoi(10,2,2))
  .out()

}


function purnama () {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Sumet
// by Rangga Purnama Aji
// https://ranggapurnamaaji1.wixsite.com/portfolio

  osc(0.05,1.25).mult(shape(1,0.09).rotate(1.5))
    .diff(gradient())
    .add(shape(2,2).blend(gradient(1)))
    .modulate(noise()
    .modulate(noise().scrollY(()=>a.fft[0],0.0625)))
    .blend(o0)
    .color(2,-0.5,-0.75)
    .out(o0)
  src(o0).out(o1)

}


function CNDSD (){
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//CNDSD
//http://malitzincortes.net/
// sand spirals

osc(3, 0.01, 0.4)
.color(2,1.2,1.3).colorama(2)
.saturate(0.3)
.modulateRepeat(osc(2),1, 2, 4, 3)
.modulateKaleid(osc(12,0.05,0),1)
.luma (0.4)
.rotate(4, 0.1,0)
.modulate(o0, () => a.fft[0]*0.0002 )
.scale(() => a.fft[0]).diff(o1)
.out(o0)
}


function ojack () {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io

osc(4, 0.1, 0.8).color(1.04,0, -1.1).rotate(0.30, 0.1).pixelate(2, 20).modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time)).out(o0)
}


function crazysquares() {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//CNDSD
//http://malitzincortes.net/
//crazy squares

shape(4, (0.01, ()=> 0.2 + a.fft[2]),1)
.mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
.color(1,2,4)
.saturate(0.2)
.luma(1.2,0.05, (5, ()=> 2 + a.fft[3]))
.scale(0.6, ()=> 0.9 + a.fft[3])
.diff(o0)// o0
.out(o0)// o1
}


function rangga() {
  // licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
  // Dreamy Diamond
  // by Rangga Purnama Aji
  // https://ranggapurnamaaji1.wixsite.com/portfolio

  osc(7,-0.125).modulate(voronoi(1)).diff(voronoi(1).mult(gradient(-1).luma(0.125)))
    .luma(0.125)
    .add(shape(7, 0.5)
         .mult(voronoi(10,2).blend(o0).diff(gradient(1)).modulate(voronoi())))
    .scrollY(-0.1)
    .scrollX(0.125)
    .blend(o1)
    .blend(o0)
    .out()

}

function khoparzi() {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Aqautic blubs
// By Khoparzi
// https://khoparzi.com

gradient(0.25)
.add(noise(), ()=>Math.cos(time))
.modulateRotate(src(o0).rotate(0, -0.52), 0.2).mult(shape(360), 0.8)
.repeat(10,5).mult(shape(360).scale(()=>Math.sin(time)), 0.8).rotate(0, 0.2)
.diff(src(o0).rotate(0, -0.2), 0.2)
.out(o1)
  src(o1).blend(src(o0)).out(o0)
}


function eye () {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/

 // "eye of the beholder"
// Alexandre Rangel
// www.alexandrerangel.art.br/hydra.html

noise(6,.05)
.mult( osc(9,0, ()=>Math.sin(time/1.5)+2 ) )
.mult(
    noise(9,.03).brightness(1.2).contrast(2)
    .mult( osc(9,0, ()=>Math.sin(time/3)+13 ) )
)
.diff(
    noise(15,.04).brightness(.2).contrast(1.3)
    .mult( osc(9,0, ()=>Math.sin(time/5)+13 ) )
    .rotate( ()=>time/33 )
)
.scale( ()=>Math.sin(time/6.2)*.12+.15 )
.modulateScale(
    osc(3,0,0).mult( osc(3,0,0).rotate(3.14/2) )
    .rotate( ()=>time/25 ).scale(.39).scale(1,.6,1).invert()
    , ()=>Math.sin(time/5.3)*1.5+3  )
.rotate( ()=>time/22 )
.mult( shape(100,.9,.01).scale(1,.6,1) )
.out()
}


function krall() {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Zach Krall
// http://zachkrall.online/

osc( 215, 0.1, 2 )
.modulate(
  osc( 2, -0.3, 100 )
  .rotate(() => a.fft[0]*15)
)
.mult(
  osc( 215, -0.1, 2)
  .pixelate( 50, 50 )
)
.color( 0.9, 0.0, 0.9 )
.modulate(
  osc( 6, -0.1 )
  .rotate( 9 )
)
.add(
  osc( 10, -0.9, 900 )
  .color(1,0,1)
)
.mult(
  shape(900, 0.2, 1)
  .luma()
  .repeatX(cc(73).range(2,10))
  .repeatY(cc(77).range(2,10))
  .colorama(cc(75).range(0,10))
)
.modulate(
  osc( 9, -0.3, 900 )
  .rotate( 6 )
)
.add(
  osc(4, 1, 90)
  .color(0.2,0,1)
)
.out()
}


