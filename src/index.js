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
  let { x, y, s } = g;
  var ctx = this.canvas.getContext("2d");
  ctx.font = "12px Times";
  ctx.fillText(s, x, y);
};

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
    x,
    y,
    s
  };
}

let w = openWindow("My first graphics program", 300, 300);
w.draw(text(100, 200, "Hello graphics world"));
w.on("click", () => w.close());
