export function calculateRingSizes(minRadius, maxRadius, rings) {
  const ringSpacing = (maxRadius - minRadius) / (rings.length - 1);
  return rings.map((ring, i) => ({
    radius: minRadius + ringSpacing * i,
    ...ring,
  }));
}

export function drawGrid(parent, rings) {
  const grid = parent.append("g");
  const { radius } = rings[rings.length - 1];

  // draw grid lines
  grid
    .append("line")
    .attr("x1", 0)
    .attr("y1", -radius)
    .attr("x2", 0)
    .attr("y2", radius)
    .classed("grid", true);

  grid
    .append("line")
    .attr("x1", -radius)
    .attr("y1", 0)
    .attr("x2", radius)
    .attr("y2", 0)
    .classed("grid", true);

  // draw rings
  rings.forEach((ring) => {
    grid
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", ring.radius)
      .classed("grid", true);

    grid
      .append("text")
      .text(ring.name)
      .attr("y", -ring.radius + 62)
      .attr("text-anchor", "middle")
      .classed("ring-label", true);
  });
}
