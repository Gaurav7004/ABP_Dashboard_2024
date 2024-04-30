import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ThreeDBarChart.css';

const ThreeDBarChart = ({ data }) => {
  console.log(data, '-- data --');
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    const containerWidth = svgRef.current.parentElement.clientWidth; // Get the width of the container
    const containerHeight = svgRef.current.parentElement.clientHeight; // Get the height of the container

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const maxDataValue = 100; // Set a manual maximum value, adjust as needed
    const y = d3
      .scaleLinear()
      .domain([0, maxDataValue]) // Use the manual maximum value here
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('*').remove();

    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('class', 'rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.value))
      .attr('fill', '#03A9F4')
      .attr('rx', 32)
      .attr('ry', 8)
      .style('filter', 'drop-shadow(4px 4px 5px #607D8B)')
      .append('title')
      .text(d => `${d.label}: ${d.value}%`)
      .style('font-weight', 'bold')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('opacity', 0.7);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('opacity', 1);
      });

    svg
      .selectAll('.top-label')
      .data(data)
      .join('text')
      .attr('class', 'top-label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-weight', 'bold')
      .text(d => `${d.value}%`);

    svg
      .selectAll('.bottom-label')
      .data(data)
      .join('text')
      .attr('class', 'bottom-label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(0) + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('transform', function(d) {
        const labelWidth = this.getComputedTextLength();
        if (labelWidth > x.bandwidth()) {
          return `rotate(-45 ${x(d.label) + x.bandwidth() / 2},${y(0) + 40})`;
        }
        return '';
      })
      .text(d => d.label);

    // Centering the chart
    const translateX = (containerWidth - width) / 2;
    const translateY = (containerHeight - height) / 2;
    svg.select('g').attr('transform', `translate(${translateX}, ${translateY})`);

  }, [data]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="80%"
      viewBox="0 0 900 600" // Set the viewBox for maintaining aspect ratio
      // preserveAspectRatio="xMidYMid meet" 
    >
      <g>
        {/* Bars will be rendered here */}
      </g>
    </svg>
  );
};

export default ThreeDBarChart;
