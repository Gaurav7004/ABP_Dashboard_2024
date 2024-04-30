import React, { useState } from "react";
import "./HumanChart.css";

const HumanChart = ({ percentages, labels }) => {
  const [color, setColor] = useState("#047dc5");

  // Function to generate SVG elements for each row
  const renderSVGRow = (percentage, label) => {
    // Calculate the number of SVGs to color green based on the percentage
    const greenSVGs = Math.floor((percentage / 100) * 10);

    return (
      <div className="svg-row" style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>

        <div className="label" style={{ color: color, marginRight: "1vw", width: '6vw' }}>
          <div onMouseEnter={() => setColor("#1f2d8e")} onMouseLeave={() => setColor("#047dc5")}>
            <strong>{label}</strong>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", flex: 1, marginRight: '1vw', marginLeft: '1vw' }}>
          {[...Array(10)].map((_, index) => {
            // Determine the color based on the current index and greenSVGs
            let svgColor;
            if (index < Math.floor(greenSVGs)) {
              svgColor = "#047dc5";
            } else if (index === Math.floor(greenSVGs) && percentage % 10 !== 0) {
              svgColor = "#047dc5";
            } else {
              svgColor = "#8e9eab";
            }
            return (
              <div key={index} className="svg-container">
                {/* Include the SVG as JSX */}
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ fill: svgColor === "#047dc5" ? "#047dc5" : "#c2c2c2", width: "2.3vw", height: "auto" }}>
                  <title>man</title>
                  <path d="M18 3c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z"></path>
                  <path d="M18 8h-6c-1.105 0-2 0.895-2 2v10h2v12h2.5v-12h1v12h2.5v-12h2v-10c0-1.105-0.895-2-2-2z"></path>
                </svg>
              </div>
            );
          })}
        </div>

        <div className="percentage" style={{ color: color, marginLeft: "10px" }}>
          <div onMouseEnter={() => setColor("#1f2d8e")} onMouseLeave={() => setColor("#047dc5")}>
            <strong>{percentage}%</strong>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div>
      {labels.map((label, index) => (
        <div key={index}>{renderSVGRow(percentages[index], label)}</div>
      ))}
    </div>
  );
};

export default HumanChart;