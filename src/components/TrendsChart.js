import React from "react";
import LineChart from "./LineChart";

function TrendsChart() {
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    dataset1: [65, 59, 80, 81, 56, 55, 40], // Data for Dataset 1
    dataset2: [28, 48, 40, 19, 86, 27, 90], // Data for Dataset 2
  };

  return (
      <LineChart chartData={chartData} />
  );
}

export default TrendsChart;
