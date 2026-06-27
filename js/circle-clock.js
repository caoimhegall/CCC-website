new p5(function(p) {
  p.setup = function() {
    let canvas = p.createCanvas(500, 500);
    canvas.parent('growing-circle-clock');
    p.smooth();
  };

  p.draw = function() {
    p.background(255);

    let cx = p.width / 2.0;
    let cy = p.height / 2.0;

    let ms = p.millis() % 1000 / 1000.0;
    let s  = p.second() + ms;
    let m  = p.minute() + s / 60.0;
    let h  = (p.hour() % 12) + m / 60.0;

    let sSize = (s / 60.0) * 120 + 20;
    let mSize = (m / 60.0) * 120 + 20;
    let hSize = (h / 12.0) * 180 + 30;

    p.textAlign(p.CENTER, p.CENTER);

    p.fill(252, 223, 3, 46);
    p.textSize(hSize);
    p.text('HOUR', cx, cy);
    p.fill(206, 58, 58);
    p.textSize(hSize);
    p.text('HOUR', cx, cy);

    p.fill(255, 153, 0, 217);
    p.textSize(mSize);
    p.text('MINUTE', cx, cy);

    p.fill(252, 223, 3, 166);
    p.textSize(sSize);
    p.text('SECOND', cx, cy);
  };
});
