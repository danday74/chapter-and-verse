const _ = require('lodash')
const osis = require('./osis')

const CV = function(book, reason) {
  this.book = book
  this.reason = reason
  this.chapter = null
  this.from = null
  this.to = null
  this.range = null
}

const getBook = strBook => {
  for (let book of osis) {
    if (strBook === book.id.toLowerCase()) {
      return new CV(book, 'matches book.id')
    }
    if (book.abbr.includes(strBook)) {
      return new CV(book, 'matches a book.abbr')
    }
    if (strBook.startsWith(book.start) && strBook.length <= book.name.replace(/ /g, '').length) {
      return new CV(book, 'starts with book.start')
    }
  }
  return null
}

const getChapter = (cv, strChapter) => {
  const chapter = parseInt(strChapter)
  if (0 < chapter && chapter <= cv.book.chapters) {
    cv.chapter = chapter
    return cv
  }
  return null
}

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
