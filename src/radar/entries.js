import { Quadrant } from "./quadrants";
import Segments from "./segments";

export function numberEntries(segmentedEntries, rings, start = 1) {
  const labelOrder = [
    Quadrant.TOP_LEFT,
    Quadrant.BOTTOM_LEFT,
    Quadrant.TOP_RIGHT,
    Quadrant.BOTTOM_RIGHT,
  ];

  let id = start;
  const labelledEntries = {};

  labelOrder.forEach((quadrant) => {
    labelledEntries[quadrant] = rings.map((_, ring) => {
      const entries = segmentedEntries[quadrant][ring];
      entries.sort((a, b) => a.label.localeCompare(b.label));
      // eslint-disable-next-line no-plusplus
      return entries.map((entry) => ({ ...entry, id: id++ }));
    });
  });

  return labelledEntries;
}

export function segmentEntries(entries) {
  return entries.reduce((acc, entry) => {
    acc[entry.quadrant] ||= {};
    acc[entry.quadrant][entry.ring] ||= [];
    acc[entry.quadrant][entry.ring].push(entry);
    return acc;
  }, {});
}

export function computeEntries({ entries, quadrants, rings }) {
  const segmentedEntries = segmentEntries(entries);
  const labelledEntries = numberEntries(segmentedEntries, rings);
  const segments = Segments({ rings });

  return Object.values(labelledEntries)
    .flat(2)
    .map((entry) => {
      const ring = rings[entry.ring];
      const quadrant = quadrants[entry.quadrant];
      const segment = segments(entry.quadrant, entry.ring);
      const point = segment.random();

      return {
        color: quadrant.color || ring.color || "#000",
        opacity: quadrant.opacity || ring.opacity || 1,
        segment,
        ...point,
        ...entry,
      };
    });
}
