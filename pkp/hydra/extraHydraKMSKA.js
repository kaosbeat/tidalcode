function set1() {
    src(s0)
    .scroll(() => params.processed[1])
    .kaleid(() => params.processed[2])
    .add(src(o1).modulate(o1,0.09),.6)
    .scrollY( ({time}) => Math.sin(time*0.05)*0.05 )
    .repeatX(2)
    .color(1,1,0.11)
    .scale(sc,1,ar/pr)
    .out(o1)
}

function set2() {
    src(s0).scroll(() => params.processed[1]).kaleid(() => params.processed[2]).add(src(o1).modulate(o1,0.09),.6).scrollY(() => a.fft[0]*0.1).scale(sc,1,ar/pr).out(o1)
}

function set3() {
    src(s0).modulateRepeatX(src(s3),300, 3.0).modulateScale(src(s3),10,3).pixelate(cc(1).range(20,200),200).out(o1)
}
