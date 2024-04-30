import React from 'react';
import { Line } from 'rc-progress';

// Define colors for each label
const labelColors = ['#0277BD', '#039BE5', '#03A9F4', '#4FC3F7', '#81D4FA'];

const ProgressBarComponent = ({ chartData }) => {
  return (
    <div>
      {chartData.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: "space-evenly", marginBottom: '10px' }}>

          <p style={{ marginLeft: '1vw', width: '10vw' }}>{`${item.label}`}</p>
          <div style={{ width: '18vw', marginRight: '1vw' }}>
            <Line percent={item.percentage} strokeWidth="3" strokeColor={labelColors[index]} />
          </div>
          <h3 style={{ fontSize: "1vw", marginLeft: "2vw" }}>{item.percentage}%</h3>

        </div>
      ))}
    </div>
  );
};

export default ProgressBarComponent;
