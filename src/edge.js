const Edge = (sourceID, sourceOutport, targetID, targetInport) => {
  const id = `${sourceID}>${sourceOutport}-${targetInport}>${targetID}`
  return {
    id
  }
}

module.exports = Edge
