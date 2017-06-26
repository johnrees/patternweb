const { Map } = require('immutable')
const EventEmitter = require('events')
const ASQ = require('asynquence')
const topolysis = require('topolysis')
const Node = require('./Node')
const Edge = require('./Edge')
// const util = require('util')

function Graph() {

  let _nodes = Map()
  const nodes = () => _nodes.toJS()

  let _edges = Map()
  const edges = () => _edges.toJS()

  let _relationships = {} // used by topolysis to arrange graph for running
  let _DAG = []

  const events = new EventEmitter() // util.inherits(Graph, EventEmitter)

  const sortDAG = relationships => {
    let _sortedDag = []
    for (const x of topolysis(relationships)) {
      _sortedDag.unshift(x)
    }
    return _sortedDag
  }

  const find = nodeID => _nodes.get(nodeID)

  const add = (nodeID, component, inputs) => {
    if (_nodes.has(nodeID)) throw "node already exists with that ID"
    const node = new Node(nodeID, component, inputs)
    _nodes = _nodes.set(nodeID, node)

    _relationships[nodeID] = _relationships[nodeID] || []
    _DAG = sortDAG(_relationships)

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

    delete _relationships[nodeID]
    _DAG = sortDAG(_relationships)

    events.emit('remove', { nodeID })
  }

  const connect = (sourceID, sourceOutport, targetID, targetInport) => {
    const edge = Edge(sourceID, sourceOutport, targetID, targetInport)
    _edges = _edges.set(edge.id, true)

    _relationships[sourceID] = _relationships[sourceID] || []
    _relationships[sourceID].push(targetID)
    _DAG = sortDAG(_relationships)

    events.emit('connect', { sourceID, sourceOutport, targetID, targetInport })
  }

  const disconnect = (sourceID, sourceOutport, targetID, targetInport) => {
    const edge = Edge(sourceID, sourceOutport, targetID, targetInport)
    _edges = _edges.delete(edge.id)

    _relationships[sourceID].splice(_relationships[sourceID].indexOf(targetID),1)
    _DAG = sortDAG(_relationships)

    events.emit('disconnect', { sourceID, sourceOutport, targetID, targetInport })
  }

  const doneWithIDAndEvent = (done, id) => output => {
    done([id, output])
    events.emit('run', id)
  }

  const run = (store, callback) => {
    const sequence = ASQ()
    _DAG.map(stepNodes => {
      sequence.all(
        ...stepNodes.map( nodeID => done => {
          try {
            return _nodes.get(nodeID).run(store, doneWithIDAndEvent(done, nodeID))
          } catch(e) {
            throw [nodeID, e]
          }
        })
      ).val(function(...outputs) {
        outputs.forEach( ([nodeID, output]) => {
          Object.keys(output).forEach(key => {
            store[nodeID] = store[nodeID] || {}
            store[nodeID][key] = output[key]
          })
        })
      })
    })
    sequence
      .or((id, err) => events.emit('error', id, err))
      .val(msg => callback ? callback(store) : store)
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
