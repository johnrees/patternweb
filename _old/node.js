const _isAnAlias = str => {
  return (typeof str === "string" && str.match(/(\w+)>(\w+)/))
}

const _getSourceNode = str => {
  return str.split(">")
}

const Node = (id, component, inputs) => {
  return {
    id, component, inputs
  }
}

module.exports = { Node, _isAnAlias, _getSourceNode }
