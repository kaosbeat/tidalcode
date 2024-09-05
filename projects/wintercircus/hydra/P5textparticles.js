function drawParticles(p5){
    // console.log(particles[0].pos)
    p5.push()
    p5.textSize(36);
    p5.translate(-width/2, -height -100 )
    for (let i = 0; i < p5.particles.length; i++) {
        let part = p5.particles[i];
        part.update();
        part.display();
    
        if (part.lifespan <= 0) {
          p5.particles.splice(i, 1);
          i--;
        }
      }
    p5.pop()
      
}

function initTextParts(p5){
  p5.textconfig = {}
  p5.myFont = p5.loadFont('hydra/PressStart2P-Regular.otf');
  p5.textFont(p5.myFont);
  p5.particles = [];
  p5.textconfig.render = true ;
  p5.textconfig.f = 0;
}


class Particle {
    constructor(x, y, z, txt, p) {
      this.p5 = p
      this.txt = txt
      this.pos = this.p5.createVector(x, y, z);
    //   this.vel = this.p5.createVector(this.p5.random(-10, 10), this.p5.random(2, 4),  this.p5.random(2, 4));
      this.vel = this.p5.createVector(this.p5.random(-8, -4), 0, 0);
      this.lifespan = 255;
    }
  
    update() {
      this.pos.add(this.vel);
      if (this.pos.x < 10){
        this.lifespan -= 5;
      }
    }
  
    display() {
    //   console.log("drawing pat")
      if (this.p5.textconfig.render) {
        // this.p5.stroke(255, this.lifespan);
        this.p5.fill(255, this.lifespan / 2);
        this.p5.push()
        this.p5.translate(this.pos.x, this.pos.y, this.pos.z)
        // this.p5.box(20)
        // this.p5.ellipse(0, 0, 16, 16);
        this.p5.text(this.txt,0,0)
        this.p5.pop()
      }
    }
  }



function updateParticles(p5) {
  if (p5.particles.length < 50){
    // Add new particles
      for (let i = 0; i < 2; i++) {
        p5.textconfig.f++;
        let x = width;
        let y = (p5.textconfig.f%50)*36;
        let z = 0-(p5.textconfig.f%50)*y/144;
        if (p5.textconfig.f%50 < 25) {
        	z = (p5.textconfig.f%50)*36;
        }
        let txt = techTerms[Math.floor(Math.random() * techTerms.length)];
        let part = new Particle(x, y, z, txt, p);
        p5.particles.push(part);
      }
    }
}


  
// 	p5.push();
//     for (var i = 0; i < techTerms.length; i++) {
// //       p5.text(techTerms[i], 10, 20*i);
// 	}
// // 	p5.rotateX(p5.frameCount * 0.1 );
// //   	p5.translate(0,p5.frameCount%height )
// // 	p5.rotateY(p5.frameCount * 0.01 );
// // 	p5.rotateZ(p5.frameCount * 0.031 );
// // 	p5.box(300)
// //     p5.fill('#ED225D');
  
  	