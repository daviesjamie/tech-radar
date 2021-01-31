import { translate } from "./coordinates";
import { segmentEntries } from "./entries";
import { Quadrant } from "./quadrants";

const addFilter = (parent) => {
  const filter = parent
    .append("defs")
    .append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "legend-highlight-filter");
  filter.append("feFlood");
  filter.append("feComposite").attr("in", "SourceGraphic");
  return filter;
};

export default function Legend(params) {
  // prettier-ignore
  const offsets = {
    [Quadrant.BOTTOM_RIGHT]: { x:  450, y:   90 },
    [Quadrant.BOTTOM_LEFT]:  { x: -675, y:   90 },
    [Quadrant.TOP_LEFT]:     { x: -675, y: -310 },
    [Quadrant.TOP_RIGHT]:    { x:  450, y: -310 },
    ...params.legendOffsets,
  };

  const { bubble, parent, rings, quadrants } = params;
  const entries = segmentEntries(params.entries);

  const colWidth = params.legendColumnWidth || 140;
  const lineSpacing = params.legendLineSpacing || 12;
  const quadrantOffset = params.legendQuadrantOffset || -45;
  const ringOffset = params.legendRingOffset || -16;
  const sectionOffset = params.legendSectionOffset || 36;

  const elemId = ({ id }) => `legend-item-${id}`;
  const highlightClass = "legend-highlight";
  const segmentClass = (quadrant, ring) => `legend-${quadrant}-${ring}`;

  addFilter(parent);
  const legend = parent.append("g");

  legend.transform = (quadrant, ring, index = null) => {
    const dx = ring < 2 ? 0 : colWidth;
    let dy = index == null ? ringOffset : index * lineSpacing;

    if (ring % 2 === 1) {
      dy += sectionOffset + entries[quadrant][ring - 1].length * lineSpacing;
    }

    return translate({
      x: offsets[quadrant].x + dx,
      y: offsets[quadrant].y + dy,
    });
  };

  legend.highlight = (d) =>
    parent.select(`#${elemId(d)}`).classed(highlightClass, true);

  legend.unhighlight = (d) =>
    parent.select(`#${elemId(d)}`).classed(highlightClass, false);

  quadrants.forEach((quadrant, quadrantIndex) => {
    // Add quadrant title
    legend
      .append("text")
      .attr(
        "transform",
        translate({
          x: offsets[quadrantIndex].x,
          y: offsets[quadrantIndex].y + quadrantOffset,
        })
      )
      .text(quadrant.name)
      .classed("legend-title", true);

    rings.forEach((ring, ringIndex) => {
      // Add ring title
      legend
        .append("text")
        .attr("transform", legend.transform(quadrantIndex, ringIndex))
        .text(ring.name)
        .classed("legend-ring", true);

      // Add entry listing
      legend
        .selectAll(`.${segmentClass(quadrantIndex, ringIndex)}`)
        .data(entries[quadrantIndex][ringIndex])
        .enter()
        .append("text")
        .attr("transform", (d, i) =>
          legend.transform(quadrantIndex, ringIndex, i)
        )
        .classed(`legend-item ${segmentClass(quadrantIndex, ringIndex)}`, true)
        .attr("id", (d) => elemId(d))
        .text((d) => `${d.id}. ${d.label}`)
        .on("mouseover", (event, d) => {
          bubble.show(d);
          legend.highlight(d);
        })
        .on("mouseout", (event, d) => {
          bubble.hide();
          legend.unhighlight(d);
        });
    });
  });

  return legend;
}
