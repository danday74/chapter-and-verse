const _ = require('lodash')
const books = require('./books')
const osis = require('./osis')
const errors = require('./errors')

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
