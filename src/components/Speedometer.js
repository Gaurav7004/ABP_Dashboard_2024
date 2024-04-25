import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import "./HumanChart.css";

const Speedometer = ({ value, labels, startColor, endColor, maxValue, minValue }) => {
  const needlePointerValues = value.map((val) => (val / maxValue) * 100);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
      {value.map((val, index) => (
        <div key={index} style={{ textAlign: "center", width: "30%", marginBottom: "20px" }}>
          <ReactSpeedometer
            maxValue={maxValue}
            minValue={minValue}
            height={150}
            width={200}
            value={val}
            needleTransition="easeOutCubic"
            needleTransitionDuration={2000}
            needleColor="black"
            startColor={startColor} // Use invertColors to get the flag
            segments={10}
            endColor={endColor} // Use invertColors to get the flag
            currentValueText={`${val}%`}
            needlePointerValue={needlePointerValues[index]}
          />

          <strong><p  style={{ color: '#047dc5', marginTop: '0', marginBottom: '0' }}>{labels[index]}</p></strong>
        </div>
      ))}
    </div>
  );
};

export default Speedometer;