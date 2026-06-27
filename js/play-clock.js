new p5(function(p) {
  let manualHourAngle, manualMinAngle;
  let draggingHour = false;
  let draggingMin  = false;
  let cx, cy, r;

  let dragCount = 0;
  const malfunctionThreshold = 4;
  let malfunctioning = false;

  let hourOffsetX     = new Array(13).fill(0);
  let hourOffsetY     = new Array(13).fill(0);
  let minOffsetX      = new Array(12).fill(0);
  let minOffsetY      = new Array(12).fill(0);
  let hourOffsetAngle = new Array(13).fill(0);

  const numColumns = 40;
  let colX = [], colY = [], colSpeed = [], colChar = [];

  function randomChar() {
    const pool = '01010110100110!@#$%^&*?<>{}[]';
    return pool.charAt(Math.floor(p.random(pool.length)));
  }

  function scrambleNumbers(level) {
    const spread = level * 80;
    for (let i = 1; i <= 12; i++) {
      hourOffsetX[i]     = p.random(-spread, spread);
      hourOffsetY[i]     = p.random(-spread, spread);
      hourOffsetAngle[i] = p.random(-level, level);
    }
    for (let i = 0; i < 12; i++) {
      minOffsetX[i] = p.random(-spread * 0.6, spread * 0.6);
      minOffsetY[i] = p.random(-spread * 0.6, spread * 0.6);
    }
  }

  function drawArrowHand(hx, hy, angle, len, c, w, arrowSize) {
    const tipX  = hx + Math.cos(angle) * len;
    const tipY  = hy + Math.sin(angle) * len;
    const baseX = hx - Math.cos(angle) * len * 0.2;
    const baseY = hy - Math.sin(angle) * len * 0.2;
    p.stroke(c);
    p.strokeWeight(w);
    p.strokeCap(p.ROUND);
    p.line(baseX, baseY,
           tipX - Math.cos(angle) * arrowSize * 0.6,
           tipY - Math.sin(angle) * arrowSize * 0.6);
    const perpX = -Math.sin(angle);
    const perpY =  Math.cos(angle);
    p.fill(c);
    p.noStroke();
    p.beginShape();
    p.vertex(tipX, tipY);
    p.vertex(tipX - Math.cos(angle) * arrowSize + perpX * arrowSize * 0.5,
             tipY - Math.sin(angle) * arrowSize + perpY * arrowSize * 0.5);
    p.vertex(tipX - Math.cos(angle) * arrowSize * 0.5,
             tipY - Math.sin(angle) * arrowSize * 0.5);
    p.vertex(tipX - Math.cos(angle) * arrowSize - perpX * arrowSize * 0.5,
             tipY - Math.sin(angle) * arrowSize - perpY * arrowSize * 0.5);
    p.endShape(p.CLOSE);
  }

  p.setup = function() {
    let canvas = p.createCanvas(500, 520);
    canvas.parent('time-clock');
    p.smooth();

    cx = p.width / 2.0;
    cy = p.height / 2.0 - 20;
    r  = 200;

    const s = p.second();
    const m = p.minute() + s / 60.0;
    const h = (p.hour() % 12) + m / 60.0;
    manualHourAngle = p.map(h, 0, 12, -p.HALF_PI, p.TWO_PI - p.HALF_PI);
    manualMinAngle  = p.map(m, 0, 60, -p.HALF_PI, p.TWO_PI - p.HALF_PI);

    for (let i = 0; i < numColumns; i++) {
      colX.push(p.random(p.width));
      colY.push(p.random(-p.height, 0));
      colSpeed.push(p.random(1.5, 4.0));
      colChar.push(randomChar());
    }
  };

  p.draw = function() {
    p.background(255);

    const glitchLevel = malfunctioning
      ? Math.min(1.0, (dragCount - malfunctionThreshold) / 6.0) : 0;

    if (malfunctioning && p.frameCount % 8 === 0) scrambleNumbers(glitchLevel);

    if (dragCount >= 6) {
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(13);
      for (let i = 0; i < numColumns; i++) {
        p.fill(80, 80, 80, 160);
        p.noStroke();
        p.text(colChar[i], colX[i], colY[i]);
        colY[i] += colSpeed[i];
        if (p.frameCount % 6 === 0) colChar[i] = randomChar();
        if (colY[i] > p.height) {
          colY[i]     = p.random(-40, 0);
          colX[i]     = p.random(p.width);
          colSpeed[i] = p.random(1.5, 4.0);
        }
      }
    }

    p.fill(255, 212, 247);
    p.noStroke();
    p.ellipse(cx + 4, cy + 6, r * 2, r * 2);
    p.fill(255, 196, 254);
    p.noStroke();
    p.ellipse(cx, cy, r * 2, r * 2);

    for (let i = 0; i < 60; i++) {
      const a = p.map(i, 0, 60, -p.HALF_PI, p.TWO_PI - p.HALF_PI);
      const x = cx + Math.cos(a) * (r - 18);
      const y = cy + Math.sin(a) * (r - 18);
      if (i % 5 === 0) {
        const idx = i / 5;
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(13);
        p.fill(30, 60, 180);
        p.noStroke();
        p.text(i === 0 ? 60 : i, x + minOffsetX[idx], y + minOffsetY[idx]);
      } else {
        p.fill(30, 60, 180);
        p.noStroke();
        p.ellipse(x, y, 3, 3);
      }
    }

    p.textAlign(p.CENTER, p.CENTER);
    for (let i = 1; i <= 12; i++) {
      const a       = p.map(i, 0, 12, -p.HALF_PI, p.TWO_PI - p.HALF_PI);
      const wobbleR = malfunctioning ? (r - 55) + hourOffsetAngle[i] * 40 : (r - 55);
      const x = cx + Math.cos(a) * wobbleR;
      const y = cy + Math.sin(a) * wobbleR;
      p.textSize(malfunctioning ? 38 + hourOffsetAngle[i] * 20 : 38);
      p.fill(210, 30, 30);
      p.noStroke();
      p.text(i, x + hourOffsetX[i], y + hourOffsetY[i]);
    }

    p.noFill();
    p.stroke(255, 212, 247);
    p.strokeWeight(5);
    p.ellipse(cx, cy, r * 2, r * 2);

    drawArrowHand(cx, cy, manualHourAngle, r * 0.52, p.color(200, 30, 30), 14, 28);
    drawArrowHand(cx, cy, manualMinAngle,  r * 0.72, p.color(30, 60, 200), 12, 24);
  };

  p.mousePressed = function() {
    const hourTipX = cx + Math.cos(manualHourAngle) * r * 0.52;
    const hourTipY = cy + Math.sin(manualHourAngle) * r * 0.52;
    const minTipX  = cx + Math.cos(manualMinAngle)  * r * 0.72;
    const minTipY  = cy + Math.sin(manualMinAngle)  * r * 0.72;
    const dHour = p.dist(p.mouseX, p.mouseY, hourTipX, hourTipY);
    const dMin  = p.dist(p.mouseX, p.mouseY, minTipX,  minTipY);
    if (dHour < 40 || dMin < 40) {
      if (dHour < dMin) draggingHour = true;
      else              draggingMin  = true;
    }
  };

  p.mouseDragged = function() {
    const angle = Math.atan2(p.mouseY - cy, p.mouseX - cx);
    if (draggingHour)     manualHourAngle = angle;
    else if (draggingMin) manualMinAngle  = angle;
  };

  p.mouseReleased = function() {
    if (draggingHour || draggingMin) {
      dragCount++;
      if (dragCount >= malfunctionThreshold) {
        malfunctioning = true;
        scrambleNumbers(Math.min(1.0, (dragCount - malfunctionThreshold) / 6.0));
      }
    }
    draggingHour = false;
    draggingMin  = false;
  };
});
