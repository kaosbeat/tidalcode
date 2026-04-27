function all(){
  // console.log(p5.codeviz)
  src(s0).out(o0)
  src(s1).out(o1)
  src(s2).out(o2)
  src(s3).out(o3)
  src(o0).add(src(o1)).add(src(o2)).add(src(s3)).out(o3)
  render(o3)
}

// function image(){
//   src(s0).out(o1)
//   src(o1).out(o3))
// }

// function webgl(){
//   src(s1).out(o1)
//   src(o1).out(o3)
// }

function code(){
    // src(o2).add(src(s0).brightness(() => p5vars.p1).contrast(() => p5vars.p2*10)).out(o3)
    src(o2).add(src(s0).brightness(0).contrast(19/127*10), 1).out(o3)
    render(o3)
    // console.log(p5vars)
}

function nocode () {    
    src(o2).out(o3)
    render(o3)
}

// function data(){
//   src(o1).add(src(s3)).out(o3)
// }

// function dataandcode(){
//   src(o1).add(src(s2)).add(src(s3)).out(o3)
// }

function repeatglitch(){
  loginfo("hydramode repeatglitch")
  src(s1)
    .blend(src(s3)
      // .scrollX(() => p5vars.p1*10+4)
      .pixelate(() => p5vars.p3*800,() => p5vars.p3*450)
      .thresh(0.5, () => p5vars.p4), () => p5vars.p2)
      .colorama(()=> Math.sin(time)*p5vars.p1)
    // .blend(src(s2))
    // .diff(src(s3))
    .add(src(s1))
    .out(o2)
}


function rotshape(){
  loginfo("hydramode test")
  shapearray = [3,5,8,12]
  src(s1)
    .diff(shape(() => shapearray[p5vars.hydracount%4]).repeat(4,5))
    .add(src(s2))
  .rotate(()=>time)
  .out(o2)
}

function silhouettes(){
  src(s1).mult(osc(10, 0.1, ()=> Math.sin(time)*3 ).saturate(3).kaleid(200))
    .modulate(o1,0.5).add(o1,0.4)
    .scrollY(-0.12)
    .scale(() => 0.95*p5vars.p2)
    // .modulateScale(o1)
    .luma(0.1)
    // .diff(src(s0))
    .mult(src(s3).scale(() => 2*p5vars.p3))
    .brightness(0.6)
    .out(o2)
}

function sqs(){
  shape(4,0.9,0.018).mask(shape(4, () => Math.sin(time)/4 +0.2, 0.9 ).invert().luma(0.2,0.2))
  // .modulateScale(shape(4,0.99), 0.1, ()=> Math.sin(time/2)/3+1)
  .modulateScale(shape(4,0.99), 0.1, ()=> p5vars.hydracount%4/3+1)
  .diff(src(o2).scale(0.5).luma(0.8, 0.7))
  .kaleid(4).diff(src(s2))
  .add(src(s1))
  .out(o2)

  // src(o1).out(o2)
}


function repetr() {
    src(s1).repeat(5,5).add(src(s1).repeat(3,4)).invert()
    .add(src(s1).modulatePixelate(src(o1),230))
    .diff(src(s1).invert().scale(() => p5vars.p1*10 + 1 ))
    .out(o2)
}




function neonglow(){
  src(s1).kaleid(() => p5vars.p4*8).scrollX(() =>  time%360).scrollY(() => p5vars.p3)
  .modulateHue(src(o1).scale(1.01),2)
  .diff(osc(0.6,5,2).mask(shape(4,1,0.1)))
  .diff(src(o1).scale(0.8))
  .out(o2)
}


function kaleido() {
  // src(o1).out(o2)
  shapearray = [3,5,8,12]
  hydracount = 1
  src(o1).repeat(()=>p5.p1*50,()=>p5.p1*50).kaleid(()=>shapearray[hydracount%4] + 3)
  .modulateScale(osc(p5.p3*2,-0.5,0).kaleid(p5.p2*50).scale(0.5),15,0)
  // .diff(src(o1), ()=>p5.p1)
  .out(o2)
}

function shmear() {
  // src(s2).out(o2)
// based on:
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//corrupted screensaver
//by Ritchse
//instagram.com/ritchse
  voronoi(350,0.15)
  .modulateScale(osc(8).rotate(Math.sin(time)),.5)
  .thresh(.8)
  .brightness([-.02,-.17].smooth().fast(.5))
.thresh(.7)
  .diff(src(o0).scale(1.8))
  // .diff(src(o2).scale(1.7))
.modulateScale(osc(2).modulateRotate(o0,.74))
.diff(src(o0).rotate([-.015,.051,-.0023,0.13]).scrollY(0,[-1/199800,0].fast(0.7)))
.modulateRotate(osc(7),.4)
.diff(src(s2).scale(1.8))

.out(o2)

}


function scrollr(){
  src(s2)
  .add(src(s2).scrollX(0.1))
  .add(src(s2).scrollX(() => time%360*0.2))
    .saturate(2)
    .contrast(1.3)
    .layer(src(o1)
      .mask(shape(4,2)
      .scale(0.5,0.7)
      .scrollX(0.25))
      .scrollX(0.001))
    .modulate(o1,0.01)
    .modulate(o1,0.02)
    // .modulateScrollY(osc(0.01), 0.5, 0)
    .modulate(o1,0.03)
    .out(o1)

   src(o1).out(o2) 

}


function simplep5(){
  src(s2).pixelate(() => p5vars.p3*800,() => p5vars.p3*450).out(o2)
  
}

function simpleascii(){
  src(s1).out(o2)
}

function simplewebcam(){
  src(s3)
  .thresh(0.5, () => p5vars.p1)
  .luma( () => p5vars.p2)
  .scale( ()=> p5vars.p4,()=> p5vars.p4)
  .pixelate(() => p5vars.p3*800,() => p5vars.p3*450).out(o2)
}


function test() {
  src(o1).diff(src(s0),()=> 0.2 + p5.p1)
  .mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
  .color(1,2,4)
  .saturate(0.2)
  .luma(1.2,0.05, (5, ()=> 2 + p5.p2))
  .scale(0.6, ()=> 0.9 + p5.p2)
  .diff(o0)// 
  .out(o2)// o1
}



function blackout() {
  solid([0,0,0],[0,0,0],[0,0,0],1).out(o3)
  render(o3)
}



function intro(){ //hydramode 1
  s1.initVideo(url="vid/enta.mp4")
  // src(s1).kaleid(5).pixelate(()=>a.fft[0]*1200,()=>a.fft[0]*1200).colorama(()=>a.fft[0]*4).contrast(2).out(o2)
  // src(s1).posterize(6).out(o1)
  src(s1).add(src(o2),0.2).out(o3)
}



function intro2(){ //hydramode 2
  s1.initVideo(url="vid/enta.mp4")
  src(s1)
    .modulateScrollX(osc(10),0.5,0)
    // .kaleid(4)
    // .colorama(()=>a.fft[0]*4)
    .contrast(2)
    .out(o3)

}




function enta1(){ //hydramode 3
  s1.initVideo(url="vid/enta1.mp4")
  src(s1)
    .add(src(s2))
    .out(o3)

}



function enta2(){ //hydramode 4
  s1.initVideo(url="vid/enta1.mp4")
  src(s1)
    .add(src(s2))
    .colorama(()=>a.fft[1]*10)
    .blend(src(s1), ()=> p5vars.p1)
    .out(o3)

}


function enta3(){ //hydramode 5
  s1.initVideo(url="vid/entahands2.mp4")
  src(s1)
    // .add(src(s0))
    // .diff(src(s0),()=> 0.2 + p5vars.p1)
  // .mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
  .color([1,5,9],2,4)
  // .saturate(0.2)
  // .luma(1.2,0.05, (5, ()=> 2 + p5vars.p2))
  .scale(()=> 0.4 + p5vars.p2*2, ()=> 0.4 + p5vars.p2*2)
  // .diff(o0)// 
  .add(src(s2))// 
    .out(o3)

}

function enta4(){ //hydramode 6
  s1.initVideo(url="vid/entahands3.mp4")
  src(s1)
    // .add(src(s0))
    // .diff(src(s0),()=> 0.2 + p5va.p1)
  // .mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
  // .color([1,5,9],2,4)
  // .modulateRotate(osc(0.01,0.5,0),()=>time*0.1,0)
  // .luma(1.2,0.05, (5, ()=> 2 + p5vars.p2))
  .scale(()=> 0.4 + p5vars.p2*2, ()=> 0.4 + p5vars.p2*2)
  .add(src(s2).repeat(()=>1 + p5vars.p1*2,()=>1 + p5vars.p1*2).pixelate(()=>p5vars.p3*200, ()=>p5vars.p3*100).colorama(()=>p5vars.p4))// 
    .out(o3)

}



function enta5(){ //hydramode 7
  s1.initVideo(url="vid/entahands3.mp4")
  src(s1)
    // .add(src(s0))
    // .diff(src(s0),()=> 0.2 + p5va.p1)
  // .mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
  // .color([1,5,9],2,4)
  // .modulateRotate(osc(0.01,0.5,0),()=>time*0.1,0)
  // .luma(1.2,0.05, (5, ()=> 2 + p5vars.p2))
  .mult(osc(10,0.1,()=>Math.sin(time)*3).saturate(3).kaleid(200))
  .modulate(o0,0.5)
  .add(src(o3).scale(0.99),0.8)
  .scrollY(-0.01)
  // .scale(0.99)
  .diff(src(o3).scale(0.95),0.8)
  .modulate(src(s1),0.008)
  .luma(0.3)
  .blend(src(s1), ()=>p5vars.p1)
// .out()
  // .scale(()=> 0.4 + p5vars.p2*2, ()=> 0.4 + p5vars.p2*2)
  // .add(src(s2).repeat(()=>1 + p5vars.p1*2,()=>1 + p5vars.p1*2).pixelate(()=>p5vars.p3*1200, ()=>p5vars.p3*1200).colorama(()=>p5vars.p4))// 
    .out(o3)

}


function enta6(){ //hydramode 8
  s1.initVideo(url="vid/entahands4.mp4")
  src(s1)
    .add(src(s2))
    // .diff(src(s0),()=> 0.2 + p5va.p1)
  .mult(osc(1, 1).modulate(osc(5).rotate(()=>a.fft[1],0.5),3))
  .modulatePixelate(src(s1))
  .blend(src(s1), ()=>p5vars.p1)
  // .modulateRotate(osc(0.01,0.5,0),()=>time*0.1,0)
    .out(o3)

}


function enta7(){ //hydramode 9
  s1.initVideo(url="vid/entahands5.mp4")
  src(s1)
    // .add(src(s0))
    // .diff(src(s0),()=> 0.2 + p5va.p1)
  // .mult(osc(1, 1).modulate(osc(5).rotate(1.4,1),3))
  // .color([1,5,9],2,4)
  // .modulateRotate(osc(0.01,0.5,0),()=>time*0.1,0)
  // .luma(1.2,0.05, (5, ()=> 2 + p5vars.p2))
  .scale(()=> 0.4 + p5vars.p2*2, ()=> 0.4 + p5vars.p2*2)
  .add(src(s2).repeat(()=>1 + p5vars.p1*2,()=>1 + p5vars.p1*2).pixelate(()=>p5vars.p3*1200, ()=>p5vars.p3*1200).colorama(()=>p5vars.p4))// 
    .out(o3)

}


function enta8(){ //hydramode 10
  s1.initVideo(url="vid/entahands6.mp4")
  osc(4,0.2,1)
  .modulateScale(osc(()=>1+ p5vars.p1*10,0,1).kaleid(8))
  // .repeat(12,0.4)
  .modulate(o0,()=>a.fft[0]+0.5)
  .modulateKaleid(shape(12,0.1,1))
  .out(o0)
  src(s1)
    .add(src(o0), 0.4)
    .out(o3)

}



function final(){ //hydramode 11
  s1.initVideo(url="vid/entahands_final.mp4")
  // src(s1).kaleid(5).pixelate(()=>a.fft[0]*1200,()=>a.fft[0]*1200).colorama(()=>a.fft[0]*4).contrast(2).out(o2)
  // src(s1).posterize(6).out(o1)
  src(s1).add(src(o2),0.2).out(o3)
}




all()

// fxpipe = [ all, code, nocode, repeatglitch, rotshape, silhouettes, sqs,  repetr, neonglow, kaleido, shmear, scrollr, pfiver, simplep5, simpleascii, simplewebcam, test]

fxpipe = [all, intro, intro2, enta1, enta2, enta3, enta4, enta5, enta6, enta7, enta8,  final, blackout]
