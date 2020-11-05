/*global d3, $*/
/*eslint no-undef: "error"*/

$.getJSON( "../SampleCampaign.json",  data => {
  console.log("load data.")
  console.log(data);
  var network = () => {
    const width = 500;
    const height = 300;
    const nodes = data.Campaigns[2].CampaignCreator.map(d => Object.create(d));
    const dist_interpolation = d3.interpolateNumber(160,80);
    nodes.map((item, i) => {
      item.x = 50+((width-100)/(nodes.length+1))*(i+1)
      item.y = i<=nodes.length/2?dist_interpolation((i+1)/(nodes.length/2)):dist_interpolation((nodes.length-i)/(nodes.length/2));
    });
    const campaign_node = Object.create({Name:data.Campaigns[2].Name,id:"campaign", x:250, y:250})
    console.log(campaign_node.Name)
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
        .selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class","node");

     node.append("circle")
        .attr("r", 5)
        .attr("cx",d => {return d.x})
        .attr("cy",d => {return d.y})
        .attr("fill", "blue");

    node.append("text")
        .attr("dx", d => {return d.x+12})
        .attr("dy", d => {return d.y})
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill",d => {return d.id=="campaign"?"brown":"blue"})
        .attr("stroke-width",0)
        .text(d => d.Name);
    return svg.node();
  }
  network()

  function createProperResCanvas(w, h, ratio) {
      if (!ratio) { ratio = Math.round(window.devicePixelRatio) || 1 }

      // Keep canvas within the allowable size:
      // https://stackoverflow.com/a/11585939/8585320
      h = Math.min(32767, h * ratio);

      // Set canvas
      var can = document.querySelector("#graph-canvas");
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";

      // Set context
      var ctx = can.getContext("2d");
      ctx.scale(ratio,ratio);
      ctx.clearRect(0, 0, w, h);

      // Since context does all of the drawing, no need to return canvas itself
     return ctx;
    }

});
