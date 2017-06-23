const { Graph } = require('./index')

const add = ({X,Y}, cb) => {
  setTimeout(() => cb({ SUM: X + Y }), 0)
}

const split = ({IN}, cb) => {
  cb({
    OUT1: Math.random(),
    OUT2: Math.random()
  })
}

var data = {}
var g = Graph("new graph", data)

g.add("add1", add, { X: 10, Y: 30 })
g.add("add0", add, { X: 13, Y: 30 })
g.add("split1", split, { IN: 34 })
g.add("add2", add, { X: 'split1>OUT1', Y: 20})
g.add("add3", add, { X: 'add2>SUM', Y: 120})
g.add("add3b", add, { X: 'add3>SUM', Y: 2})
g.add("add4", add, { X: 'add1>SUM', Y: 'split1>OUT2'})
g.add("add5", add, { X: 'add4>SUM', Y: 10})

g.run(graphData => console.log(graphData))
