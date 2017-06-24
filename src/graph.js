const { Map } = require('immutable')

const Graph = () => {

  let _nodes = Map()
  let _edges = Map()

  const add = (nodeID/*, component, inputs*/) => {
    if (_nodes.has(nodeID)) throw "node already exists with that ID"
    _nodes = _nodes.set(nodeID, 1)
  }

  const find = nodeID => _nodes.get(nodeID)

  const remove = nodeID => {
    _nodes = _nodes.delete(nodeID)
  }

  const connect = (sourceNodeID, targetNodeID) => {
    _edges = _edges.set(`${sourceNodeID}-${targetNodeID}`, 1)
  }

  const disconnect = (sourceNodeID, targetNodeID) => {
    _edges = _edges.delete(`${sourceNodeID}-${targetNodeID}`)
  }

  return {
    add,
    find,
    remove,
    connect,
    disconnect,
    nodes: () => _nodes.toJS(),
    edges: () => _edges.toJS()
  }
}

module.exports = Graph
