let SCENE1_DURATION = 200;
let scene1_time = 0;

function endSketch() {
  console.log("end");
  current_sketch.remove();
  startScreenSaver();
}

function sketch = (p) => {
  p.preload = () => sketch_preload(p);
  p.setup = () => sketch_setup(p);
  p.draw = () => sketch_draw(p);
};

function sketch_preload(p) {}

function sketch_setup(p) {
  p.createCanvas(size.x, size.y);
}

function sketch_draw(p) {
  p.circle(p.mouseX, p.mouseY, 100);
  if (scene1_time > SCENE1_DURATION) {
    p.background(255);
    endSketch();
    scene1_time = 0;
  }
  scene1_time += 1;
}
