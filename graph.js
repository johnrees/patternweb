const ASQ = require('asynquence')
const Node = require('./node')
const topolysis = require('topolysis')

const Graph = (name="new graph", _data={}) => {

  let nodes = {}
  let graph = {}

  const _getSourceNode = str => {
    return str.split(">")
  }

  const _sortGraph = () => {
    let sortedGraph = []
    for (const x of topolysis(graph)) {
      sortedGraph.unshift(x)
    }
    return sortedGraph
  }

  const addNode = (id, component, inputs) => {
    nodes[id] = Node(id, component, inputs)
    graph[id] = graph[id] || []
    Object.keys(inputs).forEach(key => {
      if (typeof inputs[key] === "string") {
        const [sourceNodeId, outport] = _getSourceNode(inputs[key])
        graph[sourceNodeId] = graph[sourceNodeId] || []
        graph[sourceNodeId].push(id)
      }
    })
  }

  const run = (data=_data) => {
    let seq = ASQ()

    const steps = _sortGraph()
    steps.forEach(stepNodes => {

      console.log("running in parallel ", stepNodes)

      seq.all(
        ...stepNodes.map(id => {
          const node = nodes[id]
          return function(done) {
            const fail = message => done.fail([id, message])
            try {
              const inputs = Object.keys(node.inputs).reduce(function(acc, key) {
                if (typeof node.inputs[key] === "string") {
                  const [sourceNodeId, outport] = _getSourceNode(node.inputs[key])
                  if (!outport) fail("malformed input")
                  else if (!data[sourceNodeId]) fail("root key not found")
                  else if (!data[sourceNodeId][outport]) fail("sub key not found")
                  acc[key] = data[sourceNodeId][outport]
                } else {
                  acc[key] = node.inputs[key]
                }
                return acc
              }, {})
              const doneWithId = (id) => (output) => done([output, id])
              node.component(inputs, doneWithId(id))
            } catch(e) {
              throw [id,e]
            }
          }
        })
      ).val(function(...msgs) {
        msgs.forEach( ([msg, id]) => {
          Object.keys(msg).forEach(key => {
            data[id] = data[id] || {}
            data[id][key] = msg[key]
          })
          console.log(`[${id}] ${JSON.stringify(msg)}`)
        })
      })

    })

    seq
      .val(msg => console.info(_data))
      .or( (err) => console.error(err) )
  }

  return {
    name,
    nodes,
    addNode,
    add: addNode,
    run
  }

}

module.exports = Graph
