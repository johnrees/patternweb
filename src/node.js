function Node(nodeID, component, inputs) {
  this.id = nodeID
  this.component = component
  this.inputs = inputs
}

Node.prototype.run = function(store, runEvent) {
  const done = (output) => {
    runEvent(this.id)
    return store = output
  }

  for (const inport of Object.keys(this.inputs)) {
    if (typeof this.inputs[inport] === "string") {
      const [sourceNode, sourceOutport] = this.inputs[inport].split(">")
      this.inputs[inport] = store[sourceNode][sourceOutport]
    }
  }

  return this.component(this.inputs, done)
}

module.exports = Node
