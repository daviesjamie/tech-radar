export const Quadrant = {
  BOTTOM_RIGHT: 0,
  BOTTOM_LEFT: 1,
  TOP_LEFT: 2,
  TOP_RIGHT: 3,
};

// prettier-ignore
export const quadrantFactors = {
  [Quadrant.BOTTOM_RIGHT]: { radialMin:  0,   radialMax:  0.5, x:  1, y:  1 },
  [Quadrant.BOTTOM_LEFT]:  { radialMin:  0.5, radialMax:  1,   x: -1, y:  1 },
  [Quadrant.TOP_LEFT]:     { radialMin: -1,   radialMax: -0.5, x: -1, y: -1 },
  [Quadrant.TOP_RIGHT]:    { radialMin: -0.5, radialMax:  0,   x:  1, y: -1 },
};

Quadrant.cartesianMax = (quadrant, radius) => ({
  x: quadrantFactors[quadrant].x * radius,
  y: quadrantFactors[quadrant].y * radius,
});

Quadrant.cartesianMin = (quadrant) => ({
  x: quadrantFactors[quadrant].x * 15,
  y: quadrantFactors[quadrant].y * 15,
});

Quadrant.radialMax = (quadrant) =>
  quadrantFactors[quadrant].radialMax * Math.PI;
Quadrant.radialMin = (quadrant) =>
  quadrantFactors[quadrant].radialMin * Math.PI;
