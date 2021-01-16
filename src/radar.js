import * as d3 from "d3";

import Bubble from "./bubble";
import { translate } from "./coordinates";
import { computeEntries } from "./entries";
import { computeRings, drawGrid } from "./grid";
import Legend from "./legend";

import "./radar.css";

export default function D3Radar(params) {
  const config = {
    height: 1000,
    minRadius: 130,
    maxRadius: 400,
    titleOffset: { x: -675, y: -420 },
    width: 1450,
    ...params,
  };

  const rings = computeRings(config);
  const entries = computeEntries({ entries: config.entries, rings });

  const svg = config.svgId
    ? d3.select(`#${config.svgId}`)
    : d3.select("body").append("svg");
  svg
    .attr("width", config.width)
    .attr("height", config.height)
    .classed("d3-radar", true);

  const radar = svg
    .append("g")
    .attr(
      "transform",
      translate({ x: config.width / 2, y: config.height / 2 })
    );

  drawGrid(radar, rings);

  // title
  radar
    .append("text")
    .attr("transform", translate(config.titleOffset))
    .text(config.title)
    .classed("title", true);

  // layer for entries
  const rink = radar.append("g").attr("id", "rink");

  // rollover bubble (on top of everything else)
  const bubble = Bubble(radar);

  // legend
  const legend = Legend({
    ...config,
    bubble,
    entries,
    parent: radar,
    rings,
  });

  // draw blips on radar
  const blips = rink
    .selectAll(".blip")
    .data(entries)
    .enter()
    .append("g")
    .attr("class", "blip")
    .on("mouseover", (event, d) => {
      bubble.show(d);
      legend.highlight(d);
    })
    .on("mouseout", (event, d) => {
      bubble.hide();
      legend.unhighlight(d);
    });

  // configure each blip
  blips.each(function drawBlip(d) {
    const blip = d3.select(this);
    blip.attr("opacity", d.opacity);
    blip.append("circle").attr("r", 9).attr("fill", d.color);
    blip.append("text").text(d.id).attr("y", 3).attr("text-anchor", "middle");
  });

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(entries)
    .velocityDecay(0.08) // magic number (found by experimentation)
    .force("collision", d3.forceCollide().radius(12).strength(0.85))
    .on("tick", () =>
      blips.attr("transform", (d) =>
        translate({ x: d.segment.clipx(d), y: d.segment.clipy(d) })
      )
    );
}
