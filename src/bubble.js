import { translate } from "./coordinates";

export default function Bubble(parent, options = {}) {
  const id = options.id || "bubble";
  const radius = options.cornerRadius || 4;

  const bubble = parent
    .append("g")
    .attr("id", id)
    .attr("x", 0)
    .attr("y", 0)
    .classed("bubble", true);

  const background = bubble
    .append("rect")
    .attr("rx", radius)
    .attr("ry", radius);

  const label = bubble.append("text");

  const triangle = bubble.append("path").attr("d", "M 0,0 10,0 5,8 z");

  bubble.hide = () => bubble.style("opacity", 0);
  bubble.hide();

  bubble.show = (d) => {
    label.text(d.label);
    const bbox = label.node().getBBox();

    bubble
      .attr("transform", translate({ x: d.x - bbox.width / 2, y: d.y - 16 }))
      .style("opacity", null);

    background
      .attr("x", -5)
      .attr("y", -bbox.height)
      .attr("width", bbox.width + 10)
      .attr("height", bbox.height + 4);

    triangle.attr("transform", translate({ x: bbox.width / 2 - 5, y: 3 }));
  };

  return bubble;
}
