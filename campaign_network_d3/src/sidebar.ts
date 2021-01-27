import * as d3 from 'd3'
import { ICONS, LIGHTBULB_ICON, ARROW_ICON } from './icons'
import { COLORS, LEGEND_COLORS } from './colors'
import { changeLightMode, click_outside } from './interactivity'

export const buildSidebar = () => {
  d3.select('#grid').append('div')
    .attr('class', 'sidebar')
    .style('margin', '1em')

  const sidebar = d3.select('.sidebar')

  const button_container = sidebar.append('div')
    .attr('class', 'button-container')

  button_container.append('div')
    .attr('class', 'color-mode')
    .on('click', changeLightMode)
    .html(LIGHTBULB_ICON[colorMode])

  button_container.append('div')
    .attr('class', 'color-mode')
    .attr('id', 'back_button')
    .style('visibility', 'hidden')
    .on('click', click_outside)
    .html(ARROW_ICON)

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
