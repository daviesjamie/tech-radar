import entries from "./data";
import radar from "./radar";

radar({
  svgId: "radar",
  width: 1450,
  height: 1000,
  title: "Jamie's Tech Radar — 2021.01",
  quadrants: [
    { name: "Languages", color: "#ab4642" },
    { name: "Infrastructure", color: "#f7ca88" },
    { name: "Frameworks", color: "#a1b56c" },
    { name: "Data Management", color: "#7cafc2" },
  ],
  rings: [
    { name: "ADOPT", opacity: 1 },
    { name: "TRIAL", opacity: 0.75 },
    { name: "ASSESS", opacity: 0.5 },
    { name: "HOLD", opacity: 0.4 },
  ],
  entries,
});
