const Graph = require("./graph")
const td = require('testdouble')

test("has a default name", () => {
  expect(Graph().name).toEqual("new graph")
})

test("can add nodes", () => {
  const g = Graph()
  g.addNode('node')
  expect(Object.keys(g.nodes).length).toEqual(1)
  g.add('two')
  expect(Object.keys(g.nodes).length).toEqual(2)
})

// test("can remove nodes", () => {
//   const g = Graph()
//   g.addNode(td.object())
//   expect(Object.keys(g.nodes).length).toEqual(1)
// })
