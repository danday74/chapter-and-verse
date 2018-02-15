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
  const versesInChapter = cv.book.versesPerChapter[cv.chapter - 1]
  if (to > versesInChapter) return null
  cv.from = from
  cv.to = to
  return cv
}

module.exports = getVerses
