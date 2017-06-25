const Graph = require("../graph")

const add = ({X, Y}, done) => done({ SUM: X + Y })

it("can be created without blowing up", () => expect(new Graph()).toBeTruthy())

describe("adding nodes", () => {
  it("can add a node", () => {
    const g = new Graph()
    g.add("newnode", add, { X: 1, Y: 2 })
    expect( Object.keys(g.nodes()) ).toEqual(["newnode"])
  })

  it("can only add a node with a unique ID", () => {
    const g = new Graph()
    g.add("newnode", add, { X: 1, Y: 2 })
    expect( () => g.add("newnode") ).toThrow("node already exists with that ID")
  })
})

it("can remove a node", () => {
  const g = new Graph()
  g.add("newnode", add, { X: 1, Y: 2 })
  g.remove("newnode")
  expect(Object.keys(g.nodes())).toHaveLength(0)
})

it("can find a node", () => {
  const g = new Graph()
  g.add("newnode", add, { X: 1, Y: 2 })
  expect(g.find("newnode")).toBeTruthy()
  expect(g.find("newnode2")).toBeUndefined()
})

it("can connect nodes", () => {
  const g = Graph()
  g.add("nodeA", add, { X: 1, Y: 2 })
  g.add("nodeB", add, { X: "nodeA>SUM", Y: 2 })
  expect( Object.keys(g.edges()) ).toEqual(["nodeA>SUM-X>nodeB"])
})

it("can disconnect nodes", () => {
  const g = new Graph()
  g.add("nodeA", add, { X: 1, Y: 2 })
  g.add("nodeB", add, { X: "nodeA>SUM", Y: 2 })
  g.disconnect("nodeA","SUM","nodeB","X")
  expect( Object.keys(g.edges()) ).toHaveLength(0)
})

it("can be run", () => {
  const g = Graph()
  let obj = {}

  g.add("nodeA", add, { X: 1, Y: 1})
  g.add("nodeB", add, { X: 'nodeA>SUM', Y: 1})
  g.add("nodeC", add, { X: 'nodeA>SUM', Y: 2})
  g.add("nodeD", add, { X: 'nodeB>SUM', Y: 'nodeC>SUM'})

  expect(g.run(obj)).toEqual({
    nodeA: { SUM: 2 },
    nodeB: { SUM: 3 },
    nodeC: { SUM: 4 },
    nodeD: { SUM: 7 }
  })
})
