const { Map, List } = require('immutable')
const util = require('util')
const EventEmitter = require('events')
const ASQ = require('asynquence')
const topolysis = require('topolysis')
const Node = require('./Node')
const Edge = require('./Edge')

function Graph() {

  let _nodes = Map()
  const nodes = () => _nodes.toJS()

  let _edges = Map()
  const edges = () => _edges.toJS()

  let _DAG = {} // used by topolysis to arrange graph for running

  const events = new EventEmitter() // util.inherits(Graph, EventEmitter)

  const find = nodeID => _nodes.get(nodeID)

  const add = (nodeID, component, inputs) => {
    if (_nodes.has(nodeID)) throw "node already exists with that ID"
    const node = new Node(nodeID, component, inputs)
    _nodes = _nodes.set(nodeID, node)
    _DAG[nodeID] = _DAG[nodeID] || []
    events.emit('add', { nodeID })

    for (const inport of Object.keys(inputs)) {
      if (typeof inputs[inport] === "string") {
        const [sourceID, sourceOutport] = inputs[inport].split(">")
        connect(sourceID, sourceOutport, nodeID, inport)
      }
    }
  }

  const remove = nodeID => {
    _nodes = _nodes.delete(nodeID)
    delete _DAG[nodeID]
    events.emit('remove', { nodeID })
  }

  const connect = (sourceID, sourceOutport, targetID, targetInport) => {
    const edge = Edge(sourceID, sourceOutport, targetID, targetInport)
    _edges = _edges.set(edge.id, true)
    _DAG[sourceID] = _DAG[sourceID] || []
    _DAG[sourceID].push(targetID)
    events.emit('connect', { sourceID, sourceOutport, targetID, targetInport })
  }

  const disconnect = (sourceID, sourceOutport, targetID, targetInport) => {
    const edge = Edge(sourceID, sourceOutport, targetID, targetInport)
    _edges = _edges.delete(edge.id)
    events.emit('disconnect', { sourceID, sourceOutport, targetID, targetInport })
  }

  const runEvent = (id) => events.emit('run', id)

  const run = (store) => {
    let steps = []
    for (const x of topolysis(_DAG)) {
      steps.unshift(x)
    }

    // const sequence = ASQ()

    steps.forEach(stepNodes => {
      stepNodes.forEach( node => {
        store[node] = store[node] || {}
        store[node] = _nodes.get(node).run(store, runEvent)
      })
    })
    return store
  }

  return {
    add,
    find,
    remove,
    connect,
    disconnect,
    events,
    nodes,
    edges,
    run
  }
}

module.exports = Graph
