"use strict";
import { colorLegend } from "./colorLegend.js";

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

  const margin = { top: 40, right: 40, bottom: 40, left: 80 };

  // calculated variables
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // helper funtion
  const xValue = (datum) => datum.Year;
  const yValue = (datum) => d3.timeParse("%M:%S")(datum.Time);
  const isDoping = (datum) => !datum.Doping || false;

  // set scales
  const minDate = d3.min(data, (datum) => xValue(datum) - 1);
  const maxDate = d3.max(data, (datum) => xValue(datum));

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

  const colorScale = d3
    .scaleOrdinal([`#f7a900`, `#0080f7`])
    .domain([true, false]);

  // set y and x axises
  const xAxis = d3.axisBottom(xScale).tickFormat((data) => data);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  // draw the chart
  const svg = d3
    .select("#js-scatterplot-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add title and subtitle
  const headerGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top - 20})`);

  // title
  headerGroup
    .append("text")
    .attr("x", `${innerWidth / 2}`)
    .attr("text-anchor", "middle")
    .attr("id", "title")
    .style("font-size", "1.25em")
    .text("Doping in Profressional Bicycle Racing");

  // subtile
  headerGroup
    .append("text")
    .attr("x", `${innerWidth / 2}`)
    .attr("y", `20`)
    .attr("text-anchor", "middle")
    .text("35 Fastest times up Alpe d'Huez");

  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add color legend
  group
    .append("g")
    .attr("transform", `translate(${innerWidth - 10}, ${innerHeight / 2})`)
    .call(colorLegend, {
      colorScale,
      heightSpacing: 20,
      fontSize: "0.6em",
      circleRadius: 7,
      textSpacing: 10,
    });

  // add x-axis
  group
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`);

  // add x-axis title
  group
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -(margin.left - 20))
    .attr("x", -(height / 8.3))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Time in Minutes");

  // add y-axis
  group.append("g").call(yAxis).attr("id", "y-axis");

  // Tooltip
  let tooltip = d3
    .select("#js-scatterplot-container")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "scatterplot-tooltip");

  // Three event mouseover, mousemove and mouseleave
  function mouseover(d) {
    tooltip.transition().style("opacity", 1);
    tooltip
      .style("top", d3.event.pageY + 20 + "px")
      .style("left", d3.event.pageX + 10 + "px");
  }

  function mousemove(d) {
    tooltip
      .style("top", d3.event.pageY - 25 + "px")
      .style("left", d3.event.pageX + 10 + "px")
      .style("padding", "0 10px")
      .attr("data-date", xValue(d))
      .style("background-color", colorScale(isDoping(d)))
      .style("opacity", 0.5)
      .html(
        `<p> ${d.Name}. ${d.Nationality} </p>
        <p>Year: ${d.Year}, Time: ${d.Time} </p>
        <p>${d.Doping}</p>`
      );
  }

  function mouseleave(d) {
    tooltip.transition().style("opacity", 0);
  }

  const circleGroup = group.append("g");

  circleGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (datum) => xScale(xValue(datum)))
    .attr("cy", (datum) => yScale(yValue(datum)))
    .attr("r", 7)
    .attr("class", "dot")
    .style("stroke", "black")
    .style("opacity", 0.5)
    .attr("fill", (datum, i) => colorScale(isDoping(datum)))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}

export default drawChart;
