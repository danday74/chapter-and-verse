const errors = require('./errors')

const getChapter = (cv, strChapter) => {
  const chapter = parseInt(strChapter)
  if (0 < chapter && chapter <= cv.book.chapters) {
    cv.chapter = chapter
    return cv
  }
  return errors.chapter
}

module.exports = getChapter
