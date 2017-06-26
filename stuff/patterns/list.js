const combine = (INPUTS, done) => {
  const LIST = Object.keys(INPUTS)
    .map(k => k.match(/\d+$/)[0])
    .sort((a, b) => a - b)
    .map(sorted => INPUTS[`ITEM${sorted}`])

  done({ LIST })
}

const flatten = ({LIST}, done) => {
  const _flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? _flatten(b) : b), []
  )
  done({ FLAT_LIST: _flatten(LIST)})
}

module.exports = { combine, flatten }
