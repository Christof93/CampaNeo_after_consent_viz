import * as d3 from 'd3'
import { ICONS } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'
import { getSVG } from './import_svg'

export const build_detailed_view = () => {
  d3.select('#grid').append('ul')
    .attr('class', 'detail-overlay hidden')
    .style('background-color', colorMode === 'dark'? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 200, 0.6)')
    .style('backdrop-filter', 'blur(10px)')
    .style('padding', '1em')
}

export async function show(node_info:any): Promise<void> {
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
    .attr('class', 'text')
    .style('color', (d: any) => LEGEND_COLORS[d.type.toLowerCase()][colorMode])
    .text((d:any) => `${d.type} (retrieved at ${d.retrievedAt})`)

}

export const hide = ():void => {
  d3.select('.detail-overlay').attr('class', 'detail-overlay hidden')
  d3.selectAll('.datapoint').remove()
}
