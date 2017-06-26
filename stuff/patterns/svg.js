const _SVG = require('svg.js')

const toSketch = draw => methods => {
  methods.reduce((chain, [fn, ...attrs]) =>
    chain[fn](...attrs), draw)
  return draw
}

const sketch = ({COMMANDS, CANVAS, CANVAS_WIDTH=600, CANVAS_HEIGHT=600}, done) => {
  var canvas = _SVG(CANVAS).size(CANVAS_WIDTH, CANVAS_HEIGHT).spof()

  let SVG
  if (Array.isArray(COMMANDS[0][0])) {
    SVG = COMMANDS.map(toSketch(canvas)).map(c => c.svg())
  } else {
    SVG = toSketch(canvas)(COMMANDS)
  }
  done({ SVG })
}

const rect = ({ WIDTH, HEIGHT }, done) => done({ RECT: ['rect', WIDTH, HEIGHT] })
const move = ({ X, Y }, done) => done({ MOVE: ['move', X, Y] })
// const circle = ({ RADIUS }, done) => done({ CIRCLE: ['circle', RADIUS] })

const circle = ({ RADIUS, POINTS }, done) => {
  let CIRCLES = []
  for (const point of POINTS) {
    CIRCLES.push([['circle', RADIUS], ['fill', 'black'], ['move', ...point]])
  }
  console.log(JSON.stringify(CIRCLES))
  done({ CIRCLES })
}
// const point = ({ POINT }, done) => sketch([['circle', 10], ['move', ...coords.map(p => p-5)]])

const polyline = ({ POINTS }, done) => done({ POLYLINE: ['polyline', POINTS] })

const fill = ({ COLOR }, done) => done({ FILL: ['fill', COLOR] })
const stroke = ({ COLOR }, done) => done({ STROKE: ['stroke', COLOR] })

module.exports = {
  sketch,
  move,
  rect,
  circle,
  polyline,
  fill,
  stroke
}
