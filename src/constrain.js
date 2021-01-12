export function constrainToInterval(value, min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

export function constrainToRing(polar, rMin, rMax) {
  return {
    t: polar.t,
    r: constrainToInterval(polar.r, rMin, rMax),
  };
}

export function constrainToBox(point, min, max) {
  return {
    x: constrainToInterval(point.x, min.x, max.x),
    y: constrainToInterval(point.y, min.y, max.y),
  };
}