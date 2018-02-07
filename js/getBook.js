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

module.exports = getBook
