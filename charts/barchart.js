"use strict";
// Selectors

// Function
async function getData() {
  let response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );
  let data = await response.json();

  return data.data;
}

const drawChart = async () => {
  // Intial variables
  let data = await getData();

  const element = document.getElementById("js-barchart-container");

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const margin = { top: 40, right: 20, bottom: 30, left: 50 };

  // Calculated variables
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  const xValue = (data) => data[0];
  const yValue = (data) => {
    // console.log(data[1]);
    return data[1];
  };

  // set up the xScale and yScale

  // xScale is date data
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (datum) => new Date(xValue(datum))))
    .rangeRound([0, innerWidth]);

  // yScale is linear data
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (datum) => yValue(datum))])
    .rangeRound([innerHeight, 0]);

  // create xAxis and yAxis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);

  // Draw the svg
  const svg = d3
    .select("#js-barchart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 15)
    .attr("text-anchor", "middle")
    .attr("id", "title")
    .style("font-size", "2rem")
    .text("United State GDP");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add x-axis and y-axis
  g.append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`)
    .attr("id", "x-axis");
  g.append("g").call(yAxis).attr("id", "y-axis");

  // Tooltip
  let tooltip = d3
    .select("#js-barchart-container")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "barchart-tooltip");

  // Three event mouseover, mousemove and mouseleave
  function mouseover(d) {
    tooltip.transition().style("opacity", 1);
    tooltip
      .style("top", d3.event.pageY + 20 + "px")
      .style("left", d3.event.pageX + 10 + "px");

    d3.select(this).style("opacity", 0.1);
  }

  function mousemove(d) {
    tooltip
      .style("top", d3.event.pageY - 25 + "px")
      .style("left", d3.event.pageX + 10 + "px")
      .style("padding", "0 10px")
      .attr("data-date", xValue(d))
      .html(
        "<p> Date: " +
          xValue(d).split("-").reverse().join("-") +
          "</p>" +
          "<p> Value: " +
          yValue(d) +
          "</p>"
      );

    d3.select("opacity", 0.8);
  }

  function mouseleave(d) {
    tooltip.transition().style("opacity", 0);
    d3.select(this).style("opacity", 1);
  }

  // Drawing the bar
  g.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (innerWidth / data.length))
    .attr("y", (d, i) => yScale(yValue(d)))
    .attr("width", (d, i) => (innerWidth / data.length) * 0.9)
    .attr("height", (d, i) => innerHeight - yScale(yValue(d)))
    .attr("fill", "steelblue")
    .attr("class", "bar")
    .attr("data-date", (d) => xValue(d))
    .attr("data-gdp", (d) => yValue(d))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
};

export default drawChart;
