const errors = require('./errors')
const getBook = require('./getBook')
const getChapter = require('./getChapter')
const getVerses = require('./getVerses')

const BASE_REGEX = /^\d?[a-z]+/
const FORMATS = [
  {
    desc: 'book',
    regex: /$/
  },
  {
    desc: 'book-chapter-or-book-verse',
    regex: /\d+$/
  },
  {
    desc: 'book-verses',
    regex: /\d+-\d+$/
  },
  {
    desc: 'book-chapter-verse',
    regex: /\d+:\d+$/
  },
  {
    desc: 'book-chapter-verses',
    regex: /\d+:\d+-\d+$/
  }
]

const getCv = (str = '') => {

  if (typeof str !== 'string') return errors.type

  str = str.toLowerCase()
  str = str.replace(/ /g, '')

  let format = null
  FORMATS.forEach(f => {
    const catRegex = new RegExp(BASE_REGEX.source + f.regex.source)
    if (catRegex.test(str)) format = f
  })
  if (format == null) return errors.format

  const strBook = str.replace(format.regex, '')
  let cv = getBook(strBook)
  if (!cv.success) return cv

  let strChapter, strVerses
  const temp = str.match(format.regex)[0]

  switch (format.desc) {

    case 'book': {
      return cv
    }

    case 'book-chapter-or-book-verse': {
      if (cv.book.chapters === 1) {
        cv.chapter = 1
        strVerses = temp
        cv = getVerses(cv, strVerses)
      } else {
        strChapter = temp
        cv = getChapter(cv, strChapter)
      }
      return cv
    }

    case 'book-verses': {
      if (cv.book.chapters === 1) {
        cv.chapter = 1
        strVerses = temp
        cv = getVerses(cv, strVerses)
      } else {
        return errors.bookVersesFormat
      }
      return cv
    }

    case 'book-chapter-verse':
    case 'book-chapter-verses': {
      const parts = temp.split(':')
      strChapter = parts[0]
      strVerses = parts[1]
      cv = getChapter(cv, strChapter)
      if (!cv.success) {
        return cv
      } else {
        cv = getVerses(cv, strVerses)
      }
      return cv
    }
  }
}

module.exports = getCv
