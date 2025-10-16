let particulas = [];
let numParticulas = 100;
let maxDist = 150;
let agrupaRadio = 200;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  canvas.style("position", "fixed");

  for (let i = 0; i < numParticulas; i++) {
    particulas.push(new Particula());
  }
}

function draw() {
  background(0);

  // dibujar líneas entre partículas cercanas
  stroke(255, 100);
  for (let i = 0; i < particulas.length; i++) {
    for (let j = i + 1; j < particulas.length; j++) {
      let d = dist(
        particulas[i].pos.x,
        particulas[i].pos.y,
        particulas[j].pos.x,
        particulas[j].pos.y
      );
      if (d < maxDist) {
        line(
          particulas[i].pos.x,
          particulas[i].pos.y,
          particulas[j].pos.x,
          particulas[j].pos.y
        );
      }
    }
  }

  // mover y mostrar partículas
  for (let p of particulas) {
    p.chequearAgrupacion(agrupaRadio);
    p.mover();
    p.mostrar();
  }
}

function mousePressed() {
  for (let p of particulas) {
    p.chequearClick(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
