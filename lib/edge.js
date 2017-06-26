"use strict";

var Edge = function Edge(sourceID, sourceOutport, targetID, targetInport) {
  var id = sourceID + ">" + sourceOutport + "-" + targetInport + ">" + targetID;
  return {
    id: id
  };
};

module.exports = Edge;