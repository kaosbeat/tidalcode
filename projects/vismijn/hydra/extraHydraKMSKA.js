function set1() {
    src(s0)
    .scroll(() => params.processed[1])
    .kaleid(() => (Math.round(params.processed[2]*6)+2))  //value = 2 + Math.round(value/127*6)
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(2)
    .scale(sc,1,ar/pr)
    .out(o1)
}

function set2() {
    src(s0)
    .scroll(() => params.processed[1])
    .kaleid(() => (Math.round(params.processed[2]*6)+2))
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY(() => a.fft[p.activeaudiobin ]*0.1)
    .scale(sc,1,ar/pr)
    .out(o1)
}

function set3() {
    src(s0)
    .modulateRepeatX(src(s3),300, 3.0)
    .modulateScale(src(s3),10,3)
    .pixelate(() => (params.processed[1]*180)+20,200)
    .out(o1)
}


function set4() {
    src(s0).blend(s3,0.4).blend(src(s0).modulate(src(o1),10),0.8).blend(s2).out(o1)
}
