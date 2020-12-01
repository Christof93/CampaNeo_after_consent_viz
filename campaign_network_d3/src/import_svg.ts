import * as d3 from 'd3'

export async function getSVG(filename:string) {
  d3.xml(filename)
    .then(documentFragment => {
      return documentFragment
    })
}
export async function appendSVGFragment(filename:string, svg:Element) {
  return d3.xml(filename)
    .then(documentFragment => {
      svg.append(documentFragment.documentElement.querySelector('#car_button') as Element)
    })
}
