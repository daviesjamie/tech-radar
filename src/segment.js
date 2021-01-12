import { constrainToBox, constrainToRing } from "./constrain";
import { toCartesian, toPolar } from "./coordinates";
import { normalBetween, randomBetween } from "./random";
import { quadrantFactors } from "./quadrants";

export default function segmenter({ rings }) {

  function segment(quadrant, ring) {
    const polarMin = {
      t: quadrantFactors[quadrant].radialMin * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius,
    };
    const polarMax = {
      t: quadrantFactors[quadrant].radialMax * Math.PI,
      r: rings[ring].radius,
    };
    const cartesianMin = {
      x: 15 * quadrantFactors[quadrant].x,
      y: 15 * quadrantFactors[quadrant].y,
    };
    const cartesianMax = {
      x: rings[3].radius * quadrantFactors[quadrant].x,
      y: rings[3].radius * quadrantFactors[quadrant].y,
    };
    return {
      clipx(d) {
        const c = constrainToBox(d, cartesianMin, cartesianMax);
        const p = constrainToRing(toPolar(c), polarMin.r + 15, polarMax.r - 15);
        d.x = toCartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy(d) {
        const c = constrainToBox(d, cartesianMin, cartesianMax);
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