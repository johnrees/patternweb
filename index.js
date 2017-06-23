const ASQ = require('asynquence')

const add = ({X,Y}, cb) => {
  cb({ SUM: X + Y })
}

const obs =
[{
  id: "add1",
  component: add,
  inputs: { X: 2, Y: 20 }
},
{
  id: "add2",
  component: add,
  inputs: { X: 'add1>SUM', Y: 20}
}]

var seq = ASQ({X: 5, Y: 20})
let data = {}

obs.forEach(o => {
  seq.then(function(done, msg) {
    try {
      const inputs = Object.keys(o.inputs).reduce(function(acc, key) {
        if (typeof o.inputs[key] === "string") {
          // acc[key] = data[o.inputs[key]]
          const [id, outport] = o.inputs[key].split(">")
          if (!outport) { done.fail([o.id, "malformed input"]) }
          if (!data[id]) { done.fail([o.id, "root key not found"]) }
          if (!data[id][outport]) { done.fail([o.id, "sub key not found"]) }
          acc[key] = data[id][outport]
        } else {
          acc[key] = o.inputs[key]
        }
        return acc
      }, {})
      o.component(inputs, done)
    } catch(e) {
      throw [o.id,e.message]
    }
  }).val(function(msg) {
    // Object.keys(msg).forEach(key => data[`${o.id}>${key}`] = msg[key])
    Object.keys(msg).forEach(key => {
      data[`${o.id}`] = data[`${o.id}`] || {}
      data[`${o.id}`][`${key}`] = msg[key]
    })
  })
})

seq
.val(function(msg) {
  console.log(data)
})
.or(function(err) {
  console.error(err)
})
