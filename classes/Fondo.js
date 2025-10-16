class MiniParticula {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.r = random(2, 4);
    this.life = 30; // duración en frames
  }

  mover() {
    this.pos.add(this.vel);
    this.life--;
  }

  mostrar() {
    noStroke();
    fill(255, map(this.life, 0, 30, 0, 255));
    circle(this.pos.x, this.pos.y, this.r * 2);
  }

  estaViva() {
    return this.life > 0;
  }
}

class Particula {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.r = random(5, 15);
    this.explotando = false;
    this.explosionFrame = 0;
    this.agrupando = false;
    this.miniParticulas = []; // array de partículas hijas
  }

  mover() {
    if (!this.explotando) {
      if (this.agrupando) {
        let dir = createVector(mouseX, mouseY).sub(this.pos);
        dir.setMag(3);
        this.pos.add(dir);
      } else {
        this.pos.add(this.vel);
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
      }
    } else {
      // generar mini partículas
      if (this.explosionFrame === 0) {
        for (let i = 0; i < 10; i++) {
          this.miniParticulas.push(new MiniParticula(this.pos.x, this.pos.y));
        }
      }
      this.explosionFrame++;
      this.pos.add(p5.Vector.random2D().mult(5));

      // mover mini partículas
      for (let mp of this.miniParticulas) mp.mover();
      this.miniParticulas = this.miniParticulas.filter((mp) => mp.estaViva());

      if (this.explosionFrame > 20) {
        this.explotando = false;
        this.explosionFrame = 0;
        this.pos = createVector(random(width), random(height));
        this.r = random(5, 15);
        this.miniParticulas = [];
      }
    }
  }

  mostrar() {
    noStroke();
    fill(255);
    this.dibujarHexagono(this.pos.x, this.pos.y, this.r);

    // dibujar mini partículas
    for (let mp of this.miniParticulas) mp.mostrar();
  }

  dibujarHexagono(x, y, radio) {
    push();
    translate(x, y);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = (TWO_PI / 6) * i;
      let vx = cos(angle) * radio;
      let vy = sin(angle) * radio;
      vertex(vx, vy);
    }
    endShape(CLOSE);
    pop();
  }

  chequearClick(mx, my) {
    let d = dist(mx, my, this.pos.x, this.pos.y);
    if (d < this.r + 5) {
      this.explotando = true;
      this.explosionFrame = 0;
    }
  }

  chequearAgrupacion(agrupaRadio) {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    this.agrupando = mouseIsPressed && d < agrupaRadio;
  }
}
