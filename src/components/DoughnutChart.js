import React from 'react';
import { Doughnut } from 'react-chartjs-2';

// Define colors for each label
const labelColors = ['green', 'brown', 'blue', '#f83600'];

// Options with custom tooltips
const options = {
  plugins: {
    tooltip: {
      enabled: true,
      mode: 'index', // Display tooltips for all datasets at the same index
      intersect: false, // Don't trigger tooltips on hover
    },
    legend: {
      display: false,
      position: 'top',
      labels: {
        color: 'black', 
        fontSize: "1.5vw",
      },
    },
  },
  responsive: true,
  animation: {
    animateScale: true,
    animateRotate: true,
  },
};


const MultiDonutChart = ({ chartData }) => {
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "space-around", flexWrap: "wrap" }}>
      {Object.entries(chartData).map(([key, data], index) => (
        <div style={{ textAlign: "center", width: "14%", marginBottom: "5px" }} key={key}>
          <Doughnut data={data} options={options} />
          <p style={{ color: labelColors[index % labelColors.length], fontSize: "1vw" }} className='rotate-text'>
            {key === "national" ? "India" : `${key}`}
          </p>
        </div>
      ))}
    </div>
  );
};



export default MultiDonutChart;
