import { legend_colors, colors } from './index.ts'
// -- loosely implemented after this http://bl.ocks.org/gvenezia/e0e6d17dbf12dd6a7ea819ffe02c7aa1
const expired:any[] = []

export function createProperResCanvas(w: number, h: number, ratio: number) {
  if (!ratio) { ratio = Math.round(window.devicePixelRatio) || 1 }
  // Set canvas
  const can = document.querySelector('#particle-overlay-canvas')! as HTMLCanvasElement
  const parent_container = can.parentElement as HTMLElement
  console.log(parent_container.clientWidth)
  // Keep canvas within the allowable size:
  // https://stackoverflow.com/a/11585939/8585320
  can.width = Math.min(32767, w * ratio)
  can.height = Math.min(32767, h * ratio)
  can.style.width = (parent_container.clientWidth || w) + 'px'
  can.style.height = (parent_container.clientHeight || h) + 'px'
  // Set context
  const ctx = can.getContext('2d')
  //ctx?.scale(ratio,ratio)
  ctx?.clearRect(0, 0, w, h)
  // Since context does all of the drawing, no need to return canvas itself
  return ctx
}

export async function draw_canvas_particles(particles:any,
                                            canvas_ctx:any,
                                            timedelta:number) {
  canvas_ctx.clearRect(0, 0, canvas_ctx.canvas.width, canvas_ctx.canvas.height)
  canvas_ctx.fillStyle = '#23F0D5'
  canvas_ctx.lineWidth = '50px'
  for (const i in particles) {
    const particle = particles[i]
    const distance_from_start = particle.dist
    const new_distance = distance_from_start + (timedelta * particle.speed)
    // make room to stack particles at the end
    if (new_distance >= particle.link.path_length && !particle.arrived) {
      particle.arrived = true
      // move all arrived particles at the same link to the right
      for (const arrived_particle of particles.filter((p:any)=>
        p.arrived && p.link.id==particle.link.id)
      ) {
        arrived_particle.position.x +=25
        draw_single_particle(arrived_particle, canvas_ctx)
      }
    }
    //draw on path
    else if (!particle.arrived) {
      particle.position = get_coordinates_at_distance(
                                                    new_distance,
                                                    particle.link.source,
                                                    particle.link.path_angle,
                                                    particle.link.orientation)
      particle.dist = new_distance
      // Draw the particles
      draw_single_particle(particle, canvas_ctx)
    }
    // draw as a stack to the side
    else {
      draw_single_particle(particle, canvas_ctx)
    }
  }
}

function draw_single_particle(particle:any, canvas_ctx:any) {
  canvas_ctx.beginPath()
  canvas_ctx.arc( // creates a circle in canvas
    particle.position.x,
    particle.position.y,
    particle.particle_size, // radius of circle
    0, // circle starting position
    2 * Math.PI  // circle ending position
  )
  canvas_ctx.lineWidth = 2
  canvas_ctx.shadowBlur = 12
  canvas_ctx.shadowColor = legend_colors[particle.type][colors.light_mode]
  canvas_ctx.fillStyle = legend_colors[particle.type][colors.light_mode]
  canvas_ctx.fill()
}

function get_coordinates_at_distance(dist:number, path_start:any ,
                                     path_angle:number, orientation:number) {
  const new_x = path_start.x + (Math.cos(path_angle) * dist)
  const new_y = path_start.y + (Math.sin(path_angle) * dist)
  return {x:new_x, y:new_y}
}
