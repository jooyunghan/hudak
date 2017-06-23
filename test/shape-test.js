const { assert } = require("chai");

const {
  Ellipse,
  Shape,
  Rectangle,
  RtTriangle,
  Polygon,
  Vertex
} = require("../src/shape");

describe("Ellipse", () => {
  it("should equal", () => {
    assert.deepEqual(new Ellipse(1, 2), new Ellipse(1, 2));
    assert.notDeepEqual(new Ellipse(1, 3), new Ellipse(1, 2));
  });
  it("should create with one radius for circle", () => {
    assert.deepEqual(new Ellipse(1), new Ellipse(1, 1));
  });
  it("should be a shape", () => {
    assert.instanceOf(new Ellipse(1), Shape);
  });
});

describe("Shape", () => {
  it("should fold", () => {
    assert.equal(new Ellipse(1, 2).fold(e => "ellipse"), "ellipse");
    assert.equal(new Rectangle(1, 2).fold(null, r => "rectangle"), "rectangle");
    assert.equal(
      new RtTriangle(1, 2).fold(null, null, e => "RtTriangle"),
      "RtTriangle"
    );
    assert.equal(
      new Polygon(1, 2).fold(null, null, null, p => "polygon"),
      "polygon"
    );
  });

  it("should calc area", () => {
    assert.closeTo(new Ellipse(1, 1).area(), Math.PI, 1e-10);
    assert.closeTo(new Rectangle(1, 3).area(), 3, 1e-10);
    assert.closeTo(new RtTriangle(0.0001, 5.126).area(), 0.0002563, 1e-10);
    assert.closeTo(
      new Polygon([Vertex(0, 0), Vertex(0.0001, 0), Vertex(0, 5.126)]).area(),
      0.0002563,
      1e-10
    );
  });
});
