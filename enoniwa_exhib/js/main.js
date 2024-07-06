import init, { LogLine } from "../pkg__/wasm_logline.js";

//シーン進行
let scene = 0;
let initializing = false;
let current_sketch = null;
let screen_saver_time = 0;
//760;
let capture_index = 0;

//全体設定
let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

//イニシャライズ
function initialize() {
  current_sketch = null;
  initializing = true;
  startScreenSaver();
}

//　クリーンセーバー定義
const screen_saver_sketch = (p) => {
  p.preload = () => screen_saver_preload(p);
  p.setup = () => screen_saver_setup(p);
  p.draw = () => screen_saver_draw(p);
};

// スクリーンセーバー終了
function endSCreenSaver() {
  console.log("end screen saver");
  particles = [];
  hideScreenSaver();
  nextScene();
}

function startScreenSaver() {
  current_sketch = new p5(screen_saver_sketch);
}

// スクリーンセーバー表示
function displayScreenSaver() {
  console.log("スクリーンセーバー");
  let screen_saver_dom = document.getElementById("screen_saver");
  screen_saver_dom.style.display = "block";
}

function hideScreenSaver() {
  let screen_saver_dom = document.getElementById("screen_saver");
  screen_saver_dom.style.display = "none";
}

//シーン変更
function nextScene() {
  current_sketch.remove();
  console.log(scene);
  current_sketch = new p5(talk);
  scene += 1;
}

//キャプチャ
function capture(p) {
  // console.log("capture");
  // p.save("capture" + String(Date.now()) + ".png");
  // capture_index++;
}

//実行
init().then(() => {
  initialize();
});

//-----------------style^------------------

let pallete_cold = [];
let pallete_warm = [];

let particles = [];

let start_button;

function screen_saver_preload(p) {}

function screen_saver_setup(p) {
  size = {
    x: window.innerWidth,
    y: window.innerHeight,
  };
  pallete_cold.push(p.color(0, 179, 189));
  pallete_cold.push(p.color(11, 75, 132));
  pallete_cold.push(p.color(93, 189, 162));

  pallete_warm.push(p.color(285, 158, 0));
  pallete_warm.push(p.color(255, 184, 217));

  p.createCanvas(size.x, size.y);

  start_button = p.createButton("スタート");
  start_button.mouseClicked(endSCreenSaver);
  start_button.size(200, 80);
  start_button.position(size.x / 2 - 100, size.y / 2 + 300);
  start_button.style("font-family", "sans-serif");
  start_button.style("font-size", "20px");
  start_button.style("background", "rgb(255,255,255,0.1)");
  start_button.style("color", "rgb(0,0,0,0.6)");
  start_button.style("border-color", "rgb(0,0,0,0.6)");
  start_button.style("border-radius", "40px");
  start_button.style("cursor", "pointer");

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

function screen_saver_draw(p) {
  p.background(255);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(p);
    particles[i].display(p);
  }
  if (screen_saver_time > 40) {
    displayScreenSaver();
  }
  screen_saver_time++;
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

//------------------------------------シーン１-------------------------------

let SCENE1_DURATION = 1000;
let scene1_time = 0;

function endSketch() {
  console.log("end");
  current_sketch.remove();
  startScreenSaver();
}

const sketch = (p) => {
  p.preload = () => sketch_preload(p);
  p.setup = () => sketch_setup(p);
  p.draw = () => sketch_draw(p);
};

function sketch_preload(p) {}

function sketch_setup(p) {
  size = {
    x: window.innerWidth,
    y: window.innerHeight,
  };
  p.createCanvas(size.x, size.y);
  p.background(255);
}

function sketch_draw(p) {
  p.circle(p.mouseX, p.mouseY, 100);
  if (scene1_time > SCENE1_DURATION) {
    // p.save("5000Shapes.png");
    capture(p);
    p.background(255);
    endSketch();
    scene1_time = 0;
  }
  scene1_time += 1;
}

//------------------------------------シーン2-------------------------------
//

let loaded_lines = [];
let user_lines = [];
let talk_particles = [];
let movie;
let movie_duration;
let movie_file;
let loaded_layer;
let user_layer;
let effect_layer;

let colorPicker;
let colorPicked;

let loaded_color;
let merged_color;

let prev_logline;
let prev_point;

let currentTime;
let current_id = 0;

let user_rest_frame = 0;

let send_button;
let sending = false;
let sending_time = 0;

let stroke_weight;
let resolution;

const talk = (p) => {
  p.preload = () => talk_preload(p);
  p.setup = () => talk_setup(p);
  p.draw = () => talk_draw(p);
  p.mouseDragged = () => talk_mouseDragged(p);
  p.mouseReleased = () => talk_mouseReleased(p);
};

function talk_preload(p) {
  let line_file;
  if (scene % 3 == 0) {
    line_file = "./data/lines/lines_utouto_long.csv";
    movie_file = "./data/movie/utouto_trimed.mov";
    stroke_weight = 20;
    resolution = 2;
    console.log("set file 1 : ", line_file, movie);
    loaded_color = p.color(pallete_cold[0]);
  } else if (scene % 3 == 1) {
    line_file = "./data/lines/lines_kurukuru.csv";
    movie_file = "./data/movie/kurukuru_trimed_low.mov";
    stroke_weight = 10;
    resolution = 1;
    console.log("set file 2 : ", line_file, movie);
    loaded_color = p.color(pallete_cold[1]);
  } else if (scene % 3 == 2) {
    line_file = "./data/lines/lines_ueshita.csv";
    movie_file = "./data/movie/ueshita_trimed.mov";
    stroke_weight = 20;
    resolution = 1;
    console.log("set file 2 : ", line_file, movie);
    loaded_color = p.color(pallete_cold[2]);
  }
  p.table = p.loadTable(line_file, "csv", "header", () => {
    loaded_lines = getLinesFromTable(p.table);
    // console.log("loaded_lines:", loaded_lines);
  });
}

function talk_setup(p) {
  p.createCanvas(size.x, size.y);
  p.pixelDensity(1);
  p.background(255);
  size = {
    x: window.innerWidth,
    y: window.innerHeight,
  };
  movie = p.createVideo(movie_file);
  movie.size(size.x, size.y);
  movie.volume(0);
  movie.muted = true; //だいじ
  movie.hide();
  movie.play();
  movie_duration = movie.elt.duration;

  //UI
  colorPicker = p.createColorPicker(
    pallete_warm[p.int(p.random(pallete_warm.length))]
  );
  colorPicker.position(20, p.height - 120);
  colorPicker.size(100, 100);

  loaded_layer = p.createGraphics(size.x, size.y);
  loaded_layer.clear();
  user_layer = p.createGraphics(size.x, size.y);
  user_layer.clear();
  effect_layer = p.createGraphics(size.x, size.y);
  effect_layer.clear();

  send_button = p.createButton("送る");
  send_button.mouseClicked(send_pressed);
  send_button.size(200, 80);
  send_button.position(size.x / 2 - 100, size.y / 2 + 300);
  send_button.style("font-family", "sans-serif");
  send_button.style("font-size", "20px");
  send_button.style("background", "rgb(255,255,255,0.1)");
  send_button.style("color", "rgb(0,0,0,0.6)");
  send_button.style("border-color", "rgb(0,0,0,0.6)");
  send_button.style("border-radius", "40px");
  send_button.style("display", "none");
  send_button.style("z-index", "10");
  send_button.style("cursor", "pointer");
}
function endTalk() {
  console.log("end");
  user_lines = [];
  loaded_lines = [];
  talk_particles = [];
  sending = false;
  sending_time = 0;
  user_rest_frame = 0;
  current_sketch.remove();
  send_button.remove();
  movie.remove();
  startScreenSaver();
}

function talk_draw(p) {
  currentTime = movie.time();
  console.log(currentTime);
  user_rest_frame++;
  colorPicked = colorPicker.color();

  if (sending) {
    talk_particles = [];
    colorPicker.remove();
    p.background(255);
    p.translate(p.width / 2, p.height / 2); // 画面の中心に移動
    p.scale(1 - sending_time * 0.01);
    p.rotate(-p.radians(sending_time * 1)); // 回転
    p.translate(0, sending_time * -30); // 上昇
    p.translate(-p.width / 2, -p.height / 2); // 原点に戻る
    sending_time++;
    if (sending_time > 100) {
      endTalk();
    }
    p.background(255, 255 - sending_time * 2.55);
  }
  p.image(loaded_layer, 0, 0);
  draw_loaded(p, currentTime);
  draw_user(p);
  draw_particles(p);
  if (user_rest_frame > 100) {
    send_button.style("display", "block");
  } else {
    send_button.style("display", "none");
  }
}

function send_pressed() {
  sending = true;
}

// if (currentTime > 20) {
//   capture(user_layer);
//   p.background(255);
//   endTalk();
// }

function draw_loaded(p, currentTime) {
  // loaded_layer.background(0);
  for (let line of loaded_lines) {
    let points_length = line.points_length();
    p.strokeWeight(stroke_weight);
    p.stroke(loaded_color);

    for (let i = 0; i < points_length - 1; i++) {
      let point_1 = line.get_point(p.int(i));
      let radius = 200 * p.sqrt(p.sin(((i + 1) / points_length) * p.PI) - 0.1);
      if (
        (currentTime - 100 < point_1.time()) &
        (point_1.time() < currentTime)
      ) {
        loaded_layer.background(255);
        loaded_layer.fill(0, 20);
        loaded_layer.noStroke();
        // loaded_layer.stroke(0, 60);
        // loaded_layer.strokeWeight(4);
        loaded_layer.circle(point_1.x() * size.x, point_1.y() * size.y, radius);
        let point_2 = line.get_point(p.int(i + 1));
        p.line(
          point_1.x() * size.x,
          point_1.y() * size.y,
          point_2.x() * size.x,
          point_2.y() * size.y
        );

        for (let user_line of user_lines) {
          if (user_line) {
            if (
              user_line.is_intersection(
                point_1.x() * size.x,
                point_1.y() * size.y,
                size.x,
                size.y
              ) &&
              p.random(3) > resolution
            ) {
              talk_particles.push(
                new effectParticle(
                  point_1.x() * size.x,
                  point_1.y() * size.y,
                  300,
                  p,
                  merged_color
                )
              );
            }
          }
        }
      }
    }
  }
}

function draw_user(p) {
  p.image(user_layer, 0, 0);
}

function talk_mouseDragged(p) {
  user_rest_frame = 0;
  player_logs(currentTime, p);
}

function talk_mouseReleased(p) {
  prev_point = null;
  user_lines.push(prev_logline);
  prev_logline = false;
  user_rest_frame = 0;

  let new_r = (p.red(colorPicked) + p.red(loaded_color)) / 2;
  let new_g = (p.green(colorPicked) + p.green(loaded_color)) / 2;
  let new_b = (p.blue(colorPicked) + p.blue(loaded_color)) / 2;
  let max = Math.max(new_r, new_g, new_b);
  let lag = 0;
  if (max === new_r) {
    lag = 255 - new_r;
  } else if (max === new_g) {
    lag = 255 - new_g;
  } else if (max === new_b) {
    lag = 255 - new_b;
  }
  new_r += lag;
  new_g += lag;
  new_b += lag;
  merged_color = p.color(new_r, new_g, new_b);
}

function player_logs(f, p) {
  if (prev_logline) {
    prev_logline.add_point(p.mouseX / size.x, p.mouseY / size.y, f);
  } else {
    prev_logline = new LogLine(current_id);
    prev_logline.add_point(p.mouseX / size.x, p.mouseY / size.y, f);
    current_id++;
  }
  if (prev_point) {
    // let dist_from_prev = p.int(
    //   p.dist(prev_point.x, prev_point.y, p.mouseX, p.mouseY)
    // );
    user_layer.stroke(colorPicked);
    // user_layer.strokeWeight((1 + 3 / Math.sqrt(dist_from_prev + 5)) * 10);
    user_layer.strokeWeight(stroke_weight);
    user_layer.noFill();
    user_layer.line(prev_point.x, prev_point.y, p.mouseX, p.mouseY);
  }
  prev_point = new p5.Vector(p.mouseX, p.mouseY);
}

function draw_particles(p) {
  effect_layer.clear();
  for (let i = 0; i < talk_particles.length; i++) {
    let particle = talk_particles[i];
    particle.update(p);
    particle.display(effect_layer);
    if (particle.old > 2.0) {
      talk_particles.splice(i, 1);
    }
  }
  p.image(effect_layer, 0, 0);
}

class effectParticle {
  constructor(_x, _y, _size, p, _color) {
    this.life = p.random(10);
    this.speed = p.random(10) / 10;
    this.seed = p.random(100);
    this.sizze = _size;
    this.angle = p.random(p.PI * 2);
    this.vector = new p5.Vector(p.sin(this.angle), p.cos(this.angle));
    this.x = _x;
    this.y = _y;
    this.fract = 0;
    this.old = 0;
    this.color = _color;
  }
  update(p) {
    this.vector.x +=
      (2 * p.noise(this.seed, 100, this.fract) - 1) * 0.4 * this.speed;
    this.vector.y +=
      (2 * p.noise(this.seed - 100, 120, this.fract) - 1) * 0.4 * this.speed;
    this.x += this.vector.x * 3;
    this.y += this.vector.y * 3;
    this.fract += 0.5;
    this.old = this.fract / this.life;
  }
  display(_graphic) {
    _graphic.noStroke();
    _graphic.fill(this.color);
    _graphic.circle(this.x, this.y, 1 + this.fract);
  }
}

function getLinesFromTable(_table) {
  console.log("row counts :", _table.getRowCount());
  let prev_id = 0;
  let lines = [];
  let fract = 0;
  let first_time = 0;
  for (let i = 0; i < _table.getRowCount(); i += resolution) {
    let frame = i;
    let id = _table.getString(i, 0);
    let u = _table.getString(i, 1);
    let v = 1 - _table.getString(i, 2);
    let log_time = _table.getString(i, 5);
    if (i == 0) {
      first_time = log_time;
    }
    let time = log_time - first_time;

    if (id != prev_id) {
      if (id == "") {
        continue;
      } else {
        fract = 0;
        let new_line = new LogLine(id);
        new_line.add_point(u, v, time);
        lines.push(new_line);
        prev_id = id;
      }
    } else {
      lines[lines.length - 1].add_point(u, v, time);
    }
    fract++;
    // console.log("");
  }
  return lines;
}
