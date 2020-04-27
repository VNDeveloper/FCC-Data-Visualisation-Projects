"use strict";

async function getData() {
  let response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );
  let data = await response.json();

  return data;
}

async function drawChart() {
  // selector
  const element = document.getElementById("js-scatterplot-container");

  // static variables
  const data = await getData();
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const margin = { top: 40, right: 40, bottom: 40, left: 60 };

  // calculated variables
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // helper funtion
  const xValue = (datum) => datum.Year;
  const yValue = (datum) => d3.timeParse("%M:%S")(datum.Time);

  // set scales
  const minDate = d3.min(data, (datum) => xValue(datum) - 1);
  const maxDate = d3.max(data, (datum) => xValue(datum) + 1);

  const xScale = d3
    .scaleLinear()
    .domain([minDate, maxDate])
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (datum) => yValue(datum)))
    .range([innerHeight, 0])
    .nice();

  // set y and x axises
  const xAxis = d3.axisBottom(xScale).tickFormat((data) => data);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  // draw the chart
  const svg = d3
    .select("#js-scatterplot-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  group
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);
  group.append("g").call(yAxis);

  group
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("r", 5);
}

export default drawChart;
