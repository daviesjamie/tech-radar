import entries from "./data";
import radar from "./radar";
import "./style.css";

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
    { name: "Expert", opacity: 1 },
    { name: "Strong", opacity: 0.75 },
    { name: "Competent", opacity: 0.5 },
  ],
  entries,
});
