/*global d3, $*/
/*eslint no-undef: "error"*/

$.getJSON( "../SampleCampaign.json",  data => {
  console.log("load data.")
  console.log(data);
  var network = () => {
    const width = 500;
    const height = 300;
    const nodes = data.Campaigns[2].CampaignCreator.map(d => Object.create(d));
    nodes.map((item, i) => {
      item.x = 50+((width-100)/(nodes.length+1))*(i+1)
      item.y = 50
    });
    const campaign_node = Object.create({Name:data.Campaigns[2].name,id:"campaign", x:250, y:250})
    const links = nodes.map((item, i) => {
      return {"id":i,"source":campaign_node, "target":item}
    });
    nodes.push(campaign_node);

    console.log(links)
    console.log(nodes)
    const svg = d3.select("#network-graph").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("x1", d => { return d.source.x; })
        .attr("y1", d => { return d.source.y; })
        .attr("x2", d => { return d.target.x; })
        .attr("y2", d => { return d.target.y; })
        .attr("stroke-width", 1)
        .attr("stroke","#999")
        .attr("stroke-opacity", 0.6);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("cx",d => {return d.x})
        .attr("cy",d => {return d.y})
        .attr("fill", "blue");

    node.append("title")
        .text(d => d.Name);
    return svg.node();
  }
  network()

});
