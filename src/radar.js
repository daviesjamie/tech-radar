import * as d3 from "d3";
import "./radar.css";
import { Quadrant } from "./quadrants";
import Segments from "./segment";
import { translate } from "./coordinates";
import Bubble from "./bubble";

export default function D3Radar(config) {
  const rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 },
  ];

  const titleOffset = { x: -675, y: -420 };

  // prettier-ignore
  const legendOffset = {
    [Quadrant.BOTTOM_RIGHT]: { x:  450, y:   90 },
    [Quadrant.BOTTOM_LEFT]:  { x: -675, y:   90 },
    [Quadrant.TOP_LEFT]:     { x: -675, y: -310 },
    [Quadrant.TOP_RIGHT]:    { x:  450, y: -310 },
  };

  const segments = Segments({ rings });

  // position each entry randomly in its segment
  const entries = config.entries.map((entry) => {
    const segment = segments(entry.quadrant, entry.ring);
    const point = segment.random();
    return {
      ...entry,
      color: config.rings[entry.ring].color,
      segment,
      x: point.x,
      y: point.y,
    };
  });

  // partition entries according to segments
  const segmentedEntries = entries.reduce((acc, entry) => {
    acc[entry.quadrant] ||= {};
    acc[entry.quadrant][entry.ring] ||= [];
    acc[entry.quadrant][entry.ring].push(entry);
    return acc;
  }, {});

  // assign unique sequential id to each entry
  let id = 1;
  const labelledEntries = {};
  [
    Quadrant.TOP_LEFT,
    Quadrant.TOP_RIGHT,
    Quadrant.BOTTOM_LEFT,
    Quadrant.BOTTOM_RIGHT,
  ].forEach(
    (quadrant) =>
      (labelledEntries[quadrant] = [0, 1, 2, 3].map((ring) => {
        const segmentEntries = segmentedEntries[quadrant][ring];
        segmentEntries.sort((a, b) => a.label.localeCompare(b.label));
        // eslint-disable-next-line no-plusplus
        return segmentEntries.map((entry) => ({ ...entry, id: id++ }));
      }))
  );

  const svg = d3
    .select(`svg#${config.svg_id}`)
    .attr("width", config.width)
    .attr("height", config.height)
    .classed("d3-radar", true);

  const radar = svg
    .append("g")
    .attr(
      "transform",
      translate({ x: config.width / 2, y: config.height / 2 })
    );

  const grid = radar.append("g");

  // draw grid lines
  grid
    .append("line")
    .attr("x1", 0)
    .attr("y1", -400)
    .attr("x2", 0)
    .attr("y2", 400)
    .classed("grid", true);

  grid
    .append("line")
    .attr("x1", -400)
    .attr("y1", 0)
    .attr("x2", 400)
    .attr("y2", 0)
    .classed("grid", true);

  // draw rings
  rings.forEach((ring, i) => {
    grid
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", ring.radius)
      .classed("grid", true);

    grid
      .append("text")
      .text(config.rings[i].name)
      .attr("y", -ring.radius + 62)
      .attr("text-anchor", "middle")
      .classed("ring-label", true);
  });

  function legendTransform(quadrant, ring, index = null) {
    const dx = ring < 2 ? 0 : 140;
    let dy = index == null ? -16 : index * 12;
    if (ring % 2 === 1) {
      dy = dy + 36 + labelledEntries[quadrant][ring - 1].length * 12;
    }
    return translate({
      x: legendOffset[quadrant].x + dx,
      y: legendOffset[quadrant].y + dy,
    });
  }

  // title
  radar
    .append("text")
    .attr("transform", translate({ x: titleOffset.x, y: titleOffset.y }))
    .text(config.title)
    .classed("title", true);

  // layer for entries
  const rink = radar.append("g").attr("id", "rink");

  // rollover bubble (on top of everything else)
  const bubble = Bubble(radar);

  // legend
  const legend = radar.append("g");
  config.quadrants.forEach((_, quadrant) => {
    legend
      .append("text")
      .attr(
        "transform",
        translate({
          x: legendOffset[quadrant].x,
          y: legendOffset[quadrant].y - 45,
        })
      )
      .text(config.quadrants[quadrant].name)
      .classed("legend-title", true);

    config.rings.forEach((_, ring) => {
      legend
        .append("text")
        .attr("transform", legendTransform(quadrant, ring))
        .text(config.rings[ring].name)
        .classed("legend-ring", true);
      legend
        .selectAll(`.legend${quadrant}${ring}`)
        .data(labelledEntries[quadrant][ring])
        .enter()
        .append("text")
        .attr("transform", (d, i) => legendTransform(quadrant, ring, i))
        .attr("class", `legend${quadrant}${ring}`)
        .classed("legend-item", true)
        .attr("id", (d, i) => `legendItem${d.id}`)
        .text((d, i) => `${d.id}. ${d.label}`)
        .on("mouseover", (event, d) => {
          bubble.show(d);
          highlightLegendItem(d);
        })
        .on("mouseout", (event, d) => {
          bubble.hide();
          unhighlightLegendItem(d);
        });
    });
  });

  const filter = grid
    .append("defs")
    .append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood").attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite").attr("in", "SourceGraphic");

  function highlightLegendItem(d) {
    d3.select(`#legendItem${d.id}`)
      .attr("filter", "url(#solid)")
      .attr("fill", "white");
  }

  function unhighlightLegendItem(d) {
    d3.select(`#legendItem${d.id}`).attr("filter", null).attr("fill", null);
  }

  // draw blips on radar
  const blips = rink
    .selectAll(".blip")
    .data(Object.values(labelledEntries).flat(2))
    .enter()
    .append("g")
    .attr("class", "blip")
    .attr("transform", (d, i) => legendTransform(d.quadrant, d.ring, i))
    .on("mouseover", (event, d) => {
      bubble.show(d);
      highlightLegendItem(d);
    })
    .on("mouseout", (event, d) => {
      bubble.hide();
      unhighlightLegendItem(d);
    });

  // configure each blip
  blips.each(function drawBlip(d) {
    const blip = d3.select(this);

    blip.append("circle").attr("r", 9).attr("fill", d.color);

    // blip text
    blip.append("text").text(d.id).attr("y", 3).attr("text-anchor", "middle");
  });

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(Object.values(labelledEntries).flat(2))
    .velocityDecay(0.08) // magic number (found by experimentation)
    .force("collision", d3.forceCollide().radius(12).strength(0.85))
    .on("tick", () =>
      blips.attr("transform", (d) =>
        translate({ x: d.segment.clipx(d), y: d.segment.clipy(d) })
      )
    );
}
