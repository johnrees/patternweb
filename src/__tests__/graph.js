const Graph = require("../graph")

it("can be created without blowing up", () => expect(new Graph()).toBeTruthy())

describe("adding nodes", () => {
  it("can add a node", () => {
    const g = new Graph()
    g.add("newnode")
    expect( Object.keys(g.nodes()) ).toEqual(["newnode"])
  })

  it("can only add a node with a unique ID", () => {
    const g = new Graph()
    g.add("newnode")
    expect( () => g.add("newnode") ).toThrow("node already exists with that ID")
  })
})

it("can remove a node", () => {
  const g = new Graph()
  g.add("newnode")
  g.remove("newnode")
  expect(Object.keys(g.nodes())).toHaveLength(0)
})

it("can find a node", () => {
  const g = new Graph()
  g.add("newnode")
  expect(g.find("newnode")).toBeTruthy()
  expect(g.find("newnode2")).toBeUndefined()
})

it("can connect nodes", () => {
  const g = Graph()
  g.add("nodeA")
  g.add("nodeB")
  g.connect("nodeA","nodeB")
  expect( Object.keys(g.edges()) ).toEqual(["nodeA-nodeB"])
})

it("can disconnect nodes", () => {
  const g = new Graph()
  g.add("nodeA")
  g.add("nodeB")
  g.connect("nodeA","nodeB")
  g.disconnect("nodeA","nodeB")
  expect( Object.keys(g.edges()) ).toHaveLength(0)
})
