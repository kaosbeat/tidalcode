pb.setName("p5")
setResolution(1436, 844)


// Type some code on a new line (such as "osc().out()"), and press CTRL+shift+entera.show()
a.show()
a.setBins(4)
a.setCutoff(4)
a.setScale(2)

// render black
// solid(1)
// 	.out(o0)
// //render code
// src(s2)
// 	.out(o0);

// render(o0)

//vars
b = 0;
xs = 100
a.onBeat = () => {
	b += 1;
  	xs = Math.round((Math.random()*1000));
}

p = new P5({ mode: "WEBGL" })
p.hide()
s0.init({ src: p.canvas })

src(s0).out()

p.draw = () => {
  console.log(b)
    p.background(0);
    p.normalMaterial();
    p.push();
    p.rotateZ(p.frameCount * 0.01);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.box(70,xs,xs);
    p.pop();
}
