import { Quadrant } from "./quadrants";

export function initialiseEntries(entries, segments) {
  return entries.map((entry) => {
    const segment = segments(entry.quadrant, entry.ring);
    const point = segment.random();
    return {
      ...entry,
      color: "#000",
      segment,
      x: point.x,
      y: point.y,
    };
  });
  // TODO:
  // - pass quadrants and rings through to initialiseEntries()
  // - allow colour and opacity to be set on a per-ring, per-quadrant or per-entry basis
}

export function numberEntries(segmentedEntries, start = 1) {
  const labelOrder = [
    Quadrant.TOP_LEFT,
    Quadrant.BOTTOM_LEFT,
    Quadrant.TOP_RIGHT,
    Quadrant.BOTTOM_RIGHT,
  ];

  let id = start;
  const labelledEntries = {};

  labelOrder.forEach((quadrant) => {
    labelledEntries[quadrant] = [0, 1, 2, 3].map((ring) => {
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
