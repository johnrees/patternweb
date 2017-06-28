"use strict";

function Node(nodeID, component, inputs) {
  this.id = nodeID;
  this.component = component;
  this.inputs = inputs;
}

Node.prototype.run = function (storeAccessor, done) {
  var _this = this;

  var newInputs = Object.keys(this.inputs).reduce(function (chain, key) {
    chain[key] = storeAccessor(_this.inputs[key]);
    return chain;
  }, {});

  return this.component.fn(newInputs, done);
};

module.exports = Node;