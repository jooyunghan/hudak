var PIXEL_RATIO = (function() {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

  return dpr / bsr;
})();

function createHiDPICanvas(w, h, ratio) {
  if (!ratio) {
    ratio = PIXEL_RATIO;
  }
  var can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
}

function SOEWindow(parent, canvas) {
  this.parent = parent;
  this.canvas = canvas;
}

SOEWindow.prototype.draw = function(g) {
  var ctx = this.canvas.getContext("2d");
  drawGraphics(ctx, g);
};

function drawGraphics(ctx, g) {
  switch (g.type) {
    case "text":
      drawText(ctx, g);
      break;
    case "ellipse":
      drawEllipse(ctx, g);
      break;
    case "polygon":
      drawPolygon(ctx, g);
      break;
    case "polyline":
      drawPolyline(ctx, g);
      break;
    case "color":
      let oldFill = ctx.fillStyle;
      let oldStroke = ctx.strokeStyle;
      ctx.fillStyle = g.color;
      ctx.strokeStyle = g.color;
      drawGraphics(ctx, g.g);
      ctx.fillStyle = oldFill;
      ctx.strokeStyle = oldStroke;
      break;
  }
}

function drawText(ctx, g) {
  let { x, y, s } = g;

  ctx.font = "12px Times";
  ctx.fillText(s, x, y);
}

function drawEllipse(ctx, g) {
  let { p1, p2 } = g;
  let c = center(p1, p2);

  ctx.beginPath();
  ctx.ellipse(c.x, c.y, c.x - p1.x, c.y - p1.y, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawPolygon(ctx, g) {
  let { points } = g;
  ctx.beginPath();
  let { x, y } = points[points.length - 1];
  ctx.moveTo(x, y);
  for (let p of points) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawPolyline(ctx, g) {
  let { points } = g;
  ctx.beginPath();
  let { x, y } = points[0];
  ctx.moveTo(x, y);
  for (let i = 1; i < points.length; i++) {
    let p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

SOEWindow.prototype.on = function(event, handler) {
  this.parent.addEventListener(event, handler);
};

SOEWindow.prototype.close = function() {
  document.body.removeChild(this.parent);
};

function openWindow(title, w, h) {
  let parent = document.createElement("div");
  parent.innerHTML = `<div>${title}</div>`;
  let canvas = createHiDPICanvas(w, h);
  canvas.style.border = "1px solid";
  parent.appendChild(canvas);
  document.body.appendChild(parent);
  return new SOEWindow(parent, canvas);
}

function text(x, y, s) {
  return {
    type: "text",
    x,
    y,
    s
  };
}

function withColor(c, g) {
  return {
    type: "color",
    color: c,
    g
  };
}

function polygon(points) {
  return {
    type: "polygon",
    points
  };
}

function polyline(points) {
  return {
    type: "polyline",
    points
  };
}

function ellipse(p1, p2) {
  return {
    type: "ellipse",
    p1,
    p2
  };
}

function Point(x, y) {
  return { x, y };
}

function center(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

function fillTri(w, x, y, size) {
  let p = polygon([Point(x, y), Point(x + size, y), Point(x, y - size)]);
  let g = withColor("blue", p);
  w.draw(g);
}

function sierpinskiTri(w, x, y, size) {
  if (size <= 4) {
    fillTri(w, x, y, size);
  } else {
    let size2 = size / 2;
    sierpinskiTri(w, x, y, size2);
    sierpinskiTri(w, x, y - size2, size2);
    sierpinskiTri(w, x + size2, y, size2);
  }
}

function main1() {
  let w = openWindow("My first graphics program", 300, 300);
  w.draw(text(100, 200, "Hello graphics world"));
  w.on("click", () => w.close());
}

function main2() {
  let w = openWindow("Some Graphics Figures", 300, 300);
  let pic1 = withColor("red", ellipse(Point(150, 150), Point(300, 200)));
  let pic2 = withColor(
    "blue",
    polyline([
      Point(100, 50),
      Point(200, 50),
      Point(200, 250),
      Point(100, 250),
      Point(100, 50)
    ])
  );
  w.draw(pic1);
  w.draw(pic2);
  w.on("click", () => w.close());
}

function main3() {
  let w = openWindow("Sierpinski's Triangle", 400, 400);
  sierpinskiTri(w, 50, 300, 256);
  w.on("click", () => w.close());
}

function equilateral(x, y, size, initialTheta) {
  let rads = [0, Math.PI * 2 / 3, Math.PI * 4 / 3];
  if (initialTheta) {
    rads = rads.map(rad => rad + initialTheta);
  }
  let points = rads.map(rad =>
    Point(x + Math.sin(rad) * size, y - Math.cos(rad) * size)
  );
  return polygon(points);
}

function starOfDavid(w, x, y, size) {
  let color = colorOf(size);
  let t1 = equilateral(x, y, size);
  let t2 = equilateral(x, y, size, Math.PI / 3);
  w.draw(withColor(color, t1));
  w.draw(withColor(color, t2));
}

function randomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return (
    Number(r).toString(16) + Number(g).toString(16) + Number(b).toString(16)
  );
}

let colors = new Map();
function colorOf(size) {
  if (colors.has(size)) return colors.get(size);
  color = randomColor();
  colors.set(size, color);
  return color;
}

function snowflake(w, x, y, size) {
  starOfDavid(w, x, y, size);
  if (size <= 8) return;
  const theta = Math.PI / 3;
  const size4 = size * 0.75;
  let points = [0, 1, 2, 3, 4, 5].map(i =>
    Point(x + Math.sin(i * theta) * size4, y - Math.cos(i * theta) * size4)
  );
  points.forEach(p => snowflake(w, p.x, p.y, size / 3));
}

function exercise_3_2() {
  let w = openWindow("Snowflake", 400, 400);
  snowflake(w, 200, 200, 150);
  w.on("click", () => w.close());
}

exercise_3_2();
main3();
main2();
main1();
