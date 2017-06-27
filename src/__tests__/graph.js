const Graph = require("../graph")

const add = {
  name: "add",
  description: "adds values",
  fn: ({A, B}, done) => done({RESULT: A + B}),
  inports: ['A', 'B'],
  outports: ['RESULT']
}

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

it("can be run", done => {

  const g = Graph()
  let obj = {}
  // const f = ({X, Y}) => { return p }

  g.add("nodeA", add, { A: 1, B: 1})
  g.add("nodeB", add, { A: 'nodeA>RESULT', B: 1})
  g.add("nodeC", add, { A: 'nodeA>RESULT', B: 2})
  g.add("nodeD", add, { A: 'nodeB>RESULT', B: 'nodeC>RESULT'})

  // g.events.on('run', function(id) { console.log(id, "RUNNNN")})
  // g.events.on('error', function(id, error) { console.error(id) })

  g.run(obj, result => {
    expect(result).toEqual({
      nodeA: { RESULT: 2 },
      nodeB: { RESULT: 3 },
      nodeC: { RESULT: 4 },
      nodeD: { RESULT: 7 }
    })
    done()
  })

})
