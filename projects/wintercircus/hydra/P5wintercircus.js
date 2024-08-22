

function drawParticles(particles){
    // console.log(particles[0].pos)
    for (let i = 0; i < particles.length; i++) {
        let part = particles[i];
        part.update();
        part.display();
    
        if (part.lifespan <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
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