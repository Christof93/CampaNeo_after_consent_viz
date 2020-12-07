import './style.css'
import 'bootstrap/dist/css/bootstrap.css'

import * as d3 from 'd3'
import { getSVG } from './import_svg'
import * as canvas_particles from './particle_overlay'

const legend_colors:any = {"Fuel":"#23F0D5","Speed":"#FBFB9C","GPS":"#D597FF"}
export {legend_colors}

fetch('SampleCampaign.json')
  .then(res => res.json())
  .then(data => {
    console.log('load data.')
    console.log(data)

    const network = () => {
      const width = 500
      const height = 300
      const timespan = 15000
      const scale_factor = 4
      var current_time = 0
      //-- constructing nodes array from data
      const nodes:any[] = data.Campaigns
      nodes.forEach((item, i) => {
        item.x = dist_interpolation_x(i, nodes.length, 0, width)
        item.y = dist_interpolation_y(i, nodes.length, 180, 80)
      })
      //-- add a node as center node center
      const user_node = {Name: "", id: 'user', x: 250, y: 250}
      //-- set up links such that all nodes are connected with center node
      const links = nodes.map((node, i) => {
                      let link = {id: i, source: {...user_node}, target: node}
                      var x = user_node.x
                      var y = user_node.y
                      link.source.x = dist_interpolation_x(i,
                                                           nodes.length,
                                                           x-65,
                                                           x+65)
                      link.source.y = dist_interpolation_y(i,
                                                           nodes.length,
                                                           y-25,
                                                           y-40)
                      return link
                    })
      // -- setup the particles
      var particles:any[] = compute_particles(links, scale_factor)
      //nodes.push(user_node)
      console.log(links)
      console.log(nodes)
      console.log(particles)
      //-- setup the svg
      const container = d3.select('#network-graph')
      const svg = container
        .append('svg')
        .attr('viewBox', [0, 0, width, height].join(','))

      var canvas_context = canvas_particles
                            .createProperResCanvas(width, height,scale_factor)
      //-- retrieving and adding all the svg elements
      add_legend_tag_symbol(svg)
      add_legend_fuel_symbol(svg)
      add_legend_speed_symbol(svg)
      add_car_button(svg)

      // -- function to update particles
      const tick = (elapsed_time:number) => {
        const flying_particles = particles.filter(p => p.time < elapsed_time)
        const time_delta = elapsed_time-current_time
        canvas_particles.draw_canvas_particles(flying_particles,canvas_context, time_delta)
        //console.log(elapsed_time)
        current_time = elapsed_time
      }
      // bind tick to timer
      const timer = d3.timer(tick,50)
      // execute in a loop
      const loop = d3.interval(() => {
        particles = compute_particles(links, scale_factor)
        timer.restart(tick,50)
      }, timespan)
      // ----------- drawing the svg with bound data ---------------
      //-- links
      svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke-width', 1)
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
      //-- nodes
      const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')

      //-- campaign textfield
      node.append('rect')
        .attr("rx", 12)
        .attr("ry", 12)
        .attr('width', 110)
        .attr('height', 25)
        .attr('x', d => d.x-57)
        .attr('y', d => d.y-31)
        .attr('fill', '#B3D2EC')
        .attr('stroke-width', 0)
      //-- campaign text
      // TODO: Make sizes dependent on word length and center
      node.append('text')
        .attr('dx', d => d.x -42)
        .attr('dy', d => d.y -13)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12.5px')
        .attr('fill', 'black')
        .attr('stroke-width', 0)
        .text(d => d.Name)

      return svg.node()
    }
    network()
})
const compute_particles = (links:any[], scale_factor:number):any[] => {
  let particles:any[] = []
  for (let link of links) {
    // go from svg coordinates to higher res canvas coordinates
    const x_start = link.source.x * scale_factor
    const y_start = link.source.y * scale_factor
    const x_end = link.target.x * scale_factor
    const y_end = link.target.y * scale_factor
    const link_length = Math.sqrt(
      Math.pow(x_start-x_end,2) +
      Math.pow(y_start-y_end,2)
    )
    for (let data of link.target.CollectedData) {
      var particle = data
      particle.time = data.retrievedAt
      particle.dist = 0.1
      particle.speed = 0.3
      particle.particle_size = 11
      particle.position = {x:x_start, y:y_start}
      particle.link = {}
      particle.link.source = {x:x_start,y:y_start}
      particle.link.path_length = link_length
      particle.link.path_angle = Math.acos(
                                  (x_start-x_end)/
                                  link_length
                                )

      particles.push(particle)
    }
  }
  return particles
}

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

const add_legend_tag_symbol = (outer_svg:any):void => {
  var svg_node_element = outer_svg.node() as Element
  getSVG('placeholder.svg')
    .then((documentFragment)=> {
      var sub_svg = documentFragment.documentElement
                                    .querySelector('#place_tag_symbol') as Element
      svg_node_element.append(sub_svg)
      outer_svg.select('#place_tag_symbol')
        .attr('transform','translate(15,190) scale(0.4)')
        .attr('fill','#D597FF')
        .append('text')
          .text('GPS')
          .attr('dx', 88)
          .attr('dy', 45)
          .attr('font-family', 'sans-serif')
          .attr('font-size', '35px')
          .attr('fill', '#D597FF')
          .attr('stroke-width', 0)
      })
  }

  const add_legend_speed_symbol = (outer_svg:any):void => {
    var svg_node_element = outer_svg.node() as Element
    getSVG('speedometer.svg')
      .then((documentFragment)=> {
        var sub_svg = documentFragment.documentElement
                                      .querySelector('#speed_symbol') as Element
        svg_node_element.append(sub_svg)
        outer_svg.select('#speed_symbol')
          .attr('transform','translate(15,225) scale(0.05)')
          .attr('fill','#FBFB9C')
          .append('text')
            .text('Speed')
            .attr('dx', 700)
            .attr('dy', 375)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '300px')
            .attr('fill', '#FBFB9C')
            .attr('stroke-width', 0)
        })
    }

  const add_legend_fuel_symbol = (outer_svg:any):void => {
    var svg_node_element = outer_svg.node() as Element
    getSVG('fuel.svg')
      .then((documentFragment)=> {
        var sub_svg = documentFragment.documentElement
                                      .querySelector('#fuel_symbol') as Element
        svg_node_element.append(sub_svg)
        outer_svg.select('#fuel_symbol')
          .attr('transform','translate(15,260) scale(0.05)')
          .attr('fill','#23F0D5')
          .append('text')
            .text('Fuel')
            .attr('dx', 700)
            .attr('dy', 375)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '300px')
            .attr('fill', '#23F0D5')
            .attr('stroke-width', 0)
        })
    }

const add_car_button = (outer_svg:any):void => {
  var svg_node_element = outer_svg.node() as Element
  getSVG('car_button.svg')
    .then((documentFragment)=> {
      var sub_svg = documentFragment.documentElement
                                    .querySelector('#car_button') as Element
      svg_node_element.append(sub_svg)
      outer_svg.select('#car_button')
        .attr('transform','translate(-265,-10) scale(0.55)');
      })
}
