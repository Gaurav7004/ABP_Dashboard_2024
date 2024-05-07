import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useRef, useEffect, useState } from 'react';

const NewLineChart = ({ chartData }) => {
//   const categories = chartData.series;

const [tileNewWidth, setTileNewWidth] = useState(null);
const tileRef = useRef(null);

useEffect(() => {
  const updateWidth = () => {
    if (tileRef.current) {
      const width = tileRef.current.getBoundingClientRect().width;
      setTileNewWidth(width);
    }
  };

  // Update width on mount and window resize
  updateWidth();
  window.addEventListener('resize', updateWidth);

  // Clean up event listener on unmount
  return () => {
    window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const roundedSeries = chartData.series.map(dataSet => ({
    name: dataSet.name,
    data: dataSet.data.map(value => parseFloat(value).toFixed(1)),
    month: dataSet.month,
  }));

  const options = {
    series: roundedSeries,
    chart: {
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#0066B2',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454', '#DA5978', '#7A63BD'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: ' ',
      align: 'left'
    },
    grid: {
      borderColor: 'white',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
        categories: chartData.series[0].month,
        title: {
          text: 'Month'
        }
      },
    yaxis: {
        title: {
          text: 'Averages'
        },
        min: 0, // Round to the nearest integer
        max: 100, // Round to the nearest integer
        tickAmount: 10, // Optional: Set the number of ticks on the y-axis
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };

  return (
    <div>
        <ReactApexChart options={options} series={roundedSeries} type="line" width='100%' />
    </div>

  );
};

export default NewLineChart;
