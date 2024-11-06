

function set0() {
    /// webcam
    src(s0).out(o3)
}

function set1() {
    /// AI img
    src(s1).out(o3)
}


function set2() {
    // P5 render
    src(s2).out(o3)
}

function set3() {
    voronoi(350,0.15)
  	.modulateScale(osc(8).rotate(Math.sin(time)),.5)
  	.thresh(.8)
	.modulateRotate(osc(7),.4)
	.thresh(.7)
  	.diff(src(s1).scale(1.8))
	.modulateScale(osc(2).modulateRotate(o3,.74))
	.diff(src(o3).rotate([-.012,.01,-.002,0]).scrollY(0,[-1/199800,0].fast(0.7)))
	.brightness([-.02,-.17].smooth().fast(.5))
    .blend(solid(0),0.5)
    .blend(src(o3),0.1)
    .modulateRotate(osc(3),0.5)
	.out(o3)
}


function set4() {
    src(s2)
    // .scroll(() => a.fft[0])
    // .kaleid(() => a.fft[0]*10)  //value = 2 + Math.round(value/127*6)
    .kaleid(5)  //value = 2 + Math.round(value/127*6)
    .add(src(o2).modulate(o2,0.9),.6)
    .scrollY( () => Math.sin(time*0.05)*0.05 )
    // .repeatX(() => a.fft[1]*10)
    .rotate( () => Math.sin(time*0.05)*0.05 )
    // .scale(sc,1,ar/pr)
  //   .blend(src(s3), 0)
    // .diff(src(s2), 0.9)
    .out(o3)
}



function set5() {
    src(s2)
//       .repeat(1).kaleid(1)
    .mult(osc(10,0.1,()=>Math.sin(time)*3).saturate(3).kaleid(200))
    .modulate(o1,0.5)
    .add(src(s2),0.2)
    .scrollY( ()=>Math.sin(time)*0.03 + 0)
    .luma(0.7).out(o3)
}

function set6() {
    src(s0).out(o0)
    osc(6,-0.015,0.3).diff(osc(6,0.08).rotate(Math.PI/2))
	.color(1,0.5,0.4).contrast(1.4)
	.scrollX(() => time%10*0.2)
	.add(src(s1))
    .diff(src(o0).invert())
// 	.modulateRotate(o1, 2, 1)
	.modulateRotate(osc(1,0.5,0).kaleid(50).scale(0.5),15,0)
//   	.out(o1)
    .sub(src(s2))
	.brightness(0.1).contrast(1.2)
	.modulateScale(osc(2),-0.2)
  .out(o3)
}

function set7() {
    src(s0).invert()
    .modulateRepeatX(src(s2).scale(),3, 10)
    .modulateScale(src(s2),10,10)
    .pixelate(() => a.fft[0]*80,80)
    .mask(src(s0).invert(), 0.1)
//     src(s0).layer(src(o2))
    .out(o3)
}


function set8() {
    src(s2)
//     .modulateScale(osc(40,0,1))
    .scrollY(() => a.fft[0]*1)
    // .kaleid(8)
    .blend(s2,()=>Math.sin(time/4) * 30)
    // .modulate(src(s1).scale(2),1)
    // .blend(solid(0),0.9)
    .out(o3)

}



function set9() {
    src(s2)
        .scrollY(0.3)
        .blend(s2,0.4)
        .blend(src(s2).modulate(src(o3),100),0.8)
        .add(src(s2)
        .pixelate(5, () => (a.fft[2]*400) - 100))
        .blend(src(s1).scale(2).modulateKaleid(osc(1,0.5,0),2), 0.2)
        .out(o3)
}

function set10() {
    src(s2)
        .scrollY(0.3)
        .blend(s2,0.4)
        .blend(src(s2)
        .modulate(src(o3),100),0.8)
        .add(src(s2)
        .pixelate(50, () => a.fft[0]*200 - 100))
        .modulateKaleid(osc(0.1,0.1,0),3)
        .blend(src(s1))
    .out(o3)
}



function set11() {
    src(s2)
    .scrollY(0.3)
    .blend(s2,0.4)
    .blend(src(s2)
    .modulate(src(o3),100),0.8)
    .add(src(s2)
    .pixelate(50, () => a.fft[0]*200 - 100))
    .modulateKaleid(osc(1,0.5,0),3)
    .pixelate(20,20)
    .repeat(3,0.3,0,1)
    .add(src(s0).colorama(0.3).diff(s1).scale(2))
    .out(o3)
}


function set12() {
    noise(3,0.1,7)
    //   .rotate(1,1)
       .add(voronoi(1000,1).contrast(1))
      .rotate(1).scrollX([0.1,-0.0625,0.005,0.00001],0)
    .out(o1)
    
    
    
    
    src(o1)
    //   .blend(src(s2))
        .thresh(.0)
          .diff(src(s2).scale(1.8))
      .blend(src(s2).scroll( () => Math.sin(time/400) * 30), 0.4)
      .blend(src(s2).scroll(0.4))
    //   .blend(src(s2))
      .blend(src(s2))
        .diff(src(o1))
    //   .blend(src(s2))
      .out(o3)  

}