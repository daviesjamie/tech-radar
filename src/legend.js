import { translate } from "./coordinates";
import { Quadrant } from "./quadrants";

// prettier-ignore
const legendOffsets = {
  [Quadrant.BOTTOM_RIGHT]: { x:  450, y:   90 },
  [Quadrant.BOTTOM_LEFT]:  { x: -675, y:   90 },
  [Quadrant.TOP_LEFT]:     { x: -675, y: -310 },
  [Quadrant.TOP_RIGHT]:    { x:  450, y: -310 },
};

const addFilter = (parent) => {
  const filter = parent
    .append("defs")
    .append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood").attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite").attr("in", "SourceGraphic");
  return filter;
};

export default function Legend({ parent, quadrants, rings, entries, bubble }) {
  addFilter(parent);
  const legend = parent.append("g");

  legend.transform = (quadrant, ring, index = null) => {
    const dx = ring < 2 ? 0 : 140;
    let dy = index == null ? -16 : index * 12;
    if (ring % 2 === 1) {
      dy = dy + 36 + entries[quadrant][ring - 1].length * 12;
    }
    return translate({
      x: legendOffsets[quadrant].x + dx,
      y: legendOffsets[quadrant].y + dy,
    });
  };

  legend.highlight = (d) =>
    parent
      .select(`#legendItem${d.id}`)
      .attr("filter", "url(#solid)")
      .attr("fill", "white");

  legend.unhighlight = (d) =>
    parent.select(`#legendItem${d.id}`).attr("filter", null).attr("fill", null);

  quadrants.forEach((quadrant, quadrantIndex) => {
    legend
      .append("text")
      .attr(
        "transform",
        translate({
          x: legendOffsets[quadrantIndex].x,
          y: legendOffsets[quadrantIndex].y - 45,
        })
      )
      .text(quadrant.name)
      .classed("legend-title", true);

    rings.forEach((ring, ringIndex) => {
      legend
        .append("text")
        .attr("transform", legend.transform(quadrantIndex, ringIndex))
        .text(ring.name)
        .classed("legend-ring", true);
      legend
        .selectAll(`.legend${quadrantIndex}${ringIndex}`)
        .data(entries[quadrantIndex][ringIndex])
        .enter()
        .append("text")
        .attr("transform", (d, i) =>
          legend.transform(quadrantIndex, ringIndex, i)
        )
        .attr("class", `legend${quadrantIndex}${ringIndex}`)
        .classed("legend-item", true)
        .attr("id", (d) => `legendItem${d.id}`)
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
