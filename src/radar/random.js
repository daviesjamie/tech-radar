export function normalBetween(min, max) {
  return min + (Math.random() + Math.random()) * 0.5 * (max - min);
}

export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}
