const _ = require('lodash')
const books = require('./books.json')
const osis = require('./osis.json')
const errors = require('./errors')
const getChapter = require('./getChapter')
const getVerses = require('./getVerses')

function CV(book, reason) {
  this.book = book
  const vpcBook = _.find(books, {id: book.id})
  this.book.versesPerChapter = vpcBook.chapters

  this.success = true
  this.reason = reason
  this.chapter = null
  this.from = null
  this.to = null
}

CV.prototype.toString = function() {
  let str = this.book.name
  if (this.chapter) {
    str += ` ${this.chapter}`
    if (this.from) {
      str += `:${this.from}`
      if (this.from < this.to) {
        str += `-${this.to}`
      }
    }
  }
  return str
}

CV.prototype.toShortString = function() {
  if (this.book.chapters > 1) return this.toString()
  let str = this.book.name
  if (this.from) {
    str += ` ${this.from}`
    if (this.from < this.to) {
      str += `-${this.to}`
    }
  }
  return str
}

CV.prototype.getType = function() {
  if (!this.chapter) return 'book'
  if (!this.from) return 'chapter'
  if (this.from === this.to) return 'verse'
  return 'verses'
}

CV.prototype.toSimpleObject = function() {
  return {
    type: this.getType(),
    asString: this.toString(),
    asShortString: this.toShortString(),
    bookId: this.book.id,
    bookName: this.book.name,
    testament: this.book.testament,
    chapter: this.chapter,
    from: this.from,
    to: this.to
  }
}

CV.prototype.next = function() {

  const NEXT = {
    BOOK: 'next book',
    CHAPTER: 'next chapter',
    VERSE: 'next verse'
  }

  let cv
  const nextBook = _.find(osis, {order: this.book.order + 1})

  if (this.getType() === 'book') {
    return (nextBook) ? new CV(nextBook, NEXT.BOOK) : errors.nextBook
  }

  if (this.getType() === 'chapter') {
    // current book, next chapter
    cv = new CV(this.book, NEXT.CHAPTER)
    cv = getChapter(cv, this.chapter + 1)
    if (!cv.success) {
      if (!nextBook) return errors.nextChapter
      // next book, 1st chapter
      cv = new CV(nextBook, NEXT.CHAPTER)
      cv = getChapter(cv, 1)
    }
  }

  if (this.getType() === 'verse' || this.getType() === 'verses') {
    // current book, current chapter, next verse
    cv = new CV(this.book, NEXT.VERSE)
    cv = getChapter(cv, this.chapter)
    cv = getVerses(cv, this.to + 1)
    if (!cv.success) {
      // current book, next chapter, 1st verse
      cv = new CV(this.book, NEXT.VERSE)
      cv = getChapter(cv, this.chapter + 1)
      if (cv.success) {
        cv = getVerses(cv, 1)
      } else {
        if (!nextBook) return errors.nextVerse
        // next book, 1st chapter, 1st verse
        cv = new CV(nextBook, NEXT.VERSE)
        cv = getChapter(cv, 1)
        cv = getVerses(cv, 1)
      }
    }
  }
  return cv
}

CV.prototype.prev = function() {

  const PREV = {
    BOOK: 'previous book',
    CHAPTER: 'previous chapter',
    VERSE: 'previous verse'
  }

  let cv
  const prevBook = _.find(osis, {order: this.book.order - 1})

  if (this.getType() === 'book') {
    return (prevBook) ? new CV(prevBook, PREV.BOOK) : errors.prevBook
  }

  if (this.getType() === 'chapter') {
    // current book, previous chapter
    cv = new CV(this.book, PREV.CHAPTER)
    cv = getChapter(cv, this.chapter - 1)
    if (!cv.success) {
      if (!prevBook) return errors.prevChapter
      // previous book, last chapter
      cv = new CV(prevBook, PREV.CHAPTER)
      cv = getChapter(cv, cv.book.chapters)
    }
  }

  if (this.getType() === 'verse' || this.getType() === 'verses') {
    // current book, current chapter, previous verse
    cv = new CV(this.book, PREV.VERSE)
    cv = getChapter(cv, this.chapter)
    cv = getVerses(cv, this.from - 1)
    if (!cv.success) {
      // current book, previous chapter, last verse
      cv = new CV(this.book, PREV.VERSE)
      cv = getChapter(cv, this.chapter - 1)
      if (cv.success) {
        cv = getVerses(cv, cv.book.versesPerChapter[cv.chapter - 1])
      } else {
        if (!prevBook) return errors.prevVerse
        // previous book, last chapter, last verse
        cv = new CV(prevBook, PREV.VERSE)
        cv = getChapter(cv, cv.book.chapters)
        cv = getVerses(cv, cv.book.versesPerChapter[cv.chapter - 1])
      }
    }
  }
  return cv
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
  return errors.book
}

module.exports = getBook
