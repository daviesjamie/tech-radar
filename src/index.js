import entries from "./data";
import radar from "./radar";

radar({
  svgId: "radar",
  width: 1450,
  height: 1000,
  title: "Jamie's Tech Radar — 2021.01",
  quadrants: [
    { name: "Languages" },
    { name: "Infrastructure" },
    { name: "Frameworks" },
    { name: "Data Management" },
  ],
  rings: [
    { name: "ADOPT", color: "#93c47d" },
    { name: "TRIAL", color: "#93d2c2" },
    { name: "ASSESS", color: "#fbdb84" },
    { name: "HOLD", color: "#efafa9" },
  ],
  entries,
});
