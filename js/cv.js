const getBook = require('./getBook')
const getChapter = require('./getChapter')
const getVerses = require('./getVerses')

const getChapterAndVerse = (str = '') => {

  if (typeof str !== 'string') return null

  str = str.toLowerCase()
  str = str.replace(/ /g, '')

  let type = null

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

  TYPES.forEach(t => {
    const catRegex = new RegExp(BASE_REGEX.source + t.regex.source)
    if (catRegex.test(str)) type = t
  })

  if (type == null) return null

  const strBook = str.replace(type.regex, '')
  let cv = getBook(strBook)
  if (cv == null) return null

  let strChapter, strVerses

  switch (type.desc) {

    case 'book': {
      return cv
    }

    case 'book-chapter-or-book-verse': {
      const unknown = str.match(type.regex)[0]
      if (cv.book.chapters === 1) {
        cv.chapter = 1
        strVerses = unknown
        cv = getVerses(cv, strVerses)
      } else {
        strChapter = unknown
        cv = getChapter(cv, strChapter)
      }
      return cv
    }

    case 'book-verses': {
      if (cv.book.chapters !== 1) return null
      cv.chapter = 1
      strVerses = str.match(type.regex)[0]
      cv = getVerses(cv, strVerses)
      return cv
    }

    case 'book-chapter-verse':
    case 'book-chapter-verses': {
      const parts = str.match(type.regex)[0].split(':')
      strChapter = parts[0]
      strVerses = parts[1]
      cv = getChapter(cv, strChapter)
      cv = getVerses(cv, strVerses)
      return cv
    }
  }
}

module.exports = getChapterAndVerse
