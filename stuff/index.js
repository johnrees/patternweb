const PW = require('../src')
const graph = PW.Graph()
const database = {}

const list = require('./patterns/list')
const svg = require('./patterns/svg')

const points = ({WIDTH, HEIGHT}, done) => {
  const POINTS = [
    [0, 0],
    [WIDTH/2, HEIGHT/2],
    [WIDTH/2, HEIGHT],
    [-WIDTH/2, HEIGHT],
    [-WIDTH/2, HEIGHT/2],
    [0, 0]
  ].map(p => [p[0] + WIDTH/2 + 50, p[1] + 50])
  done({ POINTS })
}

graph.add("Points", points, { WIDTH: 400, HEIGHT: 400 })

graph.add("Polyline", svg.polyline, { POINTS: "Points>POINTS" })
  graph.add("Fill", svg.fill, { COLOR: 'none' })
  graph.add("Stroke", svg.stroke, { COLOR: 'black' })
  graph.add("CombineHouse", list.combine, { ITEM1: "Polyline>POLYLINE", ITEM2: "Fill>FILL", ITEM3: "Stroke>STROKE" })

// graph.add("Circles", svg.circle, { POINTS: "Points>POINTS", RADIUS: 10 })

graph.add("Rect", svg.rect, { WIDTH: 100, HEIGHT: 100 })
  graph.add("MoveRect", svg.move, { X: 200, Y: 200 })
  graph.add("CombineRect", list.combine, { ITEM1: "Rect>RECT", ITEM2: "MoveRect>MOVE" })

graph.add("CombineAll", list.combine, { ITEM1: "CombineHouse>LIST", ITEM2: "CombineRect>LIST" })
graph.add("DrawHouse", svg.sketch, { CANVAS: "drawing", COMMANDS: "CombineAll>LIST" })

// ----------------

graph.events.on("run", function(id) {
  // console.log(`${id} just ran and stored ${JSON.stringify(database[id])}`)
})

graph.run(database, function() {
  // console.log(JSON.stringify(database))
})
