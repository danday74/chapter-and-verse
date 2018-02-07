const _ = require('lodash')

const getVerses = (cv, strVerses) => {
  const parts = strVerses.split('-')
  let from = parseInt(parts[0])
  let to = parseInt(parts[parts.length - 1])
  if (from > to) {
    const temp = from
    from = to
    to = temp
  }
  if (from === 0) return null
  if (to > 176) return null // psalm 119:176
  cv.from = from
  cv.to = to
  cv.range = _.range(cv.from, cv.to + 1)
  return cv
}

module.exports = getVerses
