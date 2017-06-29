'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('immutable'),
    Map = _require.Map;

var EventEmitter = require('events');
var ASQ = require('asynquence');
var topolysis = require('topolysis');
var Node = require('./node');
var Edge = require('./edge');
// const util = require('util')

function Graph() {

  var _nodes = Map();
  var nodes = function nodes() {
    return _nodes.toJS();
  };

  var _edges = Map();
  var edges = function edges() {
    return _edges.toJS();
  };

  var _relationships = {}; // used by topolysis to arrange graph for running
  var _DAG = [];

  var events = new EventEmitter(); // util.inherits(Graph, EventEmitter)

  var sortDAG = function sortDAG(relationships) {
    var _sortedDag = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = topolysis(relationships)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var x = _step.value;

        _sortedDag.unshift(x);
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

    return _sortedDag;
  };

  var find = function find(nodeID) {
    return _nodes.get(nodeID);
  };

  var add = function add(nodeID, component) {
    var inputs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (_nodes.has(nodeID)) throw "node already exists with that ID";
    var node = new Node(nodeID, component, inputs);
    _nodes = _nodes.set(nodeID, node);

    _relationships[nodeID] = _relationships[nodeID] || [];
    _DAG = sortDAG(_relationships);

    events.emit('add', { nodeID: nodeID });

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(inputs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var inport = _step2.value;

        if (typeof inputs[inport] === "string" && inputs[inport].indexOf(">") >= 0) {
          var _inputs$inport$split = inputs[inport].split(">"),
              _inputs$inport$split2 = _slicedToArray(_inputs$inport$split, 2),
              sourceID = _inputs$inport$split2[0],
              sourceOutport = _inputs$inport$split2[1];

          connect(sourceID, sourceOutport, nodeID, inport);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  var update = function update(nodeID) {
    var inputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var node = _nodes.get(nodeID, node);
    node.inputs = inputs;
    events.emit('update', { nodeID: nodeID });
  };

  var remove = function remove(nodeID) {
    _nodes = _nodes.delete(nodeID);

    delete _relationships[nodeID];
    _DAG = sortDAG(_relationships);

    events.emit('remove', { nodeID: nodeID });
  };

  var connect = function connect(sourceID, sourceOutport, targetID, targetInport) {
    var edge = Edge(sourceID, sourceOutport, targetID, targetInport);
    _edges = _edges.set(edge.id, true);

    _relationships[sourceID] = _relationships[sourceID] || [];
    _relationships[sourceID].push(targetID);
    _DAG = sortDAG(_relationships);

    events.emit('connect', { sourceID: sourceID, sourceOutport: sourceOutport, targetID: targetID, targetInport: targetInport });
  };

  var disconnect = function disconnect(sourceID, sourceOutport, targetID, targetInport) {
    var edge = Edge(sourceID, sourceOutport, targetID, targetInport);
    _edges = _edges.delete(edge.id);

    _relationships[sourceID].splice(_relationships[sourceID].indexOf(targetID), 1);
    _DAG = sortDAG(_relationships);

    events.emit('disconnect', { sourceID: sourceID, sourceOutport: sourceOutport, targetID: targetID, targetInport: targetInport });
  };

  var doneWithID = function doneWithID(done, id) {
    return function (output) {
      return done([id, output]);
    };
  };

  var getLiveValue = function getLiveValue(data) {
    return function (keys) {
      if (typeof keys === "string" && keys.indexOf(">") >= 0) {
        return keys.split('>').reduce(function (chain, key) {
          return chain[key];
        }, data);
      } else {
        return keys;
      }
    };
  };

  var run = function run(store, callback) {
    var sequence = ASQ();
    var storeAccessor = getLiveValue(store);
    _DAG.map(function (stepNodes) {
      sequence.all.apply(sequence, _toConsumableArray(stepNodes.map(function (nodeID) {
        return function (done) {
          try {
            return _nodes.get(nodeID).run(storeAccessor, doneWithID(done, nodeID));
          } catch (e) {
            throw [nodeID, e];
          }
        };
      }))).val(function () {
        for (var _len = arguments.length, outputs = Array(_len), _key = 0; _key < _len; _key++) {
          outputs[_key] = arguments[_key];
        }

        outputs.forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              nodeID = _ref2[0],
              output = _ref2[1];

          Object.keys(output).forEach(function (key) {
            store[nodeID] = store[nodeID] || {};
            store[nodeID][key] = output[key];
          });
          events.emit('run', nodeID);
        });
      });
    });
    sequence.or(function (id, err) {
      return events.emit('error', id, err);
    }).val(function (msg) {
      return callback ? callback(store) : store;
    });
  };

  return {
    add: add,
    update: update,
    find: find,
    remove: remove,
    connect: connect,
    disconnect: disconnect,
    events: events,
    nodes: nodes,
    edges: edges,
    run: run
  };
}

module.exports = Graph;