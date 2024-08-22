setResolution(400,600);



osc(10, 0.01, 1.4)
	.rotate(0, 0.4)
	.mult(osc(10, 0.1).modulate(osc(10).rotate(0, -0.1), 1))
	.color(2.3,2.91,4.39)
  .out(o1)

s0.initImage("https://localhost:8000/img/byob/elements/blacktext_layer.png");
s1.initImage("https://localhost:8000/img/byob/elements/framemask_layer.png")
s2.initImage("https://localhost:8000/img/byob/artists/artist1.png");
s3.initImage("https://localhost:8000/img/byob/elements/ovalmask_layer.png");


src(s1).posterize( [1, 5, 15, 30] , 0.5 ).diff(s0).out(o0)

//LAYER 0
osc(40,0.1,8).rotate(3.14/2).color(1,0,1).pixelate(20, 2000).sub(s0).out(o0)


// Layer1
osc(40,0.1,8).color(1,0,1).pixelate(20, 2000).sub(s1).out(o1)



// KAOS MASK
// src(o1).mask(s1).out(o2)

// ARTIST MASK
src(s2 ).mask(s3).out(o2)


// src(o0).add(o3).diff(s1).out(o2)

// src(o0).add(s1).diff(s2).out(o1)


// src(o2).add(o3).add(src(s0).invert(1)).out(o0)

src(o0).diff(o1).add(o2).out(o3)

render(o3)

