import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Circle } from 'rc-progress';

const data = [
  { label: 'India', percentage: 79.6 },
  { label: 'State', percentage: 74.3 },
  { label: 'District', percentage: 79.3 },
  { label: 'Block', percentage: 77.3 }
];

// Define colors for each label
const labelColors = ['#1565C0', '#03A9F4', '#4FC3F7', '#BBDEFB'];

const ProgressGaugeComponent = ({ chartData }) => {
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "space-evenly", flexWrap: "wrap" }}>
      {chartData.map((entry, index) => (
        
        <div key={index} style={{ textAlign: "center", width: "18%", marginBottom: "5px" }}>
          <h3>{`${entry.percentage+'%'}`}</h3>
          <Circle percent={entry.percentage} strokeWidth="8" strokeColor={labelColors[index]} />
          <p style={{ fontSize: "1vw" }} className='rotate-text'>{`${entry.label}`}</p>
        </div>
      ))}
    </div>
  );
};

// Define PropTypes for chartData as an array
ProgressGaugeComponent.propTypes = {
    chartData: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        percentage: PropTypes.number.isRequired
      })
    ).isRequired
  };

export default ProgressGaugeComponent;
