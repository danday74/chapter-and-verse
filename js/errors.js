function Failure(reason) {
  this.book = {}
  this.success = false
  this.reason = reason
}

function thrower(methodName) {
  throw Error('Cannot call ' + methodName + '() since the biblical reference is invalid - ' + this.reason)
}

Failure.prototype.toString = function() {
  thrower.call(this, 'toString')
}

Failure.prototype.toShortString = function() {
  thrower.call(this, 'toShortString')
}

Failure.prototype.getType = function() {
  thrower.call(this, 'getType')
}

Failure.prototype.toSimpleObject = function() {
  thrower.call(this, 'toSimpleObject')
}

const errors = {
  book: new Failure('book does not exist'),
  chapter: new Failure('chapter does not exist'),
  verse: new Failure('verse does not exist'),

  bookVersesFormat: new Failure('the "book verses" reference format only supports single chapter books'),
  format: new Failure('the reference format is unrecognised'),
  type: new Failure('the reference is not a string')
}

module.exports = errors
