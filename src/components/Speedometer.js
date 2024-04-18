import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const Speedometer = ({ value, labels, invertColors }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
      {value.map((val, index) => (
        <div key={index} style={{ textAlign: "center", width: "30%", marginBottom: "20px" }}>
          <ReactSpeedometer
            maxValue={100}
            minValue={0}
            height={150}
            width={200}
            value={val}
            needleTransition="easeOutCubic"
            needleTransitionDuration={2000}
            needleColor="black"
            startColor={invertColors ? "#00b00b" : "red"} // Use invertColors to get the flag
            segments={10}
            endColor={invertColors ? "red" : "#00b00b"} // Use invertColors to get the flag
            currentValueText={`${val}%`}
          />
          <p style={{ marginTop: '0', marginBottom: '0' }}>{labels[index]}</p>
        </div>
      ))}
    </div>
  );
};

export default Speedometer;
