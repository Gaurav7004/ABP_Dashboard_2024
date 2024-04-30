import React, { useState } from "react";
import "./HumanChart.css";

const MyComponent = ({ percentages, labels }) => {
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
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" style={{ fill: svgColor === "#047dc5" ? "#047dc5" : "#c2c2c2" }}>
                  <title>child_friendly</title>
                  <path d="M17.016 20.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM8.016 20.016q0.609 0 1.055-0.445t0.445-1.055-0.445-1.055-1.055-0.445-1.055 0.445-0.445 1.055 0.445 1.055 1.055 0.445zM19.313 15.891q1.172 1.078 1.172 2.625 0 1.453-1.008 2.461t-2.461 1.008q-1.313 0-2.297-0.867t-1.172-2.133h-2.109q-0.188 1.266-1.148 2.133t-2.273 0.867q-1.453 0-2.484-1.008t-1.031-2.461q0-2.063 1.828-3.094l-2.109-4.406h-2.203v-2.016h3.469l0.938 2.016h14.578q0 1.125-0.492 2.555t-1.195 2.32zM12.984 2.016q3.328 0 5.672 2.344t2.344 5.625h-8.016v-7.969z"></path>
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

export default MyComponent;
