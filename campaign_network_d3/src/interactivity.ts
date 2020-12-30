import { colors, legend_colors } from './index.ts'
import * as d3 from 'd3'

export async function add_dev_control_panel() {
  d3.select('#light-switch-button')
    .on('click',change_light_mode)
}
const change_light_mode = ():void => {
  console.log(colors)
  colors.light_mode = (colors.light_mode=='dark'?'light':'dark')
  console.log(colors)
  d3.select('#network-container')
    .style('background-color',colors.background[colors.light_mode])
  d3.select('#place_tag_symbol').attr('fill',legend_colors.GPS[colors.light_mode])
  d3.select('#fuel_symbol').attr('fill',legend_colors.Fuel[colors.light_mode])
  d3.select('#speed_symbol').attr('fill',legend_colors.Speed[colors.light_mode])
  d3.select('#car_button > ellipse').attr('fill',colors.center_out[colors.light_mode])
  d3.select('#car_button > g > path').attr('fill',colors.center_in[colors.light_mode])

}
