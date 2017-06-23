const inherits = require("./inherits");

function Shape() {}

Shape.prototype.fold = function(e, r, t, p) {
  if (this instanceof Ellipse) {
    return e(this);
  } else if (this instanceof Rectangle) {
    return r(this);
  } else if (this instanceof RtTriangle) {
    return t(this);
  } else if (this instanceof Polygon) {
    return p(this);
  } else {
    throw new Error("`this` is not a Shape." + this);
  }
};

Shape.prototype.area = function() {
  return this.fold(
    ({ r1, r2 }) => Math.PI * r1 * r2,
    ({ s1, s2 }) => s1 * s2,
    ({ s1, s2 }) => s1 * s2 / 2,
    ({ points }) => polyArea(points)
  );
};

function polyArea(points) {
  const p0 = points[0];
  let area = 0;
  for (let i = 1; i +1 < points.length; i++) {
    const x1 = points[i].x - p0.x;
    const y1 = points[i].y - p0.y;
    const x2 = points[i+1].x - p0.x;
    const y2 = points[i+1].y - p0.y;
    const cross = x1*y2 - x2*y1;
    area += cross;
  }
  return Math.abs(area/2.0);
}

// function triArea(p1, p2, p3) {
//   const a = distBetween(p1, p2);
//   const b = distBetween(p2, p3);
//   const c = distBetween(p3, p1);
//   const s = 0.5 * (a + b + c);
//   return Math.sqrt(s * (s - a) * (s - b) * (s - c));
// }

// function distBetween(p1, p2) {
//   const x = p1.x - p2.x;
//   const y = p1.y - p2.y;
//   return Math.sqrt(x * x + y * y);
// }

function Ellipse(r1, r2) {
  this.r1 = r1;
  this.r2 = r2 || r1; // circle
}

inherits(Ellipse, Shape);

function Rectangle(s1, s2) {
  this.s1 = s1;
  this.s2 = s2;
}

inherits(Rectangle, Shape);

function RtTriangle(s1, s2) {
  this.s1 = s1;
  this.s2 = s2;
}

inherits(RtTriangle, Shape);

function Polygon(points) {
  this.points = points;
}

inherits(Polygon, Shape);

function Vertex(x, y) {
  return { x, y };
}

module.exports = {
  Shape,
  Ellipse,
  Rectangle,
  RtTriangle,
  Polygon,
  Vertex
};
