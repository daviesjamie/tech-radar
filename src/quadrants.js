export const quadrantFactors = [
  { radialMin: 0, radialMax: 0.5, x: 1, y: 1 },
  { radialMin: 0.5, radialMax: 1, x: -1, y: 1 },
  { radialMin: -1, radialMax: -0.5, x: -1, y: -1 },
  { radialMin: -0.5, radialMax: 0, x: 1, y: -1 },
];

export const quadrants = quadrantFactors.map((quadrantFactor) => ({
  radialMin: quadrantFactor.radialMin * Math.PI,
  radialMax: quadrantFactor.radialMax * Math.PI,
  x: quadrantFactor.x * 15,
  y: quadrantFactor.y * 15,
}));
