function Node(nodeID, component, inputs) {
  this.id = nodeID
  this.component = component
  this.inputs = inputs
}

Node.prototype.run = function(store, done) {
  const {inputs} = this

  for (const inport of Object.keys(inputs)) {
    if (typeof inputs[inport] === "string" && inputs[inport].indexOf(">") >= 0) {
      const [sourceNode, sourceOutport] = inputs[inport].split(">")
      inputs[inport] = store[sourceNode][sourceOutport]
    }
  }

  return this.component.fn(inputs, done)
}

module.exports = Node
