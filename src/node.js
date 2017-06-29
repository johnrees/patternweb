function Node(nodeID, component, inputs) {
  this.id = nodeID
  this.component = component
  this.inputs = inputs
}

Node.prototype.run = function(storeAccessor, done) {

  this.newInputs = Object.keys(this.inputs).reduce((chain, key) => {
    chain[key] = storeAccessor(this.inputs[key])
    return chain
  }, {})

  return this.component.fn(this.newInputs, done)
}

module.exports = Node
