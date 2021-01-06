import * as d3 from "d3";

export default function (config) {
  var svg = d3
    .select(`svg#${config.svgId}`)
    .style("background-color", config.colors.background)
    .attr("width", config.width)
    .attr("height", config.height);

  var radar = svg
    .append("g")
    .attr("transform", `translate(${config.width / 2}, ${config.height / 2})`);

  var grid = radar.append("g");
  grid
    .append("line")
    .attr("x1", 0)
    .attr("y1", -400)
    .attr("x2", 0)
    .attr("y2", 400)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
  grid
    .append("line")
    .attr("x1", -400)
    .attr("y1", 0)
    .attr("x2", 400)
    .attr("y2", 0)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
}
