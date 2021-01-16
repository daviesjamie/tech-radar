import entries from "./data";
import radar from "./radar";

radar({
  svgId: "radar",
  width: 1450,
  height: 1000,
  title: "Jamie's Tech Radar — 2021.01",
  quadrants: [
    { name: "Tools & Software", color: "#ab4642" },
    { name: "Data Management", color: "#f7ca88" },
    { name: "Infrastructure & Monitoring", color: "#a1b56c" },
    { name: "Languages & Frameworks", color: "#7cafc2" },
  ],
  rings: [
    { name: "Advanced", opacity: 1 },
    { name: "Intermediate", opacity: 0.75 },
    { name: "Beginner", opacity: 0.5 },
  ],
  entries,
});
