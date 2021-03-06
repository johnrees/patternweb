# PatternWeb

Note: this is still under development, these docs are likely to be incorrect.

## Terminology

A `Graph` is formed of `Nodes`, which are connected by `Edges`.

Outgoing `Edges` are connected from the source `Node's` `Outport` to the target `Node`'s `Inport`.

A `Node` has a `Component`, which is a function that recieves an object, does some work and returns a new object. `Component`s return their object inside a callback-like function.

## Usage

```javascript
const PW = require('patternweb')

const graph = PW.Graph()
const database = {}

const addFn = {
  name: "add",
  description: "adds values",
  fn: ({A, B}, done) => done({RESULT: A + B}),
  inports: ['A', 'B'],
  outports: ['RESULT']
}

const subFn = {
  name: "subtract",
  description: "subtracts values",
  fn: ({A, B}, done) => done({RESULT: A - B}),
  inports: ['A', 'B'],
  outports: ['RESULT']
}

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
```

## Events

Graph events are dispatched by the graph.events EventEmitter

```javascript
graph.events.on('connect', function(sourceNodeID, targetNodeID) {
  console.log(sourceNodeID + " connected to " + targetNodeID)
})
```

Supported Events

* add
* remove
* connect
* disconnect
* run
* start?
* finish?
