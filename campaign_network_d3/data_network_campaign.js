
$.getJSON( "../SampleCampaign.json",  data => {
  console.log("load data.")
  console.log(data);
  network = () => {
    nodes = data.Campaigns[0].CampaignCreator.map(d => Object.create(d));
    svg = d3.select("#network-graph").append("svg")
        .attr("viewBox", [0, 0, 500, 500]);

    node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "blue");

    node.append("title")
        .text(d => d.Name);
    return svg.node();
  }
 console.log(network())
 network()

});
