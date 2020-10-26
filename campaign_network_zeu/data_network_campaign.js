/* Options */
var options = {
  // An array of nodes.
  nodes: [
    {
      // Unique node id.
      id: 'node-a',
      // X coordinate on canvas.
      x: 100,
      // Y coordinate on canvas.
      y: 50,
      // Color of the node circle.
      color: 'blue',
      // Radius of the node circle.
      size: 5,
      // Text around the node.
      text: {
        // Display value.
        value: 'Node A',
        // Font color.
        color: '#007bfb',
        // Canvas font style. For instance, '12px Arial'.
        font: '10px Arial',
        // X offset from the center of the node.
        xOffset: 0,
        // Y offset from the center of the node.
        yOffset: -10
      },
      // An array of adjacent nodes and edges. It is used to draw a line from current node to other nodes without direction. If ignored, no line is drawn.
      neighbors: [{
        // Node id.
        id: 'node-b',
        // Edge.
        edge: {
          // Line width.
          width: 1,
          // Line color.
          color: '#007bfb',
          // Canvas dash line style. If ignored, a solid line is drawn.
          dash: [0, 0]
        }
      }]
    },
    {
      // Unique node id.
      id: 'node-b',
      // X coordinate on canvas.
      x: 120,
      // Y coordinate on canvas.
      y: 150,
      // Color of the node circle.
      color: 'blue',
      // Radius of the node circle.
      size: 5,
      // Text around the node.
      text: {
        // Display value.
        value: 'Node B',
        // Font color.
        color: '#007bfb',
        // Canvas font style. For instance, '12px Arial'.
        font: '10px Arial',
        // X offset from the center of the node.
        xOffset: 0,
        // Y offset from the center of the node.
        yOffset: 17
      },
      // An array of adjacent nodes and edges. It is used to draw a line from current node to other nodes without direction. If ignored, no line is drawn.
      neighbors: []
    }
  ]
};
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
/* Constructor */
var networkGraph = new zeu.NetworkGraph('network-graph', options);

$.getJSON( "../SampleCampaign.json", function( data ) {
  console.log("load data.")
  console.log(data);
});

// Send one signal from one node to another node.
networkGraph.signal({
  // Source node id.
  from: 'node-a',
  // Destination node id.
  to: 'node-b',
  // Signal color.
  color: '#007bfb',
  // Duration.
  duration: 15000,
  // Signal radius.
  size: 3
});
