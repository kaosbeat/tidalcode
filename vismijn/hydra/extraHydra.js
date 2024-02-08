function set0() {
    src(s0).out(o3)
}

function set1() {
    src(s1).out(o3)
}


function set2() {
    src(s2).out(o3)
}

function set3() {
    src(s2).blend(src(s1)).out(o3)
}


function set4() {
    src(s2)
    .scroll(() => a.fft[0])
    .kaleid(() => a.fft[0])  //value = 2 + Math.round(value/127*6)
    .add(src(o2).modulate(o2,0.9),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(2)
    .scale(sc,1,ar/pr)
  //   .blend(src(s3), 0)
    .diff(src(s2), 0.2)
    .out(o3)
}

function set5() {
    src(s1)
//       .repeat(1).kaleid(1)
//     .mult(osc(10,0.1,()=>Math.sin(time)*3).saturate(3).kaleid(200))
//     .modulate(o1,0.5)
    .add(src(s2),0.9)
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
    .modulateRepeatX(src(s2),3, 10)
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
    .kaleid(2)
    .blend(s2,()=>Math.sin(time/4) * 30)
    .modulate(src(s1),1).out(o3)

}



function set9() {
    src(s2).scrollY(0.3).blend(s2,0.4).blend(src(s2).modulate(src(o3),100),0.8).add(src(s2).pixelate(5, () => (a.fft[2]*400) - 100)).out(o3)
}

function set10() {
    src(s2).scrollY(0.3).blend(s2,0.4).blend(src(s2).modulate(src(o3),100),0.8).add(src(s2).pixelate(50, () => a.fft[0]*200 - 100)).modulateKaleid(osc(0.1,0.1,0),3).out(o3)
}



function set11() {
    src(s2).scrollY(0.3).blend(s2,0.4).blend(src(s2).modulate(src(o3),100),0.8).add(src(s2).pixelate(50, () => a.fft[0]*200 - 100)).modulateKaleid(osc(1,0.5,0),3).pixelate(20,20).repeat(3,0.3,0,1).out(o3)
}



function set12() {
    src(s2)
    .scroll(() => p.params.processed[1])
    .kaleid(() => (Math.round(p.params.processed[2]*6)+2))  //value = 2 + Math.round(value/127*6)
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(2)
    .scale(sc,1,ar/pr)
    .out(o3)
    render(o3)
}

function set13() {
    src(s2)
    .scroll(() => p.params.processed[1])
    .kaleid(() => (Math.round(p.params.processed[2]*6)+2))  //value = 2 + Math.round(value/127*6)
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(1)
    .scale(sc,1,ar/pr)
    .mask(shape(100,0.5,0.1).scale(1,1,rw/rh)).out(o3)
    render(o3)


}



function set1() {
    src(s2)
    .scroll(() => p.params.processed[1])
    .kaleid(() => (Math.round(p.params.processed[2]*6)+2))  //value = 2 + Math.round(value/127*6)
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(1)
    .scale(sc,1,ar/pr)
    .out(o3)
    render(o3)
    src(s2).mask(shape(100,0.5,0.1).scale(1,1,rw/rh)).out(o3)
    render(o3)


}
