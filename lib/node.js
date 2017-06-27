"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function Node(nodeID, component, inputs) {
  this.id = nodeID;
  this.component = component;
  this.inputs = inputs;
}

Node.prototype.run = function (store, done) {
  var inputs = this.inputs;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {

    for (var _iterator = Object.keys(inputs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var inport = _step.value;

      if (typeof inputs[inport] === "string" && inputs[inport].indexOf(">") >= 0) {
        var _inputs$inport$split = inputs[inport].split(">"),
            _inputs$inport$split2 = _slicedToArray(_inputs$inport$split, 2),
            sourceNode = _inputs$inport$split2[0],
            sourceOutport = _inputs$inport$split2[1];

        inputs[inport] = store[sourceNode][sourceOutport];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return this.component.fn(inputs, done);
};

module.exports = Node;