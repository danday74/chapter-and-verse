function Failure(reason) {
  this.success = false
  this.reason = reason
}

const errors = {
  book: new Failure('book does not exist'),
  chapter: new Failure('chapter does not exist'),
  verse: new Failure('verse does not exist'),

  bookVersesFormat: new Failure('the "book verses" reference format only supports single chapter books'),
  format: new Failure('reference format unrecognised'),
  type: new Failure('reference not a string')
}

module.exports = errors
