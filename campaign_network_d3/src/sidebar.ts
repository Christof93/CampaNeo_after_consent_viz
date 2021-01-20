import * as d3 from 'd3'
import { ICONS } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'

export const build_sidebar = () => {
  d3.select('#grid').append('div')
    .attr('class', 'sidebar')
    .style('margin', '1em')

  const sidebar = d3.select('.sidebar')

  Object.keys(ICONS).forEach((value: string) => {
    const element = sidebar.append('div')
      .attr('class', 'sidebar-element')
      .html(ICONS[value].toString())

    element.selectChild('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
  })
}