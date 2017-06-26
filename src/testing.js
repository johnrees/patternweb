const PW = require('..')

const graph = PW.Graph()
const database = {}

const addFn = ({A, B}, done) => done({RESULT: A + B})
const subFn = ({A, B}, done) => done({RESULT: A - B})

graph.add("Add", addFn, { A: 1, B: 2 })
graph.add("Sum", subFn, { A: 10, B: "Add>RESULT" })

graph.events.on("run", function(id) {
  console.log(`${id} just ran and stored ${JSON.stringify(database[id])}`)
})
// Add just ran: {"RESULT":3}
// Sum just ran: {"RESULT":7}

graph.run(database, function() {
  console.log(database) // { Add: { RESULT: 3 }, Sum: { RESULT: 7 } }
})