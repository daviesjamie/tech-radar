export function toCartesian(polar) {
  return {
    x: polar.r * Math.cos(polar.t),
    y: polar.r * Math.sin(polar.t),
  };
}

export function toPolar(cartesian) {
  const { x, y } = cartesian;
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y),
  };
}

export function translate({ x, y }) {
  return `translate(${x}, ${y})`;
}
