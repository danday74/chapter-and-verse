const getBook = require('./getBook')
const getChapter = require('./getChapter')
const getVerses = require('./getVerses')

const BASE_REGEX = /^\d?[a-z]+/
const TYPES = [
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

  if (typeof str !== 'string') return null

  str = str.toLowerCase()
  str = str.replace(/ /g, '')

  let type = null
  TYPES.forEach(t => {
    const catRegex = new RegExp(BASE_REGEX.source + t.regex.source)
    if (catRegex.test(str)) type = t
  })
  if (type == null) return null

  const strBook = str.replace(type.regex, '')
  let cv = getBook(strBook)
  if (cv == null) return null

  let strChapter, strVerses
  const temp = str.match(type.regex)[0]

  switch (type.desc) {

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
        return null
      }
      return cv
    }

    case 'book-chapter-verse':
    case 'book-chapter-verses': {
      const parts = temp.split(':')
      strChapter = parts[0]
      strVerses = parts[1]
      cv = getChapter(cv, strChapter)
      if (cv == null) {
        return null
      } else {
        cv = getVerses(cv, strVerses)
      }
      return cv
    }
  }
}

module.exports = getCv
