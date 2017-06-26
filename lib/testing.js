"use strict";

var PW = require('..');

var graph = PW.Graph();
var database = {};

var addFn = function addFn(_ref, done) {
  var A = _ref.A,
      B = _ref.B;
  return done({ RESULT: A + B });
};
var subFn = function subFn(_ref2, done) {
  var A = _ref2.A,
      B = _ref2.B;
  return done({ RESULT: A - B });
};

graph.add("Add", addFn, { A: 1, B: 2 });
graph.add("Sum", subFn, { A: 10, B: "Add>RESULT" });

graph.events.on("run", function (id) {
  console.log(id + " just ran and stored " + JSON.stringify(database[id]));
});
// Add just ran: {"RESULT":3}
// Sum just ran: {"RESULT":7}

graph.run(database, function () {
  console.log(database); // { Add: { RESULT: 3 }, Sum: { RESULT: 7 } }
});