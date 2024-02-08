import React from "react";
import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS } from "chart.js/auto";

function VerticalBarChart({ chartData }) {
  const options = {
    // indexAxis: "y", // Set to "y" for vertical bar chart
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  return <Bar data={chartData} options={options}/>;
}

export default VerticalBarChart;