const { Map } = require('immutable')
const util = require('util')
const EventEmitter = require('events')

function Graph() {

  let _nodes = Map()
  let _edges = Map()
  const events = new EventEmitter()

  const add = (nodeID/*, component, inputs*/) => {
    if (_nodes.has(nodeID)) throw "node already exists with that ID"
    _nodes = _nodes.set(nodeID, 1)
    events.emit('add', { nodeID })
  }

  const find = nodeID => _nodes.get(nodeID)

  const remove = nodeID => {
    _nodes = _nodes.delete(nodeID)
    events.emit('remove', { nodeID })
  }

  const connect = (sourceNodeID, targetNodeID) => {
    _edges = _edges.set(`${sourceNodeID}-${targetNodeID}`, 1)
    events.emit('connect', { sourceNodeID, targetNodeID })
  }

  const disconnect = (sourceNodeID, targetNodeID) => {
    _edges = _edges.delete(`${sourceNodeID}-${targetNodeID}`)
    events.emit('disconnect', { sourceNodeID, targetNodeID })
  }

  return {
    add,
    find,
    remove,
    connect,
    disconnect,
    events,
    nodes: () => _nodes.toJS(),
    edges: () => _edges.toJS()
  }
}

// util.inherits(Graph, EventEmitter)

module.exports = Graph
