import React, { useState } from "react";
import "./HumanChart.css";

const MyComponent = ({ percentages, labels }) => {
  const [color, setColor] = useState("#047dc5");

  // Function to generate SVG elements for each row
  const renderSVGRow = (percentage, label) => {
    // Calculate the number of SVGs to color green based on the percentage
    const greenSVGs = Math.floor((percentage / 100) * 10);

    return (
      <div className="svg-row" style={{ marginBottom: "20px", display: "flex", alignItems: "center"}}>

        <div className="label" style={{ color: color, marginRight: "2vw", width: '6vw', marginLeft: '1vw' }}>
          <div onMouseEnter={() => setColor("#1f2d8e")} onMouseLeave={() => setColor("#047dc5")}>
            <strong>{label}</strong>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", flex: "1", marginRight: '1vw', marginLeft: '1vw' }}>
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
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: svgColor === "#047dc5" ? "#047dc5" : "#c2c2c2" }}>
                <title>building</title>
                <path d="M21 0c0.547 0 1 0.453 1 1v26c0 0.547-0.453 1-1 1h-20c-0.547 0-1-0.453-1-1v-26c0-0.547 0.453-1 1-1h20zM8 4.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5zM8 8.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5zM8 12.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5zM8 16.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5zM6 21.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM6 17.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM6 13.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM6 9.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM6 5.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM14 25.5v-3c0-0.281-0.219-0.5-0.5-0.5h-5c-0.281 0-0.5 0.219-0.5 0.5v3c0 0.281 0.219 0.5 0.5 0.5h5c0.281 0 0.5-0.219 0.5-0.5zM14 17.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM14 13.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM14 9.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM14 5.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM18 21.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM18 17.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM18 13.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM18 9.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM18 5.5v-1c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v1c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5z"></path>
                </svg>
              </div>
            );
          })}
        </div>

        <div className="percentage" style={{ color: color, marginLeft: "10px", flex: "1" }}>
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

export default MyComponent;
