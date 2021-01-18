import './style.css'
import 'bootstrap/dist/css/bootstrap.css'

import * as d3 from 'd3'
import { getSVG } from './import_svg'
import * as interactive from './interactivity'
import * as detail_overlay from './detailed_view'
import {COLORS, LEGEND_COLORS, ColorMode} from './colors'

interactive.add_dev_control_panel()
fetch('SampleCampaign.json')
  .then(res => res.json())
  .then(async data => {
    console.log('load data.')
    console.log(data)

    const svg:any = await build_network(data)
    // construct the overlay for more detailed info
    detail_overlay.build_detailed_view(svg)
  })

const build_network = async (data:any) => {
  const width = 500
  const height = 350
  const timespan = 10000
  const scale_factor = 4
  const radius = 100
  //-- constructing nodes array from data
  const nodes:any[] = data.Campaigns
  const circle_fraction = Math.PI*2/nodes.length
  const fraction_offset = nodes.length%2==0?2:3
  //-- add a node as center node center
  const user_node = {Name: '', id: 'user', x: 250, y: 150}
  nodes.forEach((item, i) => {
    const angle = circle_fraction * i + circle_fraction/fraction_offset
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
    const link = {id:i, source:{...user_node}, target:node, angle:0}
    link.angle = circle_fraction * i + circle_fraction/fraction_offset
    link.source.x = distributed_on_circumference_x(user_node,
      33,
      link.angle)

    link.source.y = distributed_on_circumference_y(user_node,
      33,
      link.angle)

    return link
  })
  const container = d3.select('#network-graph')
  const svg = container
  .append('svg')
  .attr('viewBox', [0, 0, width, height].join(','))

  // -- setup the particles
  //nodes.push(user_node)
  console.log(links)
  console.log(nodes)
  //-- setup the svg

  //-- retrieving and adding all the svg elements
  await add_legend_gps_symbol(svg)
  await add_legend_fuel_symbol(svg)
  await add_legend_speed_symbol(svg)
  await add_car_button(svg)

  // ----------- drawing the svg with bound data ---------------
  //-- links
  const line_links = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'link')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('stroke-width', 1)
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)

  //-- invisible hover links
  svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'boundary')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('stroke-width', 4)
    .attr('stroke-opacity', 0)
    .on('mouseover', (d,i) => interactive.mouseover_campaign_node)
    .on('mouseout', (d,i) => interactive.mouseout_campaign_node)
    .on('click', (d,i) => interactive.click_campaign_node)

  //-- nodes
  const node = svg.append('g')
    .selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .on('mouseover', (d,i) => interactive.mouseover_campaign_node)
    .on('mouseout', (d,i) => interactive.mouseout_campaign_node)
    .on('click', interactive.click_campaign_node)
    //-- campaign text

  //-- campaign textfield
  node.append('rect')
    .attr('class', 'text_field')
    .attr('rx', 12)
    .attr('ry', 12)
    .attr('width', 100)
    .attr('height', 23)
    .attr('x', d => d.x - 50)
    .attr('y', d => d.orientation>0?d.y+13:d.y-31)
    .attr('fill', COLORS.campaign_banner[colorMode])
    .attr('stroke-width', 0)

  //-- invisible hover field
  node.append('rect')
    .attr('class', 'hover_field')
    .attr('width', 100)
    .attr('height', 35)
    .attr('x', d => d.x - 50)
    .attr('y', d => d.orientation>0?d.y-4:d.y-31)
    .attr('fill', 'none')
    .attr('stroke-width', 0)

  // TODO: Make sizes dependent on word length and center
  node.append('text')
    .attr('dx', d => d.x -40)
    .attr('dy', d => d.orientation>0?d.y+29:d.y-15)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '12.5px')
    .attr('fill', 'black')
    .attr('stroke-width', 0)
    .text(d => d.Name)

  function showParticleAnimation() {
    d3.selectAll('circle').remove()

    line_links.each(function(line_link, j) {
      const elem = d3.select(this)
      const dataCollection = line_link.target.CollectedData
      const dataCollectionLength = dataCollection.length

      for(let i = 0; i < dataCollectionLength; i++) {
        const color = LEGEND_COLORS[dataCollection[i].type.toLowerCase()][colorMode]
        svg.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 3)
          .attr('fill', color)
          .transition()
          .delay(i * 750)
          .duration(3000)
          .tween('pathTween', function(){return translate(elem)})
          .on('end', function() {
            const newPos = this.cx.baseVal.value + (((dataCollectionLength - i) * 13))
            d3.select(this).attr('cx', newPos)
          })
      }
    })
  }

  showParticleAnimation()
  setTimeout(showParticleAnimation, timespan)

  function translate(path: any){
    const length = path.node().getTotalLength()
    const interpolation = d3.interpolate(0, length)
    return function(this: SVGCircleElement, t: number){
      const point = path.node().getPointAtLength(interpolation(t))

      d3.select(this)
        .attr("cx", point.x)
        .attr("cy", point.y)
    }
  }

  return svg.node()
}

// functions to compute position of nodes on circle circumference
const distributed_on_circumference_x = (center_node: any, radius: number,
  angle: number): number => {
  const x_circ = radius * Math.cos(angle) + center_node.x
  return x_circ
}
const distributed_on_circumference_y = (center_node: any, radius: number,
  angle: number): any => {
  const y_circ = radius * Math.sin(angle) + center_node.y
  return y_circ
}

const add_legend_gps_symbol = async (outer_svg: any) => {
  const svg_node_element = outer_svg.node() as Element
  const documentFragment = await getSVG('gps.svg')
  const sub_svg = documentFragment.documentElement
    .querySelector('#place_tag_symbol') as Element
  svg_node_element.append(sub_svg)
  outer_svg.select('#place_tag_symbol')
    .attr('transform','translate(340, 315) scale(0.32)')
    .attr('fill', LEGEND_COLORS.gps[colorMode])
    .append('text')
    .text('GPS')
    .attr('dx', 100)
    .attr('dy', 44)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '30px')
    .attr('stroke-width', 0)
}

const add_legend_speed_symbol = async (outer_svg: any) => {
  const svg_node_element = outer_svg.node() as Element
  const documentFragment = await getSVG('speed.svg')
  const sub_svg = documentFragment.documentElement
    .querySelector('#speed_symbol') as Element
  svg_node_element.append(sub_svg)
  outer_svg.select('#speed_symbol')
    .attr('transform','translate(230,315) scale(0.041)')
    .attr('fill', LEGEND_COLORS.speed[colorMode])
    .append('text')
    .text('Speed')
    .attr('dx', 800)
    .attr('dy', 375)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '250px')
    .attr('stroke-width', 0)
}

const add_legend_fuel_symbol = async(outer_svg: any) => {
  const svg_node_element = outer_svg.node() as Element
  const documentFragment = await getSVG('fuel.svg')
  const sub_svg = documentFragment.documentElement
    .querySelector('#fuel_symbol') as Element
  svg_node_element.append(sub_svg)
  outer_svg.select('#fuel_symbol')
    .attr('transform','translate(125,315) scale(0.041)')
    .attr('fill', LEGEND_COLORS.fuel[colorMode])
    .append('text')
    .text('Fuel')
    .attr('dx', 800)
    .attr('dy', 375)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '250px')
    .attr('stroke-width', 0)
}

const add_car_button = async (outer_svg: any) => {
  const svg_node_element = outer_svg.node() as Element
  const documentFragment = await getSVG('car_button.svg')
  const sub_svg = documentFragment.documentElement
    .querySelector('#car_button') as Element
  svg_node_element.append(sub_svg)
  outer_svg.select('#car_button')
    .attr('transform','translate(-123,-42) scale(0.4)')
}
