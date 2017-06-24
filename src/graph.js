const ASQ = require('asynquence')
const topolysis = require('topolysis')
const { Node, _isAnAlias, _getSourceNode } = require('./node')

const Graph = (name="new graph", _data={}) => {

  let _graph = {}
  let nodes = {}
  let edges = []

  const _sort = () => {
    let sortedGraph = []
    for (const x of topolysis(_graph)) {
      sortedGraph.unshift(x)
    }
    return sortedGraph
  }

  const addNode = (id, component, inputs = {}) => {
    nodes[id] = Node(id, component, inputs)
    _graph[id] = _graph[id] || []
    Object.keys(inputs).forEach(key => {
      if (_isAnAlias(inputs[key])) {
        const [sourceNodeId, outport] = _getSourceNode(inputs[key])
        _graph[sourceNodeId] = _graph[sourceNodeId] || []
        _graph[sourceNodeId].push(id)
        edges.push([ inputs[key], `${key}>${id}`])
      }
    })
  }

  const run = (callback=null) => {
    let seq = ASQ()

    const steps = _sort()
    steps.forEach(stepNodes => {

      // console.log("running in parallel ", stepNodes)

      seq.all(
        ...stepNodes.map(id => {
          const node = nodes[id]
          return function(done) {
            const fail = message => done.fail([id, message])
            try {
              const inputs = Object.keys(node.inputs).reduce(function(acc, key) {
                if (_isAnAlias(node.inputs[key])) {
                  const [sourceNodeId, outport] = _getSourceNode(node.inputs[key])
                  if (!outport) fail("malformed input")
                  else if (_data[sourceNodeId] === undefined) fail("root key not found")
                  else if (_data[sourceNodeId][outport] === undefined) fail(`sub key not found (${sourceNodeId}>${outport})`)
                  acc[key] = _data[sourceNodeId][outport]
                } else {
                  acc[key] = node.inputs[key]
                }
                return acc
              }, {})
              const doneWithId = (id) => (output) => done([output, id])
              node.component.implementation(inputs, doneWithId(id))
            } catch(e) {
              throw [id,e]
            }
          }
        })
      ).val(function(...msgs) {
        msgs.forEach( ([msg, id]) => {
          Object.keys(msg).forEach(key => {
            _data[id] = _data[id] || {}
            _data[id][key] = msg[key]
          })
          // console.log(`[${id}] ${JSON.stringify(msg)}`)
        })
      })

    })

    seq
      .val(msg => callback ? callback(_data) : _data)
      .or((err) => console.error(err))
  }

  return {
    name,
    edges,
    nodes,
    addNode,
    add: addNode,
    run,
    _data
  }

}

module.exports = Graph