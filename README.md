# PatternWeb

## Installation

`npm install patternweb`

## Usage

```
const PW = require('patternweb')
const PWMath = require('patternweb-math')

var graph = PW.Graph()
graph.add("add", PWMath.add, { A: 1, B: 2 })
graph.add("sub", PWMath.subtract, { A: 10, B: "add>SUM" })
graph.run(true)
```

## Events

.on Event Listener

`graph.on('connect', function(sourceNodeID, targetNodeID) { console.log(sourceNodeID) })`

Supported Events

connect
disconnect
add
remove
start?
finish?