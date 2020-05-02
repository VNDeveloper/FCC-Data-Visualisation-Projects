export const colorLegend = (selection, props) => {
  console.log("selection", selection);
  console.log("props", props);
  const {
    colorScale,
    heightSpacing,
    fontSize,
    circleRadius,
    textSpacing,
  } = props;

  const groups = selection.selectAll("g").data(colorScale.domain());

  const groupsEnter = groups
    .enter()
    .append("g")
    .merge(groups)
    .attr("transform", (d, i) => `translate(0, ${i * heightSpacing})`);

  groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .attr("dy", "0.32em")
    .style("font-size", fontSize)
    .style("text-anchor", "end")
    .text((d) =>
      d ? "Riders with doping allegations" : "No Doping allegations"
    );

  groupsEnter
    .append("circle")
    .merge(groups.select("circle"))
    .attr("cx", textSpacing)
    .attr("r", circleRadius)
    .attr("fill", colorScale)
    .style("stroke", "black")
    .style("opacity", 0.5);
};
