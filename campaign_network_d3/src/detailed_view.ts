import * as d3 from 'd3'


export const build_detailed_view = (node:any):any => {
  console.log(node)
  d3.select('svg').append('g')
    .attr('class','detail-overlay hidden')
    .append('rect')
    .attr('rx', 12)
    .attr('ry', 12)
    .attr('width', 480)
    .attr('height', 330)
    .attr('x', 10)
    .attr('y', 10)
    .attr('fill', 'white')
    .attr('stroke-width', 0)
  return node
}

export const show = (node_info:any):void => {

  const timeline = d3.select('g.detail-overlay')
    .attr('class','detail-overlay visible')
    .selectAll('.datapoint')
    .data(node_info.CollectedData)
    .enter().append('g')
    .attr('class','datapoint')

  console.log(timeline.data)
  timeline.append('rect')
    .attr('class', 'timeline-rect')
    .attr('width', 460)
    .attr('height', 35)
    .attr('rx', 12)
    .attr('ry', 12)
    .attr('x', 20)
    .attr('y', (d:any,i:number) => 30 + i*40)
    .attr('fill', 'white')
    .attr('stroke-width', 0)

  timeline.append('text')
    .attr('dx', 40)
    .attr('dy', (d:any,i:number) => 50 + i*40 )
    .attr('font-family', 'sans-serif')
    .attr('font-size', '12.5px')
    .attr('fill', 'black')
    .attr('stroke-width', 0)
    .text((d:any) => d.type)

}
export const hide = ():void => {
  d3.select('g.detail-overlay').attr('class','detail-overlay hidden')
  d3.selectAll('g.datapoint').remove()
}
