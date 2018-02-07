const getChapter = (cv, strChapter) => {
  const chapter = parseInt(strChapter)
  if (0 < chapter && chapter <= cv.book.chapters) {
    cv.chapter = chapter
    return cv
  }
  return null
}

module.exports = getChapter
