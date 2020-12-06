import './style.css'
import 'bootstrap/dist/css/bootstrap.css'

import * as d3 from 'd3'
import { getSVG } from './import_svg'

fetch('SampleCampaign.json')
  .then(res => res.json())
  .then(data => {
    console.log('load data.')
    console.log(data)

    const network = () => {
      const width = 500
      const height = 300

      // constructing nodes array from data
      const nodes: any[] = data.Campaigns
      nodes.forEach((item, i) => {
        item.x = dist_interpolation_x(i, nodes.length, 0, width)
        item.y = dist_interpolation_y(i, nodes.length, 170, 70)
      })
      const user_node = {Name: "", id: 'user', x: 250, y: 250}
      const links = nodes.map((item, i) => ({id: i, source: user_node, target: item}))
      //nodes.push(user_node)
      console.log(links)
      console.log(nodes)

      const container = d3.select('#network-graph')

      const svg = container
        .append('svg')
        .attr('viewBox', [0, 0, width, height].join(','))
      var svg_node_element = svg.node() as Element
      // retrieving all the svg elements TODO:move into import_svg.ts
      getSVG('car_button.svg')
        .then((documentFragment)=> {
          var sub_svg = documentFragment.documentElement
                                        .querySelector('#car_button') as Element
          svg_node_element.append(sub_svg)
          svg.select('#car_button')
            .attr('transform','translate(-123.5,50) scale(0.4)');
          })

      getSVG('fuel.svg')
        .then((documentFragment)=> {
          var sub_svg = documentFragment.documentElement
                                        .querySelector('#fuel_symbol') as Element
          svg_node_element.append(sub_svg)
          svg.select('#fuel_symbol')
            .attr('transform','translate(15,260) scale(0.05)')
            //.attr('fill','#FBFB9C')
            .append('text')
              .text('Fuel')
              .attr('dx', 700)
              .attr('dy', 375)
              .attr('font-family', 'sans-serif')
              .attr('font-size', '300px')
              .attr('fill', 'black')
              .attr('stroke-width', 0)
          })

      getSVG('speedometer.svg')
        .then((documentFragment)=> {
          var sub_svg = documentFragment.documentElement
                                        .querySelector('#speed_symbol') as Element
          svg_node_element.append(sub_svg)
          svg.select('#speed_symbol')
            .attr('transform','translate(15,225) scale(0.05)')
            .append('text')
              .text('Speed')
              .attr('dx', 700)
              .attr('dy', 375)
              .attr('font-family', 'sans-serif')
              .attr('font-size', '300px')
              .attr('fill', 'black')
              .attr('stroke-width', 0)
          })

      getSVG('placeholder.svg')
        .then((documentFragment)=> {
          var sub_svg = documentFragment.documentElement
                                        .querySelector('#place_tag_symbol') as Element
          svg_node_element.append(sub_svg)
          svg.select('#place_tag_symbol')
            .attr('transform','translate(15,190) scale(0.4)')
            .append('text')
              .text('GPS')
              .attr('dx', 88)
              .attr('dy', 45)
              .attr('font-family', 'sans-serif')
              .attr('font-size', '35px')
              .attr('fill', 'black')
              .attr('stroke-width', 0)
          })

      // ----------- drawing the svg ---------------
      // links
      svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', (d,i) => dist_interpolation_x(i, links.length,d.source.x-40,d.source.x+40))
        .attr('y1', (d,i) => dist_interpolation_y(i, links.length,d.source.y-30,d.source.y-40))
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke-width', 1)
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
      // nodes
      const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
      // textfield
      node.append('rect')
        .attr("rx", 12)
        .attr("ry", 12)
        .attr('width', 100)
        .attr('height', 20)
        .attr('x', d => d.x-52)
        .attr('y', d => d.y-25)
        .attr('fill', '#B3D2EC')
        .attr('stroke-width', 0)
      // text
      node.append('text')
        .attr('dx', d => d.x -25)
        .attr('dy', d => d.y -13)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '8px')
        .attr('fill', 'black')
        .attr('stroke-width', 0)
        .text(d => d.Name)

      return svg.node()
    }
    network()


    function createProperResCanvas(w: number, h: number, ratio: number) {
      if (!ratio) { ratio = Math.round(window.devicePixelRatio) || 1 }

      // Keep canvas within the allowable size:
      // https://stackoverflow.com/a/11585939/8585320
      h = Math.min(32767, h * ratio)

      // Set canvas
      const can = document.querySelector('#graph-canvas')! as HTMLCanvasElement
      can.width = w * ratio
      can.height = h * ratio
      can.style.width = w + 'px'
      can.style.height = h + 'px'

      // Set context
      const ctx = can?.getContext('2d')
      ctx?.scale(ratio, ratio)
      ctx?.clearRect(0, 0, w, h)

      // Since context does all of the drawing, no need to return canvas itself
      return ctx
    }
  })

// functions to compute the interpolation for nodes
const dist_interpolation_y = (position:number, array_length:number,
  interpol_start:number, interpol_end:number):number => {
  var interpolation = d3.interpolateNumber(interpol_start,interpol_end)
  if (position <= array_length / 2) {
    return interpolation((position + 1) / (array_length / 2))
  }
  else {
    return interpolation((array_length - position) / (array_length / 2))
  }
}
const dist_interpolation_x = (position:number, array_length:number,
  interpol_start:number, interpol_end:number):number => {
  var interpolation = d3.interpolateNumber(interpol_start,interpol_end)
  return interpolation((position + 1)/ (array_length + 1))
}
