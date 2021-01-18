import { COLORS, LEGEND_COLORS, ColorMode } from './colors'
import * as detail_overlay from './detailed_view'

import * as d3 from 'd3'
const detailed_view_on = false
export const add_dev_control_panel = () => {
  d3.select('#light-switch-button')
    .on('click',change_light_mode)
}
const change_light_mode = ():void => {
  colorMode = (colorMode === 'dark' ? 'light' : 'dark')
  console.log(`Color mode: ${colorMode}`)
  d3.select('#network-container')
    .style('background-color',COLORS.background[colorMode])
  d3.select('#place_tag_symbol').attr('fill',LEGEND_COLORS.gps[colorMode])
  d3.select('#fuel_symbol').attr('fill',LEGEND_COLORS.fuel[colorMode])
  d3.select('#speed_symbol').attr('fill',LEGEND_COLORS.speed[colorMode])
  d3.select('#car_button > ellipse').attr('fill',COLORS.center_out[colorMode])
  d3.select('#car_button > g > path').attr('fill',COLORS.center_in[colorMode])
  d3.select('#network-container > ul').style('background-color', colorMode === 'dark'? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 200, 0.6)')
}

export const mouseover_campaign_node = (event:any, node:any):void => {
  console.log('mouse over campaign node!')
}
export const mouseout_campaign_node = (event:any, node:any):void => {
  console.log('mouse out campaign node!')
}
export const mouseover_link = (event:any, node:any):void => {
  console.log('mouse over link!')
}
export const mouseout_link =(event:any, node:any):void => {
  console.log('mouse out link!')
}
export const click_campaign_node = (event:any, node:any):void => {
  console.log('mouse over link!')
  console.log(event)
  console.log(node)
  d3.select('canvas').style('visibility','hidden')
  detail_overlay.show(node)
  setTimeout(() => {
    d3.select('#network-container').on('click', click_outside)
  }, 10)
}
export const click_link = (event:any, node:any):void => {
  click_campaign_node(event, node)
}

export const click_outside = (event:any, node:any) => {
  console.log('hide detailed view')
  d3.select('#network-container').on('click', null)
  d3.select('canvas').style('visibility','visible')
  detail_overlay.hide()
}
