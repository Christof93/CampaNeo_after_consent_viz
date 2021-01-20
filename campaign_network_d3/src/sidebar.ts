import * as d3 from 'd3'
import { ICONS } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'
import { change_light_mode } from './interactivity'

export const build_sidebar = () => {
  d3.select('#grid').append('div')
    .attr('class', 'sidebar')
    .style('margin', '1em')

  const sidebar = d3.select('.sidebar')

  sidebar.append('div')
    .attr('class', 'color-mode')
    .on('click', change_light_mode)
    .html(ICONS['lightbulb_regular'].toString())

  Object.keys(ICONS).filter(i => i !== 'lightbulb_solid' && i !== 'lightbulb_regular').forEach((value: string) => {
    const element = sidebar.append('div')
      .attr('class', 'sidebar-element')
      .html(ICONS[value].toString())

    element.selectChild('svg')
      .attr('fill', LEGEND_COLORS[value][colorMode])
      .attr('preserveAspectRatio', 'xMidYMid meet')

    element.append('svg')
      .attr('viewBox', [0, 0, 60, 25].join(','))
      .append('text')
      .attr('fill', LEGEND_COLORS[value][colorMode])
      .text(value.toLocaleUpperCase())
      .attr('dx', 30)
      .attr('dy', 15)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'sans-serif')
  })
}
