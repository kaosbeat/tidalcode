function set1() {
    src(code).blend(
        osc(()=>a.fft[0]*30,0,0)
          .mult(osc(2,-0.1,1).modulate(noise(3,1)))
          .posterize(5)
          .modulateRotate(code,0.2)	
          .rotate(0.2)
        .saturate(10), 0.5)
        .out(o0)
}

function set2() {
    src(code)
    .scrollX(0.3, 0.1)
    .modulateRepeatX(osc(1), 1, ({
        time
    }) => Math.sin(time) * 0.5)
      .pixelate(() => a.fft[0]*1200,844)
      .colorama(p1*20)
    .add(src(code).saturate(10), 0.7)
    .out(o0);
}


function set3() {
    src(code)
    .posterize(() => (2 + a.fft[0] * 4), 1)
      .scrollY(p2,0)
    .add(src(code).invert(0).saturate(p1*10))
    .out(o0);
}


function set4() {
    src(code)
        .colorama(3)
        .rotate(0.001, () => a.fft[0] * 0.000001)
        .modulateRotate(o0, () => Math.sin(time) * 0.0003)
        .modulate(src(code), () => a.fft[0] * 1)
        .scale(1.2)
          .kaleid(p2)
        .blend(src(code), 0.7)
        .out(o0)
} 

function set5() {
        src(code)
        .color(0, 1, 0)
        .out(o0);
}

function set6() {
    src(code)
        .blend(src(code)
            .pixelate(() => a.fft[0] * 32, 20))
        .out(o0)
}
function set7() {
    src(code)
        .add(src(code)
            .pixelate(() => a.fft[0] * 32, 20))
        .out(o0)
} 


function set8() {
    src(code)
        .invert([0, 1])
        .out(o0);
}

function set9() {
    src(code)
        // 						.blend(solid(0, 1, 0))
        // 						.blend(src(code))
        .blend(src(s3))
        .out(o0);
} 

function set10() {
    osc(() => (a.fft[0] * 10) + 2)
        .modulate(src(code), 1)
        .color(1, 0.2, 0.3)
        .add(src(code))
        .out(o0)
} 

function set11() {
    src(s3)
        .pixelate(() => a.fft[0] * 1000, 1000)
        .blend(code)
        .out(o0);
} 

function set12() {
    osc(() => (a.fft[0] * 10) + 2)
        .modulate(src(code), 10)
        .color(1, 0.2, 0.3)
        .add(src(s3))
        .out(o0)
} 

function set13() {
    src(code)
        .modulate(src(code), 1)
        .color(0.5, 0.2, 0.9)
        .add(src(s3)
            .kaleid(p1 * 10))
        .blend(src(code), 0.6)
        .out(o0)

}

function set14() {
    src(s3)
        .modulate(src(code), 1)
        .color(0.5, 0.2, 0.9)
        .blend(src(code), 0.6)
        .hue(p1)
        .out(o0)
}