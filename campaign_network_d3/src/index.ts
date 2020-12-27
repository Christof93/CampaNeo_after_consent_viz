import './style.css'
import 'bootstrap/dist/css/bootstrap.css'

import * as d3 from 'd3'
import { getSVG } from './import_svg'
import * as canvas_particles from './particle_overlay'
import * as interactive from './interactivity'

const legend_colors:any = {
  'Fuel':{'dark':'#23F0D5','light':'#007CBE'},
  'Speed':{'dark':'#FBFB9C','light':'#F6AE2D'},
  'GPS':{'dark':'#D597FF','light':'#F26419'}
}
const colors:any = {
  'light_mode':'dark',
  'background':{'dark':'#032F5E','light':'#F5FBFF'},
  'campaign_banner':{'dark':'#B3D2EC','light':''},
  'center_in':{'dark':'black','light':'black'},
  'center_out':{'dark':'#CBF9F9','light':'#97D8C4'}
}
export {colors, legend_colors}
interactive.add_dev_control_panel()
fetch('SampleCampaign.json')
  .then(res => res.json())
  .then(data => {
    console.log('load data.')
    console.log(data)

    const network = () => {
      const width = 500
      const height = 350
      const timespan = 30000
      const scale_factor = 4
      const radius = 100
      var current_time = 0
      //-- constructing nodes array from data
      const nodes:any[] = data.Campaigns
      const circle_fraction = Math.PI*2/nodes.length
      const fraction_offset = nodes.length%2==0?2:3
      //-- add a node as center node center
      const user_node = {Name: "", id: 'user', x: 250, y: 150}
      nodes.forEach((item, i) => {
        let angle = circle_fraction * i + circle_fraction/fraction_offset
        item.x = distributed_on_circumference_x(user_node,
                                                radius,
                                                angle)

        item.y = distributed_on_circumference_y(user_node,
                                                radius,
                                                angle)
        // determine whether node below or above center
        item.orientation = Math.PI>angle?1:-1

      })

      //-- set up links such that all nodes are connected with center node
      const links = nodes.map((node, i) => {
        let link = {id:i, source:{...user_node}, target:node, angle:0}
        link.angle = circle_fraction * i + circle_fraction/fraction_offset
        link.source.x = distributed_on_circumference_x(user_node,
                                                       33,
                                                       link.angle)

        link.source.y = distributed_on_circumference_y(user_node,
                                                       33,
                                                       link.angle)

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
        // start drawing particles at the right time
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
        .attr('width', 100)
        .attr('height', 23)
        .attr('x', d => d.x - 50)
        .attr('y', d => d.orientation>0?d.y+13:d.y-31)
        .attr('fill', colors.campaign_banner.dark)
        .attr('stroke-width', 0)
      //-- campaign text
      // TODO: Make sizes dependent on word length and center
      node.append('text')
        .attr('dx', d => d.x -40)
        .attr('dy', d => d.orientation>0?d.y+29:d.y-15)
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
    const link_angle = link.angle
    for (let data of link.target.CollectedData) {
      let particle = data
      particle.arrived = false
      particle.time = data.retrievedAt
      particle.dist = 0.1
      particle.speed = 0.1
      particle.particle_size = 11
      particle.position = {x:x_start, y:y_start}
      particle.link = {}
      particle.link.id = link.id
      particle.link.source = {x:x_start,y:y_start}
      particle.link.path_length = link_length
      particle.link.path_angle = link_angle
      particles.push(particle)
    }
  }
  return particles
}
 // functions to compute position of nodes on circle circumference
const distributed_on_circumference_x = (center_node:any, radius:number,
  angle:number):number => {
  let x_circ = radius * Math.cos(angle) + center_node.x
  return x_circ
}
const distributed_on_circumference_y = (center_node:any, radius:number,
  angle:number):any => {
  let y_circ = radius * Math.sin(angle) + center_node.y
  return y_circ
}

const add_legend_tag_symbol = (outer_svg:any):void => {
  var svg_node_element = outer_svg.node() as Element
  getSVG('placeholder.svg')
    .then((documentFragment)=> {
      var sub_svg = documentFragment.documentElement
                                    .querySelector('#place_tag_symbol') as Element
      svg_node_element.append(sub_svg)
      outer_svg.select('#place_tag_symbol')
        .attr('transform','translate(340, 315) scale(0.32)')
        .attr('fill', legend_colors.GPS.dark)
        .append('text')
          .text('GPS')
          .attr('dx', 100)
          .attr('dy', 44)
          .attr('font-family', 'sans-serif')
          .attr('font-size', '30px')
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
          .attr('transform','translate(230,315) scale(0.041)')
          .attr('fill', legend_colors.Speed.dark)
          .append('text')
            .text('Speed')
            .attr('dx', 800)
            .attr('dy', 375)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '250px')
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
          .attr('transform','translate(125,315) scale(0.041)')
          .attr('fill', legend_colors.Fuel.dark)
          .append('text')
            .text('Fuel')
            .attr('dx', 800)
            .attr('dy', 375)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '250px')
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
        .attr('transform','translate(-123,-42) scale(0.4)');
      })
}
