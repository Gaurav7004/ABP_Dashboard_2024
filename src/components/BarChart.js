import { color, style } from "@mui/system";
import React from "react";
import { Bar } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false, // Ensure the chart respects its container size
  legend: {
    display: true
  },
  animation: {
    animateScale: false,
    animateRotate: true
  },
  plugins: {
    tooltip: {
      enabled: true, // Display tooltips
      mode: 'index', // Show tooltips for all data points in the same index
      intersect: false, // Don't trigger tooltips on hover
    },
  },
};


function BarChart({ chartData }) {
  return (
      <Bar data={chartData} options={options} />
  );
}

export default BarChart;



