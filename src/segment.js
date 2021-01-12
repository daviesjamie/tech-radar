import { constrainToBox, constrainToRing } from "./constrain";
import { toCartesian, toPolar } from "./coordinates";
import { normalBetween, randomBetween } from "./random";
import { Quadrant } from "./quadrants";

export default function segmenter({ rings }) {
  const { radius } = rings[rings.length - 1];

  function segment(quadrant, ring) {
    const polarMin = {
      t: Quadrant.radialMin(quadrant),
      r: ring === 0 ? 30 : rings[ring - 1].radius,
    };

    const polarMax = {
      t: Quadrant.radialMax(quadrant),
      r: rings[ring].radius,
    };

    return {
      clipx(d) {
        const c = constrainToBox(d, Quadrant.cartesianMin(quadrant), Quadrant.cartesianMax(quadrant, radius));
        const p = constrainToRing(toPolar(c), polarMin.r + 15, polarMax.r - 15);
        d.x = toCartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy(d) {
        const c = constrainToBox(d, Quadrant.cartesianMin(quadrant), Quadrant.cartesianMax(quadrant, radius));
        const p = constrainToRing(toPolar(c), polarMin.r + 15, polarMax.r - 15);
        d.y = toCartesian(p).y; // adjust data too!
        return d.y;
      },
      random() {
        return toCartesian({
          t: randomBetween(polarMin.t, polarMax.t),
          r: normalBetween(polarMin.r, polarMax.r),
        });
      },
    };
  }

  return segment;
}