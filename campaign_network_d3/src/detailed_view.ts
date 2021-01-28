import * as d3 from 'd3'
import { ICONS } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'
import { getSVG } from './import_svg'

export const build_detailed_view = () => {
  const overlay_container = d3.select('#grid').append('div')
    .attr('class', 'detail-overlay-container hidden')
    .style('backdrop-filter', 'blur(10px)')
    .style('background-color', colorMode === 'dark'? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 200, 0.6)')

  overlay_container.append('span')
    .attr('class', 'detail-overlay-title')

  overlay_container.append('ul')
    .attr('class', 'detail-overlay hidden')
}

export async function show(node_info:any): Promise<void> {
  d3.select('.detail-overlay-container')
    .attr('class', 'detail-overlay-container visible')

  d3.select('.detail-overlay-title')
    .html(node_info.Name)

  const timeline = d3.select('.detail-overlay')
    .attr('class','detail-overlay visible')
    .selectAll('.datapoint')
    .data(node_info.CollectedData)
    .enter().append('li')
    .attr('class', 'datapoint')
    .style('background-color', colorMode === 'dark'? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')

  timeline.append('span')
    .attr('class', 'icon')
    .html((d: any) => ICONS[d.type.toLowerCase()].toString())

  const svg = timeline.select('.icon > svg')
    .attr('height', null)
    .attr('width', null)

  svg.selectChild('g')
    .attr('fill', (d: any) => LEGEND_COLORS[d.type.toLowerCase()][colorMode])

  timeline.append('span')
    .attr('class', 'text detail-type')
    .style('color', (d: any) => LEGEND_COLORS[d.type.toLowerCase()][colorMode])
    .text((d:any) => `${d.type}`)

  timeline.append('span')
    .attr('class', 'text detail-date')
    .style('color', '#c7c7c7')
    .text((d:any) => `retrieved on ${d.retrievedAt}  by:`)

  timeline.append('span')
    .attr('class', 'text company')
    .style('color', '#424242')
    .text((d:any) => `${d.collectedBy}`)

  d3.select('.button-container')
    .style('position', 'absolute')

  d3.select('#back_button')
    .style('visibility', 'visible')

}

export const hide = ():void => {
  d3.select('.detail-overlay').attr('class', 'detail-overlay hidden')
  d3.select('.detail-overlay-container').attr('class', 'detail-overlay-container hidden')
  d3.selectAll('.datapoint').remove()

  d3.select('.button-container')
    .style('position', 'inherit')

  d3.select('#back_button')
    .style('visibility', 'hidden')
}
