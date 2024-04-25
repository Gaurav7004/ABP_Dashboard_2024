import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { schemeCategory10 } from 'd3-scale-chromatic'; // Import schemeCategory10
import './ThreeDBarChart.css';

const ThreeDBarChart = () => {
  const data = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 },
    { label: 'D', value: 40 },
    { label: 'F', value: 50 },
    { label: 'G', value: 10 }
  ];

  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 10, bottom: 30, left: 10 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4); // Increased padding to 0.3

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('*').remove();

    const color = d3
      .scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(schemeCategory10); // Use schemeCategory10

    // Append filter definition for shadow effect
    svg
      .append('defs')
      .append('filter')
      .attr('id', 'drop-shadow')
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 7)
      .attr('stdDeviation', 5)
      .attr('flood-color', 'green');

    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('class', 'rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.value))
      .attr('fill', d => color(d.label))
      .attr('rx', 32) // Set horizontal corner radius
      .attr('ry', 8) // Set vertical corner radius
      .attr('filter', 'url(#drop-shadow)') // Apply shadow effect
      .append('title')
      .text(d => `${d.label}: ${d.value}%`)
      .on('mouseover', function() {
        d3.select(this).transition().duration(100).attr('opacity', 0.7);
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(100).attr('opacity', 1);
      });

    // Append text labels on top of bars
    svg
      .selectAll('.top-label')
      .data(data)
      .join('text')
      .attr('class', 'top-label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5) // Adjust the position
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-weight', 'bold') // Apply bold font weight
      .text(d => `${d.value}%`);

    // Append text labels on the bottom of bars
    svg
      .selectAll('.bottom-label')
      .data(data)
      .join('text')
      .attr('class', 'bottom-label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(0) + 40) // Adjust the position
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('transform', function(d) {
        const labelWidth = this.getComputedTextLength(); // Use getComputedTextLength() to get the text length
        if (labelWidth > x.bandwidth()) {
          return `rotate(-45 ${x(d.label) + x.bandwidth() / 2},${y(0) + 40})`;
        }
        return '';
      })
      .text(d => d.label);
  }, [data]);

  return (
    <svg ref={svgRef} width="600" height="400">
      <g transform="translate(40, 20)">
        {/* Bars will be rendered here */}
      </g>
    </svg>
  );
};

export default ThreeDBarChart;
