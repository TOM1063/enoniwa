const scren_saver_sketch = (p) => {
  p.preload = () => preload(p);
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  //   p.mouseDragged = () => mouseDragged(p);
  //   p.mouseReleased = () => mouseReleased(p);
  //   p.touchEnded = () => touchEnded(p);
};

let screen_saver = new p5(scren_saver_sketch);
// screen_saver.remove();

let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

//-----------------style^------------------

let pallete_cold = [];
let pallete_warm = [];

let particles = [];

function preload(p) {}

function setup(p) {
  pallete_cold.push(p.color(0, 179, 189));
  pallete_cold.push(p.color(11, 75, 132));
  pallete_cold.push(p.color(93, 189, 162));

  pallete_warm.push(p.color(285, 158, 0));
  pallete_warm.push(p.color(240, 176, 206));

  p.createCanvas(size.x, size.y);

  for (let i = 0; i < 10; i++) {
    particles.push(
      new Particle(
        p.random(size.x),
        p.random(size.y),
        p.random(400) + 10,
        pallete_cold[p.int(p.random(pallete_cold.length))],
        p
      )
    );
  }
  for (let i = 0; i < 10; i++) {
    particles.push(
      new Particle(
        p.random(size.x),
        p.random(size.y),
        p.random(200) + 10,
        pallete_warm[p.int(p.random(pallete_warm.length))],
        p
      )
    );
  }
}

function draw(p) {
  p.background(255);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(p);
    particles[i].display(p);
  }
}

class Particle {
  constructor(_x, _y, _size, _color, p) {
    this.life = p.random(10);
    this.speed = p.random(10) / 10;
    this.seed = p.random(100);
    this.size = _size;
    this.angle = p.random(p.PI * 2);
    this.vector = new p5.Vector(p.sin(this.angle), p.cos(this.angle));
    this.x = _x;
    this.y = _y;
    this.fract = 0;
    this.old = 0;
    this.color = _color;
    this.random = p.random(100);
  }
  update(p) {
    this.vector.x = 40 * p.noise(this.random, this.random, this.fract) - 20;
    this.vector.y =
      40 * p.noise(this.random, this.random + 100, this.fract) - 20;
    this.x += this.vector.x;
    this.y += this.vector.y;
    this.fract += 0.01;
    this.old = this.fract / this.life;
  }
  display(_graphic) {
    _graphic.noStroke();
    _graphic.fill(
      _graphic.red(this.color),
      _graphic.green(this.color),
      _graphic.blue(this.color),
      60 / (1 + _graphic.sq(this.fract))
    );
    _graphic.circle(this.x, this.y, this.size * _graphic.sq(1 + this.fract));
  }
}
