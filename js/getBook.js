const osis = require('./osis')

const CV = function(book, reason) {
  this.book = book
  this.reason = reason
  this.chapter = null
  this.from = null
  this.to = null
  this.range = null
  this.toString = () => {
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
