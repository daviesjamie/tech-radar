import * as d3 from "d3";
import "./radar.css";
import { randomBetween, normalBetween } from "./random";
import { toCartesian, toPolar } from "./coordinates";
import { constrainToBox, constrainToRing } from "./constrain";

const quadrantFactors = [
  { radialMin:  0,    radialMax:  0.5, x:  1, y:  1 },
  { radialMin:  0.5,  radialMax:  1,   x: -1, y:  1 },
  { radialMin: -1,    radialMax: -0.5, x: -1, y: -1 },
  { radialMin: -0.5,  radialMax:  0,   x:  1, y: -1 },
];

export default function D3Radar(config) {
  const rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 },
  ];

  const titleOffset = { x: -675, y: -420 };

  const legendOffset = [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 },
  ];

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

  // position each entry randomly in its segment
  config.entries.forEach((entry) => {
    entry.segment = segment(entry.quadrant, entry.ring);
    const point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.color = config.rings[entry.ring].color;
  });

  // partition entries according to segments
  const segmented = config.entries.reduce((acc, entry) => {
    acc[entry.quadrant] ||= {};
    acc[entry.quadrant][entry.ring] ||= [];
    acc[entry.quadrant][entry.ring].push(entry);
    return acc;
  }, {});

  // assign unique sequential id to each entry
  let id = 1;
  [2, 3, 1, 0].forEach((quadrant) =>
    [0, 1, 2, 3].forEach((ring) => {
      const entries = segmented[quadrant][ring];
      entries.sort((a, b) => a.label.localeCompare(b.label));
      entries.forEach((entry) => {
        entry.id = id;
        id += 1;
      });
    })
  );

  function translate(x, y) {
    return `translate(${x},${y})`;
  }

  function viewbox(quadrant) {
    return [
      Math.max(0, quadrantFactors[quadrant].x * 400) - 420,
      Math.max(0, quadrantFactors[quadrant].y * 400) - 420,
      440,
      440,
    ].join(" ");
  }

  const svg = d3
    .select(`svg#${config.svg_id}`)
    .attr("width", config.width)
    .attr("height", config.height)
    .classed("d3-radar", true);

  const radar = svg
    .append("g")
    .attr("transform", translate(config.width / 2, config.height / 2));

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
      dy = dy + 36 + segmented[quadrant][ring - 1].length * 12;
    }
    return translate(
      legendOffset[quadrant].x + dx,
      legendOffset[quadrant].y + dy
    );
  }

  // title
  radar
    .append("text")
    .attr("transform", translate(titleOffset.x, titleOffset.y))
    .text(config.title)
    .classed("title", true);

  // legend
  const legend = radar.append("g");
  config.quadrants.forEach((_, quadrant) => {
  // for (var quadrant = 0; quadrant < 4; quadrant++) {
    legend
      .append("text")
      .attr(
        "transform",
        translate(legendOffset[quadrant].x, legendOffset[quadrant].y - 45)
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
        .data(segmented[quadrant][ring])
        .enter()
        .append("text")
        .attr("transform", (d, i) => legendTransform(quadrant, ring, i))
        // .attr("class", `legend${quadrant}${ring}`)
        .classed("legend-item", true)
        .attr("id", (d, i) => `legendItem${d.id}`)
        .text((d, i) => `${d.id}. ${d.label}`)
        .on("mouseover", (d) => {
          showBubble(d);
          highlightLegendItem(d);
        })
        .on("mouseout", (d) => {
          hideBubble(d);
          unhighlightLegendItem(d);
        });
    });
  });

  // layer for entries
  const rink = radar.append("g").attr("id", "rink");

  // rollover bubble (on top of everything else)
  const bubble = radar
    .append("g")
    .attr("id", "bubble")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("user-select", "none");
  bubble.append("rect").attr("rx", 4).attr("ry", 4).style("fill", "#333");
  bubble
    .append("text")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("fill", "#fff");
  bubble.append("path").attr("d", "M 0,0 10,0 5,8 z").style("fill", "#333");

  function showBubble(d) {
    const tooltip = d3.select("#bubble text").text(d.label);
    const bbox = tooltip.node().getBBox();
    d3.select("#bubble")
      .attr("transform", translate(d.x - bbox.width / 2, d.y - 16))
      .style("opacity", 0.8);
    d3.select("#bubble rect")
      .attr("x", -5)
      .attr("y", -bbox.height)
      .attr("width", bbox.width + 10)
      .attr("height", bbox.height + 4);
    d3.select("#bubble path").attr(
      "transform",
      translate(bbox.width / 2 - 5, 3)
    );
  }

  function hideBubble(d) {
    d3.select("#bubble").attr("transform", translate(0, 0)).style("opacity", 0);
  }

  function highlightLegendItem(d) {
    const legendItem = document.getElementById(`legendItem${d.id}`);
    legendItem.setAttribute("filter", "url(#solid)");
    legendItem.setAttribute("fill", "white");
  }

  function unhighlightLegendItem(d) {
    const legendItem = document.getElementById(`legendItem${d.id}`);
    legendItem.removeAttribute("filter");
    legendItem.removeAttribute("fill");
  }

  // draw blips on radar
  const blips = rink
    .selectAll(".blip")
    .data(config.entries)
    .enter()
    .append("g")
    .attr("class", "blip")
    .attr("transform", (d, i) => legendTransform(d.quadrant, d.ring, i))
    .on("mouseover", (d) => {
      showBubble(d);
      highlightLegendItem(d);
    })
    .on("mouseout", (d) => {
      hideBubble(d);
      unhighlightLegendItem(d);
    });

  // configure each blip
  blips.each(function (d) {
    const blip = d3.select(this);

    blip.append("circle").attr("r", 9).attr("fill", d.color);

    // blip text
    blip.append("text").text(d.id).attr("y", 3).attr("text-anchor", "middle");
  });

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(config.entries)
    .velocityDecay(0.08) // magic number (found by experimentation)
    .force("collision", d3.forceCollide().radius(12).strength(0.85))
    .on("tick", () =>
      blips.attr("transform", (d) =>
        translate(d.segment.clipx(d), d.segment.clipy(d))));

}
