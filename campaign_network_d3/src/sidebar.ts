import * as d3 from 'd3'
import { ICONS, LIGHTBULB_ICON } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'
import { changeLightMode } from './interactivity'

export const buildSidebar = () => {
  d3.select('#grid').append('div')
    .attr('class', 'sidebar')
    .style('margin', '1em')

  const sidebar = d3.select('.sidebar')

  sidebar.append('div')
    .attr('class', 'color-mode')
    .on('click', changeLightMode)
    .html(LIGHTBULB_ICON[colorMode])

  Object.entries(ICONS).forEach(([key, value]) => {
    const element = sidebar.append('div')
      .attr('class', `sidebar-element ${key}`)
      .html(value.toString())

    element.selectChild('svg')
      .attr('class', `icon`)
      .attr('fill', LEGEND_COLORS[key][colorMode])
      .attr('preserveAspectRatio', 'xMidYMid meet')

    element.append('div')
      .attr('class', 'text')
      .style('color', LEGEND_COLORS[key][colorMode])
      .text(key.toLocaleUpperCase())
  })
}
