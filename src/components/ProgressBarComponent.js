import React from 'react';
import { Line } from 'rc-progress';

const data = [
  { label: 'India', percentage: 79.6 },
  { label: 'State', percentage: 74.3 },
  { label: 'District', percentage: 79.3 },
  { label: 'Block', percentage: 77.3}
];

// Define colors for each label
const labelColors = ['#1565C0', '#03A9F4', '#4FC3F7', '#BBDEFB'];

const ProgressBarComponent = ({ chartData }) => {
  return (
    <div>
      {chartData.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

          <p style={{ marginLeft: '10px', width: '10vw' }}>{`${item.label}`}</p>
          <div style={{ width: '250px', marginRight: '10px' }}>
            <Line percent={item.percentage} strokeWidth="8" strokeColor={labelColors[index]} />
          </div>
          <h3>{item.percentage}%</h3>

        </div>
      ))}
    </div>
  );
};

export default ProgressBarComponent;
