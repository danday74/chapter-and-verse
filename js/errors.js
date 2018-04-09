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

Failure.prototype.next = function() {
  thrower.call(this, 'next')
}

Failure.prototype.prev = function() {
  thrower.call(this, 'prev')
}

const errors = {
  book: new Failure('book does not exist'),
  chapter: new Failure('chapter does not exist'),
  verse: new Failure('verse does not exist'),

  bookVersesFormat: new Failure('the "book verses" reference format only supports single chapter books'),
  format: new Failure('the reference format is unrecognised'),
  type: new Failure('the reference is not a string'),

  nextBook: new Failure('next book does not exist'),
  nextChapter: new Failure('next chapter does not exist'),
  nextVerse: new Failure('next verse does not exist'),

  prevBook: new Failure('previous book does not exist'),
  prevChapter: new Failure('previous chapter does not exist'),
  prevVerse: new Failure('previous verse does not exist')
}

module.exports = errors
