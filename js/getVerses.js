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
  return cv
}

module.exports = getVerses
