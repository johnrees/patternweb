# PatternWeb

Note: this is still under development, these docs are likely to be incorrect.

## Usage

```
const PW = require('patternweb')

const graph = PW.Graph()

const addFn = ({A, B}, done) => done({RESULT: A + B})
const subFn = ({A, B}, done) => done({RESULT: A - B})

graph.add("Add", addFn, { A: 1, B: 2 })
graph.add("Sum", subFn, { A: 10, B: "Add>RESULT" })

graph.events.on("run", function(id) { console.log(`${id} just ran`) })
// Add just ran
// Sum just ran

graph.run({}, function(results) {
  console.log(results) // { Add: { RESULT: 3 }, Sum: { RESULT: 7 } }
})
```

## Events

.on Event Listener

`graph.on('connect', function(sourceNodeID, targetNodeID) { console.log(sourceNodeID) })`

Supported Events

* connect
* disconnect
* add
* remove
* run
* start?
* finish?
